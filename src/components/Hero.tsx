
import React, { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';
import Logo from './../images/logo/landing_page_image.jpg'

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    // Set animation visibility after a short delay for better page load experience
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  return (
    <section id="home" className="bg-gradient-to-r from-billbook-50 to-blue-50 py-20 md:py-28 lg:py-32 overflow-hidden">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 md:pr-8 mb-10 md:mb-0">
            <span 
              className={`inline-block bg-billbook-100 text-billbook-700 font-medium text-sm py-1 px-3 rounded-full mb-6 transition-all duration-700 transform ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              Business Management Simplified
            </span>
            <h1 
              className={`text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6 leading-tight transition-all duration-700 delay-100 transform ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              Simplify Your Business Finances with <span className="text-billbook-600">BillBook</span>
            </h1>
            <p 
              className={`text-lg md:text-xl text-gray-600 mb-8 md:pr-8 transition-all duration-700 delay-200 transform ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              All-in-one solution for sales, purchases, inventory, reporting, and compliance designed for small and medium-sized businesses.
            </p>
            <div 
              className={`flex flex-col sm:flex-row gap-4 transition-all duration-700 delay-300 transform ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <Button size="lg" className="bg-billbook-600 hover:bg-billbook-700 text-white px-6 font-medium shadow-md hover:shadow-lg transition-all duration-300 hover:translate-y-[-2px]"
              onClick={() => navigate('/auth/signin')}>
                Start Free Trial
              </Button>
              <Button size="lg" variant="outline" className="border-billbook-600 text-billbook-600 hover:bg-billbook-50 transition-all duration-300">
                Request a Demo
              </Button>
            </div>
            <div 
              className={`mt-8 text-sm text-gray-500 transition-all duration-700 delay-400 transform ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-green-500 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-green-500 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>14-day free trial</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-green-500 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Cancel anytime</span>
                </div>
              </div>
            </div>
          </div>
          
          <div
            className="md:w-1/2 animate-fade-in"
            style={{ animationDelay: '0.4s' }}
          >
            <div
              className="md:w-full animate-fade-in"
              style={{ animationDelay: '0.4s' }}
            >
              <div className="relative w-full h-full">
                <img
                  src={Logo}
                  alt="Bill Illustration"
                  className="w-full h-full object-cover rounded-lg shadow-2xl border border-gray-200"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
