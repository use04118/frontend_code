import React from 'react';
import { useNavigate } from 'react-router-dom';

const CreateQuotation: React.FC = () => {
  const navigate = useNavigate();

  const handleCreateQuotation = (): void => {
    navigate("/Sales/Create-Quotation-form");
  };

  return (
    <div className="p-4">
      <button
        onClick={handleCreateQuotation}
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
      >
        Create Quotation
      </button>
    </div>
  );
};

export default CreateQuotation;
