import { createContext, useContext, useState } from "react";
import { setGlobalLoading } from "./services/api"; // Import global loading tracker
import { useEffect } from "react";

const LoadingContext = createContext();

export const LoadingProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setGlobalLoading(setLoading);
  }, []); // Runs only once when the provider mounts
  

  return (
    <LoadingContext.Provider value={{ loading, setLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};

// Custom hook to use the loading state
export const useLoading = () => {
  return useContext(LoadingContext);
};
