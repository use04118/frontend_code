
import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  const navLinks = [
    { name: "Home", href: "#home" },
    { name: "About", href: "#about" },
    { name: "Features", href: "#features" },
    { name: "Solutions", href: "#solutions" },
    { name: "How It Works", href: "#how-it-works" },
    { name: "Pricing", href: "#pricing" },
    { name: "FAQ", href: "#faq" },
    { name: "Contact", href: "#contact" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleNavLinkClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${
      scrolled ? 'bg-white/95 shadow-md backdrop-blur-sm' : 'bg-white/80 backdrop-blur-sm'
    }`}>
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <div className="flex items-center">
          <a href="#home" className="flex items-center">
            <span className="text-2xl font-bold text-billbook-700">Bill<span className="text-billbook-500">Book</span></span>
          </a>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-4">
          {navLinks.map((link) => (
            <a 
              key={link.name}
              href={link.href} 
              className="text-gray-700 hover:text-billbook-600 font-medium text-sm transition-colors relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-billbook-600 after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left"
            >
              {link.name}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          <Button onClick={() => navigate('/auth/signin')} variant="ghost" className="hover:bg-billbook-50">Log In</Button>
          <Button className="bg-billbook-600 hover:bg-billbook-700 transition-all duration-300 hover:shadow-md hover:translate-y-[-1px]">Start Free Trial</Button>
        </div>
        
        {/* Mobile Navigation Toggle */}
        <button 
          className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      
      {/* Mobile Navigation Menu */}
      <div 
        className={`md:hidden bg-white border-t border-gray-200 absolute w-full left-0 transition-all duration-300 ease-in-out ${
          isMenuOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
        }`}
      >
        <div className="container mx-auto px-4 py-3 space-y-2">
          {navLinks.map((link) => (
            <a 
              key={link.name}
              href={link.href} 
              className="block py-2 text-gray-700 hover:text-billbook-600 font-medium"
              onClick={handleNavLinkClick}
            >
              {link.name}
            </a>
          ))}
          <div className="pt-4 flex flex-col space-y-2">
            <Button onClick={() => navigate('/auth/signin')} variant="ghost" className="hover:bg-billbook-50 w-full" >Log In</Button>
            <Button className="bg-billbook-600 hover:bg-billbook-700 w-full">Start Free Trial</Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
