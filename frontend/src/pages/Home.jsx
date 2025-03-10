import React from "react";
import { Container } from "react-bootstrap";
import NavbarComponent from "../components/layout/NavbarComponent";
import Footer from "../components/layout/Footer";
import Hero from "../components/layout/Hero";
import CarList from "../components/cars/CarList";
import CarFilter from "../components/cars/CarFilter"; // ✅ Import filter component
import { useCars } from "../hooks/useCars";

const Home = () => {
  const { cars, loading, error, updateParams } = useCars(); // Fetch cars and updateParams

  return (
    <div className="car-selling-platform">
      <NavbarComponent />
      <Hero />

      <Container className="mb-5">
        <h2 className="mb-4">Browse Our Inventory</h2>

        {/* ✅ Add CarFilter Here */}
        <CarFilter updateParams={updateParams} className="mb-4" /> {/* Pass updateParams to CarFilter */}

        {/* Car List */}
        <CarList cars={cars} loading={loading} error={error} />
      </Container>

      <Footer />
    </div>
  );
};

export default Home;
