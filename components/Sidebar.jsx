"use client";

import { useState, useRef, useEffect } from "react";
import Filters from "./Filters";
import FocusLock from "react-focus-lock"; // optional library for focus management

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const overlayRef = useRef(null);

  // Close sidebar when user clicks ESC
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && mobileOpen) {
        setMobileOpen(false);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [mobileOpen]);

  // Optional: handle click outside the sidebar on desktop
  // if you want a similar behavior, you can do so with a ref.

  return (
    <>
      {/* Mobile button to open sidebar */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-brandGreen text-white p-2 rounded shadow"
        onClick={() => setMobileOpen(true)}
        aria-label="Open Filters"
      >
        Filters
      </button>

      {/* Desktop Sidebar */}
      <aside
        className={`
          ${collapsed ? "w-16" : "w-64"}
          hidden md:flex flex-col h-full bg-brandGreen-light transition-all duration-300
        `}
        aria-label="Desktop Filters"
      >
        <div className="flex items-center justify-between p-4">
          <span className={`${collapsed ? "hidden" : "block"} font-bold`}>
            Filters
          </span>
          <button
            onClick={() => setCollapsed(!collapsed)}
            aria-expanded={!collapsed}
            aria-label="Toggle filter sidebar"
          >
            <img src="/collapse-icon.png" alt="Toggle" className="w-6 h-6" />
          </button>
        </div>
        {!collapsed && (
          <div className="overflow-auto p-4">
            <Filters />
          </div>
        )}
      </aside>

      {/* Mobile Overlay and Sidebar */}
      {mobileOpen && (
        <div
          ref={overlayRef}
          className="fixed inset-0 z-50 flex"
        >
          {/* Overlay */}
          <div
            className="flex-1 bg-black bg-opacity-50 backdrop-blur-sm animate-fadeIn"
            onClick={() => setMobileOpen(false)}
          />

          {/* Slide-in Sidebar */}
          <FocusLock disabled={!mobileOpen}>
            <div
              className="
                w-64 bg-white h-full flex flex-col shadow-lg
                animate-slideInRight
              "
              aria-label="Mobile Filters"
              aria-modal="true"
              role="dialog"
            >
              <div className="flex justify-between p-4 border-b border-gray-200">
                <h3 className="font-bold text-gray-900">Filters</h3>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                  aria-label="Close Filters"
                >
                  Close
                </button>
              </div>
              <div className="overflow-auto p-4">
                <Filters />
              </div>
            </div>
          </FocusLock>
        </div>
      )}
    </>
  );
}
