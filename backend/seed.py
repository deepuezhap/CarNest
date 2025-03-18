import random
import os
import torch
import clip
import numpy as np
from PIL import Image
from sqlalchemy.orm import Session
from database import SessionLocal, engine
from models import Base, Car, User
from dependencies import get_password_hash

# Ensure tables exist
Base.metadata.create_all(bind=engine)

# Load CLIP model once
device = "cuda" if torch.cuda.is_available() else "cpu"
model, preprocess = clip.load("ViT-B/32", device=device)

# Sample data for car brands, models, fuel types, and locations
brands_models = {
    "Maruti Suzuki": ["Swift", "Baleno", "Alto"],
    "Hyundai": ["i20", "Creta", "Venue"],
    "Tata": ["Nexon", "Harrier", "Altroz"],
    "Mahindra": ["Scorpio", "XUV500", "Thar"],
    "Honda": ["City", "Amaze", "Jazz"],
    "Toyota": ["Innova", "Fortuner", "Etios"],
    "Ford": ["EcoSport", "Figo", "Endeavour"],
    "Kia": ["Seltos", "Sonet", "Carnival"]
}
fuel_types = ["Petrol", "Diesel", "Electric", "CNG"]
transmissions = ["Automatic", "Manual"]
general_locations = ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Kolkata"]

# Predefined locations with latitude & longitude
specific_locations = [
    {"location": "Kottayam, Kerala", "latitude": 9.591567, "longitude": 76.522153},
    {"location": "Thampanoor, Thiruvananthapuram, Kerala", "latitude": 8.487045, "longitude": 76.952725},
    {"location": "Ettumanoor, Kerala", "latitude": 9.670626, "longitude": 76.557882}
]

# Directory containing car images
IMAGE_DIR = "./images/"
image_files = os.listdir(IMAGE_DIR)

def extract_embedding(image_path: str):
    """Extract CLIP embedding for an image."""
    try:
        image = preprocess(Image.open(image_path)).unsqueeze(0).to(device)
        with torch.no_grad():
            image_features = model.encode_image(image)
        image_features /= image_features.norm(dim=-1, keepdim=True)  # Normalize
        return image_features.cpu().numpy().tobytes()  # Convert to bytes
    except Exception as e:
        print(f"⚠️ Error extracting embedding for {image_path}: {e}")
        return None

def seed_data():
    db: Session = SessionLocal()

    # Create a test user if not exists
    test_user = db.query(User).filter(User.username == "testuser").first()
    if not test_user:
        test_user = User(username="testuser", email="test@example.com", hashed_password=get_password_hash("password123"))
        db.add(test_user)
        db.commit()
        db.refresh(test_user)

    # Insert 20 random car listings
    cars = []
    for i in range(1, 21):  # Generate 20 cars
        brand = random.choice(list(brands_models.keys()))
        model = random.choice(brands_models[brand])
        year = random.randint(2015, 2024)
        price = round(random.uniform(300000, 2000000), 2)
        mileage = random.randint(5000, 150000)
        fuel_type = random.choice(fuel_types)
        transmission = random.choice(transmissions)

        # Assign location (some with predefined latitude/longitude, others random)
        if random.random() < 0.5:  # 50% chance to use predefined location
            loc_data = random.choice(specific_locations)
        else:
            loc_data = {"location": random.choice(general_locations), "latitude": None, "longitude": None}

        # Select a random image
        image_file = random.choice(image_files)
        image_url = f"http://localhost:8000/images/{image_file}"
        image_path = os.path.join(IMAGE_DIR, image_file)  # Convert to local path

        # Extract image embedding
        embedding = extract_embedding(image_path)

        cars.append(Car(
            title=f"{brand} {model} {year}",
            brand=brand,
            model=model,
            year=year,
            price=price,
            mileage=mileage,
            fuel_type=fuel_type,
            transmission=transmission,
            location=loc_data["location"],
            latitude=loc_data["latitude"],
            longitude=loc_data["longitude"],
            seller_id=test_user.id,
            has_power_windows=random.choice([True, False]),
            has_power_steering=random.choice([True, False]),
            num_previous_owners=random.randint(0, 3),
            insurance_status=random.choice(["Comprehensive", "Third-party", None]),
            registration_location=random.choice(general_locations),
            has_car_history_report=random.choice([True, False]),
            has_rear_parking_sensors=random.choice([True, False]),
            has_central_locking=random.choice([True, False]),
            has_air_conditioning=random.choice([True, False]),
            has_reverse_camera=random.choice([True, False]),
            has_abs=random.choice([True, False]),
            has_fog_lamps=random.choice([True, False]),
            has_power_mirrors=random.choice([True, False]),
            has_gps_navigation=random.choice([True, False]),
            has_keyless_start=random.choice([True, False]),
            image_path=image_url,  # Use URL for frontend display
            embedding=embedding  # Store CLIP embedding
        ))

    db.add_all(cars)
    db.commit()
    db.close()
    print("✅ 20 test car listings added successfully with embeddings and locations!")

if __name__ == "__main__":
    seed_data()
