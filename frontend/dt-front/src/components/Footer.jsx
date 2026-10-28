import React from 'react';
import { SITE } from '../config';

export default function Footer() {
  return (
    <footer className="w-full bg-black text-white py-8  border-t border-gray-900">
      <div className="max-w-7xl mx-auto px-6 flex flex-col items-center gap-4">
        
        {/* Contact Links */}
        <div className="flex flex-col md:flex-row gap-6 md:gap-12 text-sm font-medium">
          {/* Phone */}
          <a 
            href={SITE.phoneLink} 
            className="flex items-center gap-2 hover:text-gray-400 transition-colors"
          >
            <span className="text-lg">📞</span>
            <span>{SITE.phoneDisplay}</span>
          </a>

          {/* Email */}
          <a 
            href={`mailto:${SITE.email}`} 
            className="flex items-center gap-2 hover:text-gray-400 transition-colors"
          >
            <span className="text-lg">✉️</span>
            <span>{SITE.email}</span>
          </a>
        </div>

        {/* Divider line */}
        <div className="w-16 h-px bg-gray-800 my-2"></div>

        {/* Copyright */}
        <p className="text-xs text-gray-500 tracking-widest uppercase">
          © {new Date().getFullYear()} Dušan Team
        </p>
      </div>
    </footer>
  );
}