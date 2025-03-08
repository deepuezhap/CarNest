import axios from "axios";


const api = axios.create({
  baseURL: "http://localhost:8000",
});

// Global loading state
let activeRequests = 0;
let setLoading = () => {}; // Placeholder, will be set in React

export const setGlobalLoading = (fn) => {
  setLoading = fn; // Assign React's setLoading function to track state
};

// Axios request interceptor (Start loading)
api.interceptors.request.use((config) => {
  activeRequests++;
  setLoading(true);
  return config;
});

// Axios response interceptor (Stop loading)
api.interceptors.response.use(
  (response) => {
    activeRequests--;
    if (activeRequests === 0) setLoading(false);
    return response;
  },
  (error) => {
    activeRequests--;
    if (activeRequests === 0) setLoading(false);
    return Promise.reject(error);
  }
);

export default api;
