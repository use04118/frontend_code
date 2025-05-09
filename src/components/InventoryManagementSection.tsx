
import React from 'react';
import { BarChart } from 'lucide-react';
import { Button } from './ui/button';

const InventoryManagementSection = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="bg-white shadow-lg rounded-lg border border-gray-100 overflow-hidden">
              <div className="bg-billbook-600 p-4 text-white">
                <h3 className="text-lg font-semibold">Inventory Dashboard</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-billbook-50 p-4 rounded-md">
                    <div className="text-sm text-gray-600">Total Products</div>
                    <div className="text-2xl font-bold text-gray-900">278</div>
                    <div className="text-xs text-green-600 mt-1">↑ 12% this month</div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-md">
                    <div className="text-sm text-gray-600">Low Stock Items</div>
                    <div className="text-2xl font-bold text-gray-900">24</div>
                    <div className="text-xs text-red-600 mt-1">Needs attention</div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                    <div>
                      <div className="font-medium">Product A</div>
                      <div className="text-sm text-gray-500">SKU: PRD001</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">58 units</div>
                      <div className="text-sm text-green-600">In stock</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                    <div>
                      <div className="font-medium">Product B</div>
                      <div className="text-sm text-gray-500">SKU: PRD002</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">12 units</div>
                      <div className="text-sm text-yellow-600">Low stock</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                    <div>
                      <div className="font-medium">Product C</div>
                      <div className="text-sm text-gray-500">SKU: PRD003</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">0 units</div>
                      <div className="text-sm text-red-600">Out of stock</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <div className="flex items-center gap-2 mb-4">
              <BarChart size={24} className="text-billbook-600" />
              <span className="text-billbook-600 font-semibold">Inventory Management</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
              Smart Inventory Control for Your Business
            </h2>
            <p className="text-lg mb-6 text-gray-600">
              Track stock levels, receive low inventory alerts, and manage multiple warehouses with ease. Get real-time visibility into your inventory to avoid stockouts and overstock situations.
            </p>
            <ul className="space-y-4 mb-8">
              {[
                "Real-time stock level tracking across locations",
                "Automated low stock alerts and reorder notifications",
                "Barcode scanning for quick stock updates",
                "Batch tracking and expiry date management",
                "Comprehensive inventory reports"
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
              Explore Inventory Features
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InventoryManagementSection;
