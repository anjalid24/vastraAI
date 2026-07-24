import { useState, useEffect } from 'react';

/**
 * BackgroundSlideshow — smooth crossfading background image slideshow component
 * Cycles through heritage textile images with Ken-Burns scale effect & gradient overlay.
 */
export default function BackgroundSlideshow({
  images = [
    '/images/bandhani.png',
    '/images/ikat.png',
    '/images/patola.png',
    '/images/hero_generated.png',
  ],
  labels = ['Bandhani Silk', 'Sambalpuri Ikat', 'Patan Patola', 'AI Fusion Weave'],
  interval = 4000,
  opacity = 0.35,
  overlayGradient = 'linear-gradient(180deg, rgba(247,239,225,0.5) 0%, rgba(247,239,225,0.88) 100%)',
  className = '',
  style = {},
  showIndicators = false,
  showLabelBadge = false,
}) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!images || images.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, interval);
    return () => clearInterval(timer);
  }, [images, interval]);

  return (
    <div
      className={`v-bg-slideshow position-absolute inset-0 w-100 h-100 overflow-hidden ${className}`}
      style={{ top: 0, left: 0, right: 0, bottom: 0, zIndex: 0, pointerEvents: 'none', ...style }}
      aria-hidden="true"
    >
      {images.map((src, index) => {
        const isActive = index === currentIndex;
        return (
          <div
            key={src}
            className="v-slide-item position-absolute w-100 h-100"
            style={{
              top: 0, left: 0, right: 0, bottom: 0,
              opacity: isActive ? opacity : 0,
              transition: 'opacity 1.5s ease-in-out, transform 5.5s ease-out',
              transform: isActive ? 'scale(1.05)' : 'scale(1.0)',
              zIndex: isActive ? 1 : 0,
            }}
          >
            <img
              src={src}
              alt=""
              className="w-100 h-100 object-fit-cover"
              style={{ filter: 'saturate(1.25) contrast(1.1)' }}
            />
          </div>
        );
      })}

      {/* Customizable Gradient Overlay */}
      {overlayGradient && (
        <div
          className="position-absolute w-100 h-100"
          style={{ top: 0, left: 0, right: 0, bottom: 0, background: overlayGradient, zIndex: 2 }}
        />
      )}

      {/* Slide Badge / Indicators */}
      {(showIndicators || showLabelBadge) && images.length > 1 && (
        <div
          className="position-absolute bottom-0 start-50 translate-middle-x mb-3 d-flex align-items-center gap-3 px-3 py-1 rounded-pill bg-white shadow-sm border"
          style={{ zIndex: 5, pointerEvents: 'auto', opacity: 0.95 }}
        >
          {showLabelBadge && labels[currentIndex] && (
            <span className="small fw-semibold text-dark me-1" style={{ fontSize: '0.75rem' }}>
              ✨ Live Pattern: <span className="text-primary">{labels[currentIndex]}</span>
            </span>
          )}
          {showIndicators && (
            <div className="d-flex gap-1 align-items-center">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  className={`btn p-0 border-0 transition-all ${idx === currentIndex ? 'bg-primary' : 'bg-secondary opacity-40'
                    }`}
                  style={{
                    width: idx === currentIndex ? 18 : 6,
                    height: 6,
                    borderRadius: 3,
                  }}
                  title={`Switch to slide ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
