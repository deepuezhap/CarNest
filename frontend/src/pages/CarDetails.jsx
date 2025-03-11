import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Button, Table, Carousel, Badge, Spinner } from 'react-bootstrap';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { fetchCarById } from '../services/api';
import { useLoading } from '../LoadingContext';

const CarDetails = () => {
  const { id } = useParams();
  console.log(id)
  const [car, setCar] = useState(null);
  const { loading, setLoading } = useLoading(); // Use the setLoading function from context
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCar = async () => {
      try {
        // Set global loading to true before fetching
        setLoading(true);
        const data = await fetchCarById(id);
        setCar(data);
      } catch (err) {
        setError(err.message);
      } finally {
        // Set global loading to false after fetch completes
        setLoading(false);
      }
    };

    loadCar();
  }, [id]);

  if (loading) {
    return (
      <div>
        <Navbar />
        <Container className="text-center py-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </Container>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Navbar />
        <Container className="py-5">
          <div className="alert alert-danger" role="alert">
            Error loading car details: {error}
          </div>
        </Container>
        <Footer />
      </div>
    );
  }

  if (!car) {
    return (
      <div>
        <Navbar />
        <Container className="py-5">
          <div className="alert alert-warning" role="alert">
            Car not found
          </div>
        </Container>
        <Footer />
      </div>
    );
  }

  // Assume we have more photos in an array for the carousel
  const photos = car.photos || [car.image];

  return (
    <div>
      <Navbar />
      <Container className="py-4">
        <Row>
          <Col lg={8}>
            <Carousel>
              {photos.map((photo, index) => (
                <Carousel.Item key={index}>
                  <img
                    className="d-block w-100"
                    src={photo}
                    alt={`${car.title} - view ${index + 1}`}
                  />
                </Carousel.Item>
              ))}
            </Carousel>
          </Col>
          <Col lg={4}>
            <div className="mb-3">
              <h1>{car.title}</h1>
              {car.featured && (
                <Badge bg="warning" text="dark" className="me-2">Featured</Badge>
              )}
              <Badge bg="info">Verified Seller</Badge>
            </div>
            <h2 className="text-primary mb-4">${car.price.toLocaleString()}</h2>
            
            <div className="mb-4">
              <h5>Quick Overview</h5>
              <Table bordered>
                <tbody>
                  <tr>
                    <td><i className="bi bi-calendar me-2"></i>Year</td>
                    <td>{car.year}</td>
                  </tr>
                  <tr>
                    <td><i className="bi bi-speedometer2 me-2"></i>Mileage</td>
                    <td>{car.mileage.toLocaleString()} miles</td>
                  </tr>
                  <tr>
                    <td><i className="bi bi-fuel-pump me-2"></i>Fuel Type</td>
                    <td>{car.fuelType}</td>
                  </tr>
                  <tr>
                    <td><i className="bi bi-gear me-2"></i>Transmission</td>
                    <td>{car.transmission}</td>
                  </tr>
                  <tr>
                    <td><i className="bi bi-geo-alt me-2"></i>Location</td>
                    <td>{car.location}</td>
                  </tr>
                </tbody>
              </Table>
            </div>
            
            <div className="d-grid gap-2">
              <Button variant="primary" size="lg">Contact Seller</Button>
              <Button variant="outline-secondary" size="lg">Save to Favorites</Button>
            </div>
          </Col>
        </Row>
        
        <Row className="mt-5">
          <Col>
            <h3>Description</h3>
            <p>{car.description || 'No description provided'}</p>
          </Col>
        </Row>
        
        <Row className="mt-4">
          <Col>
            <h3>Features</h3>
            <Row>
              {car.features?.map((feature, index) => (
                <Col key={index} md={4} className="mb-2">
                  <i className="bi bi-check-circle-fill text-success me-2"></i>
                  {feature}
                </Col>
              )) || (
                <Col>No features listed</Col>
              )}
            </Row>
          </Col>
        </Row>
      </Container>
      <Footer />
    </div>
  );
};

export default CarDetails;