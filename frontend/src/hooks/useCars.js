import { useState, useEffect } from 'react';
import api from '../services/api'; // Use your existing API setup

export const useCars = (initialParams = {}) => {
  const [cars, setCars] = useState([]);
  const [error, setError] = useState(null);
  const [params, setParams] = useState(initialParams);
  const [loading, setLoading] = useState(false); // Add loading state

  useEffect(() => {
    const loadCars = async () => {
      try {
        setLoading(true); // Set loading to true before fetching
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
        setError(err.response?.data || { detail: "Failed to fetch cars" });
      } finally {
        setLoading(false); // Set loading to false after fetch completes
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
  

  return { cars, error, loading, updateParams }; // Return loading state
};