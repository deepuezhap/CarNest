import { useEffect, useState } from "react";
import axios from "axios";
import { Container, Spinner, Alert, Form, Row, Col, Table, Image } from "react-bootstrap";
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

  const renderBoolean = (value) => (value ? '✔️' : '❌');

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
              <Table striped bordered hover className="mt-5">
                <thead>
                  <tr>
                    <th>Attribute</th>
                    <th>Car 1</th>
                    <th>Car 2</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Image</td>
                    <td><Image src={selectedCar1.image_path }  thumbnail style={{ width: '300px', height: 'auto'}}/></td>
                    <td><Image src={selectedCar2.image_path} thumbnail style={{ width: '300px', height: 'auto'}} /></td>
                  </tr>
                  <tr>
                    <td>Brand</td>
                    <td>{selectedCar1.brand}</td>
                    <td>{selectedCar2.brand}</td>
                  </tr>
                  <tr>
                    <td>Model</td>
                    <td>{selectedCar1.model}</td>
                    <td>{selectedCar2.model}</td>
                  </tr>
                  <tr>
                    <td>Year</td>
                    <td>{selectedCar1.year}</td>
                    <td>{selectedCar2.year}</td>
                  </tr>
                  <tr>
                    <td>Price</td>
                    <td>${selectedCar1.price}</td>
                    <td>${selectedCar2.price}</td>
                  </tr>
                  <tr>
                    <td>Mileage</td>
                    <td>{selectedCar1.mileage} km</td>
                    <td>{selectedCar2.mileage} km</td>
                  </tr>
                  <tr>
                    <td>Fuel Type</td>
                    <td>{selectedCar1.fuel_type}</td>
                    <td>{selectedCar2.fuel_type}</td>
                  </tr>
                  <tr>
                    <td>Transmission</td>
                    <td>{selectedCar1.transmission}</td>
                    <td>{selectedCar2.transmission}</td>
                  </tr>
                  <tr>
                    <td>Location</td>
                    <td>{selectedCar1.location}</td>
                    <td>{selectedCar2.location}</td>
                  </tr>
                  <tr>
                    <td>Power Windows</td>
                    <td>{renderBoolean(selectedCar1.has_power_windows)}</td>
                    <td>{renderBoolean(selectedCar2.has_power_windows)}</td>
                  </tr>
                  <tr>
                    <td>Power Steering</td>
                    <td>{renderBoolean(selectedCar1.has_power_steering)}</td>
                    <td>{renderBoolean(selectedCar2.has_power_steering)}</td>
                  </tr>
                  <tr>
                    <td>Previous Owners</td>
                    <td>{selectedCar1.num_previous_owners}</td>
                    <td>{selectedCar2.num_previous_owners}</td>
                  </tr>
                  <tr>
                    <td>Insurance Status</td>
                    <td>{selectedCar1.insurance_status}</td>
                    <td>{selectedCar2.insurance_status}</td>
                  </tr>
                  <tr>
                    <td>Registration Location</td>
                    <td>{selectedCar1.registration_location}</td>
                    <td>{selectedCar2.registration_location}</td>
                  </tr>
                  <tr>
                    <td>Car History Report</td>
                    <td>{renderBoolean(selectedCar1.has_car_history_report)}</td>
                    <td>{renderBoolean(selectedCar2.has_car_history_report)}</td>
                  </tr>
                  <tr>
                    <td>Rear Parking Sensors</td>
                    <td>{renderBoolean(selectedCar1.has_rear_parking_sensors)}</td>
                    <td>{renderBoolean(selectedCar2.has_rear_parking_sensors)}</td>
                  </tr>
                  <tr>
                    <td>Central Locking</td>
                    <td>{renderBoolean(selectedCar1.has_central_locking)}</td>
                    <td>{renderBoolean(selectedCar2.has_central_locking)}</td>
                  </tr>
                  <tr>
                    <td>Air Conditioning</td>
                    <td>{renderBoolean(selectedCar1.has_air_conditioning)}</td>
                    <td>{renderBoolean(selectedCar2.has_air_conditioning)}</td>
                  </tr>
                  <tr>
                    <td>Reverse Camera</td>
                    <td>{renderBoolean(selectedCar1.has_reverse_camera)}</td>
                    <td>{renderBoolean(selectedCar2.has_reverse_camera)}</td>
                  </tr>
                  <tr>
                    <td>ABS</td>
                    <td>{renderBoolean(selectedCar1.has_abs)}</td>
                    <td>{renderBoolean(selectedCar2.has_abs)}</td>
                  </tr>
                  <tr>
                    <td>Fog Lamps</td>
                    <td>{renderBoolean(selectedCar1.has_fog_lamps)}</td>
                    <td>{renderBoolean(selectedCar2.has_fog_lamps)}</td>
                  </tr>
                  <tr>
                    <td>Power Mirrors</td>
                    <td>{renderBoolean(selectedCar1.has_power_mirrors)}</td>
                    <td>{renderBoolean(selectedCar2.has_power_mirrors)}</td>
                  </tr>
                  <tr>
                    <td>GPS Navigation</td>
                    <td>{renderBoolean(selectedCar1.has_gps_navigation)}</td>
                    <td>{renderBoolean(selectedCar2.has_gps_navigation)}</td>
                  </tr>
                  <tr>
                    <td>Keyless Start</td>
                    <td>{renderBoolean(selectedCar1.has_keyless_start)}</td>
                    <td>{renderBoolean(selectedCar2.has_keyless_start)}</td>
                  </tr>
                </tbody>
              </Table>
            )}
          </>
        )}
      </Container>
    </>
  );
};

export default CompareCars;