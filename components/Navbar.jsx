// components/Navbar.jsx
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-4 py-3 bg-brandGreen text-white shadow">
      <div className="flex items-center space-x-4">
        <span className="text-lg font-bold">
          <Link href="/" className="hover:text-brandGreen-light transition-colors">
            ClassCatch
          </Link>
        </span>
        {/* Navigation links on larger screens */}
        <div className="hidden md:flex space-x-4">
          <Link
            href="/classes"
            className="hover:text-brandGreen-light transition-colors"
          >
            Classes
          </Link>
          {/* TEMP REMOVING -- FINISH LATER */}
          {/* <Link
            href="/research"
            className="hover:text-brandGreen-light transition-colors"
          >
            Research
          </Link> */}
          <Link
            href="/plan"
            className="hover:text-brandGreen-light transition-colors"
          >
            Planning
          </Link>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        {/* Profile icon */}
        <Link
          href="/profile"
          className="hover:text-brandGreen-light transition-colors"
        >
          <img
            src="/icons/profile-light.png"
            alt="Profile"
            className="w-8 h-8 rounded-full"
          />
        </Link>
      </div>
    </nav>
  );
}
