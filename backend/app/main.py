import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from .database import Base, engine
from .routers import auth, checklists, clients, finance, orders, products, providers, services, vehicles

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Oficina Mecanica API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(clients.router)
app.include_router(vehicles.router)
app.include_router(providers.router)
app.include_router(products.router)
app.include_router(services.router)
app.include_router(orders.router)
app.include_router(finance.router)
app.include_router(checklists.router)
app.include_router(auth.router)

app.mount("/frontend", StaticFiles(directory="frontend", html=True), name="frontend")
uploads_dir = os.path.join(os.path.dirname(__file__), "uploads")
app.mount("/uploads", StaticFiles(directory=uploads_dir), name="uploads")


@app.get("/")
def healthcheck():
    return {"status": "ok", "frontend": "/frontend/index.html"}
