
import React from 'react';
import { Phone } from 'lucide-react';
import { Button } from './ui/button';

const MobileAppSection = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-billbook-50 to-blue-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <Phone size={40} className="text-billbook-600" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
            Manage Your Business On The Go
          </h2>
          <p className="text-lg max-w-3xl mx-auto text-gray-600">
            Take your business wherever you go with our mobile app. Create invoices, track inventory,
            and monitor sales right from your smartphone.
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-8">
          <div className="w-full md:w-1/2 lg:w-2/5 order-2 md:order-1">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Download the BillBook App</h3>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <div className="bg-billbook-100 p-2 rounded-full mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-billbook-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-700">Create and send invoices instantly</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-billbook-100 p-2 rounded-full mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-billbook-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-700">Manage inventory in real-time</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-billbook-100 p-2 rounded-full mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-billbook-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-700">Track sales and monitor business performance</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-billbook-100 p-2 rounded-full mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-billbook-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-700">Get business insights on the go</span>
                </li>
              </ul>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="bg-billbook-600 hover:bg-billbook-700 text-white flex items-center justify-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 19H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v5.5" />
                    <path d="M16 19h6" />
                    <path d="M19 16v6" />
                  </svg>
                  Download for Android
                </Button>
                <Button variant="outline" className="border-billbook-600 text-billbook-600 hover:bg-billbook-50 flex items-center justify-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 19H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v5.5" />
                    <path d="M16 19h6" />
                  </svg>
                  Download for iOS
                </Button>
              </div>
            </div>
          </div>
          
          <div className="w-full md:w-1/3 order-1 md:order-2 mb-8 md:mb-0">
            <div className="relative">
              <div className="bg-white p-2 rounded-lg shadow-lg border border-gray-200 transform rotate-3">
                <div className="bg-gray-800 h-6 rounded-t-md"></div>
                <div className="grid grid-cols-2 gap-2 p-3">
                  <div className="col-span-2 h-12 bg-billbook-100 rounded-md"></div>
                  <div className="h-20 bg-gray-100 rounded-md"></div>
                  <div className="h-20 bg-gray-100 rounded-md"></div>
                  <div className="col-span-2 h-12 bg-gray-100 rounded-md"></div>
                </div>
              </div>
              <div className="absolute top-4 -right-4 bg-white p-2 rounded-lg shadow-lg border border-gray-200 transform -rotate-6 z-[-1] w-full h-full"></div>
              <div className="absolute -bottom-4 -left-4 bg-white p-2 rounded-lg shadow-lg border border-gray-200 transform rotate-6 z-[-2] w-full h-full"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MobileAppSection;
