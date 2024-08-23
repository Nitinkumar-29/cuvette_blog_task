import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    photo: null, // Added for handling file
  });

  const { Signup, passwordType, setPasswordType } = useContext(AuthContext); // Access the signup function from context

  const handleOnChange = (e) => {
    if (e.target.name === "photo") {
      setFormData({ ...formData, [e.target.name]: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return console.log("Passwords do not match");
    }
    // Call the Signup function from context
    await Signup(formData);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Sign Up</h1>
        <div className="flex space-x-1 items-center text-lg font-bold text-gray-900 mb-8">
          <span className="text-indigo-600">Craft&nbsp;</span> Your Story,{" "}
          <br />
          <span className="text-teal-600">Share&nbsp;</span> Your Insights, and{" "}
          <br />
          <span className="text-pink-600">Engage&nbsp;</span> with the World
        </div>
      </div>

      <form
        onSubmit={handleSignup}
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md"
      >
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Enter your name"
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={formData.name}
            onChange={handleOnChange}
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email"
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={formData.email}
            onChange={handleOnChange}
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <div className="relative mt-1">
            <input
              type={passwordType}
              id="password"
              name="password"
              placeholder="Enter your password"
              required
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={formData.password}
              onChange={handleOnChange}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-3 flex items-center text-gray-600"
              onClick={() => {
                if (passwordType === "password") {
                  setPasswordType("text");
                } else {
                  setPasswordType("password");
                }
              }}
            >
              {passwordType === "password" ? <FaEye /> : <FaEyeSlash />}
            </button>
          </div>
        </div>
        <div className="mb-6">
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-700"
          >
            Confirm Password
          </label>
          <input
            type={passwordType}
            id="confirmPassword"
            name="confirmPassword"
            placeholder="Confirm your password"
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={formData.confirmPassword}
            onChange={handleOnChange}
          />
        </div>

        {/* File upload input for profile photo */}
        <div className="mb-6">
          <label
            htmlFor="photo"
            className="block text-sm font-medium text-gray-700"
          >
            Profile Photo
          </label>
          <input
            type="file"
            id="photo"
            name="photo"
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            onChange={handleOnChange}
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Signup
        </button>
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-600 hover:text-indigo-800">
              Login
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Signup;
