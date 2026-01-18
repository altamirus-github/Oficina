import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from .database import Base, engine, SessionLocal
from .routers import auth, checklists, clients, finance, orders, products, providers, services, users, vehicles
from .auth import seed_users

Base.metadata.create_all(bind=engine)


def _ensure_sqlite_sequence() -> None:
    if not str(engine.url).startswith("sqlite"):
        return
    with engine.begin() as conn:
        for table in [
            "addresses",
            "clients",
            "providers",
            "vehicles",
            "services",
            "products",
            "orders",
            "order_items",
            "financial_entries",
            "vehicle_checklists",
            "checklist_photos",
            "vehicle_photos",
            "users",
            "auth_tokens",
        ]:
            conn.exec_driver_sql(
                "INSERT OR IGNORE INTO sqlite_sequence(name, seq) VALUES (?, ?)",
                (table, 2025),
            )

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
app.include_router(users.router)
app.include_router(auth.router)

app.mount("/frontend", StaticFiles(directory="frontend", html=True), name="frontend")
uploads_dir = os.path.join(os.path.dirname(__file__), "uploads")
app.mount("/uploads", StaticFiles(directory=uploads_dir), name="uploads")


@app.on_event("startup")
def ensure_seed_users() -> None:
    _ensure_sqlite_sequence()
    db = SessionLocal()
    try:
        seed_users(db)
    finally:
        db.close()


@app.get("/")
def healthcheck():
    return {"status": "ok", "frontend": "/frontend/index.html"}
