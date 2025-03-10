import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { Navigate } from "react-router-dom";

function Message() {
  return (
    <div className="container min-vh-100 d-flex justify-content-center align-items-center">
      <h1>Secret</h1>
    </div>
  );
}

export default Message;
