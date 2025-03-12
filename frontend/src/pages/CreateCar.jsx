import { useState } from "react";
import axios from "axios";
import { Container, Card, Button, Form, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const CreateCar = () => {
  const [newCar, setNewCar] = useState({
    title: "",
    description: "",
    brand: "",
    model: "",
    year: "",
    price: "",
    mileage: "",
    fuel_type: "",
    transmission: "",
    location: ""
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleCreateCar = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.post("http://localhost:8000/api/cars", newCar, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate("/dashboard");
    } catch (err) {
      setError("Failed to create car listing.");
    }
  };

  return (
    <Container className="d-flex flex-column align-items-center vh-100">
      <Card style={{ width: "100%", maxWidth: "800px" }} className="p-4 shadow mt-5">
        <h2 className="text-center">Create New Car Listing</h2>
        {error && <Alert variant="danger" className="text-center">{error}</Alert>}
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              value={newCar.title}
              onChange={(e) => setNewCar({ ...newCar, title: e.target.value })}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              type="text"
              value={newCar.description}
              onChange={(e) => setNewCar({ ...newCar, description: e.target.value })}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Brand</Form.Label>
            <Form.Control
              type="text"
              value={newCar.brand}
              onChange={(e) => setNewCar({ ...newCar, brand: e.target.value })}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Model</Form.Label>
            <Form.Control
              type="text"
              value={newCar.model}
              onChange={(e) => setNewCar({ ...newCar, model: e.target.value })}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Year</Form.Label>
            <Form.Control
              type="number"
              value={newCar.year}
              onChange={(e) => setNewCar({ ...newCar, year: e.target.value })}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Price</Form.Label>
            <Form.Control
              type="number"
              value={newCar.price}
              onChange={(e) => setNewCar({ ...newCar, price: e.target.value })}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Mileage</Form.Label>
            <Form.Control
              type="number"
              value={newCar.mileage}
              onChange={(e) => setNewCar({ ...newCar, mileage: e.target.value })}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Fuel Type</Form.Label>
            <Form.Control
              type="text"
              value={newCar.fuel_type}
              onChange={(e) => setNewCar({ ...newCar, fuel_type: e.target.value })}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Transmission</Form.Label>
            <Form.Control
              type="text"
              value={newCar.transmission}
              onChange={(e) => setNewCar({ ...newCar, transmission: e.target.value })}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Location</Form.Label>
            <Form.Control
              type="text"
              value={newCar.location}
              onChange={(e) => setNewCar({ ...newCar, location: e.target.value })}
            />
          </Form.Group>
        </Form>
        <Button variant="primary" className="w-100 mt-3" onClick={handleCreateCar}>
          Create Listing
        </Button>
      </Card>
    </Container>
  );
};

export default CreateCar;