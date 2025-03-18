import Home from "./pages/Home";
import { Routes, Route } from "react-router-dom";
import NotFound from "./pages/NotFound";
import CarDetails from "./pages/CarDetails"; // Import CarDetails page
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import CreateCar from "./pages/CreateCar";
import CompareCars from "./pages/CompareCars";
import ChatPage from "./pages/ChatPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/create-car" element={<CreateCar />} />
      <Route path="/compare" element={<CompareCars />} />
      <Route path="/chatpage" element={<ChatPage />} />
      <Route path="/cars/:id" element={<CarDetails />} /> {/* Add CarDetails route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;

