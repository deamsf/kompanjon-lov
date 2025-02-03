import React from 'react';
import { Logo } from './logos/Logo';
import { logos } from './logos/config';
import { motion } from 'framer-motion';

export const ClientLogos: React.FC = () => {
  return (
    <section id="clients" className="py-24 bg-secondary relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-white mb-16 text-center font-display">
          Enkele klanten
        </h2>
        
        <div className="flex flex-wrap justify-center items-center gap-16">
          {logos.map((logo) => (
            <motion.div 
              key={logo.name}
              className="h-12 w-48 relative opacity-50 hover:opacity-100 transition-all duration-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {logo.website ? (
                <a 
                  href={logo.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full h-full"
                  aria-label={`${logo.name} website`}
                >
                  <Logo 
                    svgPath={logo.svgPath}
                    name={logo.name}
                    className="w-full h-full text-current"
                  />
                </a>
              ) : (
                <Logo 
                  svgPath={logo.svgPath}
                  name={logo.name}
                  className="w-full h-full text-current"
                />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};