import random
import os
from sqlalchemy.orm import Session
from database import SessionLocal, engine
from models import Base, Car, User
from dependencies import get_password_hash

# Ensure tables exist
Base.metadata.create_all(bind=engine)

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
locations = ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Kolkata"]

# Directory containing car images
IMAGE_DIR = "./images/"
image_files = os.listdir(IMAGE_DIR)

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
        year = random.randint(2015, 2024)  # Random year between 2015 and 2024
        price = round(random.uniform(300000, 2000000), 2)  # Price between ₹3,00,000 and ₹20,00,000
        mileage = random.randint(5000, 150000)  # Mileage between 5,000 and 1,50,000 km
        fuel_type = random.choice(fuel_types)
        transmission = random.choice(transmissions)
        location = random.choice(locations)

        # Randomly select boolean features
        has_power_windows = random.choice([True, False])
        has_power_steering = random.choice([True, False])
        num_previous_owners = random.randint(0, 3)
        insurance_status = random.choice(["Comprehensive", "Third-party", None])
        registration_location = random.choice(locations)
        has_car_history_report = random.choice([True, False])
        has_rear_parking_sensors = random.choice([True, False])
        has_central_locking = random.choice([True, False])
        has_air_conditioning = random.choice([True, False])
        has_reverse_camera = random.choice([True, False])
        has_abs = random.choice([True, False])
        has_fog_lamps = random.choice([True, False])
        has_power_mirrors = random.choice([True, False])
        has_gps_navigation = random.choice([True, False])
        has_keyless_start = random.choice([True, False])

        # Select a random image from the image directory
        image_file = random.choice(image_files)
        image_path = f"http://localhost:8000/images/{image_file}"

        cars.append(Car(
            title=f"{brand} {model} {year}",
            brand=brand,
            model=model,
            year=year,
            price=price,
            mileage=mileage,
            fuel_type=fuel_type,
            transmission=transmission,
            location=location,
            seller_id=test_user.id,
            has_power_windows=has_power_windows,
            has_power_steering=has_power_steering,
            num_previous_owners=num_previous_owners,
            insurance_status=insurance_status,
            registration_location=registration_location,
            has_car_history_report=has_car_history_report,
            has_rear_parking_sensors=has_rear_parking_sensors,
            has_central_locking=has_central_locking,
            has_air_conditioning=has_air_conditioning,
            has_reverse_camera=has_reverse_camera,
            has_abs=has_abs,
            has_fog_lamps=has_fog_lamps,
            has_power_mirrors=has_power_mirrors,
            has_gps_navigation=has_gps_navigation,
            has_keyless_start=has_keyless_start,
            image_path=image_path  # Use the generated image URL
        ))

    db.add_all(cars)
    db.commit()
    db.close()
    print("✅ 20 test car listings added successfully!")

if __name__ == "__main__":
    seed_data()
