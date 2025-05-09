import React from 'react';
import { useNavigate } from 'react-router-dom';

const CreateSalesInvoice: React.FC = () => {
  const navigate = useNavigate();

  const handleCreateSalesInvoice = () => {
    navigate("/Sales/Create-Sales-Invoice-form");
  };

  return (
    <div className="p-4">
      <button
        onClick={handleCreateSalesInvoice}
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
      >
        Create Sales Invoice
      </button>
    </div>
  );
};

export default CreateSalesInvoice;
