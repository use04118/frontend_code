import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface LowStockItem {
  item_name: string;
  item_code: string;
  stock_quantity: number;
  low_stock_value: number;
  stock_value: number;
}

const LowStockSummary = () => {
  const navigate = useNavigate();
  const [lowStockData, setLowStockData] = useState<LowStockItem[]>([]);
  const [totalStockValue, setTotalStockValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchLowStockData = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get(`${API_URL}/reports/low-stock-summary/`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
  
        const result = response.data;
        setLowStockData(result.transactions || []);
        setTotalStockValue(result.total_stock_value || 0); // Use total value from API
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error fetching low stock summary');
      } finally {
        setLoading(false);
      }
    };
  
    fetchLowStockData();
  }, []);

  return (
    <div className="bg-white dark:bg-gray-900 text-gray-800 dark:text-white p-4 rounded-lg shadow-md overflow-x-auto">
      <h2 className="text-xl font-semibold text-center text-gray-800 dark:text-white mb-4">
        Low Stock Summary
      </h2>

      {loading && (
        <p className="text-center text-gray-600 dark:text-gray-300">
          Loading...
        </p>
      )}
      {error && <p className="text-center text-red-500">Error: {error}</p>}

      {!loading && !error && (
        <>
          <div className="mb-4 flex flex-wrap justify-between items-center">
            <h2 className="text-lg font-semibold">
              Total Stock Value:{' '}
              <span className="text-black dark:text-white font-bold">
                ₹ {totalStockValue.toFixed(2)}
              </span>
            </h2>
          </div>

          <div className="w-full overflow-x-auto">
            <table className="min-w-full border border-gray-300 dark:border-gray-700">
              <thead className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-sm">
                <tr>
                  <th className="text-left p-3 font-semibold">ITEM NAME</th>
                  <th className="text-left p-3 font-semibold">ITEM CODE</th>
                  <th className="text-left p-3 font-semibold">
                    STOCK QUANTITY
                  </th>
                  <th className="text-left p-3 font-semibold">
                    LOW STOCK LEVEL
                  </th>
                  <th className="text-left p-3 font-semibold">STOCK VALUE</th>
                </tr>
              </thead>
              <tbody>
                {lowStockData.map((item, index) => (
                  <tr
                    key={index}
                    className="border-t border-gray-300 dark:border-gray-700"
                  >
                    <td className="p-3">{item.item_name}</td>
                    <td className="p-3">{item.item_code}</td>
                    <td className="p-3">{item.stock_quantity}</td>
                    <td className="p-3">{item.low_stock_value}</td>
                    <td className="p-3">
                      ₹{item.stock_value.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {lowStockData.length === 0 && (
              <p className="text-center text-gray-500 dark:text-gray-400 mt-4">
                No low stock items available.
              </p>
            )}
          </div>
        </>
      )}

      <div className="mt-4">
        <button
          onClick={() => navigate(-1)}
          className="rounded border border-blue-400 px-4 py-2 text-white bg-blue-500 dark:border-gray-600 dark:hover:bg-gray-700"
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default LowStockSummary;
