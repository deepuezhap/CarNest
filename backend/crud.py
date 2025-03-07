from sqlalchemy.orm import Session
from models import User, Car
from schemas import UserCreate, CarCreate
from dependencies import get_password_hash
from typing import Optional, List


def get_user_by_username(db: Session, username: str):
    return db.query(User).filter(User.username == username).first()

def create_user(db: Session, user: UserCreate):
    hashed_password = get_password_hash(user.password)
    db_user = User(username=user.username, email=user.email, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# Car CRUD Operations
def create_car(db: Session, car_data: CarCreate):
    car = Car(**car_data.model_dump())
    db.add(car)
    db.commit()
    db.refresh(car)
    return car

def get_cars(db: Session):
    return db.query(Car).all()

def get_car(db: Session, car_id: int):
    return db.query(Car).filter(Car.id == car_id).first()

def delete_car(db: Session, car_id: int):
    car = db.query(Car).filter(Car.id == car_id).first()
    if car:
        db.delete(car)
        db.commit()

def get_filtered_cars(
    db: Session,
    brand: Optional[str] = None,
    model: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    fuel_type: Optional[str] = None,
    transmission: Optional[str] = None,
    limit: int = 10,
    offset: int = 0
) -> List[Car]:
    query = db.query(Car)

    if brand:
        query = query.filter(Car.brand.ilike(f"%{brand}%"))
    if model:
        query = query.filter(Car.model.ilike(f"%{model}%"))
    if min_price is not None:
        query = query.filter(Car.price >= min_price)
    if max_price is not None:
        query = query.filter(Car.price <= max_price)
    if fuel_type:
        query = query.filter(Car.fuel_type == fuel_type)
    if transmission:
        query = query.filter(Car.transmission == transmission)

    # ✅ Apply pagination at the END
    return query.offset(offset).limit(limit).all()
