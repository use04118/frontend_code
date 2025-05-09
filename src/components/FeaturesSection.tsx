
import React from 'react';
import { 
  BarChart, 
  File, 
  Users, 
  FileText, 
  ChartLine, 
  ShoppingCart 
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => {
  return (
    <Card className="feature-card h-full transition-all duration-300 hover:shadow-lg">
      <CardContent className="pt-6">
        <div className="text-billbook-600 mb-4">
          {icon}
        </div>
        <h3 className="text-lg font-bold mb-2 text-gray-900">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </CardContent>
    </Card>
  );
};

const FeaturesSection = () => {
  const features = [
    {
      icon: <ShoppingCart size={36} />,
      title: "Sales & Purchase Management",
      description: "Create professional invoices, manage returns, generate quotations, and handle credit/debit notes with ease."
    },
    {
      icon: <BarChart size={36} />,
      title: "Inventory Tracking",
      description: "Complete stock management with multiple godown support, low stock alerts, and real-time tracking."
    },
    {
      icon: <FileText size={36} />,
      title: "Financial Tools",
      description: "Track expenses, manage cash and bank accounts, and automate recurring bills for better financial control."
    },
    {
      icon: <ChartLine size={36} />,
      title: "Reporting Suite",
      description: "Comprehensive financial, GST, inventory, party, and transaction reports to drive business decisions."
    },
    {
      icon: <File size={36} />,
      title: "Compliance",
      description: "Seamless E-Invoicing, GSTR support, HSN/SAC lookup, and other compliance features to stay regulatory-ready."
    },
    {
      icon: <Users size={36} />,
      title: "User & Role Management",
      description: "Multi-user access with role-based permissions and customizable business profiles for team collaboration."
    },
  ];

  const businessBenefits = [
    "Save up to 20 hours per week on manual accounting tasks",
    "Reduce inventory discrepancies by 95%",
    "Stay 100% compliant with latest tax regulations",
    "Access your business data anytime, anywhere",
  ];

  return (
    <section id="features" className="section-padding bg-white">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center bg-billbook-100 p-3 rounded-full mb-6">
            <FileText size={28} className="text-billbook-600" />
          </div>
          <h2 className="section-title">Powerful Solutions for Your Business</h2>
          <p className="section-subtitle">
            BillBook provides all the tools you need to manage your business efficiently in one place.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
        
        <div className="mt-16 bg-billbook-50 p-8 rounded-lg">
          <h3 className="text-xl font-bold mb-6 text-center text-gray-900">Why Businesses Choose BillBook</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {businessBenefits.map((benefit, index) => (
              <div key={index} className="flex items-center">
                <div className="bg-billbook-600 rounded-full p-1 mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="font-medium text-gray-800">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-16 text-center">
          <p className="mb-6 text-lg text-gray-700">Ready to transform how you manage your business?</p>
          <Button 
            className="bg-billbook-600 hover:bg-billbook-700 text-white font-medium py-2 px-6 rounded-md"
          >
            Get Started Free
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 ml-1" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path 
                fillRule="evenodd" 
                d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" 
                clipRule="evenodd" 
              />
            </svg>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
