
import React from 'react';
import { Package, UserCheck, FileText, BarChart3 } from 'lucide-react';

interface Step {
  icon: React.ElementType;
  title: string;
  description: string;
  number: number;
}

const HowItWorksSection = () => {
  const steps: Step[] = [
    {
      icon: UserCheck,
      title: "Sign Up & Setup",
      description: "Create your account and set up your business profile with your company details and preferences.",
      number: 1
    },
    {
      icon: Package,
      title: "Import Data",
      description: "Import your existing inventory, customer data, and supplier information with our easy migration tools.",
      number: 2
    },
    {
      icon: FileText,
      title: "Create Invoices",
      description: "Start creating GST-compliant invoices and manage your daily business operations effortlessly.",
      number: 3
    },
    {
      icon: BarChart3,
      title: "Analyze & Grow",
      description: "Gain insights from comprehensive reports and make data-driven decisions to grow your business.",
      number: 4
    }
  ];

  return (
    <section id="how-it-works" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
            How BillBook Works
          </h2>
          <p className="text-lg max-w-3xl mx-auto text-gray-600">
            Get started with BillBook in just a few simple steps and transform your business operations.
          </p>
        </div>

        <div className="max-w-5xl mx-auto overflow-hidden">
          <div className="relative">
            {/* Connection Line - visible only on medium and above screens */}
            <div className="hidden md:block absolute top-24 left-0 w-full h-0.5 bg-gray-200 z-0"></div>
            
            {/* Steps */}
            <div className="flex flex-col md:flex-row md:justify-between relative z-10 overflow-x-auto pb-4 md:pb-0 snap-x snap-mandatory">
              {steps.map((step, index) => (
                <div 
                  key={index} 
                  className="flex-shrink-0 w-full md:w-auto md:flex-1 flex flex-col items-center text-center mb-12 md:mb-0 snap-center px-4 md:px-2"
                >
                  <div className="relative inline-flex items-center justify-center mb-6">
                    <div className="absolute w-16 h-16 bg-billbook-100 rounded-full animate-pulse"></div>
                    <div className="relative bg-white border-2 border-billbook-600 rounded-full p-4 z-10 transition-all duration-300 hover:scale-110">
                      <step.icon size={28} className="text-billbook-600" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-billbook-600 flex items-center justify-center text-white font-bold">
                      {step.number}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile instruction hint with improved visibility */}
        <div className="md:hidden text-center mt-8 px-4">
          <div className="bg-billbook-50 py-2 px-4 rounded-full inline-flex items-center">
            <span className="animate-bounce mr-2">👆</span>
            <p className="text-sm font-medium text-billbook-600">Swipe left to see all steps</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
