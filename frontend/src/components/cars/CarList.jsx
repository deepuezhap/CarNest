import React from 'react';
import { Row, Col } from 'react-bootstrap';
import CarCard from './CarCard';

const CarList = ({ cars, loading, error }) => {
  
	console.log("🔄 CarList received cars:", cars);

  if (loading) {
    return (
      <Col className="text-center py-5">
        <h4>Loading cars...</h4>
      </Col>
    );
  }

  if (error) {
    return (
      <div className="alert alert-warning" role="alert">
        {error.detail || "Error loading cars"}
      </div>
    );
  }

  if (cars.length === 0) {
    return (
      <Col className="text-center py-5">
        <h4>No cars found matching your criteria</h4>
        <p>Try adjusting your search or filters</p>
      </Col>
    );
  }

  return (
    <Row>
      {cars.map(car => (
        <Col key={car.id} lg={4} md={6} className="mb-4">
          <CarCard car={car} />
        </Col>
      ))}
    </Row>
  );
};

export default CarList;