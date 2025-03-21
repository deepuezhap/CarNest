from typing import List
from fastapi import APIRouter, Depends, HTTPException
from schemas import CarCreate, CarResponse
from models import User
from .auth import get_current_user
from sqlalchemy.orm import Session
from dependencies import get_db
from crud import create_car, get_car, delete_car, get_user_cars, mark_car_as_sold
import logging

protected_router = APIRouter()

@protected_router.get("/protected")
def protected_route(user: User = Depends(get_current_user)):
    return {"message": f"Hello {user.username}, Welcome to dashboard!"}

@protected_router.get("/cars/{car_id}", response_model=CarResponse)
def fetch_car(car_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    car = get_car(db, car_id)
    if not car:
        raise HTTPException(status_code=404, detail="Car not found")
    return car

@protected_router.get("/user/cars", response_model=List[CarResponse])
def fetch_user_cars(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    logging.info(f"Fetching cars for user ID: {user.id}")
    user_cars = get_user_cars(db, user.id)
    logging.info(f"Found {len(user_cars)} cars for user ID: {user.id}")
    return user_cars

@protected_router.patch("/cars/{car_id}/sold")
def mark_as_sold(car_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    car = get_car(db, car_id)
    if not car:
        raise HTTPException(status_code=404, detail="Car not found")
    if car.seller_id != user.id:
        raise HTTPException(status_code=403, detail="Not authorized to mark this car as sold")
    return mark_car_as_sold(db, car_id)

@protected_router.post("/cars", response_model=CarResponse)
def add_car(car: CarCreate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    car.seller_id = user.id
    return create_car(db, car)

@protected_router.delete("/cars/{car_id}")
def remove_car(car_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    car = get_car(db, car_id)
    if not car:
        raise HTTPException(status_code=404, detail="Car not found")
    if car.seller_id != user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this car")
    delete_car(db, car_id)
    return {"message": "Car deleted"}