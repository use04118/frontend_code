import React from 'react';
import { useNavigate } from 'react-router-dom';

interface CreatePurchaseReturnProps {
  // Add any props if needed in the future
}

const CreatePurchaseReturn: React.FC<CreatePurchaseReturnProps> = () => {
  const navigate = useNavigate();
     
  const handleCreateSalesReturn = (): void => {
    navigate("/Purchase/Create-PurchasesReturn-form");
  };
       
  return (
    <div className="p-4">
      <button
        onClick={handleCreateSalesReturn}
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
      >
        Create Purchase Return
      </button>
    </div>
  );
};

export default CreatePurchaseReturn;
