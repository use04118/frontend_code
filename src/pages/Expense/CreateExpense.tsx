import React from 'react'
import { useNavigate } from 'react-router-dom';

const CreateExpense: React.FC = () => {
  const navigate = useNavigate();
    
        const handleCreateExpense = (): void => {
          navigate("/Expenses/Create-Expense");
        };
      
        return (
          <div className="p-4">
            <button
              onClick={handleCreateExpense}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Create Expense
            </button>
          </div>
        );
  }
  

export default CreateExpense
