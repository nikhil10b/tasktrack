"use client"
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const Login = () => {
  const router = useRouter();
  const [values, setValues] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState(""); // State to capture error messages
  axios.defaults.withCredentials = true; // Enable credentials for every request

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    try {
      // Send login request to the backend
      const res = await axios.post("http://localhost:8081/login", values, {
        withCredentials: true,  // Ensure cookies are included in the request
      });

      if (res.data.Status === "Success") {
        router.push("/taskmanagement"); // Redirect to home page on success
      } else {
        setError(res.data.Error); // Set error message if login fails
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
      console.error("Login error:", err); // Log the error for debugging
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

        {/* Display error message */}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit}>
          {/* Email input */}
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              onChange={(e) => setValues({ ...values, email: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-lg"
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Password input */}
          <div className="mb-4">
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              onChange={(e) => setValues({ ...values, password: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-lg"
              placeholder="Enter your password"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
