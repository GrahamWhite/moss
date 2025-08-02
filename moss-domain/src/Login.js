import React from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

function Login() {
  return (
    <>
      <Header />
      <main className="flex flex-col items-center justify-center py-20 px-4 sm:px-8 bg-[#1f1f1f] text-[#e3e4d9] min-h-screen">
        <div className="w-full max-w-md bg-[#2a2a2a] rounded-2xl shadow-lg p-8 border border-[#3a3a3a]">
          <h2 className="text-3xl font-bold text-center mb-6 text-[#b7c8b5]">Login to <span className="text-[#88a07d]">Moss</span></h2>
          
          <form className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#a2c2a2]">Email</label>
              <input
                type="email"
                id="email"
                className="w-full mt-1 px-4 py-2 bg-[#1f1f1f] text-[#e3e4d9] border border-[#444] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#88a07d]"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#a2c2a2]">Password</label>
              <input
                type="password"
                id="password"
                className="w-full mt-1 px-4 py-2 bg-[#1f1f1f] text-[#e3e4d9] border border-[#444] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#88a07d]"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-[#88a07d] text-[#1f1f1f] font-semibold rounded-xl hover:bg-[#a2c2a2] transition"
            >
              Sign In
            </button>
          </form>

          <div className="mt-6 text-sm text-center">
            <p>
              Don't have an account?{' '}
              <Link to="/register" className="text-[#8cb3af] hover:underline">Register</Link>
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

export default Login;
