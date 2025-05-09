import React, { useState, useEffect } from 'react';
import { HiDocumentReport } from 'react-icons/hi';
import IRPFormModal from './IRPFormModal';
import TransactionTable from './TransactionTable'; // Component for the table
import axios from 'axios';

interface GspCredentialsResponse {
  exists: boolean;
}

const Einvoicing: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [hasGspCredentials, setHasGspCredentials] = useState<boolean>(false);

  // On mount, check if credentials exist
  useEffect(() => {
    const checkCredentials = async () => {
      try {
        const res = await axios.get<GspCredentialsResponse>('/api/gsp-credentials');
        setHasGspCredentials(res.data.exists);
      } catch (err) {
        console.error('Error checking credentials:', err);
      }
    };

    checkCredentials();
  }, []);

  // Handle successful GSP credential save
  const handleGspSave = () => {
    setIsModalOpen(false);
    setHasGspCredentials(true); // Show table from now on
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {!hasGspCredentials ? (
          <>
            <div className="flex flex-col items-center bg-gray-100 dark:bg-gray-800 p-8 rounded-lg shadow hover:shadow-lg transition duration-300 mb-12">
              <HiDocumentReport className="text-indigo-600 dark:text-indigo-400 text-6xl mb-4" />
              <p className="text-center text-gray-800 dark:text-gray-200 font-medium text-lg">
                Automatic e-invoice generation, hassle-free e-way bill creation using IRN, and easy GSTR1 reconciliation
              </p>
            </div>
            <div className="text-center">
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-300"
              >
                Start Generating e-Invoices
              </button>
            </div>
            <IRPFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleGspSave} />
          </>
        ) : (
          <TransactionTable /> // ⬅ Show table once credentials are stored
        )}
      </div>
    </div>
  );
};

export default Einvoicing;
