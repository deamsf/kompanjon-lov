import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { Vector } from './shared/Vector';
import { vectors } from '../constants/vectors';

const testimonials = [
  {
    id: 1,
    name: "Sarah C.",
    role: "Chief Product Officer",
    company: "TechVision Inc.",
    quote: "Their strategic approach transformed our product development process. The insights and methodology they brought helped us launch our flagship product 2 months ahead of schedule.",
    image: null
  },
  {
    id: 2,
    name: "Marcus R.",
    role: "Head of Digital Innovation",
    company: "Future Finance",
    quote: "Working with them was eye-opening. They didn't just help us build a product; they helped us build a product culture that continues to drive innovation.",
    image: null
  },
  {
    id: 3,
    name: "Emma T.",
    role: "Startup Founder",
    company: "HealthTech Solutions",
    quote: "Their product management expertise was instrumental in helping us pivot our healthcare platform. We saw a 300% increase in user engagement within months.",
    image: null
  },
  {
    id: 4,
    name: "David P.",
    role: "VP of Product",
    company: "RetailConnect",
    quote: "The depth of their product strategy knowledge is impressive. They helped us transform complex user feedback into actionable product improvements.",
    image: null
  },
  {
    id: 5,
    name: "Lisa M.",
    role: "Product Director",
    company: "EduTech Global",
    quote: "Their guidance helped us completely reimagine our product strategy. The results exceeded our expectations in every way.",
    image: null
  }
];

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const getVisibleIndices = () => {
    const indices = [];
    indices.push((currentIndex - 1 + testimonials.length) % testimonials.length);
    indices.push(currentIndex);
    indices.push((currentIndex + 1) % testimonials.length);
    return indices;
  };

  return (
    <section className="py-20 bg-secondary overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">What People Say</h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Don't just take our word for it - hear from the people we've helped transform their products and businesses.
          </p>
        </div>

        <div className="relative px-4 md:px-20">
          <div className="flex items-center justify-center perspective-1000">
            <div className="relative w-full h-[400px] flex items-center justify-center">
              {getVisibleIndices().map((index, position) => (
                <motion.div
                  key={`card-${index}`}
                  initial={false}
                  animate={{
                    x: position === 1 ? 0 : position === 0 ? -300 : 300,
                    scale: position === 1 ? 1 : 0.8,
                    zIndex: position === 1 ? 2 : 1,
                    opacity: position === 1 ? 1 : 0.3,
                    rotateY: position === 1 ? 0 : position === 0 ? 15 : -15
                  }}
                  transition={{
                    duration: 0.5,
                    ease: "easeInOut"
                  }}
                  className="absolute w-full md:w-[600px]"
                  style={{
                    transformStyle: 'preserve-3d'
                  }}
                >
                  <TestimonialCard 
                    testimonial={testimonials[index]} 
                    isMain={position === 1} 
                  />
                </motion.div>
              ))}
            </div>
          </div>

          <button
            onClick={prev}
            className="absolute left-0 top-1/2 -translate-y-1/2 p-2 md:p-3 rounded-full bg-accent/40 text-accent hover:bg-accent/60 transition-colors z-10"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
          </button>
          
          <button
            onClick={next}
            className="absolute right-0 top-1/2 -translate-y-1/2 p-2 md:p-3 rounded-full bg-accent/40 text-accent hover:bg-accent/60 transition-colors z-10"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
          </button>
        </div>

        <div className="flex justify-center gap-2 mt-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                currentIndex === index 
                  ? 'bg-accent w-4' 
                  : 'bg-accent/30 hover:bg-accent/50'
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

const TestimonialCard = ({ testimonial, isMain }: { testimonial: typeof testimonials[0], isMain: boolean }) => (
  <div className={`bg-primary/100 p-6 md:p-8 rounded-lg border border-accent/10 flex flex-col h-[350px] mx-4 md:mx-0 ${isMain ? 'shadow-xl opacity-100' : 'opacity-30'}`}>
    <div className="hidden sm:flex justify-center mb-6">
      <div className="relative w-16 md:w-20 h-16 md:h-20 flex items-center justify-center">
        <Vector 
          viewBox={vectors.serviceCard.viewBox}
          paths={vectors.serviceCard.path}
          className="absolute inset-0 w-full h-full"
          color="text-highlight"
          fill="rgba(242, 211, 172, 0.1)"
        />
        <Quote className="w-6 h-6 md:w-8 md:h-8 text-highlight stroke-1 relative z-10" />
      </div>
    </div>
    
    <blockquote className="text-gray-300 italic text-base md:text-lg leading-relaxed flex-grow">
      "{testimonial.quote}"
    </blockquote>
    
    <div className="hidden sm:block text-center mt-6 pt-4 border-t border-accent/10">
      <p className="text-accent font-semibold">{testimonial.name}</p>
      <p className="text-gray-400 text-sm">{testimonial.role}</p>
      <p className="text-gray-400 text-sm">{testimonial.company}</p>
    </div>
  </div>
);

export default Testimonials;