import React, { useState } from "react";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";
import api from "../../services/api";
import CarList from "./CarList";

const CarImageSearch = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [similarCars, setSimilarCars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSearch = async () => {
    if (!selectedFile) {
      setError("Please upload an image.");
      return;
    }
    setError(null);
    setLoading(true);
    
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await api.post("/cars/search-by-image/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSimilarCars(response.data);
    } catch (err) {
      console.error("Error fetching similar cars:", err);
      setError("Failed to find similar listings.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="p-4 border rounded shadow mt-4">
      <h3 className="mb-3">Find Similar Cars</h3>
      <Row className="mb-3">
        <Col md={8}>
          <Form.Control type="file" accept="image/*" onChange={handleFileChange} />
        </Col>
        <Col md={4}>
          <Button variant="primary" onClick={handleSearch} disabled={loading}>
            {loading ? "Searching..." : "Find Similar Listings"}
          </Button>
        </Col>
      </Row>
      {error && <Alert variant="danger">{error}</Alert>}
      {similarCars.length > 0 && <CarList cars={similarCars} loading={loading} error={error} />}
    </Container>
  );
};

export default CarImageSearch;
