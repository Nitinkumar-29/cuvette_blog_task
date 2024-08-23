import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Manage login state
  const [menuOpen, setMenuOpen] = useState(false); // For responsive hamburger menu
  const navigate = useNavigate();
  const { currentUserId } = useContext(AuthContext);
  // Handle login status (this can be updated with actual logic, like checking auth tokens)
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <nav className="bg-zinc-100 p-4 text-black">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className=" text-2xl font-bold">
          <Link to="/">Cuvette Blogs</Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6">
          <Link to="/" className=" hover:text-indigo-500">
            Home
          </Link>
          <Link to="/blogs" className=" hover:text-indigo-500">
            Blogs
          </Link>
          {!isLoggedIn ? (
            <Link to="/login" className=" hover:text-indigo-500">
              Login
            </Link>
          ) : (
            <>
              <Link
                to={`/profile/${currentUserId}`}
                className=" hover:text-indigo-500"
              >
                Profile
              </Link>
              <button onClick={handleLogout} className=" hover:text-red-500">
                Logout
              </button>
            </>
          )}
        </div>

        {/* Mobile Hamburger Icon */}
        <div className="md:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className=" focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={
                  menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"
                }
              ></path>
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden mt-4 space-y-4">
          <Link
            to="/"
            className="block  hover:text-indigo-500"
            onClick={() => setMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/blogs"
            className="block  hover:text-indigo-500"
            onClick={() => setMenuOpen(false)}
          >
            Blogs
          </Link>
          {!isLoggedIn ? (
            <Link
              to="/login"
              className="block  hover:text-indigo-500"
              onClick={() => setMenuOpen(false)}
            >
              Login
            </Link>
          ) : (
            <>
              <Link
                to="/profile"
                className="block  hover:text-indigo-500"
                onClick={() => setMenuOpen(false)}
              >
                Profile
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className="block  hover:text-red-500"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
