import React from 'react';
import { ChevronDown } from 'lucide-react';

const ScrollIndicator = () => {
  const scrollToContent = () => {
    const servicesSection = document.getElementById('services');
    servicesSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div 
      className="absolute bottom-8 left-0 right-0 flex justify-center"
      onClick={scrollToContent}
    >
      <button
        className="p-2 rounded-full hover:bg-white/5 transition-colors cursor-pointer"
        aria-label="Scroll to services section"
      >
        <ChevronDown 
          size={32} 
          className="text-accent hover:text-highlight transition-colors"
        />
      </button>
    </div>
  );
};

export default ScrollIndicator;