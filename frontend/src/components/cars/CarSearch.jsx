import React from 'react';
import { Form } from 'react-bootstrap';

const CarSearch = ({ searchTerm, onSearchChange }) => {
  return (
    <Form.Group>
      <Form.Control 
        type="text" 
        placeholder="Search cars..." 
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </Form.Group>
  );
};

export default CarSearch;