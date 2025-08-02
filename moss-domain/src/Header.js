import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="w-full border-b border-[#3e3d32] py-4 bg-[#181818] sticky top-0 z-20 shadow-md">
      <div className="container mx-auto px-6 flex justify-between items-center">
        <Link to="/" className="text-2xl sm:text-3xl font-bold text-[#f8f8f2]">
          Moss
          <br />
          <span className="text-base sm:text-lg font-medium text-[#e6db74]">
            Let's Just Moss
          </span>
        </Link>
        <nav className="space-x-4 text-sm sm:text-base text-[#f8f8f2]">
          <Link to="/mission" className="hover:text-[#a6e22e] transition">Our Mission</Link>
          <Link to="/login" className="hover:text-[#66d9ef] transition">Portal</Link>
          <Link to="/updates" className="hover:text-[#fd971f] transition">Updates</Link>
          <Link to="/contact" className="hover:text-[#f92672] transition">Contact</Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;
