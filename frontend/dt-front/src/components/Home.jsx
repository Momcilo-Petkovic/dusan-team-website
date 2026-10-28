import React, { useState, useEffect } from "react";
import { API_URL } from "../config";

export default function Home() {
  const [slides, setSlides] = useState([]);
  const [current, setCurrent] = useState(0);
  const [fadeText, setFadeText] = useState(true);

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const res = await fetch(`${API_URL}/api/slides`);
        if (!res.ok) throw new Error("Failed to fetch slides");
        const data = await res.json();
        setSlides(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load slides:", err);
        setSlides([]);
      }
    };
    fetchSlides();
  }, []);

  useEffect(() => {
    if (slides.length <= 1) return;

    // Postavljeno na 3000ms (3 sekunde)
    let timeout;
    const interval = setInterval(() => {
      setFadeText(false);
      timeout = setTimeout(() => {
        setCurrent((prev) => (prev + 1) % slides.length);
        setFadeText(true);
      }, 300); // Smanjeno da brže zameni tekst
    }, 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [slides]);

  if (!slides.length) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-900 text-white">
        Nema dostupnih slajdova
      </div>
    );
  }

  return (
    <div className="w-full h-screen overflow-hidden relative">
      {/* 1. Slike */}
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((slide, i) => (
          <img
            key={i}
            src={slide.imageUrl}
            alt={`Slide ${i + 1}`}
            className="w-full h-screen object-cover flex-shrink-0"
          />
        ))}
      </div>

      {/* 2. Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/70 pointer-events-none z-10" />

      {/* 3. Tekst */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
        <h1
          className={`text-white text-4xl md:text-6xl font-bold text-center px-4 transition-opacity duration-700 [text-shadow:_2px_2px_10px_rgba(0,0,0,1)] ${
            fadeText ? "opacity-100" : "opacity-0"
          }`}
        >
          {slides[current]?.text}
        </h1>
      </div>
    </div>
  );
}