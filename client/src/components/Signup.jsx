import React, { useState } from "react";
import api from "../api";

const Signup = () => {
  const [name, setName] = useState("");
  const [birthday, setBirthday] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nameParts = name.trim().split(" ");
    if (nameParts.length < 2) {
      setMessage("Por favor, informe seu nome completo.");
      return;
    }

    try {
      const response = await api.post("/users/signup", {
        name,
        birthday,
        phone,
        email,
        password,
      });
      setMessage(response.data.message);
      console.log(response.data);
    } catch (error) {
      console.error(error.response?.data?.message || "Signup failed");
      setMessage(error.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div>
      <h4>Register</h4>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label>
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label>Birthday</label>
          <input
            type="date"
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
          />
        </div>
        <div>
          <label>Phone</label>
          <input
            type="tel"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
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
        <button type="submit">Register</button>
        {message && <p>{message}</p>}
      </form>
    </div>
  );
};

export default Signup;
