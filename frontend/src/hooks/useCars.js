import { useState, useEffect } from 'react';
import api from '../services/api'; // Use your existing API setup

export const useCars = (initialParams = {}) => {
  const [cars, setCars] = useState([]);
  const [error, setError] = useState(null);
  const [params, setParams] = useState(initialParams);

  useEffect(() => {
    const loadCars = async () => {
      try {
        // Remove empty values before sending request
        const filteredParams = Object.fromEntries(
          Object.entries(params).filter(([_, value]) => value !== "")
        );
    
        // Convert filteredParams into a query string
        const queryString = new URLSearchParams(filteredParams).toString();
        const requestUrl = `/cars?${queryString}`;
    
        console.log(requestUrl); // ✅ Logs the full request URL
    
        const response = await api.get(requestUrl);
        setCars(response.data);
        setError(null);
      } catch (err) {
        console.error("🚨 Error fetching cars:", err);
        setError(err.message || "Failed to fetch cars");
      }
    };
    

    loadCars();
  }, [params]);

  const updateParams = (newParams) => {
    // Remove empty values before sending API request
    const filteredParams = Object.fromEntries(
      Object.entries(newParams).filter(([_, value]) => value !== "")
    );
  
    setParams((prev) => ({ ...prev, ...filteredParams }));
  };
  

  return { cars, error, updateParams };
};