import Home from "./pages/Home";
import { Routes, Route } from "react-router-dom";
import NotFound from "./pages/NotFound";
import CarDetails from "./pages/CarDetails"; // Import CarDetails page

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/cars/:id" element={<CarDetails />} /> {/* Add CarDetails route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
