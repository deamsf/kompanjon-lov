import React, { useState } from 'react';
import { VectorBackground } from '../shared/VectorBackground';
import { ServiceCardNew } from './ServiceCardNew';
import { ServiceDetailsNew } from './ServiceDetailsNew';
import { servicesContent } from '../../content/services';
import { motion, AnimatePresence } from 'framer-motion';

export const ServicesNew = () => {
  const [activeService, setActiveService] = useState<string | null>(null);

  const getSectionTitle = (serviceId: string) => {
    switch (serviceId) {
      case 'discover':
        return 'Our Discover activities involve';
      case 'design':
        return 'Our Design activities involve';
      case 'delight':
        return 'Our Delight activities involve';
      default:
        return '';
    }
  };

  return (
    <section id="services" className="py-20 bg-primary relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold text-white mb-4">{servicesContent.title}</h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            {servicesContent.description}
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-3 gap-4 md:gap-8">
          {servicesContent.services.map((service, index) => (
            <React.Fragment key={service.id}>
              <ServiceCardNew
                {...service}
                isActive={activeService === service.id}
                isLast={index === servicesContent.services.length - 1}
                onClick={() => setActiveService(
                  activeService === service.id ? null : service.id
                )}
              />
              {/* Mobile-only details section */}
              <div className="md:hidden col-span-1 -mt-2">
                <ServiceDetailsNew
                  details={service.details}
                  isVisible={activeService === service.id}
                  isLastInSection={index < servicesContent.services.length - 1}
                  sectionTitle={getSectionTitle(service.id)}
                />
              </div>
            </React.Fragment>
          ))}
        </div>

        {/* Desktop-only details section */}
        <div className="hidden md:block">
          <AnimatePresence mode="wait">
            {servicesContent.services.map((service, index) => (
              <ServiceDetailsNew
                key={service.id}
                details={service.details}
                isVisible={activeService === service.id}
                isLastInSection={index < servicesContent.services.length - 1}
                sectionTitle={getSectionTitle(service.id)}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};