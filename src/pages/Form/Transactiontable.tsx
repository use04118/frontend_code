import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';

const TransactionTable = () => {
  const [transactions, setTransactions] = useState([
    {
      partyName: 'John Doe',
      category: 'service',
      MobileNumber: '7985191516',
      partytype: 'customer',
      amount: 5000,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');

  const filteredParties = transactions.filter((party) =>
    party.partyName.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Parties Details</h2>
        <div className="relative w-1/3">
          <span className="absolute inset-y-0 left-3 flex items-center text-gray-500">
            <FaSearch />
          </span>
          <input
            type="text"
            placeholder="Search by Party Name..."
            className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      {/* Table */}
      <div className="overflow-x-auto mb-4">
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="border px-4 py-2">Party Name</th>
              <th className="border px-4 py-2">Category</th>
              <th className="border px-4 py-2">Mobile Number</th>
              <th className="border px-4 py-2">Party Type</th>
              <th className="border px-4 py-2">Amount</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((txn, index) => (
              <tr key={index} className="hover:bg-gray-200 text-left">
                <td className="border px-4 py-2">{txn.partyName}</td>
                <td className="border px-4 py-2">{txn.category}</td>
                <td className="border px-4 py-2">{txn.MobileNumber}</td>
                <td className="border px-4 py-2">{txn.partytype}</td>
                <td
                  className={`border px-4 py-2 ${
                    txn.amount < 0 ? 'text-red-500' : 'text-green-500'
                  }`}
                >
                  ₹{txn.amount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Form to Add Transactions */}
    </div>
  );
};

export default TransactionTable;
