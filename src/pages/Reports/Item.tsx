import React from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation

// Define interface for item structure
interface ReportItem {
  name: string;
  path: string;
}

const Item: React.FC = () => {
  const items: ReportItem[] = [
    { name: "Item Report By Party", path: "/item-report-by-party" },
    { name: "Item Sales and Purchase Summary", path: "/item-sales-purchase-summary" },
    { name: "Low Stock Summary", path: "/low-stock-summary" },
    { name: "Rate List", path: "/rate-list" },
    { name: "Stock Detail Report", path: "/stock-detail-report" },
    { name: "Stock Summary", path: "/stock-summary" }
  ];

  return (
    <div className="w-full ml-0 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
      {/* Header */}
      <div className="flex items-center gap-2 border-b pb-2 dark:border-gray-600">
        <span className="text-gray-600 dark:text-gray-300 font-semibold">Item</span>
      </div>

      {/* List */}
      <ul className="mt-3 space-y-2">
        {items.map((item: ReportItem, index: number) => (
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

export default Item;
