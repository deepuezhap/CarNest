import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Card, Spinner, Alert, Row, Col, ListGroup } from "react-bootstrap";
import api from "../services/api";
import NavbarComponent from "../components/layout/NavbarComponent"; // Import NavbarComponent

const CarDetails = () => {
  const { id } = useParams(); // Get the car ID from the URL
  const [car, setCar] = useState(null); // State to store car details
  const [loading, setLoading] = useState(true); // State to manage loading state
  const [error, setError] = useState(null); // State to manage error state

  useEffect(() => {
    const fetchCarDetails = async () => {
      try {
        const token = localStorage.getItem("token"); // Get the token from local storage
        const response = await api.get(`/api/cars/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the request headers
          },
        });
        setCar(response.data); // Set the car details in state
      } catch (err) {
        setError("Sign in to view the car details"); // Set error message if request fails
      } finally {
        setLoading(false); // Set loading to false after request completes
      }
    };

    fetchCarDetails(); // Fetch car details when component mounts
  }, [id]); // Dependency array to re-run effect when `id` changes

  if (loading) return <Spinner animation="border" className="d-block mx-auto mt-5" />; // Show spinner while loading
  if (error) return <Alert variant="warning" className="mt-3">{error}</Alert>; // Show error message if there's an error
  if (!car) return <Alert variant="warning" className="mt-3">Car not found</Alert>; // Show message if car not found

  return (
    <>
      <NavbarComponent /> {/* Add NavbarComponent */}
      <Container className="mt-4">
        <Card>
          <Card.Img
            variant="top"
            src={car.image_path}
            alt={car.title}
            style={{ width: "70%", height: "400px", objectFit: "cover", margin: "0 auto" }} // Center the car image
          /> {/* Display car image */}
          <Card.Body>
            <Card.Title className="fw-bold fs-3">{car.title}</Card.Title> {/* Display car title */}
            <Card.Text className="fs-4 text-primary">${car.price?.toLocaleString()}</Card.Text> {/* Display car price */}
            <ListGroup variant="flush">
              {Object.entries(car).map(([key, value]) => (
                key !== "id" && key !== "image_path" && key !== "latitude" && key !== "longitude" && key !== "seller_id" && key !== "embedding" && (
                  <ListGroup.Item key={key}>
                    <strong className="text-capitalize">{key.replace(/([A-Z])/g, ' $1')}:</strong> {String(value)} {/* Display car details */}
                  </ListGroup.Item>
                )
              ))}
              <ListGroup.Item>
                <strong>Listed on:</strong> {new Date(car.created_at).toLocaleDateString()} {/* Display listing date */}
              </ListGroup.Item>
            </ListGroup>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
};

export default CarDetails;
