'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch(`${BASE_URL}/api/register/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || 'Registration failed');
      }

      setSuccess(true);
      // Optionally, auto-login or redirect user to /login
      // e.g., router.push('/login');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-4 text-brandGreen">Register</h1>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        {success && (
          <p className="text-green-500 mb-2">
            Account created! You can now <a className="underline" href="/login">log in</a>.
          </p>
        )}
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1">Username</label>
            <input
              className="w-full p-2 border rounded text-brandGreen"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Email</label>
            <input
              className="w-full p-2 border rounded text-brandGreen"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Password</label>
            <input
              className="w-full p-2 border rounded text-brandGreen"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button className="bg-brandGreen text-white px-4 py-2 rounded hover:bg-brandGreen-dark">
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}
