// components/SearchBar.jsx
"use client";
import { useEffect, useState } from "react";
import FavoriteIcon from "@mui/icons-material/Favorite";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import { IconButton } from "@mui/material";

export default function SearchBar({ onSearchChange }) {
  const [query, setQuery] = useState(""); // local state for search input
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Debounce 500ms
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(query);
    }, 500);
    return () => clearTimeout(timer);
  }, [query, onSearchChange]);

  return (
    <div className="flex items-center space-x-2">
      {/* Mobile filter button */}
      <button
        onClick={() => setMobileFilterOpen(true)}
        className="md:hidden p-2"
      >
        {/* <img src="/filter-icon.png" alt="Filters" className="w-6 h-6" /> */}
      </button>

      {/* Search input */}
      <input
        type="text"
        placeholder="Search classes..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="px-4 py-2 rounded-lg border focus:outline-none"
      />

      {/* Quick lookup icons (favorites, hot classes) */}
      <div className="p-2">
        {/* Favorites Icon */}
        <IconButton aria-label="Favorites">
          <FavoriteIcon sx={{ color: "#38a169" }} /> {/* brandGreen.DEFAULT */}
        </IconButton>

        {/* Hot Classes Icon */}
        <IconButton aria-label="Hot Classes">
          <WhatshotIcon sx={{ color: "#f6993f" }} /> {/* Orange */}
        </IconButton>
      </div>

      {/* Mobile filter drawer logic (if you implement) */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-end">
          <div className="w-64 bg-white p-4">
            <button onClick={() => setMobileFilterOpen(false)}>Close</button>
            {/* Reuse Filters here */}
          </div>
        </div>
      )}
    </div>
  );
}
