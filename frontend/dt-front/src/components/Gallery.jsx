import React, { useEffect, useState } from "react";
import { API_URL } from "../config";

export default function Gallery({ setShowHeader }) {
  const [images, setImages] = useState([]);
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetch(`${API_URL}/api/gallery`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => setImages(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Failed to load gallery", err));
  }, []);

  const openSlider = (index) => {
    setCurrentIndex(index);
    setIsSliderOpen(true);
    document.body.style.overflow = "hidden";
    if (setShowHeader) setShowHeader(false);
  };

  const closeSlider = () => {
    setIsSliderOpen(false);
    document.body.style.overflow = "auto";
    if (setShowHeader) setShowHeader(true);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div
  className="relative w-full min-h-screen pt-32 pb-10"
  style={{
    backgroundImage: "url('/gallery/gallery-background.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    // Remove backgroundAttachment: "fixed" or change it to:
    backgroundAttachment: "scroll", 
  }}
>
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <h2 className="text-4xl font-bold text-white mb-8 [text-shadow:_2px_2px_4px_rgba(0,0,0,0.5)]">
          Galerija
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {images.map((img, index) => (
            <div 
              key={img.id} 
              className="overflow-hidden rounded-xl bg-gray-900 shadow-lg group cursor-pointer"
              onClick={() => openSlider(index)}
            >
              <img
                src={img.url}
                alt={`Gallery ${index + 1}`}
                className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Modern Slider Overlay */}
      {isSliderOpen && images[currentIndex] && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md transition-all duration-300"
          onClick={closeSlider}
        >
          {/* Close Button */}
          <button 
            className="absolute top-6 right-6 text-white/70 hover:text-white text-4xl z-[110] transition-colors"
            onClick={closeSlider}
          >
            ✕
          </button>

          {/* Slider Container */}
          <div className="relative w-full max-w-5xl h-[90vh] flex flex-col items-center justify-center p-4">
            
            {/* Image Wrapper - The fix for portrait images is here */}
            <div className="relative w-full h-full flex flex-col items-center justify-center" onClick={(e) => e.stopPropagation()}>
              <img
                src={images[currentIndex].url}
                alt="Slide"
                className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl transition-all duration-500"
              />
              
              {/* Counter / Indicator */}
              <div className="mt-6 px-4 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full text-sm font-medium tracking-widest">
                {currentIndex + 1} <span className="text-white/40 mx-1">/</span> {images.length}
              </div>
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={prevImage}
              className="absolute left-4 md:-left-12 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/20 border border-white/10 text-white transition-all group"
            >
              <span className="text-2xl group-hover:-translate-x-1 transition-transform">❮</span>
            </button>

            <button
              onClick={nextImage}
              className="absolute right-4 md:-right-12 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/20 border border-white/10 text-white transition-all group"
            >
              <span className="text-2xl group-hover:translate-x-1 transition-transform">❯</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}