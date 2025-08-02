import React from 'react';
import Header from './Header';
import Footer from './Footer';
import LeafBackground from './LeafBackground';

function About() {
  return (
    <>
      <Header />
      <LeafBackground />
      <div className="relative z-10">
        <main className="bg-white/30 backdrop-blur-sm py-16 px-6 sm:px-12 text-center min-h-screen">
          <div className="max-w-3xl mx-auto bg-white/60 backdrop-blur-sm rounded-lg p-8 shadow-md">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-800">About Us</h2>
            <p className="text-lg text-gray-700 mb-6">
              Shack N' The Back Development Studios is a one-person development firm, built on a passion for clean, reliable code and a desire to help small businesses grow online.
            </p>
            <p className="text-lg text-gray-700 mb-6">
              I'm an independent full-stack developer working part-time, offering custom websites and mobile apps tailored to your needs. I don’t pretend to be a big agency — just someone who cares deeply about quality, communication, and making sure you walk away with something that works well and looks great.
            </p>
            <p className="text-lg text-gray-700 mb-6">
              Whether you're just getting started or need help refining your online presence, I’m here to listen, plan thoughtfully, and deliver dependable results without the fluff.
            </p>
            <p className="text-base text-gray-500 italic">
              Let’s build something simple, smart, and made just for you.
            </p>
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}

export default About;
