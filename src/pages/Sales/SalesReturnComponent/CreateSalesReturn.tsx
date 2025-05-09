import React from 'react';
import { useNavigate } from 'react-router-dom';

const CreateSalesReturn: React.FC = () => {
  const navigate = useNavigate();

  const handleCreateSalesReturn = (): void => {
    navigate('/Sales/Create-SalesReturn-form');
  };

  return (
    <div className="p-4">
      <button
        onClick={handleCreateSalesReturn}
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
      >
        Create Sales Return
      </button>
    </div>
  );
};

export default CreateSalesReturn;
