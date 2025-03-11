from fastapi import APIRouter, Depends,HTTPException
from schemas import CarCreate, CarResponse
from models import User
from .auth import get_current_user
from sqlalchemy.orm import Session
from dependencies import get_db
from crud import create_car, get_car, delete_car, get_filtered_cars



protected_router = APIRouter()

@protected_router.get("/protected")
def protected_route(user: User = Depends(get_current_user)):
    return {"message": f"Hello {user.username}, you have access to this protected route!"}

@protected_router.get("/cars/{car_id}", response_model=CarResponse)
def fetch_car(car_id: int, db: Session = Depends(get_db),user: User = Depends(get_current_user)):
    car = get_car(db, car_id)
    if not car:
        raise HTTPException(status_code=404, detail="Car not found")
    return car