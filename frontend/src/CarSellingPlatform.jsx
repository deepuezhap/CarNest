import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Nav, Container, Row, Col, Card, Button, Form, Badge, Dropdown } from 'react-bootstrap';

const CarSellingPlatform = () => {
  const [cars, setCars] = useState([
    {
      id: 1,
      title: "2021 Tesla Model 3",
      price: 42999,
      mileage: 12500,
      year: 2021,
      fuelType: "Electric",
      transmission: "Automatic",
      image: "/api/placeholder/600/400",
      location: "San Francisco, CA",
      featured: true
    },
    {
      id: 2,
      title: "2019 Toyota Camry XSE",
      price: 25999,
      mileage: 35600,
      year: 2019,
      fuelType: "Gasoline",
      transmission: "Automatic",
      image: "/api/placeholder/600/400",
      location: "Los Angeles, CA",
      featured: false
    },
    {
      id: 3,
      title: "2020 Honda CR-V",
      price: 28500,
      mileage: 22300,
      year: 2020,
      fuelType: "Hybrid",
      transmission: "Automatic",
      image: "/api/placeholder/600/400",
      location: "Seattle, WA",
      featured: true
    },
    {
      id: 4,
      title: "2018 Ford Mustang GT",
      price: 35850,
      mileage: 27800,
      year: 2018,
      fuelType: "Gasoline",
      transmission: "Manual",
      image: "/api/placeholder/600/400",
      location: "Chicago, IL",
      featured: false
    },
    {
      id: 5,
      title: "2022 BMW X5",
      price: 64999,
      mileage: 8500,
      year: 2022,
      fuelType: "Gasoline",
      transmission: "Automatic",
      image: "/api/placeholder/600/400",
      location: "Miami, FL",
      featured: true
    },
    {
      id: 6,
      title: "2017 Chevrolet Silverado",
      price: 29999,
      mileage: 48000,
      year: 2017,
      fuelType: "Gasoline",
      transmission: "Automatic",
      image: "/api/placeholder/600/400",
      location: "Dallas, TX",
      featured: false
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [priceFilter, setPriceFilter] = useState('');

  const filteredCars = cars.filter(car => {
    const matchesSearch = car.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPrice = priceFilter === '' || 
      (priceFilter === 'under25k' && car.price < 25000) ||
      (priceFilter === '25k-40k' && car.price >= 25000 && car.price <= 40000) ||
      (priceFilter === '40k-60k' && car.price > 40000 && car.price <= 60000) ||
      (priceFilter === 'over60k' && car.price > 60000);
    
    return matchesSearch && matchesPrice;
  });

  return (
    <div className="car-selling-platform">
      <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
        <Container>
          <Navbar.Brand href="#home">CarMarket</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="#home">Home</Nav.Link>
              <Nav.Link href="#browse">Browse Cars</Nav.Link>
              <Nav.Link href="#sell">Sell Your Car</Nav.Link>
              <Nav.Link href="#financing">Financing</Nav.Link>
              <Nav.Link href="#about">About Us</Nav.Link>
            </Nav>
            <Nav>
              <Nav.Link href="#login">Login</Nav.Link>
              <Nav.Link href="#register">Register</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

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

      <Container className="mb-5">
        <h2 className="mb-4">Browse Our Inventory</h2>
        
        <Row className="mb-4">
          <Col md={6}>
            <Form.Group>
              <Form.Control 
                type="text" 
                placeholder="Search cars..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Dropdown>
              <Dropdown.Toggle variant="outline-secondary" id="dropdown-price">
                Price Range: {priceFilter ? priceFilter.replace('under', 'Under $').replace('over', 'Over $').replace('k', ',000').replace('-', ' - $') : 'All Prices'}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item onClick={() => setPriceFilter('')}>All Prices</Dropdown.Item>
                <Dropdown.Item onClick={() => setPriceFilter('under25k')}>Under $25,000</Dropdown.Item>
                <Dropdown.Item onClick={() => setPriceFilter('25k-40k')}>$25,000 - $40,000</Dropdown.Item>
                <Dropdown.Item onClick={() => setPriceFilter('40k-60k')}>$40,000 - $60,000</Dropdown.Item>
                <Dropdown.Item onClick={() => setPriceFilter('over60k')}>Over $60,000</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Col>
        </Row>

        <Row>
          {filteredCars.length > 0 ? (
            filteredCars.map(car => (
              <Col key={car.id} lg={4} md={6} className="mb-4">
                <Card>
                  {car.featured && (
                    <div className="position-absolute" style={{ top: '10px', right: '10px' }}>
                      <Badge bg="warning" text="dark">Featured</Badge>
                    </div>
                  )}
                  <Card.Img variant="top" src={car.image} alt={car.title} />
                  <Card.Body>
                    <Card.Title>{car.title}</Card.Title>
                    <Card.Text className="text-primary fw-bold fs-4">${car.price.toLocaleString()}</Card.Text>
                    <div className="d-flex mb-3 text-muted small">
                      <div className="me-3">
                        <i className="bi bi-speedometer2 me-1"></i> {car.mileage.toLocaleString()} miles
                      </div>
                      <div className="me-3">
                        <i className="bi bi-calendar me-1"></i> {car.year}
                      </div>
                      <div>
                        <i className="bi bi-fuel-pump me-1"></i> {car.fuelType}
                      </div>
                    </div>
                    <div className="d-flex mb-3 text-muted small">
                      <div className="me-3">
                        <i className="bi bi-gear me-1"></i> {car.transmission}
                      </div>
                      <div>
                        <i className="bi bi-geo-alt me-1"></i> {car.location}
                      </div>
                    </div>
                    <div className="d-grid gap-2">
                      <Button variant="primary">View Details</Button>
                      <Button variant="outline-secondary">Contact Seller</Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <Col className="text-center py-5">
              <h4>No cars found matching your criteria</h4>
              <p>Try adjusting your search or filters</p>
            </Col>
          )}
        </Row>
      </Container>

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
    </div>
  );
};

export default CarSellingPlatform;