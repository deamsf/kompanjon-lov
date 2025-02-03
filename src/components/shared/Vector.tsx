 import React from 'react';

interface VectorProps {
  className?: string;
  color?: string;
  viewBox: string;
  paths: string | string[];
  fill?: string;
  strokeWidth?: string | number;
}

export const Vector: React.FC<VectorProps> = ({ 
  className = "opacity-5",
  color = "currentColor",
  viewBox,
  paths,
  fill = "none",
  strokeWidth = "2"
}) => {
  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      <div className="absolute inset-0 flex items-center justify-center">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="100%" 
          height="100%" 
          viewBox={viewBox}
          preserveAspectRatio="xMidYMid slice"
          className={`w-full h-full stroke-current ${color}`}
          style={{ strokeWidth }}
        >
          <g>
            {Array.isArray(paths) ? (
              paths.map((path, index) => (
                <path 
                  key={index} 
                  d={path} 
                  fill={fill} 
                  strokeMiterlimit="10" 
                />
              ))
            ) : (
              <path 
                d={paths} 
                fill={fill} 
                strokeMiterlimit="10" 
              />
            )}
          </g>
        </svg>
      </div>
    </div>
  );
};
