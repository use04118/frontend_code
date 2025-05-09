import React from 'react';
import { useNavigate } from 'react-router-dom';

const CreateDebitNote: React.FC = () => {
  const navigate = useNavigate();

  const handleCreateCreditNote = () => {
    navigate('/Purchase/Create-DebitNote-form');
  };

  return (
    <div className="p-4">
      <button
        onClick={handleCreateCreditNote}
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
      >
        Create Debit Note
      </button>
    </div>
  );
};

export default CreateDebitNote;
