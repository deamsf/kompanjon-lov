import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Rocket, Globe, LineChart, ArrowRight, Check } from 'lucide-react';
import { motion, useAnimationControls } from 'framer-motion';
import { Vector } from '../shared/Vector';
import { vectors } from '../../constants/vectors';

const services = [
  {
    id: "digital-strategy",
    icon: Rocket,
    title: "Digital Strategy",
    description: "Shape a future-proof digital strategy",
    subtext: "We help businesses develop a clear roadmap for their digital products and services. From defining the vision to implementing a structured plan, we ensure your strategy is actionable, user-centered and results-driven.",
    features: [
      "Define your digital product vision & strategy",
      "Create structured roadmaps for growth & market positioning",
      "Align product development with customer needs and business goals",
      "Bring your users to life using user personas"
    ],
    cta: "Let's think!",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200",
    path: "/digital-strategy"
  },
  {
    id: "websites",
    icon: Globe,
    title: "Websites",
    description: "Your onepager website, hassle free",
    subtext: "For small businesses and startups, a well-designed online presence is crucial. We create unique, professional, one-pager websites that look great and drive results, for an unbeatable price.",
    features: [
      "Beautiful, unique & mobile-friendly",
      "No-nonsense & effective",
      "No restrictive templates",
      "SEO-optimized",
      "Unbeatable price"
    ],
    cta: "Let's build!",
    image: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?auto=format&fit=crop&q=80&w=1200",
    path: "/websites"
  },
  {
    id: "business-audit",
    icon: LineChart,
    title: "Business Auditing & Consulting",
    description: "Optimize your business with expert insights and strategic guidance.",
    subtext: "We analyze your operations, workflows, and market positioning to uncover opportunities for growth and efficiency. Whether you need a full audit, consulting, or tailored business advice, we deliver actionable solutions.",
    features: [
      "In-depth business performance audits",
      "Process optimization for increased efficiency",
      "Strategic consulting for growth & digital transformation",
      "Independent expert advice to improve decision-making"
    ],
    cta: "Let's talk!",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=1200",
    path: "/business-audit"
  }
];

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
      className="relative w-24 h-24 flex items-center justify-center mb-6"
      onMouseEnter={handleHover}
      animate={iconControls}
      style={{ transformOrigin: "top center" }}
    >
      <Vector 
        viewBox={vectors.serviceCard.viewBox}
        paths={vectors.serviceCard.path}
        className="absolute inset-0 w-full h-full"
        color="text-highlight"
        fill="rgba(242, 211, 172, 0.1)"
      />
      <Icon className="w-10 h-10 text-highlight stroke-[1.25] relative z-10" />
    </motion.div>
  );
};

export const AdditionalServices = () => {
  const navigate = useNavigate();

  const handleLearnMore = (path: string, serviceId: string) => {
    sessionStorage.setItem('lastServiceId', serviceId);
    navigate(path);
    window.scrollTo(0, 0);
  };

  return (
    <section id="additional-services" className="py-20 bg-primary relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold text-white mb-4">Additional Services</h2>
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
              className={`grid md:grid-cols-2 gap-12 items-center ${
                index % 2 === 0 ? '' : 'md:flex-row-reverse'
              }`}
            >
              <div className="space-y-6">
                <div className="flex flex-col items-center text-center mb-8">
                  <ServiceIcon Icon={service.icon} />
                  <div>
                    <h3 className="text-2xl font-bold text-white">{service.title}</h3>
                    <p className="text-accent mt-2">{service.description}</p>
                  </div>
                </div>

                <p className="text-gray-300">{service.subtext}</p>

                <ul className="space-y-3">
                  {service.features.map((feature, i) => (
                    <li key={i} className="flex items-start text-gray-300">
                      <Check className="w-5 h-5 text-highlight mr-2 shrink-0 mt-0.5 stroke-[1.25]" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex gap-4">
                  <a
                    href="#contact"
                    className="inline-flex items-center gap-2 bg-highlight hover:bg-highlight/90 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                  >
                    <span>{service.cta}</span>
                    <ArrowRight className="w-4 h-4 stroke-[1.25]" />
                  </a>
                  <button
                    onClick={() => handleLearnMore(service.path, service.id)}
                    className="inline-flex items-center gap-2 border border-accent text-accent hover:bg-accent/10 px-6 py-3 rounded-lg font-semibold transition-colors"
                  >
                    <span>Learn More</span>
                    <ArrowRight className="w-4 h-4 stroke-[1.25]" />
                  </button>
                </div>
              </div>

              <div className={`h-[350px] ${index % 2 === 0 ? 'md:order-last' : 'md:order-first'}`}>
                <div className="relative h-full w-full rounded-lg overflow-hidden group">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent" />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};