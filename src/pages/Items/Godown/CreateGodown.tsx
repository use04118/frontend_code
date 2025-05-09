import React, { FC } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateGodown: FC = () => {
  const navigate = useNavigate();

  const handleCreateGodown = (): void => {
    navigate('/Items/Godown/Create-Godown-layout');
  };

  return (
    <div className="p-1">
      <button
        onClick={handleCreateGodown}
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
      >
        Create Godown
      </button>
    </div>
  );
};

export default CreateGodown;