import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

import Header from './Header';
import Footer from './Footer';

import Login from './Login';
import Registration from './Registration';
import Mission from './Mission';
import Contact from './Contact';

import Dashboard from './Dashboard'; 
import PrivateRoute from './PrivateRoute'; 
import UnderConstruction from './UnderConstruction';

import Smoke from './Smoke';
import BottomSmoke from './BottomSmoke'; // Import BottomSmoke
import MossCanvas from './MossCanvas';

function Home() {
  return (
    <>
      {/* Ensure BottomSmoke is rendered first to stay behind everything */}
      
      <BottomSmoke />  

      {/* Main Content */}
      <Header />
      {/* <MossCanvas /> */}
      <main className="flex flex-col items-center justify-center text-center pt-20 px-4 sm:px-8 bg-[#1f1f1f] text-[#e3e4d9]">
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
          <Route path="/register" element={<Registration />} />

          <Route path="/mission" element={<Mission />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/updates" element={<UnderConstruction />} />

          <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
          <Route path="/manage-users" element={<PrivateRoute element={<UnderConstruction />} />} />
          <Route path="/site-settings" element={<PrivateRoute element={<UnderConstruction />} />} />
          <Route path="/view-reports" element={<PrivateRoute element={<UnderConstruction />} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
