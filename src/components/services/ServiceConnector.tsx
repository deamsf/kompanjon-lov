import React from 'react';

interface ServiceConnectorProps {
  isActive: boolean;
}

export const ServiceConnector: React.FC<ServiceConnectorProps> = ({ isActive }) => (
  <div className="absolute top-1/2 -translate-y-1/2 right-0 z-10">
    <div 
      className={`
        h-px w-8 transition-colors
        ${isActive ? 'bg-accent' : 'bg-accent/30'}
      `} 
      style={{
        transform: 'translateX(calc(100% - 1px))'
      }}
    />
  </div>
);