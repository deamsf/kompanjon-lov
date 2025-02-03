import React from 'react';
import { Target, Users, Lightbulb, Award } from 'lucide-react';

const capabilities = [
  {
    icon: Target,
    title: "Strategische visie",
    description: "Complexe marktinzichten omzetten in duidelijke, bruikbare productstrategieën"
  },
  {
    icon: Users,
    title: "Gebruikers centraal",
    description: "Inzicht in gebruikersbehoeften en gedragspatronen"
  },
  {
    icon: Lightbulb,
    title: "Innovatie",
    description: "Frisse perspectieven en innovatieve oplossingen bieden voor productuitdagingen"
  },
  {
    icon: Award,
    title: "Integratie",
    description: "Uitgebreide kennis en vaardigheden in communicatie"
  }
];

const Capabilities = () => {
  return (
    <section className="py-20 bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-white mb-12 text-center">
          Wat ik voor jou kan betekenen
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {capabilities.map((capability) => (
            <div 
              key={capability.title} 
              className="bg-secondary/20 p-8 rounded-lg border border-accent/10"
            >
              <capability.icon className="w-8 h-8 text-accent stroke-[1.25] mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                {capability.title}
              </h3>
              <p className="text-gray-300">
                {capability.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Capabilities;