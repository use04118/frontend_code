import React, { useState, ChangeEvent, FC } from 'react';
import { IoMdClose } from 'react-icons/io';

interface AdjustBalanceModalProps {
  onClose: () => void;
}

const AdjustBalanceModal: FC<AdjustBalanceModalProps> = ({ onClose }) => {
  const [type, setType] = useState<'add' | 'reduce'>('add');
  const [accountType, setAccountType] = useState<'Cash' | 'Bank'>('Cash');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [amount, setAmount] = useState<number | ''>('');
  const [remarks, setRemarks] = useState<string>('');

  // Example save handler (replace with axios if you add API calls)
  const handleSave = () => {
    // Example: axios.post('/api/adjust-balance', { type, accountType, date, amount, remarks });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-lg shadow-lg p-6 relative">
        <button
          className="absolute top-3 right-3 text-xl text-gray-500 dark:text-gray-300 hover:text-black dark:hover:text-white"
          onClick={onClose}
        >
          <IoMdClose />
        </button>
        <h2 className="text-xl font-semibold mb-4">Adjust Balance</h2>

        <label className="block mb-2">Adjust money in</label>
        <select
          className="w-full border p-2 rounded mb-4 dark:bg-gray-700 dark:text-white"
          value={accountType}
          onChange={(e: ChangeEvent<HTMLSelectElement>) =>
            setAccountType(e.target.value as 'Cash' | 'Bank')
          }
        >
          <option value="Cash">Cash</option>
          <option value="Bank">Bank</option>
        </select>

        <div className="flex items-center gap-4 mb-4">
          <button
            className={`px-4 py-1 rounded border ${type === 'add' ? 'bg-purple-100 text-purple-700' : ''}`}
            onClick={() => setType('add')}
          >
            + Add Money
          </button>
          <button
            className={`px-4 py-1 rounded border ${type === 'reduce' ? 'bg-gray-200 dark:bg-gray-600' : ''}`}
            onClick={() => setType('reduce')}
          >
            - Reduce Money
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm">Current Balance</p>
            <p className="font-semibold">₹20.2</p>
          </div>
          <div>
            <p className="text-sm">Date</p>
            <input
              type="date"
              className="w-full border p-2 rounded dark:bg-gray-700 dark:text-white"
              value={date}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setDate(e.target.value)}
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="text-sm block">Enter Amount</label>
          <input
            type="number"
            placeholder="₹"
            className="w-full border p-2 rounded mt-1 dark:bg-gray-700 dark:text-white"
            value={amount}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setAmount(e.target.value === '' ? '' : Number(e.target.value))
            }
          />
        </div>

        <div className="mb-4">
          <label className="text-sm block">+ Add Remarks</label>
          <input
            type="text"
            placeholder="Optional"
            className="w-full border p-2 rounded mt-1 dark:bg-gray-700 dark:text-white"
            value={remarks}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setRemarks(e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-2">
          <button
            className="border px-4 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdjustBalanceModal;
