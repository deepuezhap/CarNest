import React, { useState } from "react";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";
import api from "../../services/api";
import CarList from "./CarList";
import NavbarComponent from "../layout/NavbarComponent";

const CarTextSearch = () => {
  const [query, setQuery] = useState("");
  const [similarCars, setSimilarCars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    if (!query.trim()) {
      setError("Please enter a search description.");
      return;
    }
    setError(null);
    setLoading(true);

    try {
      const response = await api.get("/cars/search-by-text/", { params: { query } });
      setSimilarCars(response.data);
    } catch (err) {
      console.error("Error fetching similar cars:", err);
      setError("No matching cars found.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <NavbarComponent />
      <Container className="p-4 border rounded shadow mt-4">
        <h3 className="mb-3">Search Cars by Description</h3>
        <Row className="mb-3">
          <Col md={8}>
            <Form.Control
              type="text"
              placeholder="Enter car description (e.g., 'red sports car')"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </Col>
          <Col md={4}>
            <Button variant="primary" onClick={handleSearch} disabled={loading}>
              {loading ? "Searching..." : "Find Matching Cars"}
            </Button>
          </Col>
        </Row>
        {error && <Alert variant="danger">{error}</Alert>}
        {similarCars.length > 0 && <CarList cars={similarCars} loading={loading} error={error} />}
      </Container>
    </>
  );
};

export default CarTextSearch;
