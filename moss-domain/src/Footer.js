// Footer.js
import React from 'react';
import { Link } from 'react-router-dom';
import BottomSmoke from './BottomSmoke';

function Footer() {
  return (
    <footer className="w-full border-t border-gray-300 py-6 text-center text-sm text-gray-600 bg-[#181818]">
        <p>© {new Date().getFullYear()} Shack N' The Back Development Studios. All rights reserved.</p>
      </footer>
  );
}

export default Footer;
