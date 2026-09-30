import React from 'react';

export const CadastralPattern: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden opacity-[0.045] ${className}`}
      aria-hidden="true"
    >
      <svg
        className="h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
      >
        <defs>
          <pattern
            id="cadastral-parcels"
            width="160"
            height="160"
            patternUnits="userSpaceOnUse"
          >
            {/* Cadastral parcel boundary simulation lines */}
            <path
              d="M 0,40 L 60,10 L 120,35 L 160,20 L 160,90 L 110,105 L 50,85 L 0,110 Z"
              fill="none"
              stroke="#173B57"
              strokeWidth="1.2"
              strokeDasharray="4 2"
            />
            <path
              d="M 60,10 L 50,85 M 120,35 L 110,105 M 0,40 L 50,85"
              fill="none"
              stroke="#173B57"
              strokeWidth="0.8"
            />
            <path
              d="M 0,110 L 40,160 L 100,140 L 160,150 L 160,90"
              fill="none"
              stroke="#173B57"
              strokeWidth="1"
            />
            <path
              d="M 40,160 L 110,105"
              fill="none"
              stroke="#173B57"
              strokeWidth="0.8"
              strokeDasharray="2 2"
            />
            {/* Survey / benchmark points */}
            <circle cx="60" cy="10" r="2.5" fill="#246BCE" />
            <circle cx="120" cy="35" r="2" fill="#087F8C" />
            <circle cx="50" cy="85" r="2.5" fill="#173B57" />
            <circle cx="110" cy="105" r="2" fill="#246BCE" />
            <circle cx="40" cy="160" r="2" fill="#087F8C" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#cadastral-parcels)" />
      </svg>
    </div>
  );
};

