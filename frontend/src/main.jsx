import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { LoadingProvider } from "./LoadingContext"; // Import LoadingProvider
import 'bootstrap/dist/css/bootstrap.min.css';
import CarSellingPlatform from './CarSellingPlatform.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LoadingProvider>
      <CarSellingPlatform/>
    </LoadingProvider>

  </StrictMode>,
)
