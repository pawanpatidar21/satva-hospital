import React, { useState, useEffect, useCallback } from 'react';
import { FaChevronLeft, FaChevronRight, FaImages } from 'react-icons/fa';

const BeforeAfterCarousel = ({ items, sectionTitle, accentColor = 'primary' }) => {
  const [index, setIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const goPrev = useCallback(() => {
    setIndex((i) => (i <= 0 ? items.length - 1 : i - 1));
  }, [items.length]);

  const goNext = useCallback(() => {
    setIndex((i) => (i >= items.length - 1 ? 0 : i + 1));
  }, [items.length]);

  const minSwipeDistance = 50;
  const onTouchStart = (e) => setTouchStart(e.targetTouches[0].clientX);
  const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > minSwipeDistance) goNext();
    else if (distance < -minSwipeDistance) goPrev();
    setTouchStart(null);
    setTouchEnd(null);
  };

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [goPrev, goNext]);

  if (!items || items.length === 0) return null;

  const item = items[index];
  const isPrimary = accentColor === 'primary';

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex items-center justify-center gap-1.5 mb-1.5 sm:mb-2">
        <div className={`p-1 rounded-lg ${isPrimary ? 'bg-primary-100' : 'bg-secondary-100'}`}>
          <FaImages className={isPrimary ? 'text-primary-600' : 'text-secondary-600'} />
        </div>
        <h3 className="text-lg sm:text-xl font-bold text-gray-900">{sectionTitle}</h3>
      </div>

      <div
        className="relative rounded-lg sm:rounded-xl overflow-hidden shadow-xl border border-gray-200 bg-white"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div className="relative aspect-[4/3] sm:aspect-[16/10] bg-gray-100">
          <div className="relative w-full h-full">
            <img
              src={item.image}
              alt={item.title || 'Treatment result'}
              className="w-full h-full object-cover"
              onError={(e) => {
                if (item.placeholderImage) e.target.src = item.placeholderImage;
              }}
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-center py-1 text-sm font-semibold">
              {item.title || 'Result'}
            </div>
          </div>

          {/* Caption overlay (top) - minimal padding so image shows more */}
          <div className="absolute top-0 left-0 right-0 p-1.5 sm:p-2 bg-gradient-to-b from-black/50 to-transparent">
            <p className="text-white text-sm sm:text-base font-medium drop-shadow-md">{item.title}</p>
            {item.subtitle && (
              <p className="text-white/90 text-xs sm:text-sm">{item.subtitle}</p>
            )}
          </div>
        </div>

        {/* Prev / Next */}
        <button
          type="button"
          onClick={goPrev}
          aria-label="Previous"
          className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/95 shadow-lg flex items-center justify-center text-gray-700 hover:bg-white hover:text-primary-600 transition-all z-10"
        >
          <FaChevronLeft className="text-lg sm:text-xl" />
        </button>
        <button
          type="button"
          onClick={goNext}
          aria-label="Next"
          className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/95 shadow-lg flex items-center justify-center text-gray-700 hover:bg-white hover:text-primary-600 transition-all z-10"
        >
          <FaChevronRight className="text-lg sm:text-xl" />
        </button>
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-2 mt-1.5 sm:mt-2">
        {items.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all ${
              i === index
                ? isPrimary
                  ? 'bg-primary-600 scale-125'
                  : 'bg-secondary-600 scale-125'
                : 'bg-gray-300 hover:bg-gray-400'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default BeforeAfterCarousel;
