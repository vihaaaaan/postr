import { useState, useEffect } from 'react';

export default function WelcomeModal() {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const [isAnimatingIn, setIsAnimatingIn] = useState(false);

  const handleClose = () => {
    setIsAnimatingOut(true);
    setTimeout(() => {
      setIsVisible(false);
    //   localStorage.setItem('hasSeenWelcome', 'true');
    }, 400);
  };

  useEffect(() => {
    // Check if user has seen the welcome modal before
    // const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');
    // if (!hasSeenWelcome) {
      // Small delay before showing for smooth entrance
      setTimeout(() => {
        setIsVisible(true);
        // Trigger animation slightly after visibility
        setTimeout(() => setIsAnimatingIn(true), 50);
      }, 300);
    // }

    // Add escape key listener
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  if (!isVisible) return null;

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm transition-opacity duration-700 ${
        isAnimatingOut ? 'opacity-0' : isAnimatingIn ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={handleClose}
    >
      <div 
        className={`relative w-full max-w-xl mx-4 transition-all duration-1000 ${
          isAnimatingOut 
            ? 'scale-95 opacity-0 translate-y-8' 
            : isAnimatingIn 
            ? 'scale-100 opacity-100 translate-y-0' 
            : 'scale-90 opacity-0 -translate-y-8'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Minimal close button */}
        <button
          onClick={handleClose}
          className="absolute -top-10 right-0 text-white/50 hover:text-white transition-colors duration-300 text-xs tracking-[0.3em] uppercase font-light"
          aria-label="Close welcome modal"
        >
          Close
        </button>

        {/* Main content card with film strip background */}
        <div className="relative bg-[#F2F1ED] overflow-hidden shadow-2xl rounded-lg">
          {/* Film strip background effect */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-transparent via-brand to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 h-3 bg-gradient-to-r from-transparent via-brand to-transparent"></div>
            <div className="flex h-full">
              <div className="w-8 border-r-2 border-brand/20 flex flex-col justify-around">
                {[...Array(20)].map((_, i) => (
                  <div key={i} className="h-4 mx-1 bg-brand/30"></div>
                ))}
              </div>
              <div className="flex-1"></div>
              <div className="w-8 border-l-2 border-brand/20 flex flex-col justify-around">
                {[...Array(20)].map((_, i) => (
                  <div key={i} className="h-4 mx-1 bg-brand/30"></div>
                ))}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="relative z-10 px-12 py-16 text-center">
            {/* Logo with rotating fonts */}
            <div className="mb-12">
              <h1 
                className="text-7xl text-brand tracking-tight leading-none font-serif"
              >
                postr
              </h1>
            </div>

            {/* Tagline */}
            <div className="max-w-sm mx-auto mb-12 space-y-6">
              <p className="text-gray-700 text-lg leading-relaxed font-light italic">
                Where cinema meets canvas.<br/>
                Every frame deserves to be remembered.
              </p>
              
              {/* Decorative separator */}
              <div className="flex items-center justify-center gap-2 py-4">
                <div className="w-1 h-1 bg-brand/30 rounded-full"></div>
                <div className="w-1 h-1 bg-brand/30 rounded-full"></div>
                <div className="w-1 h-1 bg-brand/30 rounded-full"></div>
              </div>
              
              <p className="text-gray-600 text-base leading-relaxed font-light">
                Design a poster that captures<br/>
                the essence of your favorite film.
              </p>
            </div>

            {/* CTA Button */}
            <div className="flex justify-center">
              <button
                onClick={handleClose}
                className="group relative overflow-hidden px-14 py-4 bg-brand text-[#F2F1ED] font-light text-sm tracking-[0.25em] uppercase border-2 border-brand transition-all duration-500 hover:bg-transparent hover:text-brand"
              >
                <span className="relative z-10">Get started</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
