import { use, useEffect } from "react";
import { useState } from "react";
import api from "../api";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);

  const fetchUser = async () => {
    const response = await api.get("/users/user", { withCredentials: true });
    setUser(response.data);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <nav className="flex justify-between items-center p-4 bg-blue-600 text-white">
      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 bg-blue-700 px-4 py-2 rounded hover:bg-blue-800"
        >
          {user?.username}
          <svg
            className="w-4 h-4"
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

        {open && (
          <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded shadow-lg">
            <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">
              Config
            </button>
            <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">
              Log Out
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
