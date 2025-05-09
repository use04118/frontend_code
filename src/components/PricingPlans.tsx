
import React from 'react';
import { Button } from './ui/button';

interface PricingPlanProps {
  title: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  isPopular?: boolean;
  ctaText: string;
}

const PricingPlan = ({ 
  title, 
  price, 
  period, 
  description, 
  features, 
  isPopular = false, 
  ctaText 
}: PricingPlanProps) => {
  return (
    <div className={`bg-white rounded-lg overflow-hidden shadow-lg transition-transform hover:-translate-y-1 ${
      isPopular ? 'border-2 border-billbook-500 relative' : 'border border-gray-200'
    }`}>
      {isPopular && (
        <div className="bg-billbook-500 text-white text-sm font-bold uppercase py-1 px-4 absolute top-0 right-0 transform translate-x-2 -translate-y-5 rotate-45">
          Popular
        </div>
      )}
      <div className="p-6">
        <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
        <div className="mt-4 flex items-baseline">
          <span className="text-4xl font-extrabold text-gray-900">{price}</span>
          <span className="ml-1 text-xl text-gray-500">/{period}</span>
        </div>
        <p className="mt-5 text-gray-500">{description}</p>
        
        <ul className="mt-8 space-y-4">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <svg className="flex-shrink-0 h-6 w-6 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="ml-3 text-gray-700">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="px-6 py-8 bg-gray-50 border-t border-gray-100">
        <Button 
          className={`w-full ${
            isPopular 
              ? 'bg-billbook-600 hover:bg-billbook-700 text-white'
              : 'bg-white text-billbook-600 border-2 border-billbook-600 hover:bg-billbook-50'
          }`}
        >
          {ctaText}
        </Button>
      </div>
    </div>
  );
};

const PricingPlans = () => {
  const plans = [
    {
      title: "Free Trial",
      price: "₹0",
      period: "14 days",
      description: "Try out all premium features for your small business at no cost.",
      features: [
        "All core features",
        "Up to 50 invoices",
        "Single user",
        "Basic reporting",
        "Email support"
      ],
      ctaText: "Start Free Trial"
    },
    {
      title: "Premium Monthly",
      price: "₹1,499",
      period: "month",
      description: "Flexible monthly billing for growing businesses.",
      features: [
        "Unlimited invoices",
        "Up to 5 users",
        "Advanced reporting",
        "E-invoicing",
        "GST compliance",
        "Priority support"
      ],
      isPopular: true,
      ctaText: "Choose Monthly"
    },
    {
      title: "Premium Annual",
      price: "₹14,999",
      period: "year",
      description: "Save 16% with our annual billing option.",
      features: [
        "Everything in Monthly",
        "Up to 10 users",
        "Multiple business profiles",
        "Data backup",
        "API access",
        "Dedicated account manager"
      ],
      ctaText: "Choose Annual"
    }
  ];

  return (
    <section id="pricing" className="section-padding bg-gray-50">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="section-title">Simple, Transparent Pricing</h2>
          <p className="section-subtitle">
            Choose the plan that fits your business needs. No hidden fees or long-term commitments.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <PricingPlan
              key={index}
              title={plan.title}
              price={plan.price}
              period={plan.period}
              description={plan.description}
              features={plan.features}
              isPopular={plan.isPopular}
              ctaText={plan.ctaText}
            />
          ))}
        </div>
        
        <div className="mt-16 max-w-3xl mx-auto bg-white rounded-lg p-6 border border-gray-200 text-center">
          <h3 className="text-lg font-bold mb-2">Need a custom plan?</h3>
          <p className="text-gray-600 mb-6">We offer tailored solutions for businesses with specific requirements.</p>
          <Button variant="outline" className="border-billbook-600 text-billbook-600 hover:bg-billbook-50">
            Contact Sales
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PricingPlans;
