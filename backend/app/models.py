from datetime import datetime
from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, Numeric, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .database import Base


class Address(Base):
    __tablename__ = "addresses"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    street: Mapped[str | None] = mapped_column(String(200))
    number: Mapped[str | None] = mapped_column(String(50))
    complement: Mapped[str | None] = mapped_column(String(100))
    neighborhood: Mapped[str | None] = mapped_column(String(100))
    city: Mapped[str | None] = mapped_column(String(100))
    state: Mapped[str | None] = mapped_column(String(2))
    zipcode: Mapped[str | None] = mapped_column(String(20))


class Client(Base):
    __tablename__ = "clients"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(150))
    cpf: Mapped[str | None] = mapped_column(String(20), unique=True)
    phone: Mapped[str | None] = mapped_column(String(30))
    email: Mapped[str | None] = mapped_column(String(120))
    address_id: Mapped[int | None] = mapped_column(ForeignKey("addresses.id"))
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    address: Mapped[Address | None] = relationship(lazy="joined")
    vehicles: Mapped[list["Vehicle"]] = relationship(back_populates="client", cascade="all, delete-orphan")
    orders: Mapped[list["Order"]] = relationship(back_populates="client", cascade="all, delete-orphan")


class Provider(Base):
    __tablename__ = "providers"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(150))
    cnpj: Mapped[str | None] = mapped_column(String(20), unique=True)
    phone: Mapped[str | None] = mapped_column(String(30))
    email: Mapped[str | None] = mapped_column(String(120))
    website: Mapped[str | None] = mapped_column(String(200))
    address_id: Mapped[int | None] = mapped_column(ForeignKey("addresses.id"))
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    address: Mapped[Address | None] = relationship(lazy="joined")
    products: Mapped[list["Product"]] = relationship(back_populates="provider")


class Vehicle(Base):
    __tablename__ = "vehicles"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    client_id: Mapped[int] = mapped_column(ForeignKey("clients.id"))
    model: Mapped[str] = mapped_column(String(120))
    brand: Mapped[str] = mapped_column(String(120))
    plate: Mapped[str] = mapped_column(String(20), unique=True)
    year: Mapped[str | None] = mapped_column(String(4))
    km_current: Mapped[float | None] = mapped_column(Numeric(12, 2))
    color: Mapped[str | None] = mapped_column(String(50))
    fuel_type: Mapped[str | None] = mapped_column(String(50))

    client: Mapped[Client] = relationship(back_populates="vehicles")
    orders: Mapped[list["Order"]] = relationship(back_populates="vehicle")


class Service(Base):
    __tablename__ = "services"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(150))
    description: Mapped[str | None] = mapped_column(Text)
    base_price: Mapped[float | None] = mapped_column(Numeric(12, 2))


class Product(Base):
    __tablename__ = "products"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    provider_id: Mapped[int | None] = mapped_column(ForeignKey("providers.id"))
    name: Mapped[str] = mapped_column(String(150))
    category: Mapped[str | None] = mapped_column(String(100))
    price: Mapped[float | None] = mapped_column(Numeric(12, 2))
    barcode: Mapped[str | None] = mapped_column(String(120))
    description: Mapped[str | None] = mapped_column(Text)
    stock_qty: Mapped[int] = mapped_column(Integer, default=0)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    provider: Mapped[Provider | None] = relationship(back_populates="products")


class Order(Base):
    __tablename__ = "orders"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    client_id: Mapped[int] = mapped_column(ForeignKey("clients.id"))
    vehicle_id: Mapped[int | None] = mapped_column(ForeignKey("vehicles.id"))
    status: Mapped[str] = mapped_column(String(40), default="Aberto")
    payment_method: Mapped[str | None] = mapped_column(String(60))
    observation: Mapped[str | None] = mapped_column(Text)
    total: Mapped[float] = mapped_column(Numeric(12, 2), default=0)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    client: Mapped[Client] = relationship(back_populates="orders")
    vehicle: Mapped[Vehicle | None] = relationship(back_populates="orders")
    items: Mapped[list["OrderItem"]] = relationship(back_populates="order", cascade="all, delete-orphan")


class OrderItem(Base):
    __tablename__ = "order_items"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    order_id: Mapped[int] = mapped_column(ForeignKey("orders.id"))
    item_type: Mapped[str] = mapped_column(String(20))
    product_id: Mapped[int | None] = mapped_column(ForeignKey("products.id"))
    service_id: Mapped[int | None] = mapped_column(ForeignKey("services.id"))
    description: Mapped[str | None] = mapped_column(String(200))
    quantity: Mapped[int] = mapped_column(Integer, default=1)
    unit_price: Mapped[float] = mapped_column(Numeric(12, 2))
    total: Mapped[float] = mapped_column(Numeric(12, 2))

    order: Mapped[Order] = relationship(back_populates="items")
    product: Mapped[Product | None] = relationship()
    service: Mapped[Service | None] = relationship()


class FinancialEntry(Base):
    __tablename__ = "financial_entries"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    entry_type: Mapped[str] = mapped_column(String(20))  # income|expense
    description: Mapped[str] = mapped_column(String(200))
    category: Mapped[str | None] = mapped_column(String(100))
    amount: Mapped[float] = mapped_column(Numeric(12, 2))
    reference_order_id: Mapped[int | None] = mapped_column(ForeignKey("orders.id"))
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class VehicleChecklist(Base):
    __tablename__ = "vehicle_checklists"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    vehicle_id: Mapped[int] = mapped_column(ForeignKey("vehicles.id"))
    notes: Mapped[str | None] = mapped_column(Text)
    incident: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    vehicle: Mapped[Vehicle] = relationship()
    photos: Mapped[list["ChecklistPhoto"]] = relationship(back_populates="checklist", cascade="all, delete-orphan")


class ChecklistPhoto(Base):
    __tablename__ = "checklist_photos"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    checklist_id: Mapped[int] = mapped_column(ForeignKey("vehicle_checklists.id"))
    file_path: Mapped[str] = mapped_column(String(300))
    caption: Mapped[str | None] = mapped_column(String(200))
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    checklist: Mapped[VehicleChecklist] = relationship(back_populates="photos")
