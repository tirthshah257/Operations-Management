import React from 'react';

export default function MeteoricLogo({ className = "h-8", centered = true }) {
  return (
    <div className={`flex items-center select-none group ${centered ? 'justify-center w-full' : ''}`}>
      {/* Premium Centered Logo Container */}
      <div className="relative overflow-hidden bg-white px-3.5 py-1.5 rounded-xl border border-slate-200/90 shadow-md shadow-slate-950/15 group-hover:shadow-lg group-hover:shadow-blue-500/10 group-hover:border-blue-300 transition-all duration-300 flex items-center justify-center">
        {/* Subtle Background Accent Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 via-white to-indigo-50/30 opacity-80" />

        <img
          src="/meteoric-new-logo.png"
          alt="Meteoric Biopharmaceuticals"
          className={`relative z-10 object-contain max-h-8 w-auto filter drop-shadow-xs transition-transform duration-300 group-hover:scale-[1.02] ${className}`}
        />
      </div>
    </div>
  );
}
