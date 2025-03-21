from fastapi import APIRouter, Depends, File, HTTPException, Query, UploadFile
from sqlalchemy.orm import Session
from typing import List, Optional
from schemas import  CarResponse, CarSearchResponse
from crud import   get_filtered_cars, search_cars_by_location, search_cars_by_text
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
    title: Optional[str] = Query(None, description="Search by title"),
    tags: Optional[str] = Query(None, description="Search by tags"),
    brand: Optional[str] = Query(None, description="Filter by brand"),
    model: Optional[str] = Query(None, description="Filter by model"),
    year: Optional[int] = Query(None, description="Filter by year"),
    min_price: Optional[float] = Query(None, description="Minimum price"),
    max_price: Optional[float] = Query(None, description="Maximum price"),
    min_mileage: Optional[float] = Query(None, description="Minimum mileage"),
    max_mileage: Optional[float] = Query(None, description="Maximum mileage"),
    fuel_type: Optional[str] = Query(None, description="Filter by fuel type"),
    transmission: Optional[str] = Query(None, description="Filter by transmission type"),
    location: Optional[str] = Query(None, description="Filter by location"),
    num_previous_owners: Optional[int] = Query(None, description="Filter by number of previous owners"),
    insurance_status: Optional[str] = Query(None, description="Filter by insurance status"),
    registration_location: Optional[str] = Query(None, description="Filter by registration location"),
    has_power_windows: Optional[bool] = Query(None, description="Has Power Windows"),
    has_power_steering: Optional[bool] = Query(None, description="Has Power Steering"),
    has_car_history_report: Optional[bool] = Query(None, description="Has Car History Report"),
    has_rear_parking_sensors: Optional[bool] = Query(None, description="Has Rear Parking Sensors"),
    has_central_locking: Optional[bool] = Query(None, description="Has Central Locking"),
    has_air_conditioning: Optional[bool] = Query(None, description="Has Air Conditioning"),
    has_reverse_camera: Optional[bool] = Query(None, description="Has Reverse Camera"),
    has_abs: Optional[bool] = Query(None, description="Has ABS"),
    has_fog_lamps: Optional[bool] = Query(None, description="Has Fog Lamps"),
    has_power_mirrors: Optional[bool] = Query(None, description="Has Power Mirrors"),
    has_gps_navigation: Optional[bool] = Query(None, description="Has GPS Navigation"),
    has_keyless_start: Optional[bool] = Query(None, description="Has Keyless Start"),
    limit: int = Query(10, description="Number of results per page"),
    offset: int = Query(0, description="Starting index for pagination"),
):
    cars = get_filtered_cars(
        db, title, tags, brand, model, year, min_price, max_price, min_mileage, max_mileage,
        fuel_type, transmission, location, num_previous_owners, insurance_status, registration_location,
        has_power_windows, has_power_steering, has_car_history_report, has_rear_parking_sensors,
        has_central_locking, has_air_conditioning, has_reverse_camera, has_abs, has_fog_lamps,
        has_power_mirrors, has_gps_navigation, has_keyless_start, limit, offset
    )
    
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

@car_router.post("/search-by-image/",response_model=List[CarSearchResponse])
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

@car_router.get("/search-by-text/", response_model=List[CarSearchResponse])
def search_by_text(query: str = Query(..., description="Search query"), db: Session = Depends(get_db), top_k: int = 5):
    """
    Search for cars using a text description.
    """
    similar_cars = search_cars_by_text(db, query, top_k)

    if not similar_cars:
        raise HTTPException(status_code=404, detail="No matching cars found")

    return similar_cars
