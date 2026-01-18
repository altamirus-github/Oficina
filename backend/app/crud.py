from sqlalchemy.orm import Session

from . import models, schemas


def _upsert_address(db: Session, address_data: schemas.AddressCreate | None, current: models.Address | None):
    if address_data is None:
        return current
    if current is None:
        current = models.Address(**address_data.model_dump())
        db.add(current)
        db.flush()
        return current
    for field, value in address_data.model_dump().items():
        setattr(current, field, value)
    return current


def create_client(db: Session, payload: schemas.ClientCreate) -> models.Client:
    address = _upsert_address(db, payload.address, None)
    client = models.Client(
        name=payload.name,
        cpf=payload.cpf,
        phone=payload.phone,
        email=payload.email,
        address=address,
    )
    db.add(client)
    db.commit()
    db.refresh(client)
    return client


def update_client(db: Session, client: models.Client, payload: schemas.ClientUpdate) -> models.Client:
    data = payload.model_dump(exclude_unset=True)
    address_data = data.pop("address", None)
    if address_data is not None:
        client.address = _upsert_address(db, schemas.AddressCreate(**address_data), client.address)
    for field, value in data.items():
        setattr(client, field, value)
    db.commit()
    db.refresh(client)
    return client


def create_provider(db: Session, payload: schemas.ProviderCreate) -> models.Provider:
    address = _upsert_address(db, payload.address, None)
    provider = models.Provider(
        name=payload.name,
        cnpj=payload.cnpj,
        phone=payload.phone,
        email=payload.email,
        website=payload.website,
        address=address,
    )
    db.add(provider)
    db.commit()
    db.refresh(provider)
    return provider


def update_provider(db: Session, provider: models.Provider, payload: schemas.ProviderUpdate) -> models.Provider:
    data = payload.model_dump(exclude_unset=True)
    address_data = data.pop("address", None)
    if address_data is not None:
        provider.address = _upsert_address(db, schemas.AddressCreate(**address_data), provider.address)
    for field, value in data.items():
        setattr(provider, field, value)
    db.commit()
    db.refresh(provider)
    return provider


def create_vehicle(db: Session, payload: schemas.VehicleCreate) -> models.Vehicle:
    vehicle = models.Vehicle(**payload.model_dump())
    db.add(vehicle)
    db.commit()
    db.refresh(vehicle)
    return vehicle


def update_vehicle(db: Session, vehicle: models.Vehicle, payload: schemas.VehicleUpdate) -> models.Vehicle:
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(vehicle, field, value)
    db.commit()
    db.refresh(vehicle)
    return vehicle


def add_vehicle_photo(
    db: Session, vehicle: models.Vehicle, file_path: str, caption: str | None
) -> models.VehiclePhoto:
    photo = models.VehiclePhoto(vehicle=vehicle, file_path=file_path, caption=caption)
    db.add(photo)
    db.commit()
    db.refresh(photo)
    return photo


def create_service(db: Session, payload: schemas.ServiceCreate) -> models.Service:
    service = models.Service(**payload.model_dump())
    db.add(service)
    db.commit()
    db.refresh(service)
    return service


def update_service(db: Session, service: models.Service, payload: schemas.ServiceUpdate) -> models.Service:
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(service, field, value)
    db.commit()
    db.refresh(service)
    return service


def create_product(db: Session, payload: schemas.ProductCreate) -> models.Product:
    product = models.Product(**payload.model_dump())
    db.add(product)
    db.commit()
    db.refresh(product)
    return product


def update_product(db: Session, product: models.Product, payload: schemas.ProductUpdate) -> models.Product:
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(product, field, value)
    db.commit()
    db.refresh(product)
    return product


def create_order(db: Session, payload: schemas.OrderCreate) -> models.Order:
    order = models.Order(
        client_id=payload.client_id,
        vehicle_id=payload.vehicle_id,
        status=payload.status or "Aberto",
        payment_method=payload.payment_method,
        observation=payload.observation,
    )
    db.add(order)
    db.flush()

    total = 0
    for item in payload.items:
        line_total = item.quantity * item.unit_price
        total += line_total
        order.items.append(
            models.OrderItem(
                item_type=item.item_type,
                product_id=item.product_id,
                service_id=item.service_id,
                description=item.description,
                quantity=item.quantity,
                unit_price=item.unit_price,
                total=line_total,
            )
        )

    order.total = total
    db.commit()
    db.refresh(order)
    return order


def update_order(db: Session, order: models.Order, payload: schemas.OrderUpdate) -> models.Order:
    data = payload.model_dump(exclude_unset=True)
    items_data = data.pop("items", None)

    for field, value in data.items():
        setattr(order, field, value)

    if items_data is not None:
        order.items.clear()
        total = 0
        for item in items_data:
            line_total = item["quantity"] * item["unit_price"]
            total += line_total
            order.items.append(
                models.OrderItem(
                    item_type=item["item_type"],
                    product_id=item.get("product_id"),
                    service_id=item.get("service_id"),
                    description=item.get("description"),
                    quantity=item["quantity"],
                    unit_price=item["unit_price"],
                    total=line_total,
                )
            )
        order.total = total

    db.commit()
    db.refresh(order)
    return order


def create_financial_entry(db: Session, payload: schemas.FinancialEntryCreate) -> models.FinancialEntry:
    entry = models.FinancialEntry(**payload.model_dump())
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return entry


def update_financial_entry(
    db: Session, entry: models.FinancialEntry, payload: schemas.FinancialEntryUpdate
) -> models.FinancialEntry:
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(entry, field, value)
    db.commit()
    db.refresh(entry)
    return entry


def create_vehicle_checklist(db: Session, payload: schemas.VehicleChecklistCreate) -> models.VehicleChecklist:
    checklist = models.VehicleChecklist(**payload.model_dump())
    db.add(checklist)
    db.commit()
    db.refresh(checklist)
    return checklist


def update_vehicle_checklist(
    db: Session, checklist: models.VehicleChecklist, payload: schemas.VehicleChecklistUpdate
) -> models.VehicleChecklist:
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(checklist, field, value)
    db.commit()
    db.refresh(checklist)
    return checklist


def add_checklist_photo(
    db: Session, checklist: models.VehicleChecklist, file_path: str, caption: str | None
) -> models.ChecklistPhoto:
    photo = models.ChecklistPhoto(checklist=checklist, file_path=file_path, caption=caption)
    db.add(photo)
    db.commit()
    db.refresh(photo)
    return photo
