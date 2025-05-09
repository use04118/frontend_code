import React, { useState } from 'react';
import ProductForm from "./CreateItemLayoutForm/ProductForm";
import ServiceForm from "./CreateItemLayoutForm/ServiceForm";
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';

// Define the type for item type
type ItemType = "product" | "service";

const CreateItemLayout: React.FC = () => {
  const [selectedType, setSelectedType] = useState<ItemType>("product");
  

  return (
    <>
  <Breadcrumb pageName="Create Items" />
      <div className="w-full flex flex-col gap-6">
      {/* Selection Toggle */}
      <div className="flex justify-start items-center gap-6 p-4">
        {/* Product Option */}
        <label
          className={`flex items-center gap-2 cursor-pointer px-4 py-2 rounded-md border ${
            selectedType === "product"
              ? "border-blue-500 text-blue-600 font-medium"
              : "border-gray-300 text-gray-600"
          }`}
        >
          <input
            type="radio"
            name="itemType"
            value="product"
            checked={selectedType === "product"}
            onChange={() => setSelectedType("product")}
            className="hidden"
          />
          <span
            className={`w-5 h-5 flex items-center justify-center rounded-full border ${
              selectedType === "product" ? "border-blue-500 bg-blue-500" : "border-gray-400"
            }`}
          ></span>
          Product
        </label>

        {/* Service Option */}
        <label
          className={`flex items-center gap-2 cursor-pointer px-4 py-2 rounded-md border ${
            selectedType === "service"
              ? "border-blue-500 text-blue-600 font-medium"
              : "border-gray-300 text-gray-600"
          }`}
        >
          <input
            type="radio"
            name="itemType"
            value="service"
            checked={selectedType === "service"}
            onChange={() => setSelectedType("service")}
            className="hidden"
          />
          <span
            className={`w-5 h-5 flex items-center justify-center rounded-full border ${
              selectedType === "service" ? "border-blue-500 bg-blue-500" : "border-gray-400"
            }`}
          ></span>
          Service
        </label>
      </div>

      {/* Conditionally Render Forms */}
      {selectedType === "product" ? <ProductForm /> : <ServiceForm />}
    </div>
    </>
  );
};

export default CreateItemLayout;
