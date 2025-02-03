import React, { useState } from 'react';
import { VectorBackground } from '../shared/VectorBackground';
import ServiceCard from './ServiceCard';
import ServiceDetails from './ServiceDetails';
import { servicesContent } from '../../content/services';

const Services = () => {
  const [activeService, setActiveService] = useState<string | null>(null);

  return (
    <section id="services" className="py-20 bg-primary relative overflow-hidden">
      <VectorBackground className="opacity-[0.02] rotate-180" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-4">{servicesContent.title}</h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            {servicesContent.description}
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 relative">
          {servicesContent.services.map((service, index) => (
            <ServiceCard
              key={service.id}
              title={service.title}
              subtitle={service.subtitle}
              icon={service.icon as any}
              description={service.description}
              isActive={activeService === service.id}
              onClick={() => setActiveService(activeService === service.id ? null : service.id)}
              showConnector={index < servicesContent.services.length - 1 ? 'right' : null}
            />
          ))}
        </div>

        {servicesContent.services.map((service) => (
          <ServiceDetails
            key={service.id}
            details={service.details}
            isVisible={activeService === service.id}
          />
        ))}
      </div>
    </section>
  );
};

export default Services;