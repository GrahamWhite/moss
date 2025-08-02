import React, { useState } from 'react';
import Header from './Header';
import Footer from './Footer';

function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    window.location.href = `mailto:shackntheback@gmail.com?subject=Message from ${formData.name}&body=${encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\n${formData.message}`
    )}`;
  };

  return (
    <>
      <Header />
      
      <div className="relative z-10">
        <main className="min-h-screen bg-[#1f1f1f] backdrop-blur-sm text-[#e3e4d9] font-sans antialiased px-6 py-12">
          <div className="max-w-2xl mx-auto bg-[#2d2d2d] backdrop-blur-sm rounded-lg p-8 shadow-lg">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-[#b7c8b5]">
              Reach Out to Us at <span className="text-[#88a07d]">Moss</span>
            </h2>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block mb-1 font-medium text-[#a2c2a2]">Your Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border border-[#3c3c3c] rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#88a07d] bg-[#1f1f1f] text-[#e3e4d9]"
                />
              </div>
              <div>
                <label htmlFor="email" className="block mb-1 font-medium text-[#a2c2a2]">Your Email</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border border-[#3c3c3c] rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#88a07d] bg-[#1f1f1f] text-[#e3e4d9]"
                />
              </div>
              <div>
                <label htmlFor="message" className="block mb-1 font-medium text-[#a2c2a2]">Your Message</label>
                <textarea
                  name="message"
                  rows="5"
                  required
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full border border-[#3c3c3c] rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#88a07d] bg-[#1f1f1f] text-[#e3e4d9]"
                />
              </div>
              <button
                type="submit"
                className="bg-[#88a07d] hover:bg-[#88a07d]/80 text-white font-medium py-3 px-6 rounded-md shadow-lg transition"
              >
                Send Message
              </button>
            </form>

            {/* Direct Email Section */}
            <div className="mt-8 text-center text-[#e3e4d9]">
              <p className="text-lg font-medium">Prefer to use your own email?</p>
              <p>
                Reach us directly at{' '}
                <a
                  href="mailto:shackntheback@gmail.com"
                  className="text-[#88a07d] underline hover:text-[#a2c2a2]"
                >
                  shackntheback@gmail.com
                </a>
              </p>
            </div>
          </div>
        </main>
      </div>
      
      <Footer />
    </>
  );
}

export default Contact;
