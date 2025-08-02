import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';


import Header from './Header';
import Footer from './Footer';

import Login from './Login';
import Mission from './Mission';
import Contact from './Contact';

function Home() {
  return (
    <>
      <Header />
      
      <main className="flex flex-col items-center justify-center text-center py-20 px-4 sm:px-8 bg-[#1f1f1f] text-[#e3e4d9]">
        <div className="max-w-3xl">
          <h2 className="text-3xl sm:text-5xl font-bold mb-6 leading-tight text-[#b7c8b5]">
            Let's Just <span className="text-[#88a07d]">Moss</span>
          </h2>
          <p className="text-lg sm:text-xl text-[#a2c2a2] mb-6">
            Welcome to Moss — A digital ecosystem to find your sesh buddy.
          </p>
          <p className="text-md sm:text-lg font-semibold text-[#8cb3af] mb-6">
            Our app is growing organically. Stay tuned.
          </p>
        </div>

        
      </main>
      <Footer />
    </>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#1f1f1f] text-[#e3e4d9] font-sans antialiased">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/mission" element={<Mission />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
