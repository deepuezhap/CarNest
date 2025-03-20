import { useState, useEffect } from "react";
import axios from "axios";
import { Container, Card, Button, Form, ListGroup, Alert, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const LOCATIONIQ_API_KEY = "pk.a409ef8b059b17004393afcec331fb6b"; // Replace with your API Key

const CreateCar = () => {
  const [newCar, setNewCar] = useState({
    title: "",
    tags: "",
    brand: "",
    model: "",
    year: "",
    price: "",
    mileage: "",
    fuel_type: "",
    transmission: "",
    location: "", // City name
    has_power_windows: false,
    has_power_steering: false,
    num_previous_owners: 0,
    insurance_status: "",
    registration_location: "",
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
    image: null,
    latitude: "", // Latitude field
    longitude: "" // Longitude field
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [searchResults, setSearchResults] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState({ lat: "", lon: "" });
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLocationChange = async (e) => {
    const query = e.target.value;
    setNewCar((prevCar) => ({ ...prevCar, location: query }));

    if (query.length > 2) {
      try {
        const response = await axios.get(`https://api.locationiq.com/v1/autocomplete.php`, {
          params: {
            key: LOCATIONIQ_API_KEY,
            q: query,
            format: "json",
          },
        });
        setSearchResults(response.data);
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    } else {
      setSearchResults([]);
    }
  };

  const handleSelectLocation = (location) => {
    const cityName =
      location.address.city ||
      location.address.town ||
      location.address.village ||
      location.display_name;

    setNewCar((prevCar) => ({
      ...prevCar,
      location: cityName,
      latitude: location.lat,
      longitude: location.lon
    }));
    setSelectedLocation({ lat: location.lat, lon: location.lon });
    setSearchResults([]);

    console.log("Selected Location:", cityName);
    console.log("Latitude:", location.lat);
    console.log("Longitude:", location.lon);
  };

  const handleCreateCar = async () => {
    const token = localStorage.getItem("token");
    try {
      let imageUrl = "";
      if (newCar.image) {
        const formData = new FormData();
        formData.append("file", newCar.image);
        const uploadResponse = await axios.post("http://localhost:8000/cars/upload-image/", formData, {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
        });
        imageUrl = uploadResponse.data.image_url;
      }

      const carData = {
        ...newCar,
        image_path: imageUrl,
        latitude: newCar.latitude,
        longitude: newCar.longitude
      };

      console.log("Car Data Payload:", carData);

      await axios.post("http://localhost:8000/api/cars", carData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate("/dashboard");
    } catch (err) {
      setError("Failed to create car listing.");
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setNewCar((prevCar) => ({
      ...prevCar,
      [name]: type === "checkbox" ? checked : type === "file" ? files[0] : value,
    }));
  };
  return (
    <Container className="d-flex flex-column align-items-center vh-100">
      <Card style={{ width: "100%", maxWidth: "800px" }} className="p-4 shadow mt-5">
        <h2 className="text-center">Create New Car Listing</h2>
        {!isLoggedIn && <Alert variant="warning" className="text-center">Please log in to create a car listing.</Alert>}
        {isLoggedIn && (
          <>
            {error && <Alert variant="danger" className="text-center">{error}</Alert>}
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  value={newCar.title}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Tags</Form.Label>
                <Form.Control
                  type="text"
                  name="tags"
                  value={newCar.tags}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Brand</Form.Label>
                <Form.Control
                  type="text"
                  name="brand"
                  value={newCar.brand}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Model</Form.Label>
                <Form.Control
                  type="text"
                  name="model"
                  value={newCar.model}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Year</Form.Label>
                <Form.Control
                  type="number"
                  name="year"
                  value={newCar.year}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Price</Form.Label>
                <Form.Control
                  type="number"
                  name="price"
                  value={newCar.price}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Mileage</Form.Label>
                <Form.Control
                  type="number"
                  name="mileage"
                  value={newCar.mileage}
                  onChange={handleChange}
                />
              </Form.Group>
              
              {/* Fuel Type Dropdown */}
              <Form.Group className="mb-3">
                <Form.Label>Fuel Type</Form.Label>
                <Form.Control
                  as="select"
                  name="fuel_type"
                  value={newCar.fuel_type}
                  onChange={handleChange}
                >
                  <option value="">Select Fuel Type</option>
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Electric">Electric</option>
                  <option value="Hybrid">Hybrid</option>
                </Form.Control>
              </Form.Group>
              
              {/* Transmission Dropdown */}
              <Form.Group className="mb-3">
                <Form.Label>Transmission</Form.Label>
                <Form.Control
                  as="select"
                  name="transmission"
                  value={newCar.transmission}
                  onChange={handleChange}
                >
                  <option value="">Select Transmission</option>
                  <option value="Automatic">Automatic</option>
                  <option value="Manual">Manual</option>
                </Form.Control>
              </Form.Group>
              
              {/* Insurance Status Dropdown */}
              <Form.Group className="mb-3">
                <Form.Label>Insurance Status</Form.Label>
                <Form.Control
                  as="select"
                  name="insurance_status"
                  value={newCar.insurance_status}
                  onChange={handleChange}
                >
                  <option value="">Select Insurance Status</option>
                  <option value="Insured">Insured</option>
                  <option value="Not Insured">Not Insured</option>
                </Form.Control>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Location</Form.Label>
                <Form.Control
                  type="text"
                  name="location"
                  value={newCar.location}
                  onChange={handleLocationChange}
                  placeholder="Enter location..."
                />
                {searchResults.length > 0 && (
                  <ListGroup className="position-absolute w-100">
                    {searchResults.map((location, index) => (
                      <ListGroup.Item
                        key={index}
                        action
                        onClick={() => handleSelectLocation(location)}
                      >
                        {location.display_name}
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                )}
              </Form.Group>

              <Row>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Check
                      type="checkbox"
                      label="Power Windows"
                      name="has_power_windows"
                      checked={newCar.has_power_windows}
                      onChange={handleChange}
                    />
                    <Form.Check
                      type="checkbox"
                      label="Power Steering"
                      name="has_power_steering"
                      checked={newCar.has_power_steering}
                      onChange={handleChange}
                    />
                    <Form.Check
                      type="checkbox"
                      label="Car History Report"
                      name="has_car_history_report"
                      checked={newCar.has_car_history_report}
                      onChange={handleChange}
                    />
                    <Form.Check
                      type="checkbox"
                      label="Rear Parking Sensors"
                      name="has_rear_parking_sensors"
                      checked={newCar.has_rear_parking_sensors}
                      onChange={handleChange}
                    />
                    <Form.Check
                      type="checkbox"
                      label="Central Locking"
                      name="has_central_locking"
                      checked={newCar.has_central_locking}
                      onChange={handleChange}
                    />
                    <Form.Check
                      type="checkbox"
                      label="Air Conditioning"
                      name="has_air_conditioning"
                      checked={newCar.has_air_conditioning}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Check
                      type="checkbox"
                      label="Reverse Camera"
                      name="has_reverse_camera"
                      checked={newCar.has_reverse_camera}
                      onChange={handleChange}
                    />
                    <Form.Check
                      type="checkbox"
                      label="ABS"
                      name="has_abs"
                      checked={newCar.has_abs}
                      onChange={handleChange}
                    />
                    <Form.Check
                      type="checkbox"
                      label="Fog Lamps"
                      name="has_fog_lamps"
                      checked={newCar.has_fog_lamps}
                      onChange={handleChange}
                    />
                    <Form.Check
                      type="checkbox"
                      label="Power Mirrors"
                      name="has_power_mirrors"
                      checked={newCar.has_power_mirrors}
                      onChange={handleChange}
                    />
                    <Form.Check
                      type="checkbox"
                      label="GPS Navigation"
                      name="has_gps_navigation"
                      checked={newCar.has_gps_navigation}
                      onChange={handleChange}
                    />
                    <Form.Check
                      type="checkbox"
                      label="Keyless Start"
                      name="has_keyless_start"
                      checked={newCar.has_keyless_start}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group className="mb-3">
                <Form.Label>Image</Form.Label>
                <Form.Control
                  type="file"
                  name="image"
                  onChange={handleChange}
                />
              </Form.Group>
            </Form>
            <Button variant="primary" className="w-100 mt-3" onClick={handleCreateCar}>
              Create Listing
            </Button>
          </>
        )}
      </Card>
    </Container>
  );
};

export default CreateCar;