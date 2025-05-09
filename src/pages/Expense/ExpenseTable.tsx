import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
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
import axios from 'axios';

// TypeScript interfaces
interface Party {
  id: number;
  party_name: string;
  category?: number;
}

interface Category {
  id: number;
  name: string;
}

interface Expense {
  id: number;
  expense_no: number | string;
  date: string;
  party: number;
  category: number;
  total_amount: number;
  [key: string]: any; // for any extra fields
}

interface ApiResponse<T> {
  results: T[];
}

const ExpenseTable: React.FC = () => {
  const API_URL = import.meta.env.VITE_API_URL as string;
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [dateRange, setDateRange] = useState<string>('Last 365 Days');
  const [customStartDate, setCustomStartDate] = useState<Date | null>(null);
  const [customEndDate, setCustomEndDate] = useState<Date | null>(null);
  const [saleexpenseData, setSaleexpenseData] = useState<Expense[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [partyData, setPartyData] = useState<Record<number, string>>({});
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [isCreatingCategory, setIsCreatingCategory] = useState<boolean>(false);
  const [newCategory, setNewCategory] = useState<string>('');
  const [partyCategory, setPartyCategory] = useState<string | number>('');
  const navigate = useNavigate();
  const [categoryMap, setCategoryMap] = useState<Record<number, string>>({});

  useEffect(() => {
    const fetchexpenses = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) throw new Error('Token not found');

        const response = await axios.get<ApiResponse<Expense>>(
          `${API_URL}/expenses/expenses/`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = response.data;
        if (Array.isArray(data.results)) {
          setSaleexpenseData(data.results);
        } else {
          setSaleexpenseData([]);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching sales expenses:', error);
        setSaleexpenseData([]);
        setLoading(false);
      }
    };

    const fetchParties = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) throw new Error('Token not found');
        const response = await axios.get<ApiResponse<Party>>(
          `${API_URL}/parties/parties`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = response.data;
        if (Array.isArray(data.results)) {
          const partyMap: Record<number, string> = {};
          data.results.forEach((party) => {
            partyMap[party.id] = party.party_name;
          });
          setPartyData(partyMap);
        }
      } catch (error) {
        console.error('Error fetching parties:', error);
      }
    };

    fetchexpenses();
    fetchParties();
  }, [API_URL]);

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
      case 'This Quarter':
        return [
          format(startOfMonth(today), 'yyyy-MM-dd'),
          format(endOfMonth(today), 'yyyy-MM-dd'),
        ];
      case 'Previous Quarter':
        return [
          format(startOfMonth(subMonths(today, 3)), 'yyyy-MM-dd'),
          format(endOfMonth(subMonths(today, 3)), 'yyyy-MM-dd'),
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

  useEffect(() => {
    fetchCategories();
    // eslint-disable-next-line
  }, []);

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) throw new Error('Token not found');

      const response = await axios.get<ApiResponse<Category>>(
        `${API_URL}/expenses/categories/`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data;
      if (Array.isArray(data.results)) {
        setCategories(data.results);

        const categoryMap: Record<number, string> = {};
        data.results.forEach((cat) => {
          categoryMap[cat.id] = cat.name;
        });
        setCategoryMap(categoryMap);
      } else {
        throw new Error('Invalid data format');
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
      setCategoryMap({});
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();
    const value = e.target.value;
    if (value === 'create') {
      setIsCreatingCategory(true);
      setPartyCategory('');
      setSelectedCategory('');
    } else {
      setPartyCategory(Number(value));
      setSelectedCategory(value);
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newCategory.trim()) {
      alert('Please enter a valid category.');
      return;
    }

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) throw new Error('Token not found');
      const response = await axios.post<Category>(
        `${API_URL}/expenses/categories/`,
        { name: newCategory.trim() },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data;
      setNewCategory('');
      setIsCreatingCategory(false);
      await fetchCategories();
      setSelectedCategory(data.name);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to add category.');
    }
  };

  const [startDate, endDate] = getDateRange(dateRange);

  const filteredexpense = saleexpenseData.filter((expense) => {
    const expenseDate = format(new Date(expense.date), 'yyyy-MM-dd');

    const isWithinDateRange =
      startDate && endDate
        ? expenseDate >= startDate && expenseDate <= endDate
        : true;

    const matchesSearch = expense.expense_no
      .toString()
      .includes(searchTerm);

    const matchesCategory = partyCategory
      ? expense.category === Number(partyCategory)
      : true;

    return matchesSearch && isWithinDateRange && matchesCategory;
  });

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-1xl font-bold">Expenses Details</h2>

        {/* Search Bar */}
        <div className="relative w-1/3">
          <span className="absolute inset-y-0  left-3 flex items-center text-gray-500">
            <FaSearch />
          </span>
          <input
            type="text"
            placeholder="Search by expense Number..."
            className="w-60 p-3 h-full pl-10 border border-gray-300 dark:bg-gray-900  rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Dropdown for Date Filtering */}
        <select
          className="w-60 mr-2 p-3 h-full border border-gray-300 dark:bg-gray-900  rounded-lg focus:ring-2 focus:ring-blue-500"
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
            'This Quarter',
            'Previous Quarter',
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

        {/* Custom Date Range Pickers */}
        {dateRange === 'Custom Date Range' && (
          <div className="flex gap-2">
            <DatePicker
              selected={customStartDate}
              onChange={(date) => setCustomStartDate(date)}
              className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholderText="Start Date"
            />
            <DatePicker
              selected={customEndDate}
              onChange={(date) => setCustomEndDate(date)}
              className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholderText="End Date"
            />
          </div>
        )}
        {/* 📌 Category Dropdown */}
        <div className="relative w-1/3">
          <select
            className="w-full p-3 h-full border border-gray-300 dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
            value={partyCategory}
            onChange={handleCategoryChange}
          >
            <option value="">Select Category</option>
            {Array.isArray(categories) &&
              categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            <option value="create">Create Category</option>
          </select>
        </div>
      </div>

      {/* Popup Modal for Creating Category */}
      {isCreatingCategory && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900  bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-bold mb-2">Create a New Category</h3>
            <form
              onSubmit={handleCreateCategory}
              className="flex flex-col space-y-3"
            >
              <input
                type="text"
                className="p-2 border border-gray-300 rounded-lg w-full"
                placeholder="Enter new category"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                required
              />
              <div className="flex justify-end space-x-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Add
                </button>
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                  onClick={() => setIsCreatingCategory(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Sales expense Table */}
      {loading ? (
        <p className="text-center text-lg">Loading...</p>
      ) : (
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-200 dark:bg-gray-700 text-left">
              <th className="border px-4 py-2">Date</th>
              <th className="border px-4 py-2">Expense Number</th>
              <th className="border px-4 py-2">Party Name</th>
              <th className="border px-4 py-2">Category</th>
              <th className="border px-4 py-2">Amount</th>
            </tr>
          </thead>
          <tbody>
            {filteredexpense.length > 0 ? (
              filteredexpense.map((data) => (
                <tr
                  key={data.expense_no}
                  /*  onClick={() => navigate(`/expenses/${data.id}`)} */
                  className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <td className="border px-4 py-2">{data.date}</td>
                  <td className="border px-4 py-2">{data.expense_no}</td>
                  <td className="border px-4 py-2">
                    {partyData[data.party] || 'Loading...'}
                  </td>
                  <td className="border px-4 py-2">
                    {categoryMap[data.category] || '—'}{' '}
                    {/* fallback if not found */}
                  </td>
                  <td className="border px-4 py-2">₹{data.total_amount}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="border px-4 py-2 text-center text-gray-500 dark:text-gray-300"
                >
                  No Expenses Found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ExpenseTable;
