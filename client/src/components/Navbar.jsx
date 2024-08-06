import React from "react";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top">
      <NavLink className="navbar-brand" to="/">
        <h1>Logo</h1>
      </NavLink>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav ml-auto">
          <li className="nav-item">
            <NavLink className="nav-link" to="/Signup">
              Signup
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/Signin">
              Signin
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/Message">
              Message
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
