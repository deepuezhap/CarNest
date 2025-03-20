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
    "Maruti Suzuki": ["Swift", "Baleno", "Alto", "Vitara Brezza", "Ertiga", "Celerio"],
    "Hyundai": ["i20", "Creta", "Venue", "Verna", "Santro", "Tucson"],
    "Tata": ["Nexon", "Harrier", "Altroz", "Tiago", "Tigor", "Safari"],
    "Mahindra": ["Scorpio", "XUV500", "Thar", "Bolero", "Marazzo", "XUV700"],
    "Honda": ["City", "Amaze", "Jazz", "WR-V", "Brio", "CR-V"],
    "Toyota": ["Innova", "Fortuner", "Etios", "Glanza", "Urban Cruiser", "Corolla Altis"],
    "Ford": ["EcoSport", "Figo", "Endeavour", "Aspire", "Focus"],
    "Kia": ["Seltos", "Sonet", "Carnival", "Carens", "Sportege"]
}

fuel_types = ["Petrol", "Diesel", "Electric", "CNG"]
transmissions = ["Automatic", "Manual"]
general_locations = [
    "Kottayam", "Thiruvananthapuram", "Ettumanoor", "Kochi", "Alappuzha", 
    "Calicut", "Kannur", "Idukki", "Pathanamthitta", "Wayanad", 
    "Varkala", "Kollam", "Palakkad", "Munnar"
]


# Predefined locations with latitude & longitude
specific_locations = [
    {"location": "Kottayam", "latitude": 9.591567, "longitude": 76.522153},
    {"location": "Thiruvananthapuram", "latitude": 8.487045, "longitude": 76.952725},
    {"location": "Ettumanoor", "latitude": 9.670626, "longitude": 76.557882},
    {"location": "Kochi", "latitude": 9.931233, "longitude": 76.267304},
    {"location": "Alappuzha", "latitude": 9.498107, "longitude": 76.338749},
    {"location": "Calicut", "latitude": 11.2588, "longitude": 75.7804},
    {"location": "Kannur", "latitude": 11.8745, "longitude": 75.3704},
    {"location": "Idukki", "latitude": 9.8833, "longitude": 77.0997},
    {"location": "Pathanamthitta", "latitude": 9.2648, "longitude": 76.7811},
    {"location": "Wayanad", "latitude": 11.7162, "longitude": 76.1144},
    {"location": "Varkala", "latitude": 8.7342, "longitude": 76.7128},
    {"location": "Kollam", "latitude": 8.884, "longitude": 76.5941},
    {"location": "Palakkad", "latitude": 10.7769, "longitude": 76.6546},
    {"location": "Munnar", "latitude": 10.0889, "longitude": 77.0588}
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

def generate_tags(image_path: str) -> list:
    """Generate tags for the image using CLIP based on predefined categories."""
    try:
        # Categories for possible tags
        vehicle_types = ["sedan", "SUV", "hatchback", "truck", "coupe", "convertible", "minivan", "crossover"]
        colors = ["red", "blue", "black", "white", "green", "yellow", "silver", "gray", "brown"]
        conditions = ["brand new", "used", "like new", "well-maintained", "slightly worn"]
        fuel_types = ["petrol", "diesel", "electric", "CNG"]
        other_tags = ["luxury", "sporty", "economical", "family", "off-road", "compact", "eco-friendly", "vintage", "modern"]

        # Combine all categories for tags
        all_tags = vehicle_types + colors + conditions + fuel_types + other_tags
        text_inputs = clip.tokenize(all_tags).to(device)
        image = preprocess(Image.open(image_path)).unsqueeze(0).to(device)
        
        # Get features for both the image and the text categories
        with torch.no_grad():
            image_features = model.encode_image(image)
            text_features = model.encode_text(text_inputs)
        
        # Normalize the features
        image_features /= image_features.norm(dim=-1, keepdim=True)
        text_features /= text_features.norm(dim=-1, keepdim=True)
        
        # Compute similarity between image and text features
        similarity = (image_features @ text_features.T).squeeze(0)
        
        # Get the top 5 tags (most similar)
        top_indices = similarity.argsort(descending=True)[:5]
        top_tags = [all_tags[i] for i in top_indices]

        return top_tags

    except Exception as e:
        print(f"⚠️ Error generating tags for {image_path}: {e}")
        return []

def seed_data():
    db: Session = SessionLocal()

    # Create a test user if not exists
    test_user = db.query(User).filter(User.username == "admin").first()
    if not test_user:
        test_user = User(username="admin", email="admin@example.com", hashed_password=get_password_hash("admin"))
        db.add(test_user)
        db.commit()
        db.refresh(test_user)

    # Insert 20 random car listings
    cars = []
    for i in range(1, 21):  # Generate 20 cars
        brand = random.choice(list(brands_models.keys()))
        model = random.choice(brands_models[brand])
        year = random.randint(2001, 2024)
        price = round(random.uniform(300000, 2000000), 2)
        mileage = random.randint(5, 26)
        fuel_type = random.choice(fuel_types)
        transmission = random.choice(transmissions)
        loc_data = random.choice(specific_locations)

        
        # Select a random image
        image_file = random.choice(image_files)
        image_url = f"http://localhost:8000/images/{image_file}"
        image_path = os.path.join(IMAGE_DIR, image_file)  # Convert to local path

        # Extract image embedding
        embedding = extract_embedding(image_path)

        # Generate tags using CLIP
        tags = generate_tags(image_path)

        # Join tags into a comma-separated string
        tags_str = ",".join(tags)  # Convert the list of tags into a single string

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
            tags=tags_str,  # Store the generated tags as string
            embedding=embedding  # Store CLIP embedding
        ))

    db.add_all(cars)
    db.commit()
    db.close()
    print("✅ 20 test car added.")

if __name__ == "__main__":
    seed_data()
