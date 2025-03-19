"use client";

import React, { useState } from 'react';
import { useRouter } from "next/navigation";
import axios from 'axios';

const Register = () => {
  const router = useRouter(); // Moved useRouter() to the top
  const [values, setValues] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:8081/register', values);
      if (res.data.Status === "Success") {
        router.push("/login"); // Redirect to login page
      }
    } catch (err) {
      console.error("Registration error:", err);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
        <form onSubmit={handleSubmit}>
          {/* Username input */}
          <div className="mb-4">
            <label className="block text-gray-700">Username</label>
            <input 
              type="text" 
              onChange={(e) => setValues({ ...values, name: e.target.value })} 
              className="w-full p-2 border border-gray-300 rounded-lg" 
              placeholder="Enter your username"
              required
            />
          </div>

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

          {/* Submit button */}
          <button 
            type="submit" 
            className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600">
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
