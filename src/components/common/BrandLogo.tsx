import React from 'react';

interface BrandLogoProps {
  className?: string;
  variant?: 'full' | 'monogram';
  height?: number | string;
  alt?: string;
}

/**
 * Official Choice Laundry Logo Component
 * Uses the official monogram (circular C with internal water drop) and brand wordmark.
 */
export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  variant = 'full',
  height = 36,
  alt = 'Choice Laundry',
}) => {
  if (variant === 'monogram') {
    return (
      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`shrink-0 ${className}`}
        style={{ height }}
        role="img"
        aria-label={alt}
      >
        {/* Outer Circular C arch in vibrant sky blue */}
        <path
          d="M148 58 A60 60 0 1 0 148 142"
          stroke="#38B6FF"
          strokeWidth="22"
          strokeLinecap="round"
          fill="none"
        />
        {/* Center Water Droplet in royal/deep cyan */}
        <path
          d="M100 72 C100 72 122 98 122 111 A22 22 0 0 1 78 111 C78 98 100 72 100 72 Z"
          fill="#0E86D4"
        />
      </svg>
    );
  }

  return (
    <div className={`inline-flex items-center gap-2 select-none ${className}`}>
      {/* Official Monogram */}
      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 drop-shadow-xs"
        style={{ height }}
        role="img"
        aria-hidden="true"
      >
        <path
          d="M148 58 A60 60 0 1 0 148 142"
          stroke="#38B6FF"
          strokeWidth="22"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M100 72 C100 72 122 98 122 111 A22 22 0 0 1 78 111 C78 98 100 72 100 72 Z"
          fill="#0E86D4"
        />
      </svg>
      {/* Official Typography */}
      <div className="flex flex-col leading-none">
        <span className="text-base sm:text-lg font-black tracking-tight text-[#0E86D4]">
          Choice<span className="font-light text-[#38B6FF] ml-0.5 sm:ml-1">Laundry</span>
        </span>
        <span className="text-[8px] sm:text-[9px] font-bold tracking-wider sm:tracking-widest uppercase text-slate-400 mt-0.5">
          Osogbo · Osun State
        </span>
      </div>
    </div>
  );
};
