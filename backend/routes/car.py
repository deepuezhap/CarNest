from fastapi import APIRouter, Depends, File, HTTPException, Query, UploadFile
from sqlalchemy.orm import Session
from typing import List, Optional
from schemas import CarCreate, CarResponse
from crud import create_car, get_car, delete_car, get_filtered_cars, search_cars_by_location
from dependencies import get_db
import shutil
import os
from crud import search_similar_cars

car_router = APIRouter()

UPLOAD_DIR = "./images/"
os.makedirs(UPLOAD_DIR, exist_ok=True)  # Ensure directory exists

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

@car_router.post("/upload-image/")
def upload_car_image(file: UploadFile = File(...), db: Session = Depends(get_db)):
    """Handles image upload and returns the file path."""
    
    file_extension = file.filename.split(".")[-1]  # Get file extension
    if file_extension not in ["jpg", "jpeg", "png", "webp"]:
        raise HTTPException(status_code=400, detail="Invalid image format")

    # Create unique filename
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)  # Save file

    # Return accessible image path
    image_url = f"http://localhost:8000/images/{file.filename}"
    return {"image_url": image_url}

@car_router.post("/search-by-image/",response_model=List[CarResponse])
def search_by_image(file: UploadFile = File(...), db: Session = Depends(get_db), top_k: int = 5):
    """Search for similar cars by image upload."""
    
    # Save the uploaded image temporarily
    temp_image_path = f"./images/temp_{file.filename}"
    with open(temp_image_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Perform search
    similar_cars = search_similar_cars(db, temp_image_path, top_k)

    # Clean up temp image after search
    os.remove(temp_image_path)

    if not similar_cars:
        raise HTTPException(status_code=404, detail="No similar cars found")

    return similar_cars  # This will return car details as JSON

@car_router.get("/search-by-location/", response_model=List[CarResponse])
def search_by_location(
    latitude: float = Query(..., description="Latitude of the search location"),
    longitude: float = Query(..., description="Longitude of the search location"),
    radius: float = Query(10, description="Search radius in kilometers"),
    limit: int = Query(5, description="Number of results to return"),
    db: Session = Depends(get_db)
):
    """Find cars within a given radius based on latitude & longitude."""
    
    nearby_cars = search_cars_by_location(db, latitude, longitude, radius, limit)

    if not nearby_cars:
        raise HTTPException(status_code=404, detail="No cars found within the given radius")

    return nearby_cars
