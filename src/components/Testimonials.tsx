
import React from 'react';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext
} from './ui/carousel';
import { Card, CardContent } from './ui/card';
import { MessageSquare } from 'lucide-react';

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  company: string;
  businessType: string;
  avatar: string;
}

const Testimonials = () => {
  const testimonials: Testimonial[] = [
    {
      quote: "BillBook has revolutionized how we manage inventory and invoicing. The GST compliance features alone have saved us countless hours every month.",
      author: "Amit Patel",
      role: "Owner",
      company: "Patel Electronics",
      businessType: "Retail",
      avatar: "https://i.pravatar.cc/150?img=11"
    },
    {
      quote: "The reporting tools in BillBook give me insights I never had before. I can finally make data-driven decisions with confidence.",
      author: "Priya Sharma",
      role: "Finance Manager",
      company: "Sharma Distributors",
      businessType: "Wholesale",
      avatar: "https://i.pravatar.cc/150?img=26"
    },
    {
      quote: "As a service business, we needed specific features for billing and client management. BillBook was flexible enough to meet all our requirements.",
      author: "Rahul Singh",
      role: "Director",
      company: "Singh Consulting",
      businessType: "Service",
      avatar: "https://i.pravatar.cc/150?img=33"
    },
    {
      quote: "BillBook's mobile app lets me manage my business on the go. I can create invoices, check inventory, and track payments from anywhere.",
      author: "Sneha Verma",
      role: "CEO",
      company: "Verma Enterprises",
      businessType: "Manufacturing",
      avatar: "https://i.pravatar.cc/150?img=20"
    },
    {
      quote: "The customer support team at BillBook is exceptional. They've helped us customize the software to perfectly fit our pharmaceutical business needs.",
      author: "Dr. Vikram Mehta",
      role: "Managing Director",
      company: "Mehta Pharmacy Chain",
      businessType: "Healthcare",
      avatar: "https://i.pravatar.cc/150?img=15"
    }
  ];

  return (
    <section id="testimonials" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center bg-billbook-100 p-3 rounded-full mb-6">
            <MessageSquare size={28} className="text-billbook-600" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
            Trusted by Businesses Like Yours
          </h2>
          <p className="text-lg max-w-3xl mx-auto text-gray-600">
            See how BillBook is helping small and medium-sized businesses streamline their operations.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Carousel className="w-full relative">
            <CarouselContent>
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index}>
                  <Card className="border-0 shadow-lg">
                    <CardContent className="p-8">
                      <div className="mb-6">
                        <svg width="45" height="36" className="fill-billbook-200">
                          <path d="M13.415.001C6.07 5.185.887 13.681.887 23.041c0 7.632 4.608 12.096 9.936 12.096 5.04 0 8.784-4.032 8.784-8.784 0-4.752-3.312-8.208-7.632-8.208-.864 0-2.016.144-2.304.288.72-4.896 5.328-10.656 9.936-13.536L13.415.001zm24.768 0c-7.2 5.184-12.384 13.68-12.384 23.04 0 7.632 4.608 12.096 9.936 12.096 4.896 0 8.784-4.032 8.784-8.784 0-4.752-3.456-8.208-7.776-8.208-.864 0-1.872.144-2.16.288.72-4.896 5.184-10.656 9.792-13.536L38.183.001z"></path>
                        </svg>
                      </div>
                      <p className="text-xl italic text-gray-700 mb-6">"{testimonial.quote}"</p>
                      
                      <div className="flex items-center">
                        <img 
                          src={testimonial.avatar} 
                          alt={testimonial.author} 
                          className="w-16 h-16 rounded-full object-cover mr-4 border-2 border-billbook-100"
                        />
                        <div>
                          <p className="font-bold text-gray-900 text-lg">{testimonial.author}</p>
                          <p className="text-gray-600">
                            {testimonial.role}, {testimonial.company}
                          </p>
                          <span className="inline-block bg-gray-100 rounded-full px-3 py-1 text-xs font-medium text-gray-700 mt-1">
                            {testimonial.businessType} Business
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-center mt-8 gap-2">
              <CarouselPrevious className="relative -left-0 hover:bg-billbook-100" />
              <CarouselNext className="relative -right-0 hover:bg-billbook-100" />
            </div>
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
