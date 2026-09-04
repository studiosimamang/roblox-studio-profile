import React, { useState } from "react";
import { studioInfo } from "../data/studioData";

export default function Navbar({ activeTab, setActiveTab }) {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Home", id: "hero" },
    { name: "Games", id: "games" },
    { name: "About", id: "about" },
    { name: "Struktur", id: "structure" },
    { name: "Daftar", id: "register" },
    { name: "KTA", id: "kta" },
    { name: "Team", id: "team" },
  ];

  return (
    <nav className="bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand / Logo (Klik logo kembali ke Home) */}
        <div
          onClick={() => setActiveTab("hero")}
          className="flex items-center space-x-3 cursor-pointer"
        >
          <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-700 p-0.5 bg-slate-900 flex-shrink-0">
            <img
              src={studioInfo.logo}
              alt={studioInfo.name}
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <span className="font-extrabold text-sm sm:text-base tracking-wider uppercase">
            <span className="text-red-500">STUDIO </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-100 via-blue-400 to-blue-600">
              SIMAMANG
            </span>
          </span>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center justify-center space-x-6 text-sm font-semibold tracking-wide flex-1">
          {navLinks.map((link) => {
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => setActiveTab(link.id)}
                className={`relative py-1 transition-colors duration-200 cursor-pointer ${
                  isActive
                    ? "text-red-500 font-bold"
                    : "text-slate-300 hover:text-red-400"
                }`}
              >
                {link.name}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-red-500 rounded-full shadow-sm shadow-red-500/50"></span>
                )}
              </button>
            );
          })}
        </div>

        {/* CTA Button */}
        <div className="hidden md:flex justify-end min-w-[150px]">
          <a
            href={studioInfo.discordUrl}
            target="_blank"
            rel="noreferrer"
            className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white px-4 py-2 rounded-lg font-semibold text-xs uppercase tracking-wider transition shadow-lg shadow-red-600/20 border border-red-500/40"
          >
            Join Discord
          </a>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-slate-300 hover:text-white focus:outline-none p-2"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-slate-950 border-b border-slate-800 px-4 pt-2 pb-6 space-y-2">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                setActiveTab(link.id);
                setIsOpen(false);
              }}
              className={`block w-full text-left py-2 font-medium text-sm ${
                activeTab === link.id
                  ? "text-red-500 font-bold"
                  : "text-slate-300 hover:text-red-400"
              }`}
            >
              {link.name}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}
