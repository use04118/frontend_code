import React from 'react'
import { useNavigate } from 'react-router-dom';

const CreateItems = () => {
 const navigate = useNavigate();
 
     const handleCreateParty = () => {
       navigate("/Items/Create-Items-layout");
     };
   
     return (
       <div className="p-4">
         <button
           onClick={handleCreateParty}
           className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
         >
           Create Items
         </button>
       </div>
     );
}

export default CreateItems
