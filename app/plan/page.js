// app/plan/page.js
"use client";
import Link from "next/link";

export default function PlanningLandingPage() {
  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen text-gray-900">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-4">Planning Dashboard</h1>
        <p className="text-gray-700 mb-4">
          Welcome to your planning dashboard! From here, you can explore majors, 
          manage your schedules, and keep track of your academic progress.
        </p>
        <Link
          href="/plan/majors"
          className="inline-block bg-brandGreen text-white px-4 py-2 rounded hover:bg-brandGreen-dark"
        >
          View Majors & Minors
        </Link>
      </div>
    </div>
  );
}