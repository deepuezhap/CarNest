from pydantic import BaseModel
from typing import Literal, Optional
from datetime import datetime

class CarCreate(BaseModel):
    title: str
    description: Optional[str] = None
    brand: str
    model: str
    year: int
    price: float
    mileage: Optional[float] = None
    fuel_type: Literal['Petrol', 'Diesel', 'Electric','CNG']
    transmission: Literal['Automatic', 'Manual']  
    location: str
    image_path: Optional[str] = None
    seller_id: Optional[int] = None
    latitude: Optional[float] = None  # For proximity search (optional)
    longitude: Optional[float] = None # For proximity search (optional)

    
    # Boolean attributes for specific features
    has_power_windows: bool = False
    has_power_steering: bool = False
    num_previous_owners: int = 0
    insurance_status: Optional[str] = None  # "Comprehensive" / "Third-party" / None
    registration_location: Optional[str] = None
    has_car_history_report: bool = False  

    # Additional features
    has_rear_parking_sensors: bool = False
    has_central_locking: bool = False
    has_air_conditioning: bool = False
    has_reverse_camera: bool = False
    has_abs: bool = False
    has_fog_lamps: bool = False
    has_power_mirrors: bool = False
    has_gps_navigation: bool = False
    has_keyless_start: bool = False

    class Config:
        # This tells Pydantic to read from attributes for ORM models (SQLAlchemy)
        from_attributes = True

class CarResponse(CarCreate):
    id: int
    sold: bool
    created_at: datetime
    

    class Config:
        # This tells Pydantic to read from attributes for ORM models (SQLAlchemy)
        from_attributes = True

class UserCreate(BaseModel):
    username: str
    email: str
    password: str

class UserResponse(BaseModel):
    id: int
    username: str
    email: str

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
