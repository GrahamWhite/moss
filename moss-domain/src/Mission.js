import React from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import BottomSmoke from './BottomSmoke';
function Mission() {
  return (
    <>
      <BottomSmoke />
      <Header />
      <main className="flex flex-col items-center justify-center text-center pt-20 px-4 sm:px-8 bg-[#1f1f1f] text-[#e3e4d9]">
        <div className="max-w-3xl">
          <h2 className="text-3xl sm:text-5xl font-bold mb-6 leading-tight text-[#b7c8b5]">
            Our Mission at <span className="text-[#88a07d]">Moss</span>
          </h2>
          <p className="text-lg sm:text-xl text-[#a2c2a2] mb-6">
            Moss isn't just an app, it's a way of life. We're here to help locals find safe, welcoming places to gather, hang out, and create spontaneous seshes.
          </p>

          <p className="text-md sm:text-lg text-[#8cb3af] font-semibold mb-6">
            At Moss, we believe in building a community. Whether you’re looking for a chill spot to relax with friends or connect with others who share your vibe, we’ve got you covered.
          </p>

          <h3 className="text-2xl sm:text-3xl font-semibold mb-4 text-[#b7c8b5]">
            What We Stand For
          </h3>
          <ul className="list-disc list-inside text-[#a2c2a2] text-lg sm:text-xl mb-6">
            <li>Creating safe and welcoming spaces for locals to gather.</li>
            <li>Helping you find and rate sesh spots that are perfect for hanging out.</li>
            <li>Connecting community members who share similar vibes and interests.</li>
            <li>Promoting respect, safety, and mindfulness in every session.</li>
          </ul>

          <p className="text-lg sm:text-xl text-[#a2c2a2] mb-6">
            Just like moss grows naturally and freely, we aim to foster an environment where the community can organically grow and thrive. Join us in creating spontaneous moments, new connections, and a space where we can all just “Moss.”
          </p>

          <div className="mt-8">
            <Link
              to="/contact"
              className="inline-block bg-[#88a07d] hover:bg-[#88a07d]/80 text-black font-medium py-3 px-6 rounded-full shadow-lg transition"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default Mission;
