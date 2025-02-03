import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Logo } from './shared/Logo';
import { navigation } from '../constants/navigation';
import { useNavigate, useLocation } from 'react-router-dom';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (href: string) => {
    setIsOpen(false);
    if (location.pathname !== '/') {
      navigate('/');
      // Wait for navigation to complete before scrolling
      setTimeout(() => {
        const element = document.querySelector(href);
        element?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const element = document.querySelector(href);
      element?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="fixed w-full bg-primary/80 backdrop-blur-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0">
            <Logo onClick={() => navigate('/')} />
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navigation.links.map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleNavigation(item.href)}
                  className="navbar-link text-gray-300 hover:text-accent px-3 py-2 rounded-md text-base font-medium transition-colors"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
          
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-300 hover:text-accent p-2"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden absolute left-0 right-0 bg-primary/95 backdrop-blur-md border-t border-gray-800">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.links.map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleNavigation(item.href)}
                  className="navbar-link text-gray-300 hover:text-accent block px-3 py-2 rounded-md text-base font-medium w-full text-left"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};