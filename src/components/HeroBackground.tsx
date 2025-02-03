import React from 'react';

const HeroBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden opacity-5">
      <div className="absolute inset-0 flex items-center justify-center animate-float">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="100%" 
          height="100%" 
          viewBox="-0.5 -0.5 235 235" 
          preserveAspectRatio="xMidYMid slice"
          className="w-full h-full blur-[1px] stroke-current text-accent"
          style={{ strokeWidth: '1' }}
        >
          <g className="animate-pulse-slow">
            <g>
              <g>
                <g/>
                <g>
                  <g>
                    <path d="M 4 80 Q 110 7 220 20" fill="none" strokeMiterlimit="10" />
                  </g>
                </g>
                <g>
                  <g>
                    <path d="M 135 226 Q 218 130 220 20" fill="none" strokeMiterlimit="10" />
                  </g>
                </g>
                <g>
                  <g>
                    <path d="M 4 80 Q 41 173 135 226" fill="none" strokeMiterlimit="10" />
                  </g>
                </g>
              </g>
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
};

export default HeroBackground;