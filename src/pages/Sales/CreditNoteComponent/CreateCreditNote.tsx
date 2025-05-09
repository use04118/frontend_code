import React from 'react';
import { useNavigate } from 'react-router-dom';

const CreateCreditNote: React.FC = () => {
  const navigate = useNavigate();

  const handleCreateCreditNote = () => {
    navigate("/Sales/Create-CreditNote-form");
  };

  return (
    <div className="p-4">
      <button
        onClick={handleCreateCreditNote}
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
      >
        Create Credit Note
      </button>
    </div>
  );
};

export default CreateCreditNote;
