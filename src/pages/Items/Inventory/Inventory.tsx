import React, { useState, useEffect } from 'react';
import CreateItems from '../CreateItems';
import ItemsTable from './ItemsTable';
import axios from 'axios';

// Define types for API responses
interface StockValueResponse {
  total_stock_value?: number;
}

interface LowStockResponse {
  totalLowStockItems?: number;
}

const Inventory: React.FC = () => {
  const API_URL = import.meta.env.VITE_API_URL as string;

  const [stockValue, setStockValue] = useState<number | null>(null);
  const [lowStock, setLowStock] = useState<number | null>(null);

  useEffect(() => {
    fetchStockValue();
    fetchLowStock();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchStockValue = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) throw new Error('Token not found');

      const response = await axios.get<StockValueResponse>(
        `${API_URL}/inventory/stock/stock-value/`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setStockValue(response.data.total_stock_value ?? 0);
    } catch (error) {
      console.error('Error fetching stock value:', error);
      setStockValue(0);
    }
  };

  const fetchLowStock = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) throw new Error('Token not found');

      const response = await axios.get<LowStockResponse>(
        `${API_URL}/inventory/stock/low-stock/`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setLowStock(response.data.totalLowStockItems ?? 0);
    } catch (error) {
      console.error('Error fetching low stock count:', error);
      setLowStock(0);
    }
  };

  return (
    <>
      <h4 className="text-2xl font-bold mb-4">Items</h4>
      <div className="flex justify-between items-center gap-4 mt-4">
        {/* Stock Value */}
        <div
          className="w-[47%] p-4 rounded-lg text-center font-semibold border-2 cursor-pointer transition-all duration-300 hover:shadow-lg 
          bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-blue-600 dark:text-blue-400"
        >
          <h3 className="text-sm uppercase tracking-wide mb-1">Stock Value</h3>
          <h2 className="text-2xl font-bold">₹{stockValue !== null ? stockValue.toLocaleString() : 'Loading...'}</h2>
        </div>

        {/* Low Stock */}
        <div
          className="w-[47%] p-4 rounded-lg text-center font-semibold border-2 cursor-pointer transition-all duration-300 hover:shadow-lg 
          bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-green-600 dark:text-green-400"
        >
          <h3 className="text-sm uppercase tracking-wide mb-1">Low Stock</h3>
          <h2 className="text-2xl font-bold">{lowStock !== null ? lowStock : 'Loading...'}</h2>
        </div>
      </div>

      <CreateItems />
      <ItemsTable />
    </>
  );
};

export default Inventory;

