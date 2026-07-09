import React from 'react';

export const Logo: React.FC<{ size?: number; light?: boolean }> = ({ size = 40, light = false }) => {
  return (
    <div className="flex items-center gap-3 group">
      <div 
        className={`relative ${size === 40 ? 'w-12 h-12' : 'w-10 h-10'} rounded-full flex items-center justify-center transition-transform group-hover:scale-110`}
      >
        <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="goldGradientLogo" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#d4af37" />
              <stop offset="50%" stopColor="#f3e5ab" />
              <stop offset="100%" stopColor="#aa7c11" />
            </linearGradient>
          </defs>
          {/* House Silhouette */}
          <path d="M50 20 L20 45 V75 H80 V45 L50 20 Z" stroke="url(#goldGradientLogo)" strokeWidth="6" strokeLinejoin="round" fill="none" />
          {/* Windows */}
          <path d="M40 55 H45 V60 H40 Z M55 55 H60 V60 H55 Z" stroke="url(#goldGradientLogo)" strokeWidth="3" fill="none" />
          {/* Arrow */}
          <path d="M15 75 Q5 75 5 45 T50 15 L75 35" stroke="url(#goldGradientLogo)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
      </div>
      <div className="flex flex-col items-start leading-none gap-0.5">
        <span className={`text-2xl font-black ${light ? 'text-white' : 'text-navy'} tracking-tight`}>EDSON</span>
        <span className="text-[9px] font-bold text-gold uppercase tracking-[0.18em]">REAL ESTATE GROUP</span>
      </div>
    </div>
  );
};

