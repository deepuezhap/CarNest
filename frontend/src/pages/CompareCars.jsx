import { useEffect, useState } from "react";
import axios from "axios";
import { Container, Card, Spinner, Alert, Form, Row, Col } from "react-bootstrap";
import NavbarComponent from "../components/layout/NavbarComponent";

const CompareCars = () => {
  const [cars, setCars] = useState([]);
  const [selectedCar1, setSelectedCar1] = useState(null);
  const [selectedCar2, setSelectedCar2] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await axios.get("http://localhost:8000/cars");
        setCars(response.data);
      } catch (err) {
        setError("Failed to fetch car listings.");
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  const handleSelectCar1 = async (e) => {
    const carId = e.target.value;
    const token = localStorage.getItem('token'); // Retrieve token from local storage
    if (carId) {
      try {
        const response = await axios.get(`http://localhost:8000/api/cars/${carId}`, {
          headers: {
            Authorization: `Bearer ${token}` // Attach token to request headers
          }
        });
        setSelectedCar1(response.data);
      } catch (err) {
        setError("Failed to fetch car details.");
      }
    } else {
      setSelectedCar1(null);
    }
  };

  const handleSelectCar2 = async (e) => {
    const carId = e.target.value;
    const token = localStorage.getItem('token'); // Retrieve token from local storage
    if (carId) {
      try {
        const response = await axios.get(`http://localhost:8000/api/cars/${carId}`, {
          headers: {
            Authorization: `Bearer ${token}` // Attach token to request headers
          }
        });
        setSelectedCar2(response.data);
      } catch (err) {
        setError("Failed to fetch car details.");
      }
    } else {
      setSelectedCar2(null);
    }
  };

  return (
    <>
      <NavbarComponent />
      <Container className="d-flex flex-column align-items-center vh-100 mt-5 mb-5">
        <h2 className="text-center">Compare Cars</h2>

        {loading ? (
          <Spinner animation="border" className="d-block mx-auto" />
        ) : error ? (
          <Alert variant="danger" className="text-center">{error}</Alert>
        ) : (
          <>
            <Form>
              <Row>
                <Col>
                  <Form.Group controlId="selectCar1">
                    <Form.Label>Select Car 1</Form.Label>
                    <Form.Control as="select" onChange={handleSelectCar1}>
                      <option value="">Select a car</option>
                      {cars.map(car => (
                        <option key={car.id} value={car.id}>
                          {car.title}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="selectCar2">
                    <Form.Label>Select Car 2</Form.Label>
                    <Form.Control as="select" onChange={handleSelectCar2}>
                      <option value="">Select a car</option>
                      {cars.map(car => (
                        <option key={car.id} value={car.id}>
                          {car.title}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                </Col>
              </Row>
            </Form>

            {selectedCar1 && selectedCar2 && (
              <Row className="mt-5">
                <Col>
                  <Card>
                    <Card.Img variant="top" src={selectedCar1.image_path} />
                    <Card.Body>
                      <Card.Title>{selectedCar1.title}</Card.Title>
                      <Card.Text>
                        <strong>Brand:</strong> {selectedCar1.brand}<br />
                        <strong>Model:</strong> {selectedCar1.model}<br />
                        <strong>Year:</strong> {selectedCar1.year}<br />
                        <strong>Price:</strong> ${selectedCar1.price}<br />
                        <strong>Mileage:</strong> {selectedCar1.mileage} km<br />
                        <strong>Fuel Type:</strong> {selectedCar1.fuel_type}<br />
                        <strong>Transmission:</strong> {selectedCar1.transmission}<br />
                        <strong>Location:</strong> {selectedCar1.location}<br />
                        <strong>Power Windows:</strong> {selectedCar1.has_power_windows ? 'Yes' : 'No'}<br />
                        <strong>Power Steering:</strong> {selectedCar1.has_power_steering ? 'Yes' : 'No'}<br />
                        <strong>Previous Owners:</strong> {selectedCar1.num_previous_owners}<br />
                        <strong>Insurance Status:</strong> {selectedCar1.insurance_status}<br />
                        <strong>Registration Location:</strong> {selectedCar1.registration_location}<br />
                        <strong>Car History Report:</strong> {selectedCar1.has_car_history_report ? 'Yes' : 'No'}<br />
                        <strong>Rear Parking Sensors:</strong> {selectedCar1.has_rear_parking_sensors ? 'Yes' : 'No'}<br />
                        <strong>Central Locking:</strong> {selectedCar1.has_central_locking ? 'Yes' : 'No'}<br />
                        <strong>Air Conditioning:</strong> {selectedCar1.has_air_conditioning ? 'Yes' : 'No'}<br />
                        <strong>Reverse Camera:</strong> {selectedCar1.has_reverse_camera ? 'Yes' : 'No'}<br />
                        <strong>ABS:</strong> {selectedCar1.has_abs ? 'Yes' : 'No'}<br />
                        <strong>Fog Lamps:</strong> {selectedCar1.has_fog_lamps ? 'Yes' : 'No'}<br />
                        <strong>Power Mirrors:</strong> {selectedCar1.has_power_mirrors ? 'Yes' : 'No'}<br />
                        <strong>GPS Navigation:</strong> {selectedCar1.has_gps_navigation ? 'Yes' : 'No'}<br />
                        <strong>Keyless Start:</strong> {selectedCar1.has_keyless_start ? 'Yes' : 'No'}<br />
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
                <Col>
                  <Card>
                    <Card.Img variant="top" src={selectedCar2.image_path} />
                    <Card.Body>
                      <Card.Title>{selectedCar2.title}</Card.Title>
                      <Card.Text>
                        <strong>Brand:</strong> {selectedCar2.brand}<br />
                        <strong>Model:</strong> {selectedCar2.model}<br />
                        <strong>Year:</strong> {selectedCar2.year}<br />
                        <strong>Price:</strong> ${selectedCar2.price}<br />
                        <strong>Mileage:</strong> {selectedCar2.mileage} km<br />
                        <strong>Fuel Type:</strong> {selectedCar2.fuel_type}<br />
                        <strong>Transmission:</strong> {selectedCar2.transmission}<br />
                        <strong>Location:</strong> {selectedCar2.location}<br />
                        <strong>Power Windows:</strong> {selectedCar2.has_power_windows ? 'Yes' : 'No'}<br />
                        <strong>Power Steering:</strong> {selectedCar2.has_power_steering ? 'Yes' : 'No'}<br />
                        <strong>Previous Owners:</strong> {selectedCar2.num_previous_owners}<br />
                        <strong>Insurance Status:</strong> {selectedCar2.insurance_status}<br />
                        <strong>Registration Location:</strong> {selectedCar2.registration_location}<br />
                        <strong>Car History Report:</strong> {selectedCar2.has_car_history_report ? 'Yes' : 'No'}<br />
                        <strong>Rear Parking Sensors:</strong> {selectedCar2.has_rear_parking_sensors ? 'Yes' : 'No'}<br />
                        <strong>Central Locking:</strong> {selectedCar2.has_central_locking ? 'Yes' : 'No'}<br />
                        <strong>Air Conditioning:</strong> {selectedCar2.has_air_conditioning ? 'Yes' : 'No'}<br />
                        <strong>Reverse Camera:</strong> {selectedCar2.has_reverse_camera ? 'Yes' : 'No'}<br />
                        <strong>ABS:</strong> {selectedCar2.has_abs ? 'Yes' : 'No'}<br />
                        <strong>Fog Lamps:</strong> {selectedCar2.has_fog_lamps ? 'Yes' : 'No'}<br />
                        <strong>Power Mirrors:</strong> {selectedCar2.has_power_mirrors ? 'Yes' : 'No'}<br />
                        <strong>GPS Navigation:</strong> {selectedCar2.has_gps_navigation ? 'Yes' : 'No'}<br />
                        <strong>Keyless Start:</strong> {selectedCar2.has_keyless_start ? 'Yes' : 'No'}<br />
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            )}
          </>
        )}
      </Container>
    </>
  );
};

export default CompareCars;