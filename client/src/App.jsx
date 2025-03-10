import React from "react";
import Signup from "./components/Signup";
import Signin from "./components/Signin";
import Message from "./components/Message";
import Navbar from "./components/Navbar";

import { BrowserRouter, Routes, Route } from "react-router-dom";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/Signup" element={<Signup />} />
        <Route exact path="/Signin" element={<Signin />} />
        <Route exact path="/Message" element={<Message />} />
      </Routes>
    </BrowserRouter>
  );
}
