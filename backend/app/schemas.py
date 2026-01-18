from datetime import datetime
from pydantic import BaseModel, Field


class AddressBase(BaseModel):
    street: str | None = None
    number: str | None = None
    complement: str | None = None
    neighborhood: str | None = None
    city: str | None = None
    state: str | None = None
    zipcode: str | None = None


class AddressCreate(AddressBase):
    pass


class Address(AddressBase):
    id: int

    class Config:
        from_attributes = True


class ClientBase(BaseModel):
    name: str
    cpf: str | None = None
    phone: str | None = None
    email: str | None = None
    address: AddressCreate | None = None


class ClientCreate(ClientBase):
    pass


class ClientUpdate(BaseModel):
    name: str | None = None
    cpf: str | None = None
    phone: str | None = None
    email: str | None = None
    address: AddressCreate | None = None


class Client(ClientBase):
    id: int
    address: Address | None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ProviderBase(BaseModel):
    name: str
    cnpj: str | None = None
    phone: str | None = None
    email: str | None = None
    website: str | None = None
    address: AddressCreate | None = None


class ProviderCreate(ProviderBase):
    pass


class ProviderUpdate(BaseModel):
    name: str | None = None
    cnpj: str | None = None
    phone: str | None = None
    email: str | None = None
    website: str | None = None
    address: AddressCreate | None = None


class Provider(ProviderBase):
    id: int
    address: Address | None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class VehicleBase(BaseModel):
    client_id: int
    model: str
    brand: str
    plate: str
    year: str | None = None
    km_current: float | None = None
    color: str | None = None
    fuel_type: str | None = None


class VehicleCreate(VehicleBase):
    pass


class VehicleUpdate(BaseModel):
    client_id: int | None = None
    model: str | None = None
    brand: str | None = None
    plate: str | None = None
    year: str | None = None
    km_current: float | None = None
    color: str | None = None
    fuel_type: str | None = None


class Vehicle(VehicleBase):
    id: int

    class Config:
        from_attributes = True


class VehiclePhotoBase(BaseModel):
    file_path: str
    caption: str | None = None


class VehiclePhoto(VehiclePhotoBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


class VehiclePhotoUpdate(BaseModel):
    caption: str | None = None


class VehicleWithPhotos(Vehicle):
    photos: list[VehiclePhoto] = []


class UserBase(BaseModel):
    name: str
    username: str
    role: str
    email: str | None = None
    phone: str | None = None
    is_active: bool = True


class UserCreate(UserBase):
    password: str


class UserUpdate(BaseModel):
    name: str | None = None
    role: str | None = None
    email: str | None = None
    phone: str | None = None
    is_active: bool | None = None
    new_password: str | None = None


class User(UserBase):
    id: int
    photo_path: str | None = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ProfileUpdate(BaseModel):
    name: str | None = None
    email: str | None = None
    phone: str | None = None
    new_password: str | None = None


class ServiceBase(BaseModel):
    name: str
    description: str | None = None
    base_price: float | None = None


class ServiceCreate(ServiceBase):
    pass


class ServiceUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    base_price: float | None = None


class Service(ServiceBase):
    id: int

    class Config:
        from_attributes = True


class ProductBase(BaseModel):
    provider_id: int | None = None
    name: str
    category: str | None = None
    price: float | None = None
    barcode: str | None = None
    description: str | None = None
    stock_qty: int = 0
    is_active: bool = True


class ProductCreate(ProductBase):
    pass


class ProductUpdate(BaseModel):
    provider_id: int | None = None
    name: str | None = None
    category: str | None = None
    price: float | None = None
    barcode: str | None = None
    description: str | None = None
    stock_qty: int | None = None
    is_active: bool | None = None


class Product(ProductBase):
    id: int

    class Config:
        from_attributes = True


class OrderItemBase(BaseModel):
    item_type: str = Field(..., description="product|service|labor")
    product_id: int | None = None
    service_id: int | None = None
    description: str | None = None
    quantity: int = 1
    unit_price: float


class OrderItemCreate(OrderItemBase):
    pass


class OrderItem(OrderItemBase):
    id: int
    total: float

    class Config:
        from_attributes = True


class OrderBase(BaseModel):
    client_id: int
    vehicle_id: int | None = None
    status: str | None = None
    payment_method: str | None = None
    observation: str | None = None


class OrderCreate(OrderBase):
    items: list[OrderItemCreate] = []


class OrderUpdate(BaseModel):
    client_id: int | None = None
    vehicle_id: int | None = None
    status: str | None = None
    payment_method: str | None = None
    observation: str | None = None
    items: list[OrderItemCreate] | None = None


class Order(OrderBase):
    id: int
    total: float
    created_at: datetime
    updated_at: datetime
    items: list[OrderItem] = []

    class Config:
        from_attributes = True


class FinancialEntryBase(BaseModel):
    entry_type: str = Field(..., description="income|expense")
    description: str
    category: str | None = None
    amount: float
    reference_order_id: int | None = None


class FinancialEntryCreate(FinancialEntryBase):
    pass


class FinancialEntryUpdate(BaseModel):
    entry_type: str | None = None
    description: str | None = None
    category: str | None = None
    amount: float | None = None
    reference_order_id: int | None = None


class FinancialEntry(FinancialEntryBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


class ChecklistPhotoBase(BaseModel):
    file_path: str
    caption: str | None = None


class ChecklistPhoto(ChecklistPhotoBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


class VehicleChecklistBase(BaseModel):
    vehicle_id: int
    notes: str | None = None
    incident: bool = False


class VehicleChecklistCreate(VehicleChecklistBase):
    pass


class VehicleChecklistUpdate(BaseModel):
    notes: str | None = None
    incident: bool | None = None


class VehicleChecklist(VehicleChecklistBase):
    id: int
    created_at: datetime
    photos: list[ChecklistPhoto] = []

    class Config:
        from_attributes = True
