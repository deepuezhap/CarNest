import React, { useState } from "react";
import { Form, Row, Col, Button, Container } from "react-bootstrap";
import { useCars } from "../../hooks/useCars"; // Custom hook for fetching cars

const CarFilter = ({ updateParams }) => { // Accept updateParams as a prop
  const [filters, setFilters] = useState({
    brand: "",
    model: "",
    min_price: "",
    max_price: "",
    fuel_type: "",
    transmission: "",
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  // Apply filters when clicking "Search"
  const applyFilters = () => {
    try {
      updateParams(filters);
    } catch (error) {
      console.error("Failed to apply filters:", error);
    }
  };

  return (
    <Container className="p-4 border rounded shadow">
      <h3 className="mb-3">Filter Cars</h3>

      <Row className="mb-3">
        {/* Brand */}
        <Col md={4}>
          <Form.Group>
            <Form.Label>Brand</Form.Label>
            <Form.Control
              type="text"
              name="brand"
              value={filters.brand}
              onChange={handleChange}
              placeholder="Enter brand"
            />
          </Form.Group>
        </Col>

        {/* Model */}
        <Col md={4}>
          <Form.Group>
            <Form.Label>Model</Form.Label>
            <Form.Control
              type="text"
              name="model"
              value={filters.model}
              onChange={handleChange}
              placeholder="Enter model"
            />
          </Form.Group>
        </Col>
      </Row>

      <Row className="mb-3">
        {/* Min Price */}
        <Col md={4}>
          <Form.Group>
            <Form.Label>Min Price</Form.Label>
            <Form.Control
              type="number"
              name="min_price"
              value={filters.min_price}
              onChange={handleChange}
              placeholder="Min price"
            />
          </Form.Group>
        </Col>

        {/* Max Price */}
        <Col md={4}>
          <Form.Group>
            <Form.Label>Max Price</Form.Label>
            <Form.Control
              type="number"
              name="max_price"
              value={filters.max_price}
              onChange={handleChange}
              placeholder="Max price"
            />
          </Form.Group>
        </Col>
      </Row>

      <Row className="mb-3">
        {/* Fuel Type */}
        <Col md={4}>
          <Form.Group>
            <Form.Label>Fuel Type</Form.Label>
            <Form.Select name="fuel_type" value={filters.fuel_type} onChange={handleChange}>
              <option value="">All</option>
              <option value="Petrol">Petrol</option>
              <option value="Diesel">Diesel</option>
              <option value="Electric">Electric</option>
            </Form.Select>
          </Form.Group>
        </Col>

        {/* Transmission */}
        <Col md={4}>
          <Form.Group>
            <Form.Label>Transmission</Form.Label>
            <Form.Select name="transmission" value={filters.transmission} onChange={handleChange}>
              <option value="">All</option>
              <option value="Manual">Manual</option>
              <option value="Automatic">Automatic</option>
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      {/* Search Button */}
      <Button variant="primary" onClick={applyFilters}>
        Search
      </Button>
    </Container>
  );
};

export default CarFilter;
