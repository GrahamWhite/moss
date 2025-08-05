import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import BottomSmoke from './BottomSmoke';
import { jwtDecode } from 'jwt-decode';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser({
          email: decoded.email,
          role: decoded.role || 'user' // default role if not in token
        });

        console.log(decoded.role);
      } catch (err) {
        console.error('Invalid token:', err);
        setErrorMsg('Invalid session, please log in again');
      }
    } else {
      setErrorMsg('User not logged in');
    }
  }, []);

  return (
    <>
      <BottomSmoke />
      <Header />
      <main className="flex flex-col items-center justify-center pt-20 px-4 sm:px-8 bg-[#1f1f1f] text-[#e3e4d9]">
        <div className="w-full max-w-4xl bg-[#2a2a2a] rounded-2xl shadow-lg p-8 border border-[#3a3a3a]">
          {errorMsg && (
            <div className="text-red-400 text-sm text-center mb-4">
              {errorMsg}
            </div>
          )}
          
          {user && (
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-6 text-[#b7c8b5]">
                Welcome to your Dashboard, <span className="text-[#88a07d]">{user.email}</span>
              </h2>
              <p className="text-sm text-[#a2c2a2] mb-6">Role: {user.role}</p>

              {/* Admin Controls Section */}
              {user.role === 'admin' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-[#88a07d]">Admin Controls</h3>
                  <div className="space-y-4">
                    <Link to="/manage-users" className="block p-4 bg-[#3a3a3a] text-[#e3e4d9] rounded-xl hover:bg-[#88a07d]">
                      Manage Users
                    </Link>
                    <Link to="/site-settings" className="block p-4 bg-[#3a3a3a] text-[#e3e4d9] rounded-xl hover:bg-[#88a07d]">
                      Site Settings
                    </Link>
                    <Link to="/view-reports" className="block p-4 bg-[#3a3a3a] text-[#e3e4d9] rounded-xl hover:bg-[#88a07d]">
                      View Reports
                    </Link>
                      <Link to="/profile" className="block p-4 bg-[#3a3a3a] text-[#e3e4d9] rounded-xl hover:bg-[#88a07d]">
                      Edit Profile
                    </Link>
                    <Link to="/user-settings" className="block p-4 bg-[#3a3a3a] text-[#e3e4d9] rounded-xl hover:bg-[#88a07d]">
                      Account Settings
                    </Link>
                  </div>
                </div>
              )}

              {/* User Controls Section */}
              {user.role === 'user' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-[#88a07d]">User Controls</h3>
                  <div className="space-y-4">
                    <Link to="/profile" className="block p-4 bg-[#3a3a3a] text-[#e3e4d9] rounded-xl hover:bg-[#88a07d]">
                      Edit Profile
                    </Link>
                    <Link to="/user-settings" className="block p-4 bg-[#3a3a3a] text-[#e3e4d9] rounded-xl hover:bg-[#88a07d]">
                      Account Settings
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Back Button */}
          <div className="mt-8 text-center">
            <Link to="/" className="text-[#8cb3af] hover:underline">
              ← Back to Home
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default Dashboard;
