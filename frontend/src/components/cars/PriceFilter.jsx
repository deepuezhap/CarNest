import React from 'react';
import { Dropdown } from 'react-bootstrap';

const PriceFilter = ({ priceFilter, onPriceFilterChange }) => {
  const formatPriceFilter = (filter) => {
    if (!filter) return 'All Prices';
    return filter
      .replace('under', 'Under $')
      .replace('over', 'Over $')
      .replace('k', ',000')
      .replace('-', ' - $');
  };

  return (
    <Dropdown>
      <Dropdown.Toggle variant="outline-secondary" id="dropdown-price">
        Price Range: {formatPriceFilter(priceFilter)}
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item onClick={() => onPriceFilterChange('')}>All Prices</Dropdown.Item>
        <Dropdown.Item onClick={() => onPriceFilterChange('under25k')}>Under $25,000</Dropdown.Item>
        <Dropdown.Item onClick={() => onPriceFilterChange('25k-40k')}>$25,000 - $40,000</Dropdown.Item>
        <Dropdown.Item onClick={() => onPriceFilterChange('40k-60k')}>$40,000 - $60,000</Dropdown.Item>
        <Dropdown.Item onClick={() => onPriceFilterChange('over60k')}>Over $60,000</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default PriceFilter;