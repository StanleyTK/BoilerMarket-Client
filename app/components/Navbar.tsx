import React, { useState } from "react";
import { useNavigate, Outlet } from "react-router";
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth, signOut } from "firebase/auth";
import { getApp } from "firebase/app";

const Navbar: React.FC = () => {
  const auth = getAuth(getApp());
  const [user] = useAuthState(auth);
  const isLoggedIn = !!user;
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setMenuOpen(false);
      navigate("/login");
    } catch (error) {
      console.error("Error signing out", error);
    }
  };

  const handleProfileClick = () => {
    setMenuOpen(false);
    if (isLoggedIn) {
      navigate(`/u/${user?.uid}`); 
    } else {
      navigate("/login");
    }
  };

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery(""); // Clear search bar after navigating
    }
  };

  return (
    <div className="relative">
      <header className="flex items-center justify-between p-4 bg-gray-900 text-white">
        {/* Logo */}
        <div className="flex items-center cursor-pointer" onClick={() => navigate("/")}>
          <img src="/logo.png" alt="BoilerMarket Logo" className="h-12 mr-2" />
          <span className="text-xl font-bold">BoilerMarket</span>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative w-1/3">
          <input
            type="text"
            placeholder="Search listings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full py-2 pl-10 pr-4 rounded-full bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button type="submit" className="absolute inset-y-0 left-0 flex items-center pl-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10 4a6 6 0 016 6 6 6 0 01-1.254 3.68l5.017 5.018a1 1 0 01-1.414 1.414l-5.018-5.017A6 6 0 1110 4z"
              />
            </svg>
          </button>
        </form>

        {/* Profile & Menu */}
        <div className="flex items-center space-x-4">
          <button
            onClick={handleProfileClick}
            className="text-white font-semibold hover:underline"
          >
            View My Profile
          </button>

          <div className="cursor-pointer p-2" onClick={toggleMenu}>
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </div>
        </div>
      </header>

      {/* Dropdown Menu */}
      {menuOpen && (
        <div
          className="absolute right-4 mt-2 w-48 bg-white rounded shadow-lg z-50 transition transform duration-300 origin-top-right"
          style={{ animation: "fadeInScale 0.3s forwards" }}
        >
          {isLoggedIn ? (
            <>
              <button
                onClick={() => navigate("/settings")}
                className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
              >
                Settings
              </button>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate("/login")}
                className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
              >
                Login
              </button>
              <button
                onClick={() => navigate("/register")}
                className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      )}
      <Outlet />
    </div>
  );
};

export default Navbar;
