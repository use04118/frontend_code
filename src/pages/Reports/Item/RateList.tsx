import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface RateListItem {
  item_name: string;
  item_code: string;
  MRP: number;
  selling_price: number;
}

interface ApiResponse {
  transactions: RateListItem[];
}

const RateList: React.FC = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<RateListItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const API_URL: string = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchRateList = async (): Promise<void> => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get<ApiResponse>(`${API_URL}/reports/rate-list/`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
  
        const result = response.data;
        setItems(result.transactions || []); // <- ✅ Corrected key
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Error fetching rate list';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };
  
    fetchRateList();
  }, []);

  return (
    <div className="bg-white dark:bg-gray-900 text-gray-800 dark:text-white p-4 rounded-lg shadow-md overflow-x-auto">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
        Rate List
      </h2>

      {loading && (
        <p className="text-center text-gray-600 dark:text-gray-300">
          Loading...
        </p>
      )}
      {error && <p className="text-center text-red-500">Error: {error}</p>}

      {!loading && !error && (
        <table className="min-w-full border border-gray-300 dark:border-gray-700">
          <thead className="bg-gray-100 dark:bg-gray-800 text-sm text-gray-600 dark:text-gray-300">
            <tr>
              <th className="p-3 text-left font-semibold">NAME</th>
              <th className="p-3 text-left font-semibold">ITEM CODE</th>
              <th className="p-3 text-left font-semibold">MRP</th>
              <th className="p-3 text-left font-semibold">SELLING PRICE</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr
                key={index}
                className="border-t border-gray-300 dark:border-gray-700"
              >
                <td className="p-3">{item.item_name || '-'}</td>
                <td className="p-3">{item.item_code || '-'}</td>
                <td className="p-3">{item.MRP ? `₹ ${item.MRP}` : '-'}</td>
                <td className="p-3">
                  {item.selling_price ? `₹ ${item.selling_price}` : '-'}
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td
                  colSpan="4"
                  className="text-center p-4 text-gray-500 dark:text-gray-400"
                >
                  No rate data available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
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

export default RateList;
