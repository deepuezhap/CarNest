from sqlalchemy.orm import Session
from models import User, Car
from schemas import UserCreate, CarCreate
from dependencies import get_password_hash
from typing import Optional, List
import torch
import clip
from PIL import Image
import numpy as np
import os
import faiss
from math import radians, cos, sin, asin, sqrt
import re


device = "cuda" if torch.cuda.is_available() else "cpu"
model, preprocess = clip.load("ViT-B/32", device=device)


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
    # Convert Pydantic model to dictionary
    car_dict = car_data.model_dump()

    # Extract the actual file path from the image URL
    image_url = car_dict.get("image_path")
    if not image_url:
        raise ValueError("Image path (URL) is required for embedding extraction")

    # Convert the URL to a local file path
    filename = os.path.basename(image_url)  # Extract "800-1986-1997.webp"
    image_path = os.path.join("images", filename)  # Convert to "./images/800-1986-1997.webp"

    try:
        # Load image and preprocess
        image = preprocess(Image.open(image_path)).unsqueeze(0).to(device)

        # Extract embedding
        with torch.no_grad():
            image_features = model.encode_image(image)

        # Normalize and convert to bytes
        image_features /= image_features.norm(dim=-1, keepdim=True)
        embedding_bytes = image_features.cpu().numpy().tobytes()

    except Exception as e:
        print(f"Error extracting embedding: {e}")
        embedding_bytes = None  # Store as NULL if there's an error

    # Create car entry with the embedding
    car = Car(**car_dict, embedding=embedding_bytes)
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
    title: Optional[str] = None,
    tags: Optional[str] = None,
    brand: Optional[str] = None,
    model: Optional[str] = None,
    year: Optional[int] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    min_mileage: Optional[float] = None,
    max_mileage: Optional[float] = None,
    fuel_type: Optional[str] = None,
    transmission: Optional[str] = None,
    location: Optional[str] = None,
    num_previous_owners: Optional[int] = None,
    insurance_status: Optional[str] = None,
    registration_location: Optional[str] = None,
    has_power_windows: Optional[bool] = None,
    has_power_steering: Optional[bool] = None,
    has_car_history_report: Optional[bool] = None,
    has_rear_parking_sensors: Optional[bool] = None,
    has_central_locking: Optional[bool] = None,
    has_air_conditioning: Optional[bool] = None,
    has_reverse_camera: Optional[bool] = None,
    has_abs: Optional[bool] = None,
    has_fog_lamps: Optional[bool] = None,
    has_power_mirrors: Optional[bool] = None,
    has_gps_navigation: Optional[bool] = None,
    has_keyless_start: Optional[bool] = None,
    limit: int = 10,
    offset: int = 0
) -> List[Car]:
    query = db.query(Car).filter(Car.sold == False)  # Exclude sold cars

    # String-based filters
    if title:
        query = query.filter(Car.title.ilike(f"%{title}%"))
    if tags:
        query = query.filter(Car.tags.ilike(f"%{tags}%"))
    if brand:
        query = query.filter(Car.brand.ilike(f"%{brand}%"))
    if model:
        query = query.filter(Car.model.ilike(f"%{model}%"))
    if location:
        query = query.filter(Car.location.ilike(f"%{location}%"))
    if registration_location:
        query = query.filter(Car.registration_location.ilike(f"%{registration_location}%"))
    
    # Numeric filters
    if year is not None:
        query = query.filter(Car.year >= year)
    if min_price is not None:
        query = query.filter(Car.price >= min_price)
    if max_price is not None:
        query = query.filter(Car.price <= max_price)
    if min_mileage is not None:
        query = query.filter(Car.mileage >= min_mileage)
    if max_mileage is not None:
        query = query.filter(Car.mileage <= max_mileage)
    if num_previous_owners is not None:
        query = query.filter(Car.num_previous_owners == num_previous_owners)

    # Exact match filters
    if fuel_type:
        query = query.filter(Car.fuel_type == fuel_type)
    if transmission:
        query = query.filter(Car.transmission == transmission)
    if insurance_status:
        query = query.filter(Car.insurance_status == insurance_status)

    # Boolean feature filters
    if has_power_windows is not None:
        query = query.filter(Car.has_power_windows == has_power_windows)
    if has_power_steering is not None:
        query = query.filter(Car.has_power_steering == has_power_steering)
    if has_car_history_report is not None:
        query = query.filter(Car.has_car_history_report == has_car_history_report)
    if has_rear_parking_sensors is not None:
        query = query.filter(Car.has_rear_parking_sensors == has_rear_parking_sensors)
    if has_central_locking is not None:
        query = query.filter(Car.has_central_locking == has_central_locking)
    if has_air_conditioning is not None:
        query = query.filter(Car.has_air_conditioning == has_air_conditioning)
    if has_reverse_camera is not None:
        query = query.filter(Car.has_reverse_camera == has_reverse_camera)
    if has_abs is not None:
        query = query.filter(Car.has_abs == has_abs)
    if has_fog_lamps is not None:
        query = query.filter(Car.has_fog_lamps == has_fog_lamps)
    if has_power_mirrors is not None:
        query = query.filter(Car.has_power_mirrors == has_power_mirrors)
    if has_gps_navigation is not None:
        query = query.filter(Car.has_gps_navigation == has_gps_navigation)
    if has_keyless_start is not None:
        query = query.filter(Car.has_keyless_start == has_keyless_start)

    # Apply pagination at the end
    return query.offset(offset).limit(limit).all()


def get_user_cars(db: Session, user_id: int) -> List[Car]:
    return db.query(Car).filter(Car.seller_id == user_id).all()

def mark_car_as_sold(db: Session, car_id: int):
    car = db.query(Car).filter(Car.id == car_id).first()
    if car:
        car.sold = True
        db.commit()
        db.refresh(car)
    return car


# ..............Image Search.....................


def search_similar_cars(db: Session, query_image_path: str, top_k: int = 5)-> List[Car]:
    """
    Given a query image, find the top-k most similar cars using CLIP and FAISS.
    """
    # Load and process query image
    image = preprocess(Image.open(query_image_path)).unsqueeze(0).to(device)

    with torch.no_grad():
        query_embedding = model.encode_image(image)

    # Normalize embedding
    query_embedding /= query_embedding.norm(dim=-1, keepdim=True)
    query_embedding_np = query_embedding.cpu().numpy().astype(np.float32)

    # Retrieve all car embeddings from the database
    cars = db.query(Car).filter(Car.embedding.isnot(None)).all()

    if not cars:
        return []

    # Convert stored BLOB embeddings to NumPy array
    embeddings = []
    car_ids = []

    for car in cars:
        embedding_np = np.frombuffer(car.embedding, dtype=np.float32)
        embeddings.append(embedding_np)
        car_ids.append(car.id)

    embeddings = np.array(embeddings, dtype=np.float32)

    # Create FAISS index and add embeddings
    index = faiss.IndexFlatIP(embeddings.shape[1])  # Inner Product (Cosine Similarity)
    index.add(embeddings)

    # Perform search
    distances, indices = index.search(query_embedding_np, top_k)
    normalized_scores = ((distances[0] + 1) / 2) * 100


    # Get the corresponding car IDs
    similar_car_ids = [car_ids[i] for i in indices[0]]

    # Fetch car details
    similar_cars = db.query(Car).filter(Car.id.in_(similar_car_ids)).all()

# Attach confidence scores to each car object
    for i, car in enumerate(similar_cars):
        car.confidence = float(f"{normalized_scores[i]:.2f}")  # Proper rounding to 2 decimal places
                
    return similar_cars



# ..............Proximity Search...................


def haversine(lat1, lon1, lat2, lon2):
    """
    Calculate the great-circle distance between two points 
    on the Earth using the Haversine formula.
    """
    R = 6371  # Radius of Earth in kilometers
    lat1, lon1, lat2, lon2 = map(radians, [lat1, lon1, lat2, lon2])

    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = sin(dlat / 2) ** 2 + cos(lat1) * cos(lat2) * sin(dlon / 2) ** 2
    c = 2 * asin(sqrt(a))

    return R * c  # Distance in km

def search_cars_by_location(db: Session, latitude: float, longitude: float, radius: float, limit: int = 5) -> List[Car]:
    """
    Find cars within a given radius from the given latitude and longitude.
    """
    cars = db.query(Car).filter(Car.latitude.isnot(None), Car.longitude.isnot(None)).all()

    nearby_cars = [
        car for car in cars if haversine(latitude, longitude, car.latitude, car.longitude) <= radius
    ]

    return nearby_cars[:limit]  # Limit results

def search_cars_by_text(db: Session, query_text: str, top_k: int = 5) -> List[Car]:
    """
    Given a text query, find the top-k most similar cars using CLIP text-to-image search.
    """
    cleaned_query_text=clean_text(query_text)

    # Encode the text query
    with torch.no_grad():
        text_embedding = model.encode_text(clip.tokenize([cleaned_query_text]).to(device))

    # Normalize embedding
    text_embedding /= text_embedding.norm(dim=-1, keepdim=True)
    text_embedding_np = text_embedding.cpu().numpy().astype(np.float32)

    # Retrieve all car embeddings from the database
    cars = db.query(Car).filter(Car.embedding.isnot(None)).all()

    if not cars:
        return []

    # Convert stored BLOB embeddings to NumPy array
    embeddings = []
    car_ids = []

    for car in cars:
        embedding_np = np.frombuffer(car.embedding, dtype=np.float32)
        embeddings.append(embedding_np)
        car_ids.append(car.id)

    embeddings = np.array(embeddings, dtype=np.float32)

    # Create FAISS index and add embeddings
    index = faiss.IndexFlatIP(embeddings.shape[1])  # Inner Product (Cosine Similarity)
    index.add(embeddings)

    # Perform search
    distances, indices = index.search(text_embedding_np, top_k)
    normalized_scores = ((distances[0] + 1) / 2) * 100


    # Get the corresponding car IDs
    similar_car_ids = [car_ids[i] for i in indices[0]]

    # Fetch car details
    similar_cars = db.query(Car).filter(Car.id.in_(similar_car_ids)).all()

    # Attach confidence scores to each car object
    for i, car in enumerate(similar_cars):
        car.confidence = float(f"{normalized_scores[i]:.2f}")  # Proper rounding to 2 decimal places

    return similar_cars

def clean_text(text):
    """Remove special characters and convert to lowercase for better matching."""
    text = text.lower()
    text = re.sub(r'[^a-z0-9 ]+', '', text)  # Remove special characters
    return text

