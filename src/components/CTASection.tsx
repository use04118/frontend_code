
import React from 'react';
import { Rocket } from 'lucide-react';
import { Button } from './ui/button';

const CTASection = () => {
  return (
    <section className="py-20 gradient-bg">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-white/20 rounded-full">
              <Rocket size={32} className="text-white" />
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            Ready to Transform Your Business Operations?
          </h2>
          <p className="text-lg mb-10 text-white/90">
            Join thousands of businesses that use BillBook to simplify accounting, 
            inventory management, and compliance. Start your free trial today!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-billbook-600 hover:bg-gray-100 px-8 font-medium">
              Start Free Trial
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8">
              Schedule a Demo
            </Button>
          </div>
          <p className="mt-8 text-sm text-white/80">
            No credit card required. 14-day free trial. Cancel anytime.
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
