import React from 'react';
import { useNavigate } from "react-router-dom";

const CreateParty = () => {
    const navigate = useNavigate();

    const handleCreateParty = () => {
      navigate("/forms/form-layout");
    };
  
    return (
      <div className="p-4">
        <button
          onClick={handleCreateParty}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Create New Party
        </button>
      </div>
    );
}

export default CreateParty
