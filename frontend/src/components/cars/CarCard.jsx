import React from 'react';
import { Card, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaTachometerAlt, FaCalendarAlt, FaGasPump, FaCogs, FaMapMarkerAlt } from 'react-icons/fa';
import { BsStars } from 'react-icons/bs';
import WhatsAppButton from './WhatsAppButton';

const CarCard = ({ car }) => {
  const { 
    id, title, price, mileage, year, fuel_type,
    transmission, image_path, location, seller_id, confidence
  } = car;

  // Determine confidence badge color
  const getConfidenceBadge = (confidence) => {
    if (confidence >= 80) return "success"; // Green ✅
    if (confidence >= 50) return "warning"; // Yellow ⚠️
    return "danger"; // Red ❌
  };

  return (
    <Card>
      <Card.Img variant="top" src={image_path} alt={title} style={{ width: "100%", height: "200px", objectFit: "cover" }} /> 
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Card.Text className="text-primary fw-bold fs-4">${price.toLocaleString()}</Card.Text>
        
        {/* Show Confidence Badge Only If `confidence` Exists */}
        {confidence !== undefined && (
          <Badge pill bg={getConfidenceBadge(confidence)} className="mb-2">
            <BsStars className="me-1" /> {confidence}% Match
          </Badge>
        )}

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
          <Button as={Link} to={`/cars/${id}`} variant="primary">View Details</Button> 
          <WhatsAppButton phoneNumber={8848509216} message="I need assistance with my order." />  
        </div>
      </Card.Body>
    </Card>
  );
};

export default CarCard;
