
import React from 'react';
import { Link2 } from 'lucide-react';

const IntegrationPartners = () => {
  const partnerLogos = [
    { name: "Bank 1", logo: "bg-gradient-to-r from-blue-50 to-blue-100 h-16 w-32 flex items-center justify-center rounded-lg font-bold text-blue-500 shadow-sm border border-blue-200" },
    { name: "Payment Gateway", logo: "bg-gradient-to-r from-green-50 to-green-100 h-16 w-32 flex items-center justify-center rounded-lg font-bold text-green-500 shadow-sm border border-green-200" },
    { name: "E-Commerce", logo: "bg-gradient-to-r from-yellow-50 to-yellow-100 h-16 w-32 flex items-center justify-center rounded-lg font-bold text-yellow-600 shadow-sm border border-yellow-200" },
    { name: "Accounting", logo: "bg-gradient-to-r from-purple-50 to-purple-100 h-16 w-32 flex items-center justify-center rounded-lg font-bold text-purple-500 shadow-sm border border-purple-200" },
    { name: "Tax Filing", logo: "bg-gradient-to-r from-red-50 to-red-100 h-16 w-32 flex items-center justify-center rounded-lg font-bold text-red-500 shadow-sm border border-red-200" },
    { name: "CRM", logo: "bg-gradient-to-r from-indigo-50 to-indigo-100 h-16 w-32 flex items-center justify-center rounded-lg font-bold text-indigo-500 shadow-sm border border-indigo-200" },
  ];

  const integrationBenefits = [
    {
      title: "Seamless Banking",
      description: "Connect directly with your bank accounts for real-time transaction tracking and reconciliation."
    },
    {
      title: "Payment Gateway Integration",
      description: "Accept online payments directly through invoices with popular payment gateways."
    },
    {
      title: "E-Commerce Connectivity",
      description: "Sync your online store inventory and orders automatically with BillBook."
    },
    {
      title: "Tax Filing Support",
      description: "Export data in formats compatible with popular tax filing platforms."
    }
  ];

  return (
    <section id="integrations" className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center bg-billbook-100 p-3 rounded-full mb-6">
            <Link2 size={28} className="text-billbook-600" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
            Powerful Integrations
          </h2>
          <p className="text-lg max-w-3xl mx-auto text-gray-600">
            BillBook connects seamlessly with the tools and services your business already uses.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-16">
          {partnerLogos.map((partner, index) => (
            <div key={index} className="flex items-center justify-center transform hover:-translate-y-2 transition-transform duration-300 hover:shadow-md">
              <div className={partner.logo}>{partner.name}</div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {integrationBenefits.map((benefit, index) => (
            <div 
              key={index} 
              className="bg-white p-6 rounded-xl border border-gray-100 hover:border-billbook-200 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1"
            >
              <h3 className="text-xl font-bold mb-3 text-gray-900">{benefit.title}</h3>
              <p className="text-gray-600">{benefit.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-6">Looking for a specific integration? Let us know!</p>
          <a 
            href="#contact" 
            className="inline-flex items-center bg-white text-billbook-600 border-2 border-billbook-600 py-2 px-6 rounded-md hover:bg-billbook-50 transition-all duration-300 hover:shadow-md"
          >
            Request Integration
          </a>
        </div>
      </div>
    </section>
  );
};

export default IntegrationPartners;
