# Oficina Mecanica API (FastAPI)

## Requisitos
- Python 3.10+

## Instalacao
```
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

## Executar
```
uvicorn app.main:app --reload --port 8000
```

## Banco de dados
- SQLite por padrao em `oficina.db` na pasta `backend/`.
- Para mudar, defina `DATABASE_URL`.

## Rotas principais
- `GET /clients`
- `GET /vehicles`
- `GET /providers`
- `GET /products`
- `GET /services`
- `GET /orders`
