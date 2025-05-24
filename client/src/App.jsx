import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Signup from "./components/Signup";
import Signin from "./components/Signin";
import Home from "./pages/Home";
import ProtectedRoute from "./components/ProtectedRoute";

function Layout() {
  const location = useLocation();

  const hideNavbarRoutes = ["/signin", "/signup"];
  const shouldHideNavbar = hideNavbarRoutes.includes(
    location.pathname.toLowerCase()
  );

  return (
    <>
      {!shouldHideNavbar && <Navbar />}
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route
          path="/Home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}
