import React from 'react';
import { useNavigate } from "react-router-dom";

const AddNewUser = () => {
    const navigate = useNavigate();

    const handleCreateParty = () => {
      navigate("/Create-New-User");
    };
  
    return (
      <div className="p-4">
        <button
          onClick={handleCreateParty}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Add New User
        </button>
      </div>
    );
}

export default AddNewUser