import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ServiceDetail } from './types';

interface ServiceDetailsProps {
  details: ServiceDetail[];
  isVisible: boolean;
  isLastInSection?: boolean;
  sectionTitle: string;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export const ServiceDetailsNew: React.FC<ServiceDetailsProps> = ({ 
  details, 
  isVisible,
  isLastInSection,
  sectionTitle
}) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className={`overflow-hidden ${isLastInSection ? 'mb-10' : 'mb-2'}`}
        >
          <motion.h4
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-base text-gray-300 text-center mt-8 mb-6"
          >
            {sectionTitle}
          </motion.h4>
          
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="grid md:grid-cols-2 gap-6"
          >
            {details.map((detail) => (
              <motion.div
                key={detail.title}
                variants={item}
                className="bg-secondary/10 p-6 rounded-lg border border-accent/10 hover:border-accent/30 transition-colors"
              >
                <h4 className="text-accent font-semibold mb-2">{detail.title}</h4>
                <p className="text-gray-300">{detail.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};