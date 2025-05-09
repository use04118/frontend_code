import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import {
  format,
  subDays,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  subMonths,
  startOfYear,
  endOfYear,
} from 'date-fns';
import { useNavigate } from 'react-router-dom';

interface Category {
  id: number;
  name: string;
}

interface StockSummary {
  date: string;
  item_name: string;
  total_sales_quantity: number;
  total_purchase_quantity: number;
}

interface ApiResponse {
  results: Category[];
}

interface StockSummaryResponse {
  stock_summary: StockSummary[];
}

const ItemSalesAndPurchaseSummary = () => {
  const [categoryList, setCategoryList] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [data, setData] = useState<StockSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<string>('Last 30 Days');
  const [customStartDate, setCustomStartDate] = useState<Date | null>(null);
  const [customEndDate, setCustomEndDate] = useState<Date | null>(null);
  const Navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL;

  // 🔄 Fetch Categories
  useEffect(() => {
    const fetchCategories = async (): Promise<void> => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get<ApiResponse>(`${API_URL}/parties/categories/`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
  
        setCategoryList(response.data.results || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
  
    fetchCategories();
  }, []);
  
  // 🔄 Fetch Report Data based on selected category
  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('accessToken');
        const url = `${API_URL}/reports/item-sales-and-purchase_summary/`;
  
        const response = await axios.get<StockSummaryResponse>(url, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          params: selectedCategory ? { category_id: selectedCategory } : {},
        });
  
        const result = response.data;
        setData(result.stock_summary || []);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          setError((error.response?.data as { message?: string })?.message || error.message);
        } else {
          setError('An unexpected error occurred');
        }
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [selectedCategory]);

  const getDateRange = (option: string): [string | null, string | null] => {
    const today = new Date();
    switch (option) {
      case 'Today':
        return [format(today, 'yyyy-MM-dd'), format(today, 'yyyy-MM-dd')];
      case 'Yesterday':
        return [
          format(subDays(today, 1), 'yyyy-MM-dd'),
          format(subDays(today, 1), 'yyyy-MM-dd'),
        ];
      case 'This Week':
        return [
          format(startOfWeek(today), 'yyyy-MM-dd'),
          format(endOfWeek(today), 'yyyy-MM-dd'),
        ];
      case 'Last Week':
        return [
          format(startOfWeek(subDays(today, 7)), 'yyyy-MM-dd'),
          format(endOfWeek(subDays(today, 7)), 'yyyy-MM-dd'),
        ];
      case 'Last 7 Days':
        return [
          format(subDays(today, 7), 'yyyy-MM-dd'),
          format(today, 'yyyy-MM-dd'),
        ];
      case 'This Month':
        return [
          format(startOfMonth(today), 'yyyy-MM-dd'),
          format(endOfMonth(today), 'yyyy-MM-dd'),
        ];
      case 'Previous Month':
        return [
          format(startOfMonth(subMonths(today, 1)), 'yyyy-MM-dd'),
          format(endOfMonth(subMonths(today, 1)), 'yyyy-MM-dd'),
        ];
      case 'Last 30 Days':
        return [
          format(subDays(today, 30), 'yyyy-MM-dd'),
          format(today, 'yyyy-MM-dd'),
        ];
      case 'Current Fiscal Year':
        return [
          format(startOfYear(today), 'yyyy-MM-dd'),
          format(endOfYear(today), 'yyyy-MM-dd'),
        ];
      case 'Previous Fiscal Year':
        return [
          format(startOfYear(subMonths(today, 12)), 'yyyy-MM-dd'),
          format(endOfYear(subMonths(today, 12)), 'yyyy-MM-dd'),
        ];
      case 'Last 365 Days':
        return [
          format(subDays(today, 365), 'yyyy-MM-dd'),
          format(today, 'yyyy-MM-dd'),
        ];
      case 'Custom Date Range':
        return customStartDate && customEndDate
          ? [
              format(customStartDate, 'yyyy-MM-dd'),
              format(customEndDate, 'yyyy-MM-dd'),
            ]
          : [null, null];
      default:
        return [null, null];
    }
  };

  const [startDate, endDate] = getDateRange(dateRange);
  const filteredData = data.filter((item) => {
    if (!item.date) return true;
    const itemDate = format(new Date(item.date), 'yyyy-MM-dd');
    return startDate && endDate
      ? itemDate >= startDate && itemDate <= endDate
      : true;
  });

  const handleBack = (): void => {
    Navigate(-1);
  };

  return (
    <div className="bg-white dark:bg-gray-900 overflow-x-auto min-h-screen p-4">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
        Item Sales and Purchase Summary
      </h2>

      {/* 🔘 Category Dropdown */}
      <div className="mb-4">
        <select
          value={selectedCategory}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedCategory(e.target.value)}
          className="border rounded p-2  dark:bg-gray-700 dark:text-white"
        >
          <option value="">Select Category</option>
          {categoryList.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <select
          className="p-2 border ml-2 rounded dark:bg-gray-700 dark:text-white"
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
        >
          {[
            'Today',
            'Yesterday',
            'This Week',
            'Last Week',
            'Last 7 Days',
            'This Month',
            'Previous Month',
            'Last 30 Days',
            'Current Fiscal Year',
            'Previous Fiscal Year',
            'Last 365 Days',
            'Custom Date Range',
          ].map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        {dateRange === 'Custom Date Range' && (
          <>
            <DatePicker
              selected={customStartDate}
              onChange={(date: Date | null) => setCustomStartDate(date)}
              className="p-2 border rounded dark:bg-gray-700 dark:text-white"
              placeholderText="Start Date"
            />
            <DatePicker
              selected={customEndDate}
              onChange={setCustomEndDate}
              className="p-2 border rounded dark:bg-gray-700 dark:text-white"
              placeholderText="End Date"
            />
          </>
        )}
      </div>

      {/* 🔁 Loading */}
      {loading && (
        <p className="text-center text-gray-600 dark:text-gray-300">
          Loading...
        </p>
      )}

      {/* ❌ Error */}
      {error && <p className="text-center text-red-500">Error: {error}</p>}

      {/* 📊 Data Table */}
      {!loading && !error && filteredData.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300">
            <thead className="bg-gray-200 dark:bg-gray-700">
              {selectedCategory && (
                <tr className="bg-gray-100 dark:bg-gray-800">
                  <td
                    colSpan={6}
                    className="p-6 font-semibold text-left text-gray-700 dark:text-white"
                  >
                    Category:{' '}
                    {categoryList.find((c) => c.id === Number(selectedCategory))?.name}
                  </td>
                </tr>
              )}
              <tr>
              <th className="border p-2 text-left">Date</th>
                <th className="border p-2 text-left">Item Name</th>
                <th className="border p-2 text-left">Sales Quantity</th>
                <th className="border p-2 text-left">Purchase Quantity</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((row, index) => (
                <tr key={index} className="border dark:border-gray-600">
                   <td className="border p-2 text-left">{row.date}</td>
                  <td className="border p-2 text-left">{row.item_name}</td>
                  <td className="border p-2 text-left">
                    {row.total_sales_quantity}
                  </td>
                  <td className="border p-2 text-left">
                    {row.total_purchase_quantity}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && !error && filteredData.length === 0 && (
        <p className="text-center text-gray-500 dark:text-gray-400">
          No data available.
        </p>
      )}
      <div className="flex justify-start gap-4 mt-2">
        <button
          type="button"
          onClick={handleBack}
          className="rounded border border-blue-400 px-4 py-2 text-white bg-blue-500 dark:border-gray-600 dark:text-white dark:hover:bg-gray-700"
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default ItemSalesAndPurchaseSummary;
