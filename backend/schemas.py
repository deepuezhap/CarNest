from pydantic import BaseModel
from typing import Optional

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

class CarCreate(BaseModel):
    title: str
    description: Optional[str] = None
    brand: str
    model: str
    year: int
    price: float
    mileage: Optional[float] = None
    fuel_type: str
    transmission: str
    location: str
    seller_id: int

class CarResponse(CarCreate):
    id: int
