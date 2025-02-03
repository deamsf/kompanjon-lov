import React from 'react';
import { Facebook, Instagram, Linkedin, Youtube, Twitter, BookOpen } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const socialLinks = [
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'X (Twitter)' },
    { icon: BookOpen, href: '#', label: 'Medium' },
    { icon: Youtube, href: '#', label: 'YouTube' },
  ];

  return (
    <footer className="bg-primary/95 py-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center space-y-8">
          <div className="flex space-x-4">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                className="text-gray-400 hover:text-accent transition-colors"
                aria-label={social.label}
              >
                <social.icon className="w-5 h-5" />
              </a>
            ))}
          </div>
          
          <div className="flex items-center justify-center space-x-4 text-sm text-gray-400">
            <span>© {currentYear} 3volve Consulting (BE1018741807). Alle rechten voorbehouden. </span>
            <span>•</span>
            <a href="/privacy" className="hover:text-accent transition-colors">
              Privacy Policy
            </a>
            <span>•</span>
            <a href="/cookies" className="hover:text-accent transition-colors">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;