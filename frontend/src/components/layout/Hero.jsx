import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import carLogo from '../../assets/carlogo.jpg'; // Import the image

const Hero = () => {
  const navigate = useNavigate(); // Initialize useNavigate

  const handleSellYourCarClick = () => {
    navigate('/create-car'); // Navigate to the dashboard
  };

  return (
    <div className="hero-section bg-primary text-white py-5 mb-4">
      <Container>
        <Row className="align-items-center">
          <Col md={6}>
            <h1>Find Your Dream Car</h1>
            <p className="lead">Browse thousands of quality vehicles at competitive prices</p>
            <Button variant="light" size="lg" className="me-2">Browse Inventory</Button>
            <Button variant="outline-light" size="lg" onClick={handleSellYourCarClick}>Sell Your Car</Button>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Hero;
