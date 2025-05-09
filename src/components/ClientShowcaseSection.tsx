
import React from 'react';
import { Users } from 'lucide-react';

const ClientShowcaseSection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <Users size={40} className="text-billbook-600" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
            Trusted by 10,000+ Businesses Across India
          </h2>
          <p className="text-lg max-w-3xl mx-auto text-gray-600">
            From small retailers to medium enterprises, businesses of all sizes rely on BillBook for their daily operations.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {[1, 2, 3, 4, 5, 6].map((index) => (
            <div key={index} className="flex items-center justify-center">
              <div className="bg-gray-100 h-16 w-32 rounded flex items-center justify-center text-gray-400 font-semibold">
                Client {index}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col md:flex-row gap-6 items-center justify-center">
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 max-w-md">
            <div className="flex justify-between mb-4">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-gray-500 text-sm">1 month ago</span>
            </div>
            <p className="text-gray-700 mb-4">
              "BillBook has simplified our inventory management and billing process. The GST compliance features are exceptional and save us so much time every month."
            </p>
            <div className="flex items-center">
              <div className="bg-gray-300 w-10 h-10 rounded-full mr-3"></div>
              <div>
                <p className="font-medium text-gray-900">Rajesh Kumar</p>
                <p className="text-sm text-gray-600">General Store Owner</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 max-w-md">
            <div className="flex justify-between mb-4">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-gray-500 text-sm">2 weeks ago</span>
            </div>
            <p className="text-gray-700 mb-4">
              "The reporting tools in BillBook give me insights I never had before. Now I can make better business decisions with confidence."
            </p>
            <div className="flex items-center">
              <div className="bg-gray-300 w-10 h-10 rounded-full mr-3"></div>
              <div>
                <p className="font-medium text-gray-900">Priya Sharma</p>
                <p className="text-sm text-gray-600">Boutique Owner</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClientShowcaseSection;
