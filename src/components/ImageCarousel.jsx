import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Circle } from 'lucide-react';
import { getThemeClasses } from '../utils/theme';

const ImageCarousel = ({ images, isDark }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const theme = getThemeClasses(isDark);

  if (!images || images.length === 0) return null;

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  useEffect(() => {
    if (!isHovered) {
      const intervalId = setInterval(nextSlide, 3000); // Swap every 3 seconds
      return () => clearInterval(intervalId);
    }
  }, [currentIndex, isHovered, nextSlide]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div 
      className={`relative group w-full h-[300px] md:h-[400px] mb-8 rounded-xl overflow-hidden border ${theme.cardBorder}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main Image */}
      <div 
        className="w-full h-full bg-cover bg-center transition-all duration-500 ease-out"
        style={{ backgroundImage: `url(${images[currentIndex]})` }}
      >
        {/* Blur backdrop for sizing */}
        <div className={`w-full h-full backdrop-blur-3xl bg-black/50 flex items-center justify-center`}>
           <img 
              src={images[currentIndex]} 
              alt={`Slide ${currentIndex}`} 
              className="max-h-full max-w-full object-contain"
              onError={(e) => {
                  e.currentTarget.style.display = 'none';
              }}
           />
        </div>
      </div>

      {/* Left Arrow */}
      <button 
        onClick={prevSlide}
        className={`absolute top-1/2 -translate-y-1/2 left-4 p-2 rounded-full bg-black/30 text-white hover:bg-black/50 backdrop-blur-sm transition-all duration-300 cursor-pointer z-10 opacity-0 group-hover:opacity-100`}
      >
        <ChevronLeft size={24} />
      </button>

      {/* Right Arrow */}
      <button 
        onClick={nextSlide}
        className={`absolute top-1/2 -translate-y-1/2 right-4 p-2 rounded-full bg-black/30 text-white hover:bg-black/50 backdrop-blur-sm transition-all duration-300 cursor-pointer z-10 opacity-0 group-hover:opacity-100`}
      >
        <ChevronRight size={24} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
        {images.map((_, slideIndex) => (
          <button
            key={slideIndex}
            onClick={() => goToSlide(slideIndex)}
            className={`h-2 rounded-full transition-all duration-300 ${
              currentIndex === slideIndex ? 'w-6 bg-white' : 'w-2 bg-white/50 hover:bg-white/80'
            }`}
          >
          </button>
        ))}
      </div>
    </div>
  );
};

export default ImageCarousel;