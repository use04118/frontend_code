
import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import FeaturesSection from '../components/FeaturesSection';
// import TechStack from '../components/TechStack';
import Testimonials from '../components/Testimonials';
import PricingPlans from '../components/PricingPlans';
import FAQSection from '../components/FAQSection';
import IntegrationPartners from '../components/IntegrationPartners';
// import CTASection from '../components/CTASection';
import Footer from '../components/Footer';
import FeatureHighlightSection from '../components/FeatureHighlightSection';
import InventoryManagementSection from '../components/InventoryManagementSection';
import MobileAppSection from '../components/MobileAppSection';
// import ClientShowcaseSection from '../components/ClientShowcaseSection';
import NewsletterSection from '../components/NewsletterSection';
import AboutSection from '../components/AboutSection';
// import BlogSection from '../components/BlogSection';
import ContactSection from '../components/ContactSection';
import ComparisonSection from '../components/ComparisonSection';
// import StatsSection from '../components/StatsSection';
import HowItWorksSection from '../components/HowItWorksSection';
import Preloader from '../components/Preloader';
import { toast } from 'sonner';

const Index = () => {
  const [pageLoaded, setPageLoaded] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    // Track scroll progress
    const handleScroll = () => {
      const totalHeight = document.body.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
    };

    // Set up page load detection
    if (document.readyState === 'complete') {
      setPageLoaded(true);
    } else {
      window.addEventListener('load', () => setPageLoaded(true));
    }

    // Display welcome toast after page loads
    const timer = setTimeout(() => {
      toast.success("Welcome to BillBook!", {
        description: "Explore our features to streamline your business operations.",
        duration: 5000,
      });
    }, 2500);

    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth'
          });
        }
      });
    });

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('load', () => setPageLoaded(true));
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="min-h-screen">
      <Preloader />
      <div className="fixed top-0 left-0 right-0 h-1 z-50">
        <div 
          className="bg-billbook-600 h-full transition-all duration-300 ease-out"
          style={{ width: `${scrollProgress}%` }}
        ></div>
      </div>
      <Navbar />
      <main className="overflow-x-hidden">
        <Hero />
        {/* <StatsSection /> */}
        <AboutSection />
        <HowItWorksSection />
        <FeaturesSection />
        <FeatureHighlightSection />
        <InventoryManagementSection />
        <ComparisonSection />
        <IntegrationPartners />
        {/* <TechStack /> */}
        <MobileAppSection />
        {/* <ClientShowcaseSection /> */}
        <Testimonials />
        {/* <BlogSection /> */}
        <PricingPlans />
        <FAQSection />
        <ContactSection />
        <NewsletterSection />
        {/* <CTASection /> */}
      </main>
      <Footer />
      <button 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`fixed bottom-8 right-8 bg-billbook-600 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:bg-billbook-700 hover:scale-110 ${scrollProgress > 20 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        aria-label="Scroll to top"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 7-7 7 7"></path><path d="M12 19V5"></path></svg>
      </button>
    </div>
  );
};

export default Index;
