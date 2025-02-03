import React from 'react';

interface VectorBackgroundProps {
  className?: string;
  color?: string;
}

export const VectorBackground: React.FC<VectorBackgroundProps> = ({ 
  className = "opacity-5",
  color = "currentColor" 
}) => {
  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      <div className="absolute inset-0 flex items-center justify-center">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="100%" 
          height="100%" 
          viewBox="0 0 260 260" 
          preserveAspectRatio="xMidYMid slice"
          className={`w-full h-full stroke-current ${color}`}
          style={{ strokeWidth: '2' }}
        >
          <g>
            <path d="M 30 100 Q 130 30 230 50" fill="none" strokeMiterlimit="10" />
            <path d="M 145 230 Q 228 140 230 50" fill="none" strokeMiterlimit="10" />
            <path d="M 30 100 Q 60 180 145 230" fill="none" strokeMiterlimit="10" />
          </g>
        </svg>
      </div>
    </div>
  );
};