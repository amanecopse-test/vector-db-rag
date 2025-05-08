#!/usr/bin/env python3
from pathlib import Path
from typing import List, Optional
from dotenv import load_dotenv
from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter
import click
import subprocess
import os
import chromadb

def load_dotenv_file():
    """환경 변수 로드"""
    load_dotenv()

def get_model_cache_dir() -> Path:
    """모델 캐시 디렉토리를 반환합니다."""
    cache_dir = Path.home() / ".cache" / "code_embedder" / "models"
    cache_dir.mkdir(parents=True, exist_ok=True)
    return cache_dir

def get_file_content(file_path: Path) -> str:
    """파일 내용을 읽어옵니다."""
    with open(file_path, 'r', encoding='utf-8') as f:
        return f.read()

def get_all_files(directory: Path, exclude_dirs: Optional[List[str]] = None) -> List[Path]:
    """디렉토리 내의 모든 파일을 재귀적으로 찾습니다."""
    if exclude_dirs is None:
        exclude_dirs = ['.git', 'node_modules', '__pycache__', '.venv', 'coverage', '.vscode', '.idea', 'code_embedder']
    
    # 소스 코드 파일 확장자 목록
    source_extensions = {'.py', '.js', '.jsx', '.ts', '.tsx', '.html', '.css', '.scss', '.json', '.md'}
    
    files = []
    for item in directory.iterdir():
        if item.name in exclude_dirs:
            continue
        if item.is_file() and item.suffix in source_extensions:
            files.append(item)
        elif item.is_dir():
            files.extend(get_all_files(item, exclude_dirs))
    return files

def run_git_command(command: List[str], cwd: Optional[str] = None) -> str:
    """깃 명령어를 실행하고 결과를 반환합니다."""
    try:
        result = subprocess.run(
            command,
            cwd=cwd,
            capture_output=True,
            text=True,
            check=True
        )
        return result.stdout.strip()
    except subprocess.CalledProcessError as e:
        print(f"깃 명령어 실행 실패: {e}")
        print(f"에러 출력: {e.stderr}")
        raise

def get_current_commit_hash() -> str:
    """현재 커밋 해시를 반환합니다."""
    return run_git_command(["git", "rev-parse", "HEAD"])

def checkout_commit(commit_hash: str) -> None:
    """특정 커밋으로 체크아웃합니다."""
    run_git_command(["git", "checkout", commit_hash])

def create_embeddings(directory: Path, persist_directory: str = "./chroma_db", commit_hash: Optional[str] = None):
    """디렉토리 내의 모든 파일을 임베딩하여 벡터 스토어에 저장합니다."""
    if commit_hash is None or commit_hash == "":
        commit_hash = get_current_commit_hash()
    
    # 임베딩 모델 초기화
    model_cache_dir = get_model_cache_dir()
    embeddings = HuggingFaceEmbeddings(
        model_name="sentence-transformers/all-MiniLM-L6-v2",
        model_kwargs={'device': 'cpu'},
        cache_folder=str(model_cache_dir)
    )
    
    # 텍스트 분할기 초기화
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200
    )
    
    # 벡터 스토어 로드 또는 생성
    collection_name = f"code_embeddings_{commit_hash}"
    try:
        vectorstore = Chroma(
            persist_directory=persist_directory,
            embedding_function=embeddings,
            collection_name=collection_name
        )
        print(f"기존 벡터 스토어를 로드했습니다. (커밋: {commit_hash})")
    except Exception:
        # 기존 컬렉션이 없는 경우 새로 생성
        vectorstore = Chroma(
            persist_directory=persist_directory,
            embedding_function=embeddings,
            collection_name=collection_name
        )
        print(f"새로운 벡터 스토어를 생성했습니다. (커밋: {commit_hash})")
    
    # 파일 로드 및 처리
    files = get_all_files(directory)
    total_files = len(files)
    processed_files = 0
    
    for file_path in files:
        try:
            content = get_file_content(file_path)
            relative_path = file_path.relative_to(directory)
            
            # 파일별로 청크 생성
            chunks = text_splitter.split_text(content)
            if not chunks:  # 빈 파일이거나 청크가 생성되지 않은 경우
                print(f"경고: {relative_path}에서 청크가 생성되지 않았습니다.")
                continue
                
            metadatas = [{
                'source': str(relative_path),
                'file_type': file_path.suffix,
                'commit_hash': commit_hash
            }] * len(chunks)
            
            # 기존 문서 삭제 (같은 파일의 이전 버전)
            vectorstore._collection.delete(
                where={
                    "$and": [
                        {"source": str(relative_path)},
                        {"commit_hash": commit_hash}
                    ]
                }
            )
            
            # 새로운 문서 추가
            vectorstore.add_texts(
                texts=chunks,
                metadatas=metadatas
            )
            
            processed_files += 1
            print(f"처리 완료: {relative_path} ({processed_files}/{total_files})")
            
        except Exception as e:
            print(f"Error processing {file_path}: {e}")
            continue
    
    if processed_files == 0:
        print("경고: 처리된 파일이 없습니다.")
    else:
        print(f"총 {processed_files}개 파일이 처리되었습니다.")
        print(f"임베딩이 {persist_directory}에 자동 저장되었습니다. (커밋: {commit_hash})")

def search_code(query: str, persist_directory: str = "./chroma_db", commit_hash: Optional[str] = None, k: int = 5):
    """임베딩된 코드베이스에서 검색을 수행합니다."""
    if commit_hash is None or commit_hash == "":
        commit_hash = get_current_commit_hash()
    
    # 임베딩 모델 초기화
    model_cache_dir = get_model_cache_dir()
    embeddings = HuggingFaceEmbeddings(
        model_name="sentence-transformers/all-MiniLM-L6-v2",
        model_kwargs={'device': 'cpu'},
        cache_folder=str(model_cache_dir)
    )
    
    collection_name = f"code_embeddings_{commit_hash}"
    
    # 벡터 스토어 존재 여부 확인
    client = chromadb.PersistentClient(path=persist_directory)
    try:
        collection = client.get_collection(collection_name)
        count = collection.count()
    except Exception:
        count = 0
    
    if count == 0:
        print(f"커밋 {commit_hash}에 대한 벡터 스토어가 비어있습니다. 임베딩을 시작합니다...")
        # 현재 커밋 해시 저장
        current_commit = get_current_commit_hash()
        try:
            # 특정 커밋으로 체크아웃
            checkout_commit(commit_hash)
            # 임베딩 생성
            create_embeddings(Path("."), persist_directory, commit_hash)
            # 벡터 스토어 다시 로드
            vectorstore = Chroma(
                persist_directory=persist_directory,
                embedding_function=embeddings,
                collection_name=collection_name
            )
        finally:
            # 원래 커밋으로 복귀
            checkout_commit(current_commit)
    
    # 검색 수행
    results = vectorstore.similarity_search_with_score(query, k=k)
    
    # 결과 출력
    print(f"\n검색어: {query}")
    print(f"커밋 해시: {commit_hash}")
    print("-" * 80)
    for doc, score in results:
        print(f"\n파일: {doc.metadata['source']}")
        print(f"유사도 점수: {score:.4f}")
        print(f"내용:\n{doc.page_content[:200]}...")
        print("-" * 80)

@click.group()
def cli():
    """코드베이스 임베딩 및 검색 도구"""
    pass

@cli.command()
@click.option('--directory', '-d', 
              type=click.Path(exists=True, file_okay=False, dir_okay=True, path_type=Path),
              default='.',
              help='임베딩할 디렉토리 경로 (기본값: 현재 디렉토리)')
@click.option('--persist-dir', '-p',
              type=click.Path(file_okay=False, dir_okay=True, path_type=Path),
              default='./chroma_db',
              help='벡터 스토어를 저장할 디렉토리 (기본값: ./chroma_db)')
@click.option('--commit', '-c',
              type=str,
              help='임베딩할 커밋 해시 (기본값: 현재 커밋)')
def embed(directory: Path, persist_dir: Path, commit: Optional[str]):
    """코드베이스를 벡터 스토어에 임베딩합니다."""
    create_embeddings(directory, str(persist_dir), commit)

@cli.command()
@click.argument('query')
@click.option('--persist-dir', '-p',
              type=click.Path(file_okay=False, dir_okay=True, path_type=Path),
              default='./chroma_db',
              help='벡터 스토어가 저장된 디렉토리 (기본값: ./chroma_db)')
@click.option('--commit', '-c',
              type=str,
              help='검색할 커밋 해시 (기본값: 현재 커밋)')
@click.option('--k', '-k',
              type=int,
              default=5,
              help='반환할 결과의 수 (기본값: 5)')
def search(query: str, persist_dir: Path, commit: Optional[str], k: int):
    """임베딩된 코드베이스에서 검색을 수행합니다."""
    search_code(query, str(persist_dir), commit, k)

if __name__ == "__main__":
    load_dotenv_file()
    cli() 