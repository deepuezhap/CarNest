import random
from sqlalchemy.orm import Session
from database import SessionLocal, engine
from models import Base, Car, User
from dependencies import get_password_hash

# Ensure tables exist
Base.metadata.create_all(bind=engine)

# Sample data for car brands, models, fuel types, and locations
brands_models = {
    "Toyota": ["Corolla", "Camry", "Rav4"],
    "Honda": ["Civic", "Accord", "CR-V"],
    "Ford": ["Focus", "Fusion", "Escape"],
    "BMW": ["X5", "3 Series", "5 Series"],
    "Tesla": ["Model 3", "Model S", "Model X"],
    "Mercedes": ["C-Class", "E-Class", "S-Class"],
    "Audi": ["A4", "A6", "Q5"],
    "Nissan": ["Altima", "Sentra", "Rogue"]
}
fuel_types = ["Petrol", "Diesel", "Electric", "Hybrid"]
transmissions = ["Automatic", "Manual"]
locations = ["New York", "Los Angeles", "San Francisco", "Texas", "Miami", "Chicago"]

def seed_data():
    db: Session = SessionLocal()

    # Create a test user if not exists
    test_user = db.query(User).filter(User.username == "testuser").first()
    if not test_user:
        test_user = User(username="testuser", email="test@example.com", hashed_password=get_password_hash("password123"))
        db.add(test_user)
        db.commit()
        db.refresh(test_user)

    # Insert 100 random car listings
    cars = []
    for i in range(1, 101):  # Generate 100 cars
        brand = random.choice(list(brands_models.keys()))
        model = random.choice(brands_models[brand])
        year = random.randint(2015, 2024)  # Random year between 2015 and 2024
        price = round(random.uniform(5000, 80000), 2)  # Price between $5,000 and $80,000
        mileage = random.randint(10000, 200000)  # Mileage between 10,000 and 200,000 miles
        fuel_type = random.choice(fuel_types)
        transmission = random.choice(transmissions)
        location = random.choice(locations)

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
            seller_id=test_user.id
        ))

    db.add_all(cars)
    db.commit()
    db.close()
    print("✅ 100 test car listings added successfully!")

if __name__ == "__main__":
    seed_data()
