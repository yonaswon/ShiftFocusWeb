'use client'
import React, { useState, useRef, useEffect } from "react";
import { FaRegUserCircle } from "react-icons/fa";
import { useAuth } from "../Auth/AuthProvider";

const ProfileMenu = () => {
  const [showLogout, setShowLogout] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const {logout} = useAuth()

  // Handle outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowLogout(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setShowLogout((prev) => !prev)}
        className="p-2 text-gray-400 hover:text-white"
      >
        <FaRegUserCircle className="text-2xl" />
      </button>

      {showLogout && (
        <div className="absolute right-0 mt-2 w-32 bg-gray-800 border border-gray-600 rounded shadow-lg z-50">
          <button
            onClick={() => {
              // Add logout logic here
              logout()
              setShowLogout(false);
            }}
            className="w-full px-4 py-2 text-left text-white hover:bg-gray-700"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;
