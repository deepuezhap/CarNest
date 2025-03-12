from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from schemas import CarCreate, CarResponse
from crud import create_car, get_car, delete_car, get_filtered_cars
from dependencies import get_db

car_router = APIRouter()




@car_router.get("/", response_model=List[CarResponse])
def fetch_cars(
    db: Session = Depends(get_db),
    brand: Optional[str] = Query(None, description="Filter by car brand"),
    model: Optional[str] = Query(None, description="Filter by car model"),
    min_price: Optional[float] = Query(None, description="Minimum price"),
    max_price: Optional[float] = Query(None, description="Maximum price"),
    fuel_type: Optional[str] = Query(None, description="Filter by fuel type"),
    transmission: Optional[str] = Query(None, description="Filter by transmission type"),
    limit: int = Query(10, description="Number of results per page"),
    offset: int = Query(0, description="Starting index for pagination"),
):
    cars = get_filtered_cars(db, brand, model, min_price, max_price, fuel_type, transmission, limit, offset)
    
    if not cars:
        raise HTTPException(status_code=404, detail="No cars found with the given filters")
    
    return cars