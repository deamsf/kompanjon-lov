import React, { useEffect } from 'react';
import { ArrowLeft, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

const Websites = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/');
    setTimeout(() => {
      const serviceId = sessionStorage.getItem('lastServiceId') || 'websites';
      const element = document.getElementById(serviceId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      } else {
        document.getElementById('additional-services')?.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  useEffect(() => {
    document.title = "Website Development | 3volve - Product Management Consultancy";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Professional websites that drive results. Perfect for small businesses and startups looking for a strong online presence.');
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

          <h1 className="text-4xl font-bold text-white mb-6">Websites for Small Businesses</h1>
          <div className="prose prose-invert">
            <div className="space-y-8">
              <div className="text-gray-300">
                           <h2 className="text-gray-300 text-lg mb-8">
                  
                  Many small businesses struggle with outdated websites or expensive development costs.
                </h2>
              </div>

                         <div className="text-gray-300">
                <p className="mb-6">
                  We offer a streamlined one-pager website solution, perfect for small enterprises that need a clean, effective online presence at an affordable and transparent cost. No secrets!
                </p>
              </div>

              <div className="bg-secondary/20 p-8 rounded-lg border border-accent/10">
                <h2 className="text-2xl font-bold text-white mb-6">What You Get</h2>
                <ul className="space-y-4">
                  {[
                    'A modern, professional and streamlined onepager website, built for value and efficiency',
                    'Custom one-page website tailored to your brand',
                    'Tailored design & content for a professional look and feel',
                    'One intake talk and one revision round',
                    'No complicated systems, just a sleek, modern website that does the job',
                    'Fast loading & mobile-friendly for the best user experience',
                    'Zero clutter, zero fuss, zero hidden costs'
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
                    'We don\'t sell uneccessary extras. You\'ll get a simple yet great looking webpage that does the job.',
                    'We are here to help. You want new or additional content? You\'ll get an honest quote for hourly work.',
                    'We don\'t lock you in. You own your site and domain name.'
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-3 text-gray-300">
                      <span className="text-highlight shrink-0">🔹</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <p className="text-gray-300 text-lg mb-8">
                Ready to level up your business's website? Let's get in touch!
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

export default Websites;