import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';

const Hero = () => {
  return (
    <div className="hero-section bg-primary text-white py-5 mb-4">
      <Container>
        <Row className="align-items-center">
          <Col md={6}>
            <h1>Find Your Dream Car</h1>
            <p className="lead">Browse thousands of quality vehicles at competitive prices</p>
            <Button variant="light" size="lg" className="me-2">Browse Inventory</Button>
            <Button variant="outline-light" size="lg">Sell Your Car</Button>
          </Col>
          <Col md={6}>
            <img 
              src="/api/placeholder/600/400" 
              alt="Featured car" 
              className="img-fluid rounded"
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Hero;
