import { useEffect, useState } from "react";
import axios from "axios";
import { Container, Card, Spinner, Alert, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
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
      } catch (err) {
        setError("Access denied! Please log in again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProtectedContent();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card style={{ width: "400px" }} className="p-4 shadow">
        <h2 className="text-center">Dashboard</h2>

        {loading ? (
          <Spinner animation="border" className="d-block mx-auto" />
        ) : error ? (
          <Alert variant="danger" className="text-center">{error}</Alert>
        ) : (
          <Alert variant="success" className="text-center">{content}</Alert>
        )}

        <Button variant="danger" className="w-100 mt-3" onClick={handleLogout}>
          Logout
        </Button>
      </Card>
    </Container>
  );
};

export default Dashboard;
