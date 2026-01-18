# Oficina Mecanica Master (FastAPI + UI)

Projeto refeito em Python (FastAPI) com UI dark moderna.

## Estrutura
- `backend/` API FastAPI + SQLAlchemy
- `frontend/` UI estatica consumindo a API

## Deploy em /opt/oficina (Docker Swarm + Portainer)
1) No servidor, clone em `/opt/oficina`:
```
git clone git@github.com:altamirus-github/Oficina.git /opt/oficina
cd /opt/oficina
```

2) Build da imagem no manager do Swarm:
```
docker build -t oficina:latest .
```

3) Deploy da stack:
```
docker stack deploy -c docker-stack.yml oficina
```

4) Acesso:
- `http://<IP_DO_SERVIDOR>:8090/frontend/index.html`
- `https://<IP_DO_SERVIDOR>:4433/frontend/index.html`

Observacao: em Swarm, o `build` do compose nao e aplicado. Se usar Portainer, suba a stack apontando para a imagem `oficina:latest` ou publique a imagem em um registry.

Nota final:
- Acesso local: `http://localhost:8090/frontend/index.html`
- Usuario demo: `demo`
- Senha demo: `demo123`

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
