import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiMenu,
  FiX,
  FiHome,
  FiBarChart,
  FiUser,
  FiLogOut,
} from "react-icons/fi";

import { UserService } from "../services/UserService";

export default function Navbar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const fetchUser = async () => {
    const response = await UserService.fetchUser();
    setUser(response);
  };

  const logout = async () => {
    try {
      await UserService.logout();
      setUser(null);
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const navigationOptions = [
    {
      name: "Home",
      path: "/home",
      icon: <FiHome className="mr-3" />,
    },
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <FiBarChart className="mr-3" />,
    },
  ];

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <>
      <nav className="flex items-center p-3 bg-p-green shadow-md">
        <div className="flex w-full relative">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="ml-5 p-2 hover:bg-s-green rounded-lg transition-colors"
          >
            <FiMenu className="text-white w-6 h-6" />
          </button>
          <div className="ml-auto">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center justify-between px-4 py-2 rounded hover:bg-s-green ml-auto mr-5 shadow-md w-32 text-white"
            >
              <span className="mr-2">{user?.name.split(" ")[0]}</span>
              <svg
                className={`w-4 h-4 transform transition-transform ${
                  isUserMenuOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {isUserMenuOpen && (
              <div className="absolute ml-auto mt-2 bg-white rounded-md shadow-lg w-32">
                <button
                  onClick={() => navigate("/profile")}
                  className="w-full px-4 py-3 text-left hover:bg-gray-100 flex items-center"
                >
                  <FiUser className="mr-2" /> Profile
                </button>
                <button
                  onClick={logout}
                  className="w-full px-4 py-3 text-left hover:bg-gray-100 flex items-center"
                >
                  <FiLogOut className="mr-2" /> Quit
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
      <div
        className={`fixed top-0 left-0 h-full w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-4 bg-p-green shadow-md">
          <h2 className="ml-2 text-[24px] text-white">Menu</h2>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="p-1 hover:bg-s-green rounded-lg"
          >
            <FiX className="w-6 h-6 text-white" />
          </button>
        </div>
        <nav className="mt-4">
          {navigationOptions.map((item) => (
            <button
              key={item.name}
              onClick={() => {
                navigate(item.path);
                setIsSidebarOpen(false);
              }}
              className="w-full flex items-center px-6 py-4 hover:bg-gray-100 text-gray-700 transition-colors"
            >
              {item.icon}
              <span className="text-lg">{item.name}</span>
            </button>
          ))}
        </nav>
      </div>
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 cursor-pointer"
        />
      )}
    </>
  );
}
