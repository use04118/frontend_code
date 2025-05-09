import React from 'react';
import { useNavigate } from 'react-router-dom';

const CreateDeliveryChallan: React.FC = () => {
  const navigate = useNavigate();

  const handleCreateDeliveryChallan = () => {
    navigate("/Sales/Create-DeliveryChallan-form");
  };

  return (
    <div className="p-4">
      <button
        onClick={handleCreateDeliveryChallan}
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
      >
        Create Delivery Challan
      </button>
    </div>
  );
};

export default CreateDeliveryChallan;
