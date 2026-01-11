import { useState } from "react";
import axios from "axios";

const Login = ({ setToken, toggleForm }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // State for error message

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous error
    try {
      const res = await axios.post("https://mern-todo-app.onrender.com/auth/login", { email, password });
      setToken(res.data.token);
      localStorage.setItem("token", res.data.token);
    } catch (err) {
      console.error(err);
      // If backend sends a message, show it; else default
      if (err.response && err.response.data && err.response.data.message) {
        alert(err.response.data.message);
      } else {
        alert("Invalid email or password.");
      }
    }
  };

  return (
    <form onSubmit={handleLogin} className="authForm">
      <h1>Todo App</h1>
      <h2>Login</h2>
      <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Password"
        onChange={e => setPassword(e.target.value)} />
      <button className="authBtn">Login</button>
      {/* Display error message */}
      {error && <p className="errorMsg">{error}</p>}
      <p className="switchForm">
        Don't have an account?{" "}
        <button
          type="button"
          className="link-btn"
          onClick={toggleForm}
        >
          Signup
        </button>
      </p>
    </form>
  );
};

export default Login;
