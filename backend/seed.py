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

# Sample data
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
locations = [
    {"location": "Kottayam", "latitude": 9.591567, "longitude": 76.522153},
    {"location": "Thiruvananthapuram", "latitude": 8.487045, "longitude": 76.952725},
    {"location": "Ettumanoor", "latitude": 9.670626, "longitude": 76.557882},
    {"location": "Kochi", "latitude": 9.931233, "longitude": 76.267304},
    {"location": "Alappuzha", "latitude": 9.498107, "longitude": 76.338749}
]

# Load images from directory
IMAGE_DIR = "./images/"
image_files = os.listdir(IMAGE_DIR)
random.shuffle(image_files)  # Shuffle images for variety


def extract_embedding(image_path: str):
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
    try:
        tags = ["sedan", "SUV", "hatchback", "truck", "luxury", "sporty", "family"]
        text_inputs = clip.tokenize(tags).to(device)
        image = preprocess(Image.open(image_path)).unsqueeze(0).to(device)
        with torch.no_grad():
            image_features = model.encode_image(image)
            text_features = model.encode_text(text_inputs)
        similarity = (image_features @ text_features.T).squeeze(0)
        top_indices = similarity.argsort(descending=True)[:5]
        return [tags[i] for i in top_indices]
    except Exception as e:
        print(f"⚠️ Error generating tags for {image_path}: {e}")
        return []


def seed_data():
    db: Session = SessionLocal()

    # Create test user
    test_user = db.query(User).filter(User.username == "admin").first()
    if not test_user:
        test_user = User(username="admin", email="admin@example.com", hashed_password=get_password_hash("admin"))
        db.add(test_user)
        db.commit()
        db.refresh(test_user)

    cars = []
    image_cycle = iter(image_files)  # Ensure all images are used

    for brand, models in brands_models.items():
        for model in models:
            if len(cars) >= 20:
                break
            year = random.randint(2005, 2024)
            price = round(random.uniform(300000, 2000000), 2)
            mileage = random.randint(5, 26)
            fuel_type = random.choice(fuel_types)
            transmission = random.choice(transmissions)
            loc_data = random.choice(locations)

            try:
                image_file = next(image_cycle)  # Get next image in cycle
            except StopIteration:
                image_cycle = iter(image_files)  # Restart if exhausted
                image_file = next(image_cycle)

            image_url = f"http://localhost:8000/images/{image_file}"
            image_path = os.path.join(IMAGE_DIR, image_file)
            embedding = extract_embedding(image_path)
            tags = ",".join(generate_tags(image_path))

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
                image_path=image_url,
                tags=tags,
                embedding=embedding
            ))

    db.add_all(cars)
    db.commit()
    db.close()
    print("✅ Seeded 20 test cars with diverse images and models.")


if __name__ == "__main__":
    seed_data()