import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const useAuth = () => {
  const [currentUser, setCurrentUser] = useState(null);

  const validateToken = (token) => {
    try {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000; // Current time in seconds
      if (decodedToken.exp > currentTime) {
        console.log("User authenticated:", decodedToken); // Debugging
        return decodedToken;
      } else {
        localStorage.removeItem("token"); // Token expired, remove it
        return null;
      }
    } catch (error) {
      console.error("Invalid token:", error);
      localStorage.removeItem("token");
      return null;
    }
  };

  const checkToken = () => {
    const token = localStorage.getItem("token");
    const user = token ? validateToken(token) : null;
    setCurrentUser(user);
  };

  useEffect(() => {
    checkToken();
    const interval = setInterval(checkToken, 60000); // Check token every minute
    window.addEventListener("storage", checkToken);

    return () => {
      clearInterval(interval);
      window.removeEventListener("storage", checkToken);
    };
  }, []);

  return currentUser;
};

export default useAuth;
