import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { Navigate } from "react-router-dom";

function Message() {
  const { token, loading } = useContext(AuthContext);
  if (loading) {
    return null;
  }

  if (!token) {
    return <Navigate to="/Signin" replace />;
  }

  return (
    <div className="container min-vh-100 d-flex justify-content-center align-items-center">
      <h1>Secret</h1>
    </div>
  );
}

export default Message;
