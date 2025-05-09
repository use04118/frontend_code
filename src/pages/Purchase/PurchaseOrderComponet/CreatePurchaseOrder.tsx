import React from 'react';
import { useNavigate } from 'react-router-dom';

const CreatePurchaseOrder: React.FC = () => {
  const navigate = useNavigate();

  const handleCreateSalesReturn = () => {
    navigate('/Purchase/Create-PurchasesOrder-form');
  };

  return (
    <div className="p-4">
      <button
        onClick={handleCreateSalesReturn}
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
      >
        Create Purchase Order
      </button>
    </div>
  );
};

export default CreatePurchaseOrder;
