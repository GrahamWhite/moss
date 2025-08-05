import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

function VerifyEmail() {
  const { token } = useParams();
  const [status, setStatus] = useState('Verifying...');

  useEffect(() => {
    async function verify() {
      try {
        const res = await fetch(`https://flumpy.ca/api/verify/${token}`);
        const data = await res.json();
        if (res.ok) {
          setStatus('✅ Email verified! You can now log in.');
        } else {
          setStatus(`❌ Verification failed: ${data.error}`);
        }
      } catch {
        setStatus('❌ Server error during verification.');
      }
    }
    verify();
  }, [token]);

  return (
    <div className="verify-page">
      <h1>{status}</h1>
      <Link to="/login">Go to Login</Link>
    </div>
  );
}

export default VerifyEmail;
