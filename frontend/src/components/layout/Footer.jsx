import React from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer className="bg-dark text-white py-4 mt-5">
      <Container>
        <Row>
          <Col md={4}>
            <h5>CarMarket</h5>
            <p>The simplest way to buy and sell cars online.</p>
            <div className="social-links">
              <a href="#" className="text-white me-3"><i className="bi bi-facebook"></i></a>
              <a href="#" className="text-white me-3"><i className="bi bi-twitter"></i></a>
              <a href="#" className="text-white me-3"><i className="bi bi-instagram"></i></a>
              <a href="#" className="text-white"><i className="bi bi-linkedin"></i></a>
            </div>
          </Col>
          <Col md={2}>
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li><a href="#" className="text-white">Home</a></li>
              <li><a href="#" className="text-white">Browse Cars</a></li>
              <li><a href="#" className="text-white">Sell Your Car</a></li>
              <li><a href="#" className="text-white">About Us</a></li>
            </ul>
          </Col>
          <Col md={3}>
            <h5>Support</h5>
            <ul className="list-unstyled">
              <li><a href="#" className="text-white">Contact Us</a></li>
              <li><a href="#" className="text-white">FAQ</a></li>
              <li><a href="#" className="text-white">Help Center</a></li>
              <li><a href="#" className="text-white">Privacy Policy</a></li>
            </ul>
          </Col>
          <Col md={3}>
            <h5>Subscribe</h5>
            <p>Get the latest car listings and offers</p>
            <Form>
              <Form.Group>
                <Form.Control type="email" placeholder="Your email" />
              </Form.Group>
              <Button variant="primary" className="mt-2">Subscribe</Button>
            </Form>
          </Col>
        </Row>
        <hr className="my-4" />
        <div className="text-center">
          <small>&copy; {new Date().getFullYear()} CarMarket. All Rights Reserved.</small>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;