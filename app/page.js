"use client";

import Link from "next/link";
import { useAuthStore } from "../store/useAuthStore";

// Material UI icons
import BookIcon from "@mui/icons-material/Book";
import ScienceIcon from "@mui/icons-material/Science";
import CalculateIcon from "@mui/icons-material/Calculate";
import LaptopChromebookIcon from "@mui/icons-material/LaptopChromebook";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import EditIcon from "@mui/icons-material/Edit";

const floatingIconsTop = [
  {
    component: <BookIcon color="branGreen-light" fontSize="large" />,
    delay: 0,
  },
  { component: <ScienceIcon color="orange" fontSize="large" />, delay: 2 },
  {
    component: <CalculateIcon color="brandGreen-dark" fontSize="large" />,
    delay: 4,
  },
];

const floatingIconsBottom = [
  { component: <LaptopChromebookIcon fontSize="large" />, delay: 0 },
  { component: <AutoAwesomeIcon fontSize="large" />, delay: 2 },
  { component: <EditIcon fontSize="large" />, delay: 4 },
];

export default function HomePage() {
  const token = useAuthStore((state) => state.token);

  return (
    <main className="relative min-h-screen bg-gray-50 text-gray-900">
      {/* Container for icons */}
      <div className="absolute inset-0 w-screen overflow-hidden pointer-events-none">
        {/* Top Icons */}
        {floatingIconsTop.map((iconObj, idx) => (
          <span
            key={`top-${idx}`}
            className="absolute top-10 animate-floatR2L"
            style={{ animationDelay: `${iconObj.delay}s` }}
          >
            {iconObj.component}
          </span>
        ))}

        {/* Bottom Icons */}
        {floatingIconsBottom.map((iconObj, idx) => (
          <span
            key={`bot-${idx}`}
            className="absolute bottom-10 animate-floatL2R"
            style={{ animationDelay: `${iconObj.delay}s` }}
          >
            {iconObj.component}
          </span>
        ))}
      </div>

      {/* Main Content in center */}
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="p-8 text-center">
          <h1
            className="text-4xl md:text-6xl font-bold mb-6"
            data-test="hero-heading"
          >
            Class<span className="text-brandGreen">Catch</span>
          </h1>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            A smarter way to monitor class enrollment, track availability, and
            plan your academic journey.
          </p>

          <div className="flex flex-col md:flex-row justify-center items-center gap-4">
            <Link
              href="/classes"
              className="bg-brandGreen text-white px-6 py-3 rounded hover:bg-brandGreen-dark transition-colors"
            >
              Browse Classes
            </Link>
            {token ? (
              <Link
                href="/profile"
                className="bg-gray-200 text-gray-800 px-6 py-3 rounded hover:bg-gray-300 transition-colors"
              >
                View Profile
              </Link>
            ) : (
              <Link
                href="/login"
                className="bg-gray-200 text-gray-800 px-6 py-3 rounded hover:bg-gray-300 transition-colors"
                data-test='login-link'
              >
                Login
              </Link>
            )}
            <Link
              href="/plan"
              className="bg-white border-2 border-brandGreen text-brandGreen px-6 py-3 rounded hover:bg-brandGreen-light transition-colors"
            >
              My Planning
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
