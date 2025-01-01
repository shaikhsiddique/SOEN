import React, { useContext, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../config/axois.js';
import gsap from 'gsap';
import { UserContext } from '../context/UserContext.jsx';

function Login() {
  const navigate = useNavigate();
  const displayTextRef = useRef(null);
  const {setUser} = useContext(UserContext)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post('/user/login', {
        email: formData.email,
        password: formData.password,
      })
      .then((res) => {
        if (res.status === 200) {
          localStorage.setItem('SOENtoken',res.data.token);
          setUser(res.data.user);
          navigate('/');
        }
      })
      .catch((err) => {
        displayTextRef.current.textContent = err.response?.data.message;
        gsap.to(displayTextRef.current, {
          opacity: 1,
          duration: 0.2,
        });
        console.error(err.response?.data || 'An error occurred');
      });

    setFormData({
      email: '',
      password: '',
    });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold text-white text-center mb-6">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <p
              ref={displayTextRef}
              className="text-center text-red-500 text-sm font-semibold opacity-0"
            >
              Invalid Email or Password
            </p>
            <label
              htmlFor="email"
              className="block text-gray-300 font-medium mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-gray-300 font-medium mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white"
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Login
          </button>
        </form>
        <div className="text-center mt-4">
          <p className="text-gray-300">Don't have an account?</p>
          <Link to="/register" className="text-blue-400 hover:underline">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
