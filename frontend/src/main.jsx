import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import Home from './pages/Home';
import CarDetails from './pages/CarDetails';
import { LoadingProvider } from "./LoadingContext"; // Import LoadingProvider
import 'bootstrap/dist/css/bootstrap.min.css';
import CarSellingPlatform from './CarSellingPlatform.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CarSellingPlatform/>
  </React.StrictMode>
);
