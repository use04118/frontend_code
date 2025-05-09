import React from 'react';
import { Link } from 'react-router-dom'; // Link import karna na bhoolna

// Define interface for the items
interface TransactionItem {
  name: string;
  path: string;
}

const Transaction: React.FC = () => {
  // Sample data with routing paths
  const items: TransactionItem[] = [
    { name: "Audit Trail", path: "/audit-trail" },
    { name: "Bill Wise Profit", path: "/bill-wise-profit" },
    { name: "Cash and Bank Report (All Payments)", path: "/cash-bank-report" },
    { name: "Daybook", path: "/daybook" },
    { name: "Expense Category Report", path: "/expense-category-report" },
    { name: "Expense Transaction Report", path: "/expense-transaction-report" },
    { name: "Purchase Summary", path: "/purchase-summary" }
  ];

  return (
    <div className="w-full ml-0 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
      {/* Header */}
      <div className="flex items-center gap-2 border-b pb-2 dark:border-gray-600">
        <span className="text-gray-600 dark:text-gray-300 font-semibold">Transaction</span>
      </div>

      {/* List */}
      <ul className="mt-3 space-y-2">
        {items.map((item: TransactionItem, index: number) => (
          <li key={index}>
            <Link
              to={item.path}
              className="flex justify-between items-center text-gray-800 dark:text-gray-300 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition"
            >
              <span>{item.name}</span>
              <span className="font-semibold text-yellow-600 dark:text-yellow-400">★ ★</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Transaction;
