import React from 'react';
import { Card, Button, Badge } from 'react-bootstrap';

const CarCard = ({ car }) => {
  const { 
    id, title, price, mileage, year, fuelType,
    transmission, image, location, featured 
  } = car;

  return (
    <Card>
      {featured && (
        <div className="position-absolute" style={{ top: '10px', right: '10px' }}>
          <Badge bg="warning" text="dark">Featured</Badge>
        </div>
      )}
      <Card.Img variant="top" src={image} alt={title} />
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Card.Text className="text-primary fw-bold fs-4">${price.toLocaleString()}</Card.Text>
        <div className="d-flex mb-3 text-muted small">
          <div className="me-3">
            <i className="bi bi-speedometer2 me-1"></i> {mileage.toLocaleString()} miles
          </div>
          <div className="me-3">
            <i className="bi bi-calendar me-1"></i> {year}
          </div>
          <div>
            <i className="bi bi-fuel-pump me-1"></i> {fuelType}
          </div>
        </div>
        <div className="d-flex mb-3 text-muted small">
          <div className="me-3">
            <i className="bi bi-gear me-1"></i> {transmission}
          </div>
          <div>
            <i className="bi bi-geo-alt me-1"></i> {location}
          </div>
        </div>
        <div className="d-grid gap-2">
          <Button variant="primary" href={`/cars/${id}`}>View Details</Button>
          <Button variant="outline-secondary">Contact Seller</Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default CarCard;