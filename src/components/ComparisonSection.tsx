
import React from 'react';
import { Check, X } from 'lucide-react';

interface FeatureComparison {
  feature: string;
  billbook: boolean;
  competitor1: boolean;
  competitor2: boolean;
}

const ComparisonSection = () => {
  const comparisons: FeatureComparison[] = [
    {
      feature: "GST Compliant Invoicing",
      billbook: true,
      competitor1: true,
      competitor2: false
    },
    {
      feature: "Mobile App Access",
      billbook: true,
      competitor1: false,
      competitor2: true
    },
    {
      feature: "Real-time Inventory Tracking",
      billbook: true,
      competitor1: false,
      competitor2: false
    },
    {
      feature: "Automated Tax Calculations",
      billbook: true,
      competitor1: true,
      competitor2: true
    },
    {
      feature: "Business Analytics Dashboard",
      billbook: true,
      competitor1: false,
      competitor2: true
    },
    {
      feature: "Multi-branch Management",
      billbook: true,
      competitor1: false,
      competitor2: false
    },
    {
      feature: "24/7 Customer Support",
      billbook: true,
      competitor1: false,
      competitor2: false
    }
  ];

  const FeatureIcon = ({ available }: { available: boolean }) => {
    return available ? (
      <Check className="h-6 w-6 text-green-500" />
    ) : (
      <X className="h-6 w-6 text-red-500" />
    );
  };

  return (
    <section id="comparison" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
            Why Choose BillBook?
          </h2>
          <p className="text-lg max-w-3xl mx-auto text-gray-600">
            See how BillBook stacks up against other business management solutions.
          </p>
        </div>

        <div className="max-w-4xl mx-auto overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-billbook-600">
                <th className="py-4 px-6 text-left text-white font-medium">Features</th>
                <th className="py-4 px-6 text-center text-white font-medium">BillBook</th>
                <th className="py-4 px-6 text-center text-white font-medium">Competitor A</th>
                <th className="py-4 px-6 text-center text-white font-medium">Competitor B</th>
              </tr>
            </thead>
            <tbody>
              {comparisons.map((item, index) => (
                <tr 
                  key={index} 
                  className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} border-b border-gray-200`}
                >
                  <td className="py-4 px-6 text-gray-800 font-medium">{item.feature}</td>
                  <td className="py-4 px-6 text-center">
                    <div className="flex justify-center">
                      <FeatureIcon available={item.billbook} />
                    </div>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <div className="flex justify-center">
                      <FeatureIcon available={item.competitor1} />
                    </div>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <div className="flex justify-center">
                      <FeatureIcon available={item.competitor2} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-500 text-sm italic max-w-2xl mx-auto">
            This comparison is based on the standard features offered by each platform as of May 2025. 
            Features may change over time. Please check with individual providers for the most current information.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ComparisonSection;
