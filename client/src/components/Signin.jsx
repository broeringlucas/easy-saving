import React, { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/users/signin", {
        email,
        password,
      });
      navigate("/home");
    } catch (error) {
      console.error("Authentication failed:", error);
      setMessage(error.response?.data?.message || "An error occurred");
    }
  };

  return (
    <div>
      <div>
        <div>
          <form onSubmit={handleSubmit}>
            <h4>Sign in</h4>
            <div>
              <label>Email</label>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label>Password</label>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type="submit">Sign in</button>
            <div>{message && <p>{message}</p>}</div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signin;
