import React from 'react';
import { Star } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'lg';
  animated?: boolean;
}

const Logo: React.FC<LogoProps> = ({ size = 'sm', animated = false }) => {
  const baseClasses = `
    relative
    ${size === 'lg' ? 'w-24 h-24' : 'w-8 h-8'}
    ${animated ? 'animate-spin-slow' : ''}
  `;

  const glowClasses = `
    absolute
    inset-0
    bg-indigo-500
    rounded-full
    blur-lg
    opacity-50
    ${animated ? 'animate-pulse' : ''}
  `;

  const starClasses = `
    absolute
    inset-0
    ${size === 'lg' ? 'p-3' : 'p-1'}
    text-white
    transform
    ${animated ? 'hover:scale-110' : ''}
    transition-transform
    duration-300
    z-20
  `;

  const ringClasses = `
    absolute
    inset-0
    border-4
    border-indigo-600
    rounded-full
    transform
    rotate-45
    ${animated ? 'animate-pulse-fast' : ''}
    z-10
  `;

  return (
    <div className={baseClasses}>
      <div className={glowClasses} />
      <div className={ringClasses} />
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-full shadow-lg z-0" />
      <Star 
        className={starClasses} 
        fill="currentColor"
        size={size === 'lg' ? 72 : 24}
        strokeWidth={2}
        absoluteStrokeWidth
      />
    </div>
  );
};

export default Logo;
