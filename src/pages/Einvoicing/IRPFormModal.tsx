import React, { useState } from 'react';
import axios from 'axios';

interface IRPFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

const IRPFormModal: React.FC<IRPFormModalProps> = ({ isOpen, onClose, onSave }) => {
  const [gstin, setGstin] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  if (!isOpen) return null;

  const handleSubmit = async () => {
    try {
      await axios.post('/api/gsp-credentials', {
        gstin,
        username,
        password
      }); // 🔁 Replace with actual endpoint

      onSave(); // notify parent to show table
    } catch (err) {
      console.error('Failed to save GSP details:', err);
      alert('Failed to save credentials');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">&times;</button>
        
        <h2 className="text-lg font-semibold mb-4">Enter your IRP details</h2>

        <input type="text" placeholder="GSTIN" value={gstin} onChange={(e) => setGstin(e.target.value)} className="w-full mb-3 px-3 py-2 border rounded" />
        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full mb-3 px-3 py-2 border rounded" />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full mb-4 px-3 py-2 border rounded" />

        <button onClick={handleSubmit} className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition">
          Save GSP Details
        </button>
      </div>
    </div>
  );
};

export default IRPFormModal;
