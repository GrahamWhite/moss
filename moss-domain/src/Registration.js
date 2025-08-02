// Registration.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

function Registration() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match');
      return;
    }

    try {
      // Sending the registration request to the backend
      const res = await fetch('https://flumpy.ca/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: email, password })
      });

      const data = await res.json();

      if (res.ok) {
        // If registration is successful, navigate to login page
        navigate('/login');
      } else {
        setErrorMsg(data.error || 'Registration failed');
      }
    } catch (err) {
      setErrorMsg('Server error. Please try again later.');
    }
  };

  return (
    <>
      <Header />
      <main className="flex flex-col items-center justify-center py-20 px-4 sm:px-8 bg-[#1f1f1f] text-[#e3e4d9] min-h-screen">
        <div className="w-full max-w-md bg-[#2a2a2a] rounded-2xl shadow-lg p-8 border border-[#3a3a3a]">
          <h2 className="text-3xl font-bold text-center mb-6 text-[#b7c8b5]">
            Create an Account
          </h2>

          {errorMsg && (
            <div className="text-red-400 text-sm text-center mb-4">
              {errorMsg}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleRegister}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#a2c2a2]">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full mt-1 px-4 py-2 bg-[#1f1f1f] text-[#e3e4d9] border border-[#444] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#88a07d]"
                placeholder="you@example.com"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#a2c2a2]">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full mt-1 px-4 py-2 bg-[#1f1f1f] text-[#e3e4d9] border border-[#444] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#88a07d]"
                placeholder="••••••••"
                required
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#a2c2a2]">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className="w-full mt-1 px-4 py-2 bg-[#1f1f1f] text-[#e3e4d9] border border-[#444] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#88a07d]"
                placeholder="••••••••"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-[#88a07d] text-[#1f1f1f] font-semibold rounded-xl hover:bg-[#a2c2a2] transition"
            >
              Register
            </button>
          </form>

          <div className="mt-6 text-sm text-center">
            <p>
              Already have an account?{' '}
              <Link to="/login" className="text-[#8cb3af] hover:underline">Login</Link>
            </p>
            <p className="mt-2">
              <Link to="/" className="text-[#8cb3af] hover:underline">← Back to Home</Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default Registration;
