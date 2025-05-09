import React from 'react';
import { Link } from 'react-router-dom';

// Define interface for the items
interface GSTItem {
  name: string;
  path: string;
}

const GST: React.FC = () => {
  // Sample data with routing paths
  const items: GSTItem[] = [
    { name: "GSTR-2 (Purchase)", path: "/gstr-2" },
    { name: "GSTR-3b", path: "/gstr-3b" },
    { name: "GST Purchase (With HSN)", path: "/gst-purchase-hsn" },
    { name: "GST Sales (With HSN)", path: "/gst-sales-hsn" },
    { name: "HSN Wise Sales Summary", path: "/hsn-wise-sales-summary" },
    { name: "TDS Payable", path: "/tds-payable" },
    { name: "TDS Receivable", path: "/tds-receivable" },
    { name: "TCS Payable", path: "/tcs-payable" },
    { name: "TCS Receivable", path: "/tcs-receivable" }
  ];

  return (
    <div className="w-full ml-0 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
      {/* Header */}
      <div className="flex items-center gap-2 border-b pb-2 dark:border-gray-600">
        <span className="text-gray-600 dark:text-gray-300 font-semibold">GST</span>
      </div>

      {/* List */}
      <ul className="mt-3 space-y-2">
        {items.map((item: GSTItem, index: number) => (
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

export default GST;
