import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';

const SellerSection = () => {
  return (
    <div className="bg-light py-5">
      <Container>
        <Row className="align-items-center">
          <Col md={6}>
            <h2>Sell Your Car With Us</h2>
            <p className="lead">List your vehicle for free and reach thousands of potential buyers</p>
            <ul className="list-unstyled">
              <li className="mb-2">✓ Free basic listings</li>
              <li className="mb-2">✓ Easy-to-use listing creation</li>
              <li className="mb-2">✓ Secure messaging system</li>
              <li className="mb-2">✓ Featured listing options available</li>
            </ul>
            <Button variant="primary" size="lg">Start Selling Now</Button>
          </Col>
          <Col md={6}>
            <img 
              src="/api/placeholder/600/400" 
              alt="Sell your car" 
              className="img-fluid rounded"
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default SellerSection;