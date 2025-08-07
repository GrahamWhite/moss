import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import BottomSmoke from './BottomSmoke';

function AddSesh() {
  const [title, setTitle] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [info, setInfo] = useState('');
  const [location, setLocation] = useState('');
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState('');
  const [picture, setPicture] = useState(null);

  const handleAddUser = () => {
    if (newUser.trim()) {
      setUsers([...users, newUser.trim()]);
      setNewUser('');
    }
  };

  const handlePictureChange = (e) => {
    if (e.target.files.length > 0) {
      setPicture(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const pictureUrl = picture ? picture : null;

    const res = await fetch('/api/meetings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title,
        dateTime,
        info,
        location,
        pictureUrl,
        users
      })
    });

    const data = await res.json();

    if (res.ok) {
      alert('Sesh created!');
      console.log('Created meeting:', data);
      setTitle('');
      setDateTime('');
      setInfo('');
      setLocation('');
      setUsers([]);
      setPicture(null);
    } else {
      alert('Error: ' + (data.error || 'Unknown error'));
    }
  } catch (err) {
    console.error('Submit error:', err);
    alert('Something went wrong creating the sesh.');
  }
};


  return (
    <>
      <BottomSmoke />
      <Header />
      <main className="flex flex-col items-center justify-center text-center pt-20 px-4 sm:px-8 bg-[#1f1f1f] text-[#e3e4d9]">
        <div className="max-w-3xl w-full">
          <h2 className="text-3xl sm:text-5xl font-bold mb-6 leading-tight text-[#b7c8b5]">
            Create a New <span className="text-[#88a07d]">Sesh</span>
          </h2>
          <form
            onSubmit={handleSubmit}
            className="bg-[#2a2a2a] p-6 rounded-2xl shadow-lg text-left space-y-6"
          >
            {/* Title */}
            <div>
              <label className="block text-[#a2c2a2] mb-2">Sesh Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-[#1f1f1f] text-[#e3e4d9] border border-[#88a07d]"
                required
              />
            </div>

            {/* Date & Time */}
            <div>
              <label className="block text-[#a2c2a2] mb-2">Date & Time</label>
              <input
                type="datetime-local"
                value={dateTime}
                onChange={(e) => setDateTime(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-[#1f1f1f] text-[#e3e4d9] border border-[#88a07d]"
                required
              />
            </div>

            {/* Info */}
            <div>
              <label className="block text-[#a2c2a2] mb-2">
                Info (max 100 characters)
              </label>
              <textarea
                value={info}
                onChange={(e) =>
                  e.target.value.length <= 100 && setInfo(e.target.value)
                }
                rows="3"
                className="w-full px-4 py-2 rounded-lg bg-[#1f1f1f] text-[#e3e4d9] border border-[#88a07d]"
                placeholder="Describe your sesh..."
              />
              <p className="text-sm text-[#8cb3af]">
                {info.length}/100 characters
              </p>
            </div>

            {/* Location */}
            <div>
              <label className="block text-[#a2c2a2] mb-2">
                Location (GPS or Google Maps link)
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Paste link or coordinates"
                className="w-full px-4 py-2 rounded-lg bg-[#1f1f1f] text-[#e3e4d9] border border-[#88a07d]"
              />
            </div>

            {/* Picture */}
            <div>
              <label className="block text-[#a2c2a2] mb-2">Picture</label>
              <input
                type="file"
                accept="image/*"
                onChange={handlePictureChange}
                className="text-[#a2c2a2]"
              />
              {picture && (
                <img
                  src={picture}
                  alt="Preview"
                  className="mt-2 w-32 h-32 object-cover rounded-lg border border-[#88a07d]"
                />
              )}
            </div>

            {/* Add Users */}
            <div>
              <label className="block text-[#a2c2a2] mb-2">
                Add Users to Sesh
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newUser}
                  onChange={(e) => setNewUser(e.target.value)}
                  placeholder="Enter username"
                  className="flex-1 px-4 py-2 rounded-lg bg-[#1f1f1f] text-[#e3e4d9] border border-[#88a07d]"
                />
                <button
                  type="button"
                  onClick={handleAddUser}
                  className="bg-[#88a07d] hover:bg-[#88a07d]/80 text-black px-4 py-2 rounded-lg"
                >
                  Add
                </button>
              </div>
              {users.length > 0 && (
                <ul className="mt-2 text-[#a2c2a2] list-disc list-inside">
                  {users.map((user, idx) => (
                    <li key={idx}>{user}</li>
                  ))}
                </ul>
              )}
            </div>

            {/* Submit */}
            <div className="text-center">
              <button
                type="submit"
                className="bg-[#88a07d] hover:bg-[#88a07d]/80 text-black font-medium py-3 px-6 rounded-full shadow-lg transition"
              >
                Create Sesh
              </button>
            </div>
          </form>

          <div className="mt-8 text-center">
            <Link
              to="/"
              className="inline-block text-[#88a07d] hover:text-[#a2c2a2]"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default AddSesh;
