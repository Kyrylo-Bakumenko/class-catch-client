"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter();

  const setToken = useAuthStore((state) => state.setToken);

  const BASE_URL = process.env.BACKEND_URL || "http://localhost:8000";

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await fetch(`${BASE_URL}/api/token-auth/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        throw new Error("Invalid credentials");
      }

      const data = await res.json();
      // data.token should be returned from the DRF token auth endpoint
      setToken(data.token);

      // Navigate to profile
      router.push("/profile");
    } catch (err) {
      setError(err.message);
    }
  };

  // const handleCasLogin = () => {
  //   // full reload and redirect to CAS
  //   window.location.href = "http://localhost:8000/cas/login/";
  // };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-4 text-brandGreen">Login</h1>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-4">
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
            <label className="block text-gray-700 mb-1">Password</label>
            <input
              className="w-full p-2 border rounded text-brandGreen"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-between flex-wrap">
            <button className="bg-brandGreen text-white px-4 py-2 rounded hover:bg-brandGreen-dark">
              Log In
            </button>
            <button
              onClick={handleCasLogin}
              className="bg-brandGreen text-white px-4 py-2 rounded cursor-not-allowed bg-opacity-50"
              disabled={true}
            >
              Login with Dartmouth SSO
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
