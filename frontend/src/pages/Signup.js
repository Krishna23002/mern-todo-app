import { useState } from "react";
import axios from "axios";

const Signup = ({ toggleForm }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // For showing error messages

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    try {
      await axios.post("https://mern-todo-app.onrender.com/auth/signup", { email, password });
      alert("Signup successful. Please login.");
      toggleForm(); // Switch to login after signup
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data && err.response.data.message) {
        alert(err.response.data.message); // Backend sends specific message
      } else {
        alert("Signup failed. User may already exist.");
      }
    }
  };

  return (
    <form onSubmit={handleSignup} className="authForm">
      <h1>Todo App</h1>
      <h2>Signup</h2>
      <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Password"
        onChange={e => setPassword(e.target.value)} />
      <button className="authBtn">Signup</button>
      {error && <p className="errorMsg">{error}</p>} {/* Display error */}
      <p className="switchForm">
        Already have an account?{" "}
        <button
          type="button"
          className="link-btn"
          onClick={toggleForm}
        >
          Login
        </button>
      </p>
    </form>
  );
};

export default Signup;
