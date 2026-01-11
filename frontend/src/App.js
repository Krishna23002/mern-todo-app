import "./App.css";
import { useEffect, useState } from "react";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Todo from "./Todo";

function App() {
  const [token, setToken] = useState("");
  const [showLogin, setShowLogin] = useState(false); // Track which form to show

  


// Restore token on refresh
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  // If NOT logged in
  if (!token) {
    return (
      <div className="container" >
        {showLogin ? (
          <Login
            setToken={setToken}
            toggleForm={() => setShowLogin(false)} // Switch to Signup
          />
        ) : (
          <Signup
            toggleForm={() => setShowLogin(true)} // Switch to Login
          />
        )}
      </div>
    );
  }

  // If logged in
  return <Todo token={token} setToken={setToken} />;
}

export default App;
