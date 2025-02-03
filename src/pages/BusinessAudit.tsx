import React, { useEffect } from 'react';
import { ArrowLeft, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

const BusinessAudit = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/');
    setTimeout(() => {
      const serviceId = sessionStorage.getItem('lastServiceId') || 'business-audit';
      const element = document.getElementById(serviceId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      } else {
        document.getElementById('additional-services')?.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  useEffect(() => {
    document.title = "Business Auditing & Consulting | 3volve - Product Management Consultancy";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Expert insights and strategic guidance to optimize your business operations and drive growth. We help businesses improve efficiency and achieve their goals.');
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

          <h1 className="text-4xl font-bold text-white mb-6">Optimize Your Business with Expert Auditing & Consulting</h1>
          <div className="prose prose-invert">
            <h2 className="text-gray-300 text-lg mb-8">
              Uncover inefficiencies, streamline operations, and position your business for sustainable growth.
            </h2>

            <div className="space-y-8">
              <div className="text-gray-300">
                <p className="mb-6">
                  Many businesses struggle with internal bottlenecks, outdated processes, or missed opportunities in their market. Our Business Auditing & Consulting service helps you identify areas for improvement and implement practical solutions that drive efficiency, profitability, and long-term success.
                </p>
              </div>

              <div className="bg-secondary/20 p-8 rounded-lg border border-accent/10">
                <h2 className="text-2xl font-bold text-white mb-6">What We Offer</h2>
                <ul className="space-y-6">
                  <li className="space-y-2">
                    <div className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-highlight shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold text-white">Business Performance Audits</h3>
                        <p className="text-gray-300">We take a deep dive into your operations, financials, and workflows to pinpoint inefficiencies and areas for improvement.</p>
                      </div>
                    </div>
                  </li>
                  <li className="space-y-2">
                    <div className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-highlight shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold text-white">Process Optimization</h3>
                        <p className="text-gray-300">Streamline your internal processes to reduce costs, save time, and improve overall productivity.</p>
                      </div>
                    </div>
                  </li>
                  <li className="space-y-2">
                    <div className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-highlight shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold text-white">Strategic Growth Consulting</h3>
                        <p className="text-gray-300">Get expert guidance on scaling your business, expanding into new markets, or adopting digital transformation strategies.</p>
                      </div>
                    </div>
                  </li>
                  <li className="space-y-2">
                    <div className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-highlight shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold text-white">Independent Expert Advice</h3>
                        <p className="text-gray-300">Gain unbiased, data-driven insights to improve decision-making and future-proof your business.</p>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="bg-secondary/20 p-8 rounded-lg border border-accent/10">
                <h2 className="text-2xl font-bold text-white mb-6">Why Choose Us?</h2>
                <ul className="space-y-4">
                  {[
                    'Actionable Insights – No vague recommendations, just clear, practical strategies you can implement.',
                    'Customized Approach – Every business is unique, so we tailor our advice to your specific needs.',
                    'Efficiency-Driven – We help you eliminate waste, optimize resources, and maximize profitability.',
                    'Future-Focused – Our strategies aren\'t just about fixing today\'s problems, but setting you up for long-term success.'
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-3 text-gray-300">
                      <span className="text-highlight shrink-0">🔹</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <p className="text-gray-300 text-lg mb-8">
                Want to unlock your business's full potential? Let's discuss how we can help.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Contact />
      <Footer />
    </>
  );
}

export default BusinessAudit;