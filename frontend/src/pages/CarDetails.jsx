import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Card, Spinner, Alert, Row, Col, ListGroup } from "react-bootstrap";
import api from "../services/api";

const CarDetails = () => {
  const { id } = useParams(); // Get the car ID from the URL
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCarDetails = async () => {
      try {
        const response = await api.get(`/cars/${id}`);
        setCar(response.data);
      } catch (err) {
        setError("Failed to load car details");
      } finally {
        setLoading(false);
      }
    };

    fetchCarDetails();
  }, [id]);

  if (loading) return <Spinner animation="border" className="d-block mx-auto mt-5" />;
  if (error) return <Alert variant="danger" className="mt-3">{error}</Alert>;
  if (!car) return <Alert variant="warning" className="mt-3">Car not found</Alert>;

  return (
    <Container className="mt-4">
      <Card>
        <Card.Img variant="top" src={car.image} alt={car.title} />
        <Card.Body>
          <Card.Title className="fw-bold fs-3">{car.title}</Card.Title>
          <Card.Text className="fs-4 text-primary">${car.price?.toLocaleString()}</Card.Text>
          <ListGroup variant="flush">
            {Object.entries(car).map(([key, value]) => (
              key !== "id" && key !== "image" && (
                <ListGroup.Item key={key}>
                  <strong className="text-capitalize">{key.replace(/([A-Z])/g, ' $1')}:</strong> {String(value)}
                </ListGroup.Item>
              )
            ))}
          </ListGroup>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default CarDetails;
