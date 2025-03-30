import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/images/logoMotivant.png'; 


const Auth = () => {
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isSignup
      ? 'http://localhost:5000/api/auth/signup'
      : 'http://localhost:5000/api/auth/login';

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(isSignup ? 'Înregistrare reușită!' : 'Autentificare reușită!');
        if (!isSignup) {
          localStorage.setItem('token', data.token);
          navigate('/home');
        }
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage('Eroare la conectare!');
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Side */}
      <div className="hidden md:flex w-1/2 bg-[#F7CBA4] flex-col items-center justify-center text-center p-8">
        <img src={logo} alt="You++ Logo" className="w-56 mb-6" />
        <h1 className="text-4xl font-bold text-[#8E1C3B] mb-4">You++</h1>
        <p className="text-gray-700 text-lg">
          Fă upgrade la tine însuți – obicei cu obicei.
        </p>
      </div>

      {/* Right Side - Auth Form */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 px-8 py-12 bg-white">
        <h2 className="text-3xl font-semibold mb-6 text-[#555352]">
          {isSignup ? 'Creează cont' : 'Autentifică-te'}
        </h2>
        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
          {isSignup && (
            <input
              type="text"
              name="name"
              placeholder="Nume"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FFD045]"
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FFD045]"
          />
          <input
            type="password"
            name="password"
            placeholder="Parolă"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FFD045]"
          />
          <button
            type="submit"
            className="w-full bg-[#EE5249] text-white py-2 rounded-md hover:bg-[#d8453c] transition duration-200"
          >
            {isSignup ? 'Înregistrează-te' : 'Autentifică-te'}
          </button>
        </form>

        {message && <p className="mt-4 text-sm text-red-500">{message}</p>}

        <button
          onClick={() => setIsSignup(!isSignup)}
          className="mt-6 text-sm text-[#8E1C3B] hover:underline"
        >
          {isSignup
            ? 'Ai deja cont? Autentifică-te'
            : 'Nu ai cont? Creează unul'}
        </button>
      </div>
    </div>
  );
};

export default Auth;
