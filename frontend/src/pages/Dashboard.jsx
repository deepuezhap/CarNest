import { useEffect, useState } from "react";
import axios from "axios";
import { Container, Card, Spinner, Alert, Button, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import NavbarComponent from "../components/layout/NavbarComponent";

const Dashboard = () => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cars, setCars] = useState([]);
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

  return (
    <>
    <NavbarComponent/>
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
            <Button variant="primary" className="mb-3" onClick={() => navigate("/create-car")}>
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
    </Container>
    </>
  );
};

export default Dashboard;