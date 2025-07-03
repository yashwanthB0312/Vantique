import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    address: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // ✅ Define handleChange before it's used
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
    const response = await axios.post('http://localhost:5000/api/users/signup', form);
    console.log("User created:", response.data);
    navigate('/')
  } catch (err) {
    console.error("Signup failed:", err.response?.data || err.message);
  }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-center text-cyan-700 mb-6">Create Your Account</h2>
        <form onSubmit={handleSignup} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            className="w-full border rounded px-4 py-2 text-sm"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            className="w-full border rounded px-4 py-2 text-sm"
            required
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full border rounded px-4 py-2 text-sm"
              required
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 text-gray-400 text-sm cursor-pointer"
            >
              {showPassword ? "Hide" : "Show"}
            </span>
          </div>
          <textarea
            name="address"
            placeholder="Address"
            value={form.address}
            onChange={handleChange}
            className="w-full border rounded px-4 py-2 text-sm"
            rows={3}
            required
          />
          <button
            type="submit"
            className="w-full bg-cyan-700 text-white py-2 rounded hover:bg-cyan-800 transition"
          >
            Sign Up
          </button>
        </form>
        <p className="text-sm text-center mt-4 text-gray-500">
          Already have an account?{' '}
          <a href="/" className="text-cyan-600 font-medium hover:underline">
            Log in
          </a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
