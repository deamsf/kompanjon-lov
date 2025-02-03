import React from 'react';
import { Target, Users, Lightbulb, Award } from 'lucide-react';
import { Vector } from './shared/Vector';
import { vectors } from '../constants/vectors';
import Capabilities from './Capabilities';

const About = () => {
  return (
    <>
      <section id="about" className="py-20 bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Title */}
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Over mij</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Hallo, ik ben Frank, digitaal omnivoor.
            </p>
          </div>

          {/* Two Column Layout */}
          <div className="flex flex-col md:flex-row gap-12">
            {/* Left Column - Image */}
            <div className="w-full md:w-1/3 flex items-center">
              <div className="relative w-64 h-64 mx-auto">
                <div className="absolute inset-0 animate-float">
                  <img
                    src="./img/frank-orig-s.png?auto=format&fit=crop"
                    alt="Profile"
                    className="w-full h-full object-cover"
                    style={{
                      clipPath: "path('M 4 80 Q 110 7 220 20 Q 218 130 135 226 Q 41 173 4 80 Z')"
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent"
                    style={{
                      clipPath: "path('M 4 80 Q 110 7 220 20 Q 218 130 135 226 Q 41 173 4 80 Z')"
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Right Column - Content */}
            <div className="w-full md:w-2/3 space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-accent mb-4">Mezelf</h3>
                <p className="text-gray-300">
                  Ik ben een ervaren productmanager met meer dan tien jaar op de teller in het omzetten van inzichten en ideeën in succesvolle digitale strategieën en producten. In mijn aanpak combineer ik diepgaande kennis van gebruikers met strategisch bedrijfsgericht denken, zodat ik organisaties kan helpen bij de complexe reis van concept naar marktsucces.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-accent mb-4">Mijn missie</h3>
                <p className="text-gray-300">
                  Ik heb 3volve opgericht om bedrijven te helpen digitale oplossingen te ontwikkelen die echt aanslaan. Al te vaak worden belangrijke productbeslissingen genomen op basis van onderbuikgevoelens, waardoor middelen worden verspild zonder echte impact in de markt. Mijn aanpak combineert onderzoek, strategisch inzicht en sterke front-end- en communicatie-expertise.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default About;