import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import BottomSmoke from './BottomSmoke';

function SeshList() {
  const [seshes, setSeshes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSeshes() {
      try {
        const res = await fetch('/api/meetings');
        const data = await res.json();

        if (res.ok) {
          // Transform MySQL data into the same structure your UI expects
          const mapped = data.map((meeting) => ({
            id: meeting.meeting_id,
            title: meeting.title,
            dateTime: meeting.start_time,
            info: meeting.info,
            location: meeting.location,
            picture: meeting.picture_url || 'https://via.placeholder.com/150',
            users: meeting.users || [] // If your backend sends an array of usernames
          }));
          setSeshes(mapped);
        } else {
          console.error('Error loading seshes:', data.error);
        }
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchSeshes();
  }, []);

  const handleJoin = async (id) => {
  try {
    const token = localStorage.getItem('token');
    const res = await fetch(`/api/meetings/${id}/join`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await res.json();
    if (res.ok) {
      alert(`You joined the sesh: ${data.title}`);
    } else {
      alert(data.error || 'Failed to join sesh');
    }
  } catch (err) {
    console.error('Join error:', err);
  }
};

  return (
    <>
      <BottomSmoke />
      <Header />
      <main className="flex flex-col items-center pt-20 px-4 sm:px-8 bg-[#1f1f1f] text-[#e3e4d9] min-h-screen">
        <div className="max-w-4xl w-full">
          <h2 className="text-3xl sm:text-5xl font-bold mb-8 text-center text-[#b7c8b5]">
            Current <span className="text-[#88a07d]">Seshes</span>
          </h2>

          {loading ? (
            <p className="text-center text-[#a2c2a2]">Loading seshes...</p>
          ) : seshes.length === 0 ? (
            <p className="text-center text-[#a2c2a2]">No seshes found.</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2">
              {seshes.map((sesh) => (
                <div
                  key={sesh.id}
                  className="bg-[#2a2a2a] p-4 rounded-2xl shadow-lg flex flex-col"
                >
                  <img
                    src={sesh.picture}
                    alt={sesh.title}
                    className="w-full h-40 object-cover rounded-lg mb-4 border border-[#88a07d]"
                  />
                  <h3 className="text-xl font-semibold text-[#b7c8b5] mb-2">
                    {sesh.title}
                  </h3>
                  <p className="text-[#a2c2a2] mb-1">
                    <span className="font-semibold">When:</span>{' '}
                    {new Date(sesh.dateTime).toLocaleString()}
                  </p>
                  <p className="text-[#a2c2a2] mb-1">
                    <span className="font-semibold">Info:</span> {sesh.info}
                  </p>
                  <p className="text-[#a2c2a2] mb-1">
                    <span className="font-semibold">Location:</span>{' '}
                    <a
                      href={sesh.location}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#88a07d] hover:text-[#a2c2a2]"
                    >
                      {sesh.location}
                    </a>
                  </p>
                  <p className="text-[#a2c2a2] mb-3">
                    <span className="font-semibold">Users:</span>{' '}
                    {sesh.users.length > 0 ? sesh.users.join(', ') : 'None yet'}
                  </p>
                  <button
                    onClick={() => handleJoin(sesh.id)}
                    className="mt-auto bg-[#88a07d] hover:bg-[#88a07d]/80 text-black font-medium py-2 px-4 rounded-lg transition"
                  >
                    Join Sesh
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="mt-8 text-center">
            <Link
              to="/sesh"
              className="inline-block bg-[#88a07d] hover:bg-[#88a07d]/80 text-black font-medium py-3 px-6 rounded-full shadow-lg transition"
            >
              Create New Sesh
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default SeshList;
