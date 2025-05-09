import React from 'react';
import { Info, Award, BarChart } from 'lucide-react';

const AboutSection = () => {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-4">
            <Info size={40} className="text-billbook-600" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
            About BillBook
          </h2>
          <p className="text-lg max-w-3xl mx-auto text-gray-600 mb-8">
            BillBook was founded with a simple mission: to make business management effortless for SMEs across India. 
            Our journey began in 2018 when our founders experienced firsthand the challenges of running a small business.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h3 className="text-2xl font-bold mb-4 text-gray-900">Our Mission</h3>
            <p className="text-gray-600 mb-6">
              We're on a mission to empower small and medium businesses with enterprise-grade tools that are affordable, 
              easy to use, and tailored to the unique needs of the Indian market.
            </p>
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
              <h4 className="font-semibold text-lg mb-2 text-gray-800">Our Vision</h4>
              <p className="text-gray-600">
                To create a world where every business, regardless of size, has access to powerful tools that drive growth and efficiency.
              </p>
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-8 border border-gray-100">
            <div className="flex flex-col gap-6">
              <div className="flex items-start">
                <div className="bg-billbook-100 p-3 rounded-full mr-4">
                  <Award className="text-billbook-600 h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Excellence in Service</h4>
                  <p className="text-gray-600">We're dedicated to providing exceptional service and support to our customers.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-billbook-100 p-3 rounded-full mr-4">
                  <BarChart className="text-billbook-600 h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Data-Driven Decisions</h4>
                  <p className="text-gray-600">We help businesses make informed decisions with powerful analytics.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-billbook-50 rounded-lg p-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Growth</h3>
            <p className="text-gray-600 max-w-3xl mx-auto">
              From a small startup to a trusted partner for thousands of businesses across India.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { number: "10K+", label: "Active Users" },
              { number: "50M+", label: "Invoices Generated" },
              { number: "100+", label: "Team Members" },
              { number: "20+", label: "States Covered" }
            ].map((stat, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                <p className="text-3xl font-bold text-billbook-600 mb-2">{stat.number}</p>
                <p className="text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
