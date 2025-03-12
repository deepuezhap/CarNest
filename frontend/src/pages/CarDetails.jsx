import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Card, Spinner, Alert, ListGroup } from "react-bootstrap";
import api from "../services/api";
import NavbarComponent from "../components/layout/NavbarComponent"; // Import NavbarComponent
import { FaDollarSign, FaGasPump, FaCogs, FaMapMarkerAlt, FaCalendarAlt, FaTachometerAlt } from "react-icons/fa"; // Import icons

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

  const additionalFeatures = [
    { label: "Power Windows", value: car.has_power_windows },
    { label: "Power Steering", value: car.has_power_steering },
    { label: "Rear Parking Sensors", value: car.has_rear_parking_sensors },
    { label: "Central Locking", value: car.has_central_locking },
    { label: "Air Conditioning", value: car.has_air_conditioning },
    { label: "Reverse Camera", value: car.has_reverse_camera },
    { label: "ABS", value: car.has_abs },
    { label: "Fog Lamps", value: car.has_fog_lamps },
    { label: "Power Mirrors", value: car.has_power_mirrors },
    { label: "GPS Navigation", value: car.has_gps_navigation },
    { label: "Keyless Start", value: car.has_keyless_start },
    { label: "History Report", value: car.has_car_history_report },

  ];

  const hasAdditionalFeatures = additionalFeatures.some(feature => feature.value);
  return (
    <>
      <NavbarComponent /> {/* Add NavbarComponent */}
      <Container className="mt-4 mb-4">
        <Card>
          <Card.Img
            variant="top"
            src={car.image_path}
            alt={car.title}
            style={{ width: "70%", height: "400px", objectFit: "cover", margin: "0 auto" }} // Center the car image
          /> {/* Display car image */}
          <Card.Body>
            <Card.Title className="fw-bold fs-3">{car.title}</Card.Title> {/* Display car title */}
            <Card.Text className="fs-4 text-primary">
              <FaDollarSign className="me-2" />${car.price?.toLocaleString()}
            </Card.Text> {/* Display car price */}
            <ListGroup variant="flush">
              <ListGroup.Item>
                <strong>Brand:</strong> {car.brand}
              </ListGroup.Item>
              <ListGroup.Item>
                <strong>Model:</strong> {car.model}
              </ListGroup.Item>
              <ListGroup.Item>
                <strong><FaCalendarAlt className="me-2" />Year:</strong> {car.year}
              </ListGroup.Item>
              <ListGroup.Item>
                <strong><FaTachometerAlt className="me-2" />Mileage:</strong> {car.mileage?.toLocaleString()} miles
              </ListGroup.Item>
              <ListGroup.Item>
                <strong><FaGasPump className="me-2" />Fuel Type:</strong> {car.fuel_type}
              </ListGroup.Item>
              <ListGroup.Item>
                <strong><FaCogs className="me-2" />Transmission:</strong> {car.transmission}
              </ListGroup.Item>
              <ListGroup.Item>
                <strong><FaMapMarkerAlt className="me-2" />Location:</strong> {car.location}
              </ListGroup.Item>
              <ListGroup.Item>
                <strong>Insurance Status:</strong> {car.insurance_status || "N/A"}
              </ListGroup.Item>
              <ListGroup.Item>
                <strong>Number of Previous Owners:</strong> {car.num_previous_owners}
              </ListGroup.Item>
              <ListGroup.Item>
                <strong>Car History Report:</strong> {car.has_car_history_report ? "Yes" : "No"}
              </ListGroup.Item>
              <ListGroup.Item>
                <strong>Listed on:</strong> {new Date(car.created_at).toLocaleDateString()} {/* Display listing date */}
              </ListGroup.Item>
            </ListGroup>
            {hasAdditionalFeatures && (
              <Card className="mt-4">
                <Card.Header>Additional Features</Card.Header>
                <ListGroup variant="flush">
                  {additionalFeatures.map(
                    feature =>
                      feature.value && (
                        <ListGroup.Item key={feature.label}>
                          {feature.label}
                        </ListGroup.Item>
                      )
                  )}
                </ListGroup>
              </Card>
            )}
          </Card.Body>
        </Card>
      </Container>
    </>
  );
};

export default CarDetails;
