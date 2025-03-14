import Home from "./pages/Home";
import { Routes, Route } from "react-router-dom";
import NotFound from "./pages/NotFound";
import CarDetails from "./pages/CarDetails"; // Import CarDetails page
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import CreateCar from "./pages/CreateCar";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/create-car" element={<CreateCar />} />
      <Route path="/cars/:id" element={<CarDetails />} /> {/* Add CarDetails route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;

