
import React from 'react';

const TechStack = () => {
  const techDetails = [
    {
      category: "Frontend",
      technologies: ["React.js", "Tailwind CSS", "TypeScript"],
      description: "Modern, responsive user interface built with the industry's leading technologies for optimal performance and user experience."
    },
    {
      category: "Backend",
      technologies: ["Django 5.x", "Django REST Framework"],
      description: "Robust and secure API design that ensures scalability, maintainability, and enterprise-grade reliability."
    },
    {
      category: "Authentication",
      technologies: ["JWT-based login", "OTP support", "Role-based access"],
      description: "Comprehensive security protocols with flexible authentication options and fine-grained access controls."
    },
    {
      category: "Database & Security",
      technologies: ["SQLite (configurable)", "CSRF protection", "Audit logs", "CORS"],
      description: "Adaptable database architecture with multiple security layers to protect your business data at all times."
    }
  ];

  return (
    <section id="tech" className="section-padding bg-gray-50">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="section-title">Built with Modern Technology</h2>
          <p className="section-subtitle">
            BillBook leverages the latest tech stack to deliver a fast, secure, and scalable business management system.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {techDetails.map((tech, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
              <div className="bg-billbook-600 py-4 px-6">
                <h3 className="text-xl font-bold text-white">{tech.category}</h3>
              </div>
              <div className="p-6">
                <div className="flex flex-wrap gap-2 mb-4">
                  {tech.technologies.map((item, i) => (
                    <span key={i} className="px-3 py-1 bg-billbook-50 text-billbook-700 rounded-full text-sm font-medium">
                      {item}
                    </span>
                  ))}
                </div>
                <p className="text-gray-600">{tech.description}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-16 max-w-3xl mx-auto bg-billbook-50 rounded-lg p-6 border border-billbook-100">
          <h3 className="text-xl font-bold mb-3 text-gray-900">Why Our Tech Stack Matters</h3>
          <ul className="space-y-3">
            <li className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 text-billbook-600">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="ml-3 text-gray-700"><span className="font-medium">Performance</span> — Optimized codebase for fast loading and responsive interactions</p>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 text-billbook-600">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="ml-3 text-gray-700"><span className="font-medium">Security</span> — Multiple layers of protection for your sensitive business data</p>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 text-billbook-600">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="ml-3 text-gray-700"><span className="font-medium">Scalability</span> — Designed to grow with your business without performance bottlenecks</p>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 text-billbook-600">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="ml-3 text-gray-700"><span className="font-medium">Maintainability</span> — Clean architecture that simplifies updates and new feature additions</p>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default TechStack;
