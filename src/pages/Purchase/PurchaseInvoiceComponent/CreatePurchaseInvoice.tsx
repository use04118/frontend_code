import React from 'react'
import { useNavigate } from 'react-router-dom';

const CreatePurchaseInvoice: React.FC = () => {
  const navigate = useNavigate();
  
  const handleCreateParty = () => {
    navigate("/Purchase/Create-Purchases-Invoice-form");
  };

  return (
    <div className="p-4">
      <button
        onClick={handleCreateParty}
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
      >
        Create Purchase Invoice
      </button>
    </div>
  );
}

export default CreatePurchaseInvoice;
