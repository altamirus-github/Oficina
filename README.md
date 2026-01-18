# Oficina Mecanica Master (FastAPI + UI)

Projeto refeito em Python (FastAPI) com UI dark moderna.

## Estrutura
- `backend/` API FastAPI + SQLAlchemy
- `frontend/` UI estatica consumindo a API

## Executar API
```
python -m venv backend/.venv
source backend/.venv/bin/activate
pip install -r backend/requirements.txt
export ADMIN_USER=admin
export ADMIN_PASSWORD=defina_uma_senha
export ADMIN_TOKEN=static-admin-token
uvicorn app.main:app --reload --port 8000 --app-dir backend
```

## Abrir UI
- Abra `frontend/index.html` no navegador.
- A UI usa `http://127.0.0.1:8000` por padrao (ajuste `API_BASE` em `frontend/app.js` se precisar).

## Observacao sobre acessos
Login simples com credenciais via variaveis de ambiente.
