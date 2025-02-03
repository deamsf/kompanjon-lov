import React, { useEffect } from 'react';
import { ArrowLeft, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ServicesSection } from '../components/services/ServicesSection';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

const DigitalStrategy = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/');
    setTimeout(() => {
      const serviceId = sessionStorage.getItem('lastServiceId') || 'digital-strategy';
      const element = document.getElementById(serviceId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      } else {
        document.getElementById('additional-services')?.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  useEffect(() => {
    document.title = "Digital Strategy | 3volve - Product Management Consultancy";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Shape your digital future with our comprehensive strategy services. We help businesses develop clear, actionable roadmaps for their digital products and services.');
    }
  }, []);

  return (
    <>
      <div className="min-h-screen bg-primary py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <button 
            onClick={handleBack}
            className="inline-flex items-center gap-2 text-accent hover:text-highlight transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Services</span>
          </button>

          <h1 className="text-4xl font-bold text-white mb-6">Digital Strategy</h1>
          <div className="prose prose-invert">
            <h2 className="text-gray-300 text-lg mb-8">
              Shape your digital future with our comprehensive strategy services
            </h2>

            <div className="text-gray-300 mb-12">
              <p>
                We help you turn market insights into product excellence. We help businesses develop clear, actionable roadmaps for their digital products and services. 
                Our approach combines deep market understanding with strategic planning to ensure your digital 
                initiatives deliver real value.
 
              </p>
            </div>
          </div>
        </div>

        <ServicesSection />

        {/* Reduced top margin from mt-20 to mt-8 */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          <div className="space-y-8">
            <div className="bg-secondary/20 p-8 rounded-lg border border-accent/10">
              <h2 className="text-2xl font-bold text-white mb-6">What You Get</h2>
              <ul className="space-y-4">
                {[
                  'Comprehensive digital strategy assessment and roadmap',
                  'Clear vision and mission statement for your digital initiatives',
                  'Detailed user personas and journey maps',
                  'Competitive analysis and market positioning strategy',
                  'Actionable implementation plan with clear milestones',
                  'KPI framework to measure success',
                  'Regular strategy review and adjustment sessions'
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3 text-gray-300">
                    <Check className="w-5 h-5 text-highlight shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-secondary/20 p-8 rounded-lg border border-accent/10">
              <h2 className="text-2xl font-bold text-white mb-6">Why Choose Us?</h2>
              <ul className="space-y-4">
                {[
                  'Deep expertise in digital product strategy and market analysis',
                  'Proven methodology that combines user needs with business goals',
                  'Focus on actionable, measurable outcomes',
                  'Flexible approach that adapts to your business context',
                  'Continuous support throughout strategy implementation'
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3 text-gray-300">
                    <span className="text-highlight shrink-0">🔹</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-center">
              <p className="text-gray-300 text-lg mb-8">
                Ready to develop your digital strategy? Let's sit together!
              </p>
            </div>
          </div>
        </div>
      </div>
      <Contact />
      <Footer />
    </>
  );
};

export default DigitalStrategy;