import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Logo from "./Logo";

export default function Header() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navItems = [
    { name: "Početna", page: "/" },
    { name: "Galerija", page: "/gallery" },
    { name: "O nama", page: "/about" },
    { name: "Kontakt", page: "/contact" },
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-50 shadow-md backdrop-blur-2xl bg-gray-800/50 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-20 px-6">

        {/* LEFT: Logo */}
        <Logo />

        {/* Desktop nav */}
        {!isMobile && (
          <nav className="flex gap-10 font-semibold text-white text-lg">
            {navItems.map(item => (
              <Link
                key={item.page}
                to={item.page}
                className="hover:text-gray-200"
              >
                {item.name}
              </Link>
            ))}
          </nav>
        )}

        {/* Mobile menu icon */}
        {isMobile && (
          <button
            onClick={() => setMenuOpen(prev => !prev)}
            className="text-white text-3xl focus:outline-none"
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        )}
      </div>

      {/* Mobile dropdown */}
      {isMobile && menuOpen && (
        <div className="bg-gray-900/70 backdrop-blur-xl px-6 py-4 flex flex-col gap-4 text-white font-semibold text-lg shadow-lg animate-slideDown">
          {navItems.map(item => (
            <Link
              key={item.page}
              to={item.page}
              onClick={() => setMenuOpen(false)}
              className="py-2 px-1 rounded hover:bg-gray-700/40 transition-all"
            >
              {item.name}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
