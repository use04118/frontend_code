import React from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation

// Define interface for the item structure
interface FavouriteItem {
  name: string;
  path: string;
}

const Favourite: React.FC = () => {
  // Sample data with routing paths
  const items: FavouriteItem[] = [
    { name: "Balance Sheet", path: "/balance-sheet" },
    { name: "GSTR-1 (Sales)", path: "/gstr-1" },
    { name: "Profit And Loss Report", path: "/profit-loss-report" },
    { name: "Sales Summary", path: "/sales-summary" }
  ];

  return (
    <div className="w-full ml-0 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
      {/* Header */}
      <div className="flex items-center gap-2 border-b pb-2 dark:border-gray-600">
        <span className="text-gray-600 dark:text-gray-300 font-semibold">Favourite</span>
      </div>

      {/* List */}
      <ul className="mt-3 space-y-2">
        {items.map((item: FavouriteItem, index: number) => (
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

export default Favourite;
