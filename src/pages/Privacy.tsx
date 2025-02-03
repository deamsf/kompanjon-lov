import React, { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import Footer from '../components/Footer';

const Privacy = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Privacy Policy | 3volve";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Privacy Policy for 3volve - Learn how we protect and handle your personal information.');
    }
  }, []);

  return (
    <div className="min-h-screen bg-primary flex flex-col">
      <Navbar />
      <main className="flex-grow pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <button 
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 text-accent hover:text-highlight transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>

          <div className="bg-secondary/20 p-8 rounded-lg border border-accent/10">
            <h1 className="text-3xl font-bold text-white mb-6">Privacy Policy</h1>
            <div className="text-gray-300 space-y-4">
              <p>Our privacy policy is currently being updated to ensure compliance with the latest regulations.</p>
              <p>Please check back soon for our comprehensive privacy policy.</p>
              <p>If you have any immediate questions about how we handle your data, please don't hesitate to contact us.</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Privacy;