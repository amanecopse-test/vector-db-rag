# 코드 임베더 (Code Embedder)

이 도구는 프로젝트의 코드베이스를 벡터 스토어에 임베딩하여 저장하는 CLI 프로그램입니다.

## 특징

- ChromaDB를 사용한 벡터 스토어 저장
- Git 버저닝 지원
- 오버레이 기능 지원
- 재귀적 파일 탐색
- 메타데이터 저장 (파일 경로, 파일 타입 등)

## 설치 방법

1. uv 설치 (아직 설치하지 않은 경우):
```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

2. 의존성 설치:
```bash
uv pip install -r requirements.txt
```

## 사용 방법

기본 사용법:
```bash
python code_embedder.py
```

특정 디렉토리 지정:
```bash
python code_embedder.py --directory /path/to/your/project
```

벡터 스토어 저장 위치 지정:
```bash
python code_embedder.py --persist-dir /path/to/store/vectors
```

## 벡터 스토어 위치

기본적으로 벡터 스토어는 `./chroma_db` 디렉토리에 저장됩니다. 이 디렉토리는 Git으로 버전 관리할 수 있습니다.

## 주의사항

- `.git`, `node_modules`, `__pycache__`, `.venv` 디렉토리는 자동으로 제외됩니다.
- 텍스트 파일만 처리 가능합니다.
- 기본적으로 CPU를 사용하여 임베딩을 생성합니다. 