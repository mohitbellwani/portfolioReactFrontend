import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Circle } from 'lucide-react';
import { getThemeClasses } from '../utils/theme';

const ImageCarousel = ({ images, isDark }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const theme = getThemeClasses(isDark);

  if (!images || images.length === 0) return null;

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div className={`relative group w-full h-[300px] md:h-[400px] mb-8 rounded-xl overflow-hidden border ${theme.cardBorder}`}>
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
        className={`absolute top-1/2 -translate-y-1/2 left-4 p-2 rounded-full bg-black/30 text-white hover:bg-black/50 backdrop-blur-sm transition-colors cursor-pointer z-10`}
      >
        <ChevronLeft size={24} />
      </button>

      {/* Right Arrow */}
      <button 
        onClick={nextSlide}
        className={`absolute top-1/2 -translate-y-1/2 right-4 p-2 rounded-full bg-black/30 text-white hover:bg-black/50 backdrop-blur-sm transition-colors cursor-pointer z-10`}
      >
        <ChevronRight size={24} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {images.map((_, slideIndex) => (
          <button
            key={slideIndex}
            onClick={() => goToSlide(slideIndex)}
            className={`transition-all duration-300 ${
              currentIndex === slideIndex 
              ? 'text-white scale-125' 
              : 'text-white/50 hover:text-white/80'
            }`}
          >
            <Circle size={10} fill="currentColor" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ImageCarousel;