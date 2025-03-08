import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const FeatureSection = () => {
  return (
    <Container className="mb-5">
      <h2 className="mb-4">Why Choose CarMarket?</h2>
      <Row>
        <Col md={4} className="mb-4">
          <div className="text-center">
            <div className="feature-icon mb-3">
              <i className="bi bi-shield-check" style={{ fontSize: '2.5rem', color: '#0d6efd' }}></i>
            </div>
            <h4>Trusted Sellers</h4>
            <p>All our sellers are verified and reviewed by our community</p>
          </div>
        </Col>
        <Col md={4} className="mb-4">
          <div className="text-center">
            <div className="feature-icon mb-3">
              <i className="bi bi-cash-coin" style={{ fontSize: '2.5rem', color: '#0d6efd' }}></i>
            </div>
            <h4>Competitive Pricing</h4>
            <p>Get fair market value with our pricing transparency tool</p>
          </div>
        </Col>
        <Col md={4} className="mb-4">
          <div className="text-center">
            <div className="feature-icon mb-3">
              <i className="bi bi-tools" style={{ fontSize: '2.5rem', color: '#0d6efd' }}></i>
            </div>
            <h4>Vehicle Inspection</h4>
            <p>Optional professional inspection services available</p>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default FeatureSection;