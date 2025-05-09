import React from 'react';
import { useNavigate } from 'react-router-dom';

const CreatePaymentOut: React.FC = () => {
  const navigate = useNavigate();
    
  const handleCreatePaymentIn = () => {
    navigate("/Purchase/Create-PaymentOut-form");
  };
  
  return (
    <div className="p-4">
      <button
        onClick={handleCreatePaymentIn}
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
      >
        Create Payment Out
      </button>
    </div>
  );
};

export default CreatePaymentOut;
