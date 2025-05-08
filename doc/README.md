# Code Embedder

코드베이스를 벡터 데이터베이스에 임베딩하고 검색할 수 있는 도구입니다.

## 기능

- 코드베이스의 파일들을 벡터 데이터베이스에 임베딩
- 특정 커밋 버전의 코드베이스 임베딩 지원
- 자연어로 코드베이스 검색
- ChromaDB를 사용한 벡터 저장 및 검색

## 설치

### uv 가상환경 시작 (먼저 uv 설치할 것)

```bash
uv venv --python 3.12
```

### uv 의존성 적용

```bash
uv sync
```

### uv 의존성 적용 (개발 환경 의존성 제외)

```bash
uv sync --no-dev
```

## 사용법

### 코드베이스 임베딩

```bash
python {working_dir}/code_embedder/src/code_embedder.py embed [OPTIONS]
```

옵션:
- `-d, --directory`: 임베딩할 디렉토리 경로 (기본값: 현재 디렉토리)
- `-p, --persist-dir`: 벡터 스토어를 저장할 디렉토리 (기본값: ./chroma_db)
- `-c, --commit`: 임베딩할 커밋 해시 (기본값: 현재 커밋)

예시:
```bash
# 현재 디렉토리의 코드베이스 임베딩
python {working_dir}/code_embedder/src/code_embedder.py embed

# 특정 디렉토리의 코드베이스 임베딩
python {working_dir}/code_embedder/src/code_embedder.py embed -d /path/to/code

# 특정 커밋의 코드베이스 임베딩
python {working_dir}/code_embedder/src/code_embedder.py embed -c abc123
```

### 코드베이스 검색

```bash
python {working_dir}/code_embedder/src/code_embedder.py search [OPTIONS] QUERY
```

옵션:
- `-p, --persist-dir`: 벡터 스토어가 저장된 디렉토리 (기본값: ./chroma_db)
- `-c, --commit`: 검색할 커밋 해시 (기본값: 현재 커밋)
- `-k, --k`: 반환할 결과의 수 (기본값: 5)

예시:
```bash
# 현재 커밋의 코드베이스에서 검색
python {working_dir}/code_embedder/src/code_embedder.py search "함수 정의 방법"

# 특정 커밋의 코드베이스에서 검색
python {working_dir}/code_embedder/src/code_embedder.py search -c abc123 "에러 처리"

# 검색 결과 수 지정
python {working_dir}/code_embedder/src/code_embedder.py search -k 10 "데이터베이스 연결"
```

## 지원하는 파일 형식

- Python (.py)
- JavaScript (.js, .jsx)
- TypeScript (.ts, .tsx)
- HTML (.html)
- CSS (.css, .scss)
- JSON (.json)
- Markdown (.md)

## 제외되는 디렉토리

다음 디렉토리는 자동으로 제외됩니다:
- .git
- node_modules
- __pycache__
- .venv
- coverage
- .vscode
- .idea
- code_embedder 