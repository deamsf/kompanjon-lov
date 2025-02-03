import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Rocket, ArrowRight, Check } from 'lucide-react';
import { motion, useAnimationControls } from 'framer-motion';
import { Vector } from './shared/Vector';
import { vectors } from '../constants/vectors';
import { services } from '../constants/services';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

const ServiceIcon = ({ Icon }: { Icon: typeof Rocket }) => {
  const iconControls = useAnimationControls();

  const handleHover = async () => {
    await iconControls.start({
      rotate: [0, -5, 5, -3, 3, 0],
      transition: {
        duration: 1.2,
        ease: "easeOut",
        times: [0, 0.2, 0.4, 0.6, 0.8, 1]
      }
    });
  };

  return (
    <motion.div 
      className="relative w-32 h-32 flex items-center justify-center mx-auto"
      onMouseEnter={handleHover}
      animate={iconControls}
      style={{ transformOrigin: "center" }}
    >
      <Vector 
        viewBox={vectors.serviceCard.viewBox}
        paths={vectors.serviceCard.path}
        className="absolute inset-0 w-full h-full"
        color="text-highlight"
        fill="rgba(242, 211, 172, 0.2)"
      />
      <Icon className="w-14 h-14 text-highlight stroke-[1.25] relative z-10" />
    </motion.div>
  );
};

export const Services = () => {
  const navigate = useNavigate();

  const handleLearnMore = (path: string, serviceId: string) => {
    sessionStorage.setItem('lastServiceId', serviceId);
    navigate(path);
    window.scrollTo(0, 0);
  };

  return (
    <section id="services" className="py-20 bg-primary relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold text-white mb-4">What we do</h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Comprehensive solutions to help your business thrive in the digital age
          </p>
        </motion.div>

        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="space-y-24"
        >
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              id={service.id}
              variants={item}
              className="grid md:grid-cols-2 gap-12 items-center"
            >
              {/* Image/Icon Column - Always first on mobile */}
              <div className={`order-1 ${index % 2 === 0 ? 'md:order-2' : 'md:order-1'}`}>
                <div className="relative h-[400px] rounded-lg overflow-hidden group">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/50 to-transparent" />
                  
                  {/* Overlay content */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                    <div className="w-full max-w-md mx-auto">
                      <ServiceIcon Icon={service.icon} />
                      <h3 className="text-3xl sm:text-4xl font-bold text-white mt-4 mb-6 leading-tight mx-auto">
                        {service.title}
                      </h3>
                      
                      {/* CTA Buttons */}
                      <div className="flex flex-col gap-4 mt-6 w-full max-w-xs mx-auto">
                        <a
                          href="#contact"
                          className="inline-flex items-center justify-center gap-2 bg-highlight hover:bg-highlight/90 text-white px-6 py-3 rounded-lg font-semibold transition-colors w-full"
                        >
                          <span>{service.cta}</span>
                          <ArrowRight className="w-4 h-4 stroke-[1.25]" />
                        </a>
                        <button
                          onClick={() => handleLearnMore(service.path, service.id)}
                          className="inline-flex items-center justify-center gap-2 border border-accent text-accent hover:bg-accent/10 px-6 py-3 rounded-lg font-semibold transition-colors w-full"
                        >
                          <span>Learn More</span>
                          <ArrowRight className="w-4 h-4 stroke-[1.25]" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Text Column - Always second on mobile */}
              <div className={`order-2 space-y-6 ${index % 2 === 0 ? 'md:order-1' : 'md:order-2'}`}>
                <p className="text-accent text-xl">{service.description}</p>
                <p className="text-gray-300">{service.subtext}</p>

                <ul className="space-y-3">
                  {service.features.map((feature, i) => (
                    <li key={i} className="flex items-start text-gray-300">
                      <Check className="w-5 h-5 text-highlight mr-2 shrink-0 mt-0.5 stroke-[1.25]" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};