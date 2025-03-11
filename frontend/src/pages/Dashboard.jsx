import { useEffect, useState } from "react";
import axios from "axios";
import { Container, Card, Spinner, Alert, Button, Table, Modal, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cars, setCars] = useState([]);
  const [showModal, setShowModal] = useState(false);
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
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProtectedContent = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Unauthorized! Please log in.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get("http://localhost:8000/api/protected", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setContent(response.data.message);
        fetchUserCars(token);
      } catch (err) {
        setError("Access denied! Please log in again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProtectedContent();
  }, []);

  const fetchUserCars = async (token) => {
    try {
      const response = await axios.get("http://localhost:8000/api/user/cars", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCars(response.data);
    } catch (err) {
      setError("Failed to fetch car listings.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleDeleteCar = async (carId) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`http://localhost:8000/api/cars/${carId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCars(cars.filter(car => car.id !== carId));
    } catch (err) {
      setError("Failed to delete car.");
    }
  };

  const handleMarkAsSold = async (carId) => {
    const token = localStorage.getItem("token");
    try {
      await axios.patch(`http://localhost:8000/api/cars/${carId}/sold`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCars(cars.map(car => car.id === carId ? { ...car, sold: true } : car));
    } catch (err) {
      setError("Failed to mark car as sold.");
    }
  };

  const handleCreateCar = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post("http://localhost:8000/api/cars", newCar, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCars([...cars, response.data]);
      setShowModal(false);
      setNewCar({
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
    } catch (err) {
      setError("Failed to create car listing.");
    }
  };

  return (
    <Container className="d-flex flex-column align-items-center vh-100">
      <Card style={{ width: "100%", maxWidth: "800px" }} className="p-4 shadow mt-5">
        <h2 className="text-center">Dashboard</h2>

        {loading ? (
          <Spinner animation="border" className="d-block mx-auto" />
        ) : error ? (
          <Alert variant="danger" className="text-center">{error}</Alert>
        ) : (
          <>
            <Alert variant="success" className="text-center">{content}</Alert>
            <Button variant="primary" className="mb-3" onClick={() => setShowModal(true)}>
              Create New Car Listing
            </Button>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {cars.map(car => (
                  <tr key={car.id}>
                    <td>{car.title}</td>
                    <td>${car.price}</td>
                    <td>{car.sold ? "Sold" : "Available"}</td>
                    <td>
                      <Button variant="success" className="me-2" onClick={() => handleMarkAsSold(car.id)} disabled={car.sold}>
                        Mark as Sold
                      </Button>
                      <Button variant="danger" onClick={() => handleDeleteCar(car.id)}>
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </>
        )}

        <Button variant="danger" className="w-100 mt-3" onClick={handleLogout}>
          Logout
        </Button>
      </Card>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Car Listing</Modal.Title>
        </Modal.Header>
        <Modal.Body>
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
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleCreateCar}>
            Create Listing
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Dashboard;