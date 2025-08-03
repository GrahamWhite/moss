import React from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import BottomSmoke from './BottomSmoke';
function UnderConstruction() {
  return (
    <>
      <BottomSmoke />
      <Header />
      <main className="flex flex-col items-center justify-center pt-20 px-4 sm:px-8 bg-[#1f1f1f] text-[#e3e4d9]">
        <div className="text-center max-w-2xl bg-[#2a2a2a] rounded-2xl shadow-lg p-8 border border-[#3a3a3a]">
          <h2 className="text-3xl sm:text-5xl font-bold text-[#b7c8b5] mb-6">
            This page is <span className="text-[#88a07d]">Under Construction</span>
          </h2>
          <p className="text-lg sm:text-xl text-[#a2c2a2] mb-6">
            We're working hard to bring you this feature. Stay tuned!
          </p>
          <p className="text-md sm:text-lg font-semibold text-[#8cb3af] mb-6">
            Thank you for your patience.
          </p>
          <div className="mt-6">
            <Link to="/" className="text-[#88a07d] hover:underline">
              ← Back to Home
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default UnderConstruction;
