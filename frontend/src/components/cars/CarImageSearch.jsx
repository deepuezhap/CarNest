import React, { useState } from "react";
import { Form, Button, Container, Row, Col, Alert, Image } from "react-bootstrap";
import api from "../../services/api";
import CarList from "./CarList";
import NavbarComponent from "../layout/NavbarComponent";

const CarImageSearch = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [similarCars, setSimilarCars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file)); // Create a temporary URL for preview
    }
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
    <>
    <NavbarComponent/>
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
      {previewUrl && (
        <div className="text-center mb-3">
          <Image src={previewUrl} alt="Uploaded preview" thumbnail width={200} />
        </div>
      )}
      {error && <Alert variant="danger">{error}</Alert>}
      {similarCars.length > 0 && <CarList cars={similarCars} loading={loading} error={error} />}
    </Container>
    </>

  );
};

export default CarImageSearch;
