import React from 'react';
import { Card, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import { FaTachometerAlt, FaCalendarAlt, FaGasPump, FaCogs, FaMapMarkerAlt } from 'react-icons/fa'; // Import icons

const CarCard = ({ car }) => {
  const { 
    id, title, price, mileage, year, fuel_type,
    transmission, image_path, location, seller_id 
  } = car;
  const blah = ()=>console.log(seller_id);
  return (
    <Card>
      <Card.Img variant="top" src={image_path} alt={title} style={{ width: "100%", height: "200px", objectFit: "cover" }} /> {/* Display car image */}
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Card.Text className="text-primary fw-bold fs-4">${price.toLocaleString()}</Card.Text>
        <div className="d-flex mb-3 text-muted small">
          <div className="me-3">
            <FaTachometerAlt className="me-1" /> {mileage.toLocaleString()} miles
          </div>
          <div className="me-3">
            <FaCalendarAlt className="me-1" /> {year}
          </div>
          <div>
            <FaGasPump className="me-1" /> {fuel_type}
          </div>
        </div>
        <div className="d-flex mb-3 text-muted small">
          <div className="me-3">
            <FaCogs className="me-1" /> {transmission}
          </div>
          <div>
            <FaMapMarkerAlt className="me-1" /> {location}
          </div>
        </div>
        <div className="d-grid gap-2">
          <Button as={Link} to={`/cars/${id}`} variant="primary">View Details</Button> {/* Use Link for navigation */}
  <Button variant="outline-secondary" onClick={blah}>Contact Seller</Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default CarCard;