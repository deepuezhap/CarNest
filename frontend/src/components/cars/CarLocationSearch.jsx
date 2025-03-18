import React, { useState } from "react";
import { Form, Button, Container, Row, Col, Alert, ListGroup } from "react-bootstrap";
import api from "../../services/api";
import CarList from "./CarList";
import NavbarComponent from "../layout/NavbarComponent";

const LOCATIONIQ_API_KEY = "pk.a409ef8b059b17004393afcec331fb6b"; // Replace with your API key

const CarLocationSearch = () => {
  const [location, setLocation] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [radius, setRadius] = useState(10);
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLocationChange = async (event) => {
    const query = event.target.value;
    setLocation(query);

    if (query.length < 3) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await fetch(
        `https://api.locationiq.com/v1/autocomplete.php?key=${LOCATIONIQ_API_KEY}&q=${query}&format=json`
      );
      const data = await response.json();
      setSuggestions(data);
    } catch (err) {
      console.error("Location autocomplete error:", err);
    }
  };

  const handleSelectLocation = (place) => {
    setLocation(place.display_name);
    setLatitude(parseFloat(place.lat));
    setLongitude(parseFloat(place.lon));
    setSuggestions([]);
  };

  const handleSearch = async () => {
    if (!latitude || !longitude) {
      setError("Please select a valid location.");
      return;
    }
    setError(null);
    setLoading(true);

    try {
      const response = await api.get(`/cars/search-by-location/`, {
        params: { latitude, longitude, radius },
      });
      setCars(response.data);
    } catch (err) {
      console.error("Error fetching cars:", err);
      setError("No cars found within the given radius.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <NavbarComponent />
      <Container className="p-4 border rounded shadow mt-4">
        <h3 className="mb-3">Find Cars by Location</h3>

        <Row className="mb-3">
          <Col md={6} className="position-relative">
            <Form.Control
              type="text"
              placeholder="Enter location..."
              value={location}
              onChange={handleLocationChange}
            />
            {suggestions.length > 0 && (
              <ListGroup className="position-absolute w-100 mt-1 bg-white shadow" style={{ zIndex: 1050, maxHeight: "200px", overflowY: "auto" }}>
                {suggestions.map((place, index) => (
                  <ListGroup.Item
                    key={index}
                    action
                    onClick={() => handleSelectLocation(place)}
                  >
                    {place.display_name}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
          </Col>


          <Col md={3}>
            <Form.Select value={radius} onChange={(e) => setRadius(Number(e.target.value))}>
              {[5, 10, 20, 50].map((km) => (
                <option key={km} value={km}>{km} km</option>
              ))}
            </Form.Select>
          </Col>

          <Col md={3}>
            <Button variant="primary" onClick={handleSearch} disabled={loading}>
              {loading ? "Searching..." : "Find Cars"}
            </Button>
          </Col>
        </Row>
        
      </Container>
      
      
      
        {error && <Alert variant="danger">{error}</Alert>}
        {cars.length > 0 && <Container className="p-4 border rounded shadow mt-4"><CarList cars={cars} loading={loading} error={error} /></Container>}
    </>
  );
};

export default CarLocationSearch;
