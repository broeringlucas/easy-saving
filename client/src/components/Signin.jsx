import React, { useState, useContext } from "react";
import api from "../api";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const { setToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/users/signin", {
        email,
        password,
      });
      setToken(response.data.accessToken);
      localStorage.setItem("token", response.data.accessToken);
      navigate("/Message");
    } catch (error) {
      console.error("Authentication failed:", error);
      setToken(null);
      localStorage.removeItem("token");
      setMessage(error.response.data.message);
    }
  };

  return (
    <div className="container min-vh-100 d-flex justify-content-center align-items-center">
      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <h4>Sign in</h4>
            <div className="form-group ">
              <label>Email</label>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-control"
              />
            </div>
            <div class="form-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-control"
              />
            </div>
            <button type="submit" className="btn btn-primary btn-block">
              Sign in
            </button>
            <div>{message && <p>{message}</p>}</div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signin;
