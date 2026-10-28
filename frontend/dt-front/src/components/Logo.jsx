import React from "react";
import { Link } from "react-router-dom";

export default function Logo() {
  return (
    <Link
      to="/"
      className="flex items-center gap-3 cursor-pointer select-none"
    >
      {/* Logo Image */}
      <div className="w-13 h-13 flex items-center justify-center overflow-hidden">
        <img
          src="/logo/logo.jpg"
          alt="Dušan Team Logo"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Logo Text */}
      <span className="text-white font-bold text-lg drop-shadow-md">
        Dušan Team
      </span>
    </Link>
  );
}
