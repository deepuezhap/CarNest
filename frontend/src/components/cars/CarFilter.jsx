import React, { useState } from "react";
import { Form, Row, Col, Button, Container } from "react-bootstrap";

const CarFilter = ({ updateParams }) => {
  const [filters, setFilters] = useState({
    brand: "",
    model: "",
    year: "",
    min_price: "",
    max_price: "",
    min_mileage: "",
    max_mileage: "",
    fuel_type: "",
    transmission: "",
    location: "",
    num_previous_owners: "",
    insurance_status: "",
    registration_location: "",
    has_power_windows: false,
    has_power_steering: false,
    has_car_history_report: false,
    has_rear_parking_sensors: false,
    has_central_locking: false,
    has_air_conditioning: false,
    has_reverse_camera: false,
    has_abs: false,
    has_fog_lamps: false,
    has_power_mirrors: false,
    has_gps_navigation: false,
    has_keyless_start: false,
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Apply filters
  const applyFilters = () => {
    updateParams(filters);
  };

  return (
    <Container className="p-4 border rounded shadow">
      <h3 className="mb-3">Filter Cars</h3>

      <Row className="mb-3">
        <Col md={4}>
          <Form.Group>
            <Form.Label>Brand</Form.Label>
            <Form.Control type="text" name="brand" value={filters.brand} onChange={handleChange} placeholder="Enter brand" />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group>
            <Form.Label>Model</Form.Label>
            <Form.Control type="text" name="model" value={filters.model} onChange={handleChange} placeholder="Enter model" />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group>
            <Form.Label>Year</Form.Label>
            <Form.Control type="number" name="year" value={filters.year} onChange={handleChange} placeholder="Enter year" />
          </Form.Group>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={4}>
          <Form.Group>
            <Form.Label>Min Price</Form.Label>
            <Form.Control type="number" name="min_price" value={filters.min_price} onChange={handleChange} placeholder="Enter minimum price" />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group>
            <Form.Label>Max Price</Form.Label>
            <Form.Control type="number" name="max_price" value={filters.max_price} onChange={handleChange} placeholder="Enter maximum price" />
          </Form.Group>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={4}>
          <Form.Group>
            <Form.Label>Min Mileage</Form.Label>
            <Form.Control type="number" name="min_mileage" value={filters.min_mileage} onChange={handleChange} placeholder="Enter minimum mileage" />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group>
            <Form.Label>Max Mileage</Form.Label>
            <Form.Control type="number" name="max_mileage" value={filters.max_mileage} onChange={handleChange} placeholder="Enter maximum mileage" />
          </Form.Group>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={4}>
          <Form.Group>
            <Form.Label>Fuel Type</Form.Label>
            <Form.Select name="fuel_type" value={filters.fuel_type} onChange={handleChange}>
              <option value="">All</option>
              <option value="Petrol">Petrol</option>
              <option value="Diesel">Diesel</option>
              <option value="Electric">Electric</option>
              <option value="CNG">CNG</option>
            </Form.Select>
          </Form.Group>
        </Col>
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
        <Col md={4}>
          <Form.Group>
            <Form.Label>Previous Owners</Form.Label>
            <Form.Control type="number" name="num_previous_owners" value={filters.num_previous_owners} onChange={handleChange} placeholder="Enter number of owners" />
          </Form.Group>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={4}>
          <Form.Group>
            <Form.Label>Insurance Status</Form.Label>
            <Form.Select name="insurance_status" value={filters.insurance_status} onChange={handleChange}>
              <option value="">All</option>
              <option value="Comprehensive">Comprehensive</option>
              <option value="Third-party">Third-party</option>
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group>
            <Form.Label>Location</Form.Label>
            <Form.Control type="text" name="location" value={filters.location} onChange={handleChange} placeholder="Enter location" />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group>
            <Form.Label>Registration Location</Form.Label>
            <Form.Control type="text" name="registration_location" value={filters.registration_location} onChange={handleChange} placeholder="Enter registration location" />
          </Form.Group>
        </Col>
      </Row>

      <Row className="mb-3">
        {[
          "has_power_windows",
          "has_power_steering",
          "has_car_history_report",
          "has_rear_parking_sensors",
          "has_central_locking",
          "has_air_conditioning",
          "has_reverse_camera",
          "has_abs",
          "has_fog_lamps",
          "has_power_mirrors",
          "has_gps_navigation",
          "has_keyless_start",
        ].map((feature, index) => (
          <Col md={4} key={index}>
            <Form.Check
              type="checkbox"
              label={feature.replace(/_/g, " ").replace("has ", "").toUpperCase()}
              name={feature}
              checked={filters[feature]}
              onChange={handleChange}
            />
          </Col>
        ))}
      </Row>

      <Button variant="primary" onClick={applyFilters}>
        Search
      </Button>
    </Container>
  );
};

export default CarFilter;
