import { useState, useEffect } from 'react';
import api from '../services/api'; // Use your existing API setup

export const useCars = (initialParams = {}) => {
  const [cars, setCars] = useState([]);
  const [error, setError] = useState(null);
  const [params, setParams] = useState(initialParams);

  useEffect(() => {
    const loadCars = async () => {
      try {
        const response = await api.get('/cars', { params });
        setCars(response.data);
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to fetch cars');
      }
    };

    loadCars();
  }, [params]);

  const updateParams = (newParams) => {
    setParams(prev => ({ ...prev, ...newParams }));
  };

  return { cars, error, updateParams };
};