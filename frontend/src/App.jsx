import { useEffect, useState } from "react";
import api from "./api"; // Import the Axios instance
import { useLoading } from "./LoadingContext"; // Import global loading state

function App() {
  const [message, setMessage] = useState("Loading...");
  const loading = useLoading(); //
  
  useEffect(() => {
    api.get("/") // Axios GET request to FastAPI
      .then((response) => {
        setMessage(response.data.message);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setMessage("Failed to load message");
      });
  }, []);

  return (
    <div>
    { loading ? (<h2>loading car details</h2>):
    (<div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>{message}</h1>
    </div>)
    }
    
    </div>
  );
}

export default App;
