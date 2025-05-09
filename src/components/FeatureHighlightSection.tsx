
import React from 'react';
import { FileText } from 'lucide-react';
import { Button } from './ui/button';

const FeatureHighlightSection = () => {
  return (
    <section id="solutions" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <div className="flex items-center gap-2 mb-4">
              <FileText size={24} className="text-billbook-600" />
              <span className="text-billbook-600 font-semibold">Invoice Management</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
              Create Professional Invoices in Seconds
            </h2>
            <p className="text-lg mb-6 text-gray-600">
              Easily generate GST-compliant invoices that look professional and reflect your brand. Add your logo, customize templates, and send invoices directly to customers.
            </p>
            <ul className="space-y-4 mb-8">
              {[
                "GST-compliant invoice templates",
                "Customizable business branding",
                "Email invoices directly to customers",
                "Track payment status in real-time",
                "Generate recurring invoices"
              ].map((item, index) => (
                <li key={index} className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-billbook-100 flex items-center justify-center mr-3">
                    <svg className="h-4 w-4 text-billbook-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
            <Button className="bg-billbook-600 hover:bg-billbook-700 text-white">
              Try Invoice Creator
            </Button>
          </div>
          
          <div className="order-1 md:order-2">
            <div className="relative">
              <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-100">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <div className="h-8 bg-billbook-100 w-32 rounded-md"></div>
                    <div className="h-4 bg-gray-100 w-24 mt-2 rounded-md"></div>
                  </div>
                  <div className="h-12 w-12 bg-billbook-100 rounded-full"></div>
                </div>
                
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <div className="h-4 bg-gray-100 w-32 rounded-md"></div>
                    <div className="h-4 bg-gray-100 w-16 rounded-md"></div>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <div className="h-4 bg-gray-100 w-40 rounded-md"></div>
                    <div className="h-4 bg-gray-100 w-20 rounded-md"></div>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <div className="h-4 bg-gray-100 w-36 rounded-md"></div>
                    <div className="h-4 bg-gray-100 w-24 rounded-md"></div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center py-2">
                  <div className="font-medium">Total</div>
                  <div className="font-bold">₹12,500.00</div>
                </div>
                
                <div className="mt-6 flex justify-end">
                  <div className="h-10 bg-billbook-100 w-32 rounded-md"></div>
                </div>
              </div>
              
              <div className="absolute -bottom-4 -right-4 h-40 w-40 bg-billbook-50 rounded-full z-[-1]"></div>
              <div className="absolute -top-4 -left-4 h-20 w-20 bg-blue-50 rounded-full z-[-1]"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureHighlightSection;
