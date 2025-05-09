
import React, { useState } from 'react';
import { HelpCircle } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";

const FAQSection = () => {
  const faqs = [
    {
      question: "How does the 14-day free trial work?",
      answer: "You get full access to all BillBook Premium features for 14 days. No credit card required to start, and you can cancel anytime. If you decide to continue, you can choose from our monthly or annual plans."
    },
    {
      question: "Can I export my data from BillBook?",
      answer: "Yes, BillBook allows you to export all your data in standard formats like CSV and PDF. You can export invoices, inventory reports, financial statements, and more with just a few clicks."
    },
    {
      question: "Is BillBook GST compliant?",
      answer: "Absolutely. BillBook is fully GST compliant and updated with the latest GST regulations. We support GSTR filing, e-invoicing, and all GST-related compliance requirements for Indian businesses."
    },
    {
      question: "How secure is my business data with BillBook?",
      answer: "We take security seriously. BillBook uses industry-standard encryption, secure data centers, and regular security audits. Your data is backed up regularly, and we have strict access controls in place to protect your business information."
    },
    {
      question: "Can multiple users access the same BillBook account?",
      answer: "Yes, our Premium plans support multiple users with role-based access control. You can set specific permissions for different team members based on their responsibilities."
    },
    {
      question: "What kind of support do you offer?",
      answer: "We provide email support for all users. Premium subscribers get priority support with faster response times, and Annual plan subscribers also receive dedicated account management."
    }
  ];

  return (
    <section id="faq" className="section-padding bg-billbook-50">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-4">
            <HelpCircle size={40} className="text-billbook-600" />
          </div>
          <h2 className="section-title">Frequently Asked Questions</h2>
          <p className="section-subtitle">
            Get quick answers to common questions about BillBook features, pricing, and support.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`} 
                className="bg-white rounded-lg shadow-sm border border-gray-100"
              >
                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  <span className="text-left text-lg font-medium text-gray-800">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 pt-2 text-gray-600">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-6">Still have questions? We're here to help.</p>
          <a 
            href="#contact" 
            className="inline-flex items-center bg-white text-billbook-600 border-2 border-billbook-600 py-2 px-6 rounded-md hover:bg-billbook-50 transition-colors"
          >
            Contact Support
          </a>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
