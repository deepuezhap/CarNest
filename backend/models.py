from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Boolean, LargeBinary
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime, timezone

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)

    cars = relationship("Car", back_populates="seller")  # One-to-Many Relationship

class Car(Base):
    __tablename__ = "cars"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    tags = Column(String)
    brand = Column(String, nullable=False)
    model = Column(String, nullable=False)
    year = Column(Integer, nullable=False)
    price = Column(Float, nullable=False)
    mileage = Column(Float)
    fuel_type = Column(String)
    transmission = Column(String)
    location = Column(String)
    latitude = Column(Float)  # For proximity search
    longitude = Column(Float) # For proximity search
    image_path = Column(String, nullable=False)  # Store image location
    embedding = Column(LargeBinary, nullable=True)  # Store CLIP embedding
    has_power_windows = Column(Boolean, default=False)
    has_power_steering = Column(Boolean, default=False)
    num_previous_owners = Column(Integer, default=0)
    insurance_status = Column(String, nullable=True)  # "Comprehensive" / "Third-party" / None
    registration_location = Column(String, nullable=True)
    has_car_history_report = Column(Boolean, default=False)  #
    has_rear_parking_sensors = Column(Boolean, default=False)
    has_central_locking = Column(Boolean, default=False)
    has_air_conditioning = Column(Boolean, default=False)
    has_reverse_camera = Column(Boolean, default=False)
    has_abs = Column(Boolean, default=False)
    has_fog_lamps = Column(Boolean, default=False)
    has_power_mirrors = Column(Boolean, default=False)
    has_gps_navigation = Column(Boolean, default=False)
    has_keyless_start = Column(Boolean, default=False)

    seller_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    sold = Column(Boolean, default=False)

    seller = relationship("User", back_populates="cars")

