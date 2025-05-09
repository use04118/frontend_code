import React from 'react';
import { useNavigate } from 'react-router-dom';

const CreateProformaInvoice: React.FC = () => {
  const navigate = useNavigate();

  const handleCreateProformaInvoice = (): void => {
    navigate("/Sales/Create-ProformaInvoice-form");
  };

  return (
    <div className="p-4">
      <button
        onClick={handleCreateProformaInvoice}
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
      >
        Create Proforma Invoice
      </button>
    </div>
  );
};

export default CreateProformaInvoice;
