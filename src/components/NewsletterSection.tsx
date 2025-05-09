
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Mail, CheckCircle, FileText } from 'lucide-react';

const NewsletterSection = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // In a real application, you would send this to your API
      console.log('Submitted email:', email);
      setIsSubmitted(true);
      setEmail('');
      
      // Reset the success message after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 3000);
    }
  };
  
  return (
    <section id="newsletter" className="py-16 bg-billbook-50">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center justify-center bg-billbook-100 p-3 rounded-full mb-6">
                <Mail size={28} className="text-billbook-600" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
                Stay Updated with BillBook
              </h2>
              <p className="text-lg mb-6 text-gray-600">
                Subscribe to our newsletter for the latest updates, business tips, and exclusive offers.
              </p>
              
              <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6 flex items-start">
                <div className="mr-4 mt-1">
                  <FileText className="text-billbook-600" size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Free Guide: Business Financial Health Checklist</h4>
                  <p className="text-gray-600 text-sm">
                    Subscribe now and get our exclusive guide to assessing and improving your business's financial health.
                  </p>
                </div>
              </div>
              
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-grow">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-billbook-500 focus:border-transparent"
                    required
                  />
                </div>
                <Button 
                  type="submit"
                  className="bg-billbook-600 hover:bg-billbook-700 text-white whitespace-nowrap"
                >
                  Subscribe Now
                </Button>
              </form>
              
              {isSubmitted && (
                <div className="mt-4 flex items-center text-green-600">
                  <CheckCircle size={18} className="mr-2" />
                  <span>Thank you for subscribing! Check your email for the free guide.</span>
                </div>
              )}
              
              <p className="mt-4 text-sm text-gray-500">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </div>
            
            <div className="hidden md:block">
              <div className="relative">
                <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="bg-billbook-600 w-10 h-10 rounded flex items-center justify-center text-white mr-3">
                        <FileText size={20} />
                      </div>
                      <span className="font-bold text-gray-900">Business Financial Health Checklist</span>
                    </div>
                    <span className="bg-billbook-100 text-billbook-800 text-xs py-1 px-2 rounded-full">FREE</span>
                  </div>
                  <div className="space-y-3">
                    <div className="h-3 bg-gray-100 rounded w-full"></div>
                    <div className="h-3 bg-gray-100 rounded w-5/6"></div>
                    <div className="h-3 bg-gray-100 rounded w-full"></div>
                    <div className="h-3 bg-gray-100 rounded w-4/5"></div>
                  </div>
                  <div className="mt-6 space-y-3">
                    <div className="flex items-center">
                      <CheckCircle size={16} className="text-green-500 mr-2" />
                      <span className="text-sm text-gray-700">Cash Flow Assessment Guide</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle size={16} className="text-green-500 mr-2" />
                      <span className="text-sm text-gray-700">Expense Tracking Templates</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle size={16} className="text-green-500 mr-2" />
                      <span className="text-sm text-gray-700">Financial Health Score Calculator</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle size={16} className="text-green-500 mr-2" />
                      <span className="text-sm text-gray-700">Tax Saving Strategies</span>
                    </div>
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-billbook-100 rounded-full z-[-1]"></div>
                <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-blue-100 rounded-full z-[-1]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;
