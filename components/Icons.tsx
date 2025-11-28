import React from 'react';

interface IconProps {
  className?: string;
}

export const AppLogo: React.FC<IconProps> = ({ className = "w-10 h-10" }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="48" fill="#FFF8F4" stroke="#8D6E4D" strokeWidth="2"/>
    <mask id="mask0">
      <circle cx="50" cy="50" r="44" fill="white"/>
    </mask>
    <g mask="url(#mask0)">
        {/* Top Half - Brown */}
        <rect x="0" y="0" width="100" height="50" fill="#8D6E4D"/>
        {/* Bottom Half - Dark Blue/Grey */}
        <rect x="0" y="50" width="100" height="50" fill="#374151"/>
        
        {/* Cup Outline in bottom half */}
        <path d="M25 55 L75 55" stroke="#FFF8F4" strokeWidth="3" strokeLinecap="round" />
        <path d="M30 55 C30 55 30 78 50 78 C70 78 70 55 70 55" stroke="#FFF8F4" strokeWidth="3" strokeLinecap="round" />
        <path d="M70 60 C76 60 78 62 78 66 C78 70 76 72 70 72" stroke="#FFF8F4" strokeWidth="3" strokeLinecap="round" />

        {/* Spoon - Vertical */}
        <line x1="50" y1="15" x2="50" y2="42" stroke="#FFF8F4" strokeWidth="4" strokeLinecap="round" />
        <ellipse cx="50" cy="42" rx="9" ry="11" fill="#FFF8F4" />
        
        {/* Decorative Dots */}
        <circle cx="20" cy="35" r="3" fill="#FFF8F4" opacity="0.8" />
        <circle cx="80" cy="35" r="3" fill="#FFF8F4" opacity="0.8" />
    </g>
  </svg>
);

export const RoastIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
  </svg>
);

export const FragranceIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2.5c-1.5 0-2.5 1-2.5 2.5 0 1.5 1 3 3 5 .5.5 1.5.5 2 0 2-2 3-3.5 3-5 0-1.5-1-2.5-2.5-2.5-1 0-2 .5-3 2.5C14 3 13 2.5 12 2.5z" />
    <path d="M12 10a7 7 0 0 0-7 7c0 2.5 2 4.5 4.5 4.5h5c2.5 0 4.5-2 4.5-4.5 0-2-1-3.5-2.5-4.5" />
    <path d="M12 14v4" />
  </svg>
);

export const FlavorIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 21a9 9 0 0 0 9-9c0-4.97-4.03-9-9-9s-9 4.03-9 9 0 9 9 9z" />
    <path d="M9 10h.01" />
    <path d="M15 10h.01" />
    <path d="M9.5 15a3.5 3.5 0 0 0 5 0" />
  </svg>
);

export const AftertasteIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

export const AcidityIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
    <path d="m12 2 2 8-2 2-2-2 2-8z" />
    <path d="m2 12 8-2 2 2-2 2-8-2z" />
    <path d="m22 12-8 2-2-2 2-2 8 2z" />
    <path d="m12 22-2-8 2-2 2 2-2 8z" />
  </svg>
);

export const BodyIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z" />
  </svg>
);

export const BalanceIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m3 20 5-10 5 10" />
    <path d="m11 20 5-10 5 10" />
    <path d="M8 10h8" />
  </svg>
);

export const CommentIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);