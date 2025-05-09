import React from "react";
import { Link } from "react-router-dom"; // Import Link for navigation

// Define interface for the items
interface ReportItem {
  name: string;
  path: string;
}

const Party: React.FC = () => {
  const items: ReportItem[] = [
    { name: "Receivable Ageing Report", path: "/receivable-ageing-report" },
    { name: "Party Report By Item", path: "/party-report-by-item" },
    { name: "Party Statement (Ledger)", path: "/party-statement" },
    { name: "Party Wise Outstanding", path: "/party-wise-outstanding" },
    { name: "Sales Summary - Category Wise", path: "/sales-summary-category" },
  ];

  return (
    <div className="w-full ml-0 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
      {/* Header */}
      <div className="flex items-center gap-2 border-b pb-2 dark:border-gray-600">
        <span className="text-gray-600 dark:text-gray-300 font-semibold">
          Party
        </span>
      </div>

      {/* List */}
      <ul className="mt-3 space-y-2">
        {items.map((item: ReportItem, index: number) => (
          <li key={index}>
            <Link
              to={item.path} // Navigate to respective route
              className="flex justify-between items-center text-gray-800 dark:text-gray-300 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition"
            >
              <span>{item.name}</span>
              <span className="font-semibold text-yellow-600 dark:text-yellow-400">
                ★ ★
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Party;
