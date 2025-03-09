import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import NavbarComponent from '../components/layout/NavbarComponent';
import Footer from '../components/layout/Footer';
import Hero from '../components/layout/Hero';
import CarList from '../components/cars/CarList';
import CarSearch from '../components/cars/CarSearch';
import PriceFilter from '../components/cars/PriceFilter';
import FeatureSection from '../components/common/FeatureSection';
import SellerSection from '../components/common/SellerSection';
import { useCars } from '../hooks/useCars';

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [priceFilter, setPriceFilter] = useState('');
  
  // Backend integration - fetch cars using our custom hook
  const { cars, loading, error, updateParams } = useCars({
    search: searchTerm,
    priceRange: priceFilter
  });

  // Handle search term changes
  const handleSearchChange = (value) => {
    setSearchTerm(value);
    updateParams({ search: value });
  };

  // Handle price filter changes
  const handlePriceFilterChange = (value) => {
    setPriceFilter(value);
    updateParams({ priceRange: value });
  };

  return (
    <div className="car-selling-platform">
      <NavbarComponent />
      <Hero />

      <Container className="mb-5">
        <h2 className="mb-4">Browse Our Inventory</h2>
        
        <Row className="mb-4">
          <Col md={6}>
            <CarSearch 
              searchTerm={searchTerm} 
              onSearchChange={handleSearchChange} 
            />
          </Col>
          <Col md={6}>
            <PriceFilter 
              priceFilter={priceFilter}
              onPriceFilterChange={handlePriceFilterChange}
            />
          </Col>
        </Row>

        <CarList cars={cars} loading={loading} error={error} />
      </Container>

      <FeatureSection />
      <SellerSection />
      <Footer />
    </div>
  );
};

export default Home;