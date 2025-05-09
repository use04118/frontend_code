import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const TotalTransactions = ({
  totalParties,
  totalToCollect,
  totalToPay,
  onFilterChange,
}) => {
  const location = useLocation();
  const defaultFilter = location.state?.filter || 'all';
  const [selectedFilter, setSelectedFilter] = useState(defaultFilter);

  useEffect(() => {
    onFilterChange(selectedFilter);
  }, [selectedFilter, onFilterChange]);

  const handleClick = (filter) => {
    setSelectedFilter(filter);
    onFilterChange(filter);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
      {/* All Parties */}
      <div
        className={`p-4 rounded-lg transition duration-300 cursor-pointer flex items-center justify-between shadow-sm hover:scale-[1.02] ${
          selectedFilter === 'all'
            ? 'border-2 border-blue-600'
            : 'border border-gray-300 dark:border-gray-700'
        } bg-white dark:bg-gray-800`}
        onClick={() => handleClick('all')}
      >
        <div>
          <h3 className="text-sm text-gray-500 dark:text-gray-400 mb-1">
            All Parties
          </h3>
          <h2 className="text-2xl font-bold text-blue-600">{totalParties}</h2>
        </div>
        <div className="bg-blue-100 dark:bg-blue-950 p-2 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800 transition cursor-pointer">
          <svg
            className="w-6 h-6 text-blue-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M2 11h16v2H2v-2zm0-4h16v2H2V7zm0-4h16v2H2V3z" />
          </svg>
        </div>
      </div>

      {/* To Collect */}
      <div
        className={`p-4 rounded-lg transition duration-300 cursor-pointer flex items-center justify-between shadow-sm hover:scale-[1.02] ${
          selectedFilter === 'toCollect'
            ? 'border-2 border-green-600'
            : 'border border-gray-300 dark:border-gray-700'
        } bg-white dark:bg-gray-800`}
        onClick={() => handleClick('toCollect')}
      >
        <div>
          <h3 className="text-sm text-gray-500 dark:text-gray-400 mb-1">
            To Collect
          </h3>
          <h2 className="text-2xl font-bold text-green-600">{totalToCollect}</h2>
        </div>
        <div className="bg-green-100 dark:bg-green-950 p-2 rounded-full hover:bg-green-200 dark:hover:bg-green-800 transition cursor-pointer">
          <svg
            className="w-6 h-6 text-green-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M5 11l5-5 5 5H5z" />
          </svg>
        </div>
      </div>

      {/* To Pay */}
      <div
        className={`p-4 rounded-lg transition duration-300 cursor-pointer flex items-center justify-between shadow-sm hover:scale-[1.02] ${
          selectedFilter === 'toPay'
            ? 'border-2 border-red-600'
            : 'border border-gray-300 dark:border-gray-700'
        } bg-white dark:bg-gray-800`}
        onClick={() => handleClick('toPay')}
      >
        <div>
          <h3 className="text-sm text-gray-500 dark:text-gray-400 mb-1">
            To Pay
          </h3>
          <h2 className="text-2xl font-bold text-red-600">{totalToPay}</h2>
        </div>
        <div className="bg-red-100 dark:bg-red-950 p-2 rounded-full hover:bg-red-200 dark:hover:bg-red-800 transition cursor-pointer">
          <svg
            className="w-6 h-6 text-red-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M5 9l5 5 5-5H5z" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default TotalTransactions;
