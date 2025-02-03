import React, { useState, useRef } from 'react';
import { Send } from 'lucide-react';
import emailjs from '@emailjs/browser';
import toast, { Toaster } from 'react-hot-toast';
// import ReCAPTCHA from 'react-google-recaptcha';

const Contact = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // const [recaptchaValue, setRecaptchaValue] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    user_name: '',
    user_email: '',
    message: ''
  });
  const [emailError, setEmailError] = useState('');
  const [messageError, setMessageError] = useState('');

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email)) {
      setEmailError('Dubbelcheck je e-mailadres, zodat we je kunnen bereiken.');
      return false;
    }
    setEmailError('');
    return true;
  };

  const validateMessage = (message: string) => {
    if (message.length > 0 && message.length < 15) {
      setMessageError('Nog een beetje meer info alsjeblieft 😊');
      return false;
    }
    setMessageError('');
    return true;
  };

  const isFormValid = () => {
    return (
      formData.user_name.trim() !== '' &&
      formData.user_email.trim() !== '' &&
      formData.message.trim() !== '' &&
      !emailError &&
      !messageError &&
      formData.message.length >= 15
      // && recaptchaValue !== null // Uncomment when enabling reCAPTCHA
    );
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'user_email') {
      validateEmail(value);
    } else if (name === 'message') {
      validateMessage(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current || !isFormValid()) return;

    setIsSubmitting(true);
    try {
      // Send confirmation email to sender
      await emailjs.sendForm(
        'service_zot77kc',
        'template_k8cdgrq',
        formRef.current,
        'E-jPUZxl8ctmaHoxQ'
      );
      
      // Send notification email to owner
      await emailjs.sendForm(
        'service_zot77kc',
        'template_7zgx4ym',
        formRef.current,
        'E-jPUZxl8ctmaHoxQ'
      );

      toast.success('Bericht succesvol verzonden. Tot snel!', { duration: 4000 });
      formRef.current.reset();
      setFormData({ user_name: '', user_email: '', message: '' });
      // setRecaptchaValue(null); // Uncomment when enabling reCAPTCHA
    } catch (error) {
      toast.error('Versturen mislukt. Probeer het even opnieuw.', { duration: 4000 });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-primary">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-4">Contacteer mij</h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Klaar om jouw digitale strategie uit te werken? Let's talk!
          </p>
        </div>
        
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="user_name" className="block text-sm font-medium text-gray-300 mb-2">
              Naam <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="user_name"
              name="user_name"
              value={formData.user_name}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 bg-white/10 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-accent focus:border-transparent"
            />
          </div>
          
          <div>
            <label htmlFor="user_email" className="block text-sm font-medium text-gray-300 mb-2">
              E-mail <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="user_email"
              name="user_email"
              value={formData.user_email}
              onChange={handleInputChange}
              required
              className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white focus:ring-2 focus:ring-accent focus:border-transparent ${
                emailError ? 'border-red-500' : 'border-gray-600'
              }`}
            />
            {emailError && <p className="mt-1 text-sm text-red-500">{emailError}</p>}
          </div>
          
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
              Bericht <span className="text-red-500">*</span>
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              required
              rows={4}
              className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white focus:ring-2 focus:ring-accent focus:border-transparent ${
                messageError ? 'border-red-500' : 'border-gray-600'
              }`}
            />
            {messageError && <p className="mt-1 text-sm text-red-500">{messageError}</p>}
          </div>

          <div className="relative">
            <button
              type="submit"
              disabled={!isFormValid() || isSubmitting}
              className={`w-full px-8 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all ${
                isFormValid() && !isSubmitting
                  ? 'bg-highlight hover:bg-highlight/90 text-white'
                  : 'bg-accent cursor-not-allowed text-gray-600'
              }`}
              title={!isFormValid() ? 'Vul het formulier aub correct in' : ''}
            >
              {isSubmitting ? 'Versturen...' : (
                <>
                  Verstuur bericht
                  <Send size={20} />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
      <Toaster position="top-right" />
    </section>
  );
};

export default Contact;