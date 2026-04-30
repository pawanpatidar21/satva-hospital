import React, { useState, useEffect, useCallback, useRef } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const AUTOPLAY_INTERVAL = 5000;
const TRANSITION_MS = 600;

const TreatmentPhotosCarousel = ({ items }) => {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const touchStart = useRef(null);
  const touchEnd = useRef(null);

  const len = items?.length || 0;
  const safeIndex = len ? ((index % len) + len) % len : 0;

  const goTo = useCallback(
    (next, dir = 1) => {
      if (!len || isTransitioning) return;
      const target = ((next % len) + len) % len;
      if (target === safeIndex) return;
      setDirection(dir);
      setIsTransitioning(true);
      setIndex(next);
    },
    [len, isTransitioning, safeIndex]
  );

  const goPrev = useCallback(() => {
    goTo(safeIndex - 1, -1);
  }, [safeIndex, goTo]);

  const goNext = useCallback(() => {
    goTo(safeIndex + 1, 1);
  }, [safeIndex, goTo]);

  // Auto-advance
  useEffect(() => {
    if (!len || isPaused) return;
    const id = setInterval(() => goNext(), AUTOPLAY_INTERVAL);
    return () => clearInterval(id);
  }, [len, isPaused, safeIndex, goNext]);

  // Reset transitioning after animation
  useEffect(() => {
    if (!isTransitioning) return;
    const t = setTimeout(() => setIsTransitioning(false), TRANSITION_MS);
    return () => clearTimeout(t);
  }, [isTransitioning, index]);

  // Touch
  const onTouchStart = (e) => {
    touchStart.current = e.targetTouches[0].clientX;
    touchEnd.current = null;
  };
  const onTouchMove = (e) => {
    touchEnd.current = e.targetTouches[0].clientX;
  };
  const onTouchEnd = () => {
    if (touchStart.current == null || touchEnd.current == null) return;
    const diff = touchStart.current - touchEnd.current;
    if (Math.abs(diff) > 50) diff > 0 ? goNext() : goPrev();
  };

  // Keyboard
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [goPrev, goNext]);

  if (!items || len === 0) return null;

  const current = items[safeIndex];
  const imgSrc = current.image;
  const fallback = current.placeholder;

  return (
    <section
      aria-label="General treatment photos"
      className="relative w-full overflow-hidden bg-gradient-to-b from-gray-100 to-gray-200 py-8 sm:py-10 md:py-12 flex justify-center items-center"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Taller, modern card-style carousel */}
      <div
        className="relative w-full max-w-2xl sm:max-w-3xl md:max-w-4xl aspect-[4/3] sm:aspect-[16/10] md:aspect-[16/9] min-h-[280px] sm:min-h-[320px] md:min-h-[380px] lg:min-h-[420px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl ring-1 ring-black/5"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div className="absolute inset-0">
          <img
            key={safeIndex}
            src={imgSrc}
            alt={current.caption || 'Treatment'}
            className="w-full h-full object-cover transition-all duration-500 ease-out"
            onError={(e) => {
              if (fallback) e.target.src = fallback;
            }}
            style={{ transitionDuration: `${TRANSITION_MS}ms` }}
          />
          {/* Modern gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 md:p-8 flex justify-center items-end">
            <p className="text-white text-base sm:text-lg md:text-xl lg:text-2xl font-semibold tracking-tight drop-shadow-md text-center">
              {current.caption}
            </p>
          </div>
        </div>

        {/* Modern nav buttons: glass style */}
        <button
          type="button"
          onClick={goPrev}
          aria-label="Previous photo"
          className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-white/80 backdrop-blur-md hover:bg-white border border-white/50 shadow-lg flex items-center justify-center text-gray-700 hover:text-primary-600 transition-all duration-200 hover:scale-105 active:scale-95"
        >
          <FaChevronLeft className="text-lg sm:text-xl md:text-2xl" />
        </button>
        <button
          type="button"
          onClick={goNext}
          aria-label="Next photo"
          className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-white/80 backdrop-blur-md hover:bg-white border border-white/50 shadow-lg flex items-center justify-center text-gray-700 hover:text-primary-600 transition-all duration-200 hover:scale-105 active:scale-95"
        >
          <FaChevronRight className="text-lg sm:text-xl md:text-2xl" />
        </button>

        {/* Dots - pill style */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2 p-2 rounded-full bg-black/30 backdrop-blur-sm">
          {items.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i, i > safeIndex ? 1 : -1)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === safeIndex ? 'w-6 bg-white' : 'w-2 bg-white/50 hover:bg-white/80'
              }`}
            />
          ))}
        </div>

        {/* Auto-play - minimal pill */}
        {len > 1 && (
          <div className="absolute top-3 right-3 z-10 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-sm text-white/95 text-xs font-medium border border-white/10">
            <span className={`w-2 h-2 rounded-full ${isPaused ? 'bg-amber-400/90' : 'bg-emerald-400 animate-pulse'}`} />
            {isPaused ? 'Paused' : 'Auto'}
          </div>
        )}
      </div>
    </section>
  );
};

export default TreatmentPhotosCarousel;
