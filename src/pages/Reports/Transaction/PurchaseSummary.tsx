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

type DateRangeOption = 
  | 'Today'
  | 'Yesterday'
  | 'This Week'
  | 'Last Week'
  | 'Last 7 Days'
  | 'This Month'
  | 'Previous Month'
  | 'Last 30 Days'
  | 'Current Fiscal Year'
  | 'Previous Fiscal Year'
  | 'Last 365 Days'
  | 'Custom Date Range';

interface PurchaseTransaction {
  tid: string;
  date: string;
  Purchase_no: string;
  Original_invoice_no?: string;
  party_name: string;
  purchase_amount: string;
  purchase_notes?: string;
}

interface ApiResponse {
  transactions: PurchaseTransaction[];
  total_purchases: number;
}

interface ErrorResponse {
  message: string;
}

const PurchaseSummary: React.FC = () => {
  const [data, setData] = useState<PurchaseTransaction[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<DateRangeOption>('Last 30 Days');
  const [customStartDate, setCustomStartDate] = useState<Date | null>(null);
  const [customEndDate, setCustomEndDate] = useState<Date | null>(null);
  const Navigate = useNavigate();
  const [totalPurchases, setTotalPurchases] = useState<number>(0);
  const [filteredData, setFilteredData] = useState<PurchaseTransaction[]>([]);

  const API_URL = import.meta.env.VITE_API_URL;

  // 🔄 Fetch All Report Data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('accessToken');
        const url = `${API_URL}/reports/purchase-summary/`;

        const response = await axios.get<ApiResponse>(url, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        console.log(response.data); // Check what the data looks like in the response
        setData(response.data.transactions);
        setTotalPurchases(response.data.total_purchases || 0);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          setError((error.response?.data as ErrorResponse)?.message || error.message);
        } else {
          setError('An unexpected error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      const [start, end] = getDateRange(dateRange);
      const filtered = data.filter((item) => {
        if (!item.date) return true;
        const itemDate = format(new Date(item.date), 'yyyy-MM-dd');
        return start && end ? itemDate >= start && itemDate <= end : true;
      });
      setFilteredData(filtered);
    }
  }, [data, dateRange, customStartDate, customEndDate]);

  useEffect(() => {
    if (filteredData.length > 0) {
      const total = filteredData.reduce((sum, item) => {
        return sum + (parseFloat(item.purchase_amount) || 0);
      }, 0);
      setTotalPurchases(total);
    } else {
      setTotalPurchases(0);
    }
  }, [filteredData]);

  const getDateRange = (option: DateRangeOption): [string | null, string | null] => {
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

  console.log(filteredData); // Log the filtered data to check if it's correct

  const handleBack = () => {
    Navigate(-1);
  };

  return (
    <div className="bg-white dark:bg-gray-900 overflow-x-auto min-h-screen p-4">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
        Purchase Summary
      </h2>

      {/* 🔘 Date Range Dropdown */}
      <div className="mb-4">
        <select
          className="p-2 border rounded dark:bg-gray-700 dark:text-white"
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value as DateRangeOption)}
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
              className="p-2 border rounded dark:bg-gray-700 dark:text-white ml-2"
              placeholderText="Start Date"
            />
            <DatePicker
              selected={customEndDate}
              onChange={(date: Date | null) => setCustomEndDate(date)}
              className="p-2 border rounded dark:bg-gray-700 dark:text-white ml-2"
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
              <tr className="bg-gray-100 dark:bg-gray-800">
                <td
                  colSpan={6}
                  className="p-6 font-semibold text-left text-gray-700 dark:text-white"
                >
                  Total Purchases: ₹{totalPurchases.toLocaleString()}
                </td>
              </tr>
              <tr>
                <th className="border p-2 text-left">Date</th>
                <th className="border p-2 text-left">Purchase No</th>
                <th className="border p-2 text-left">Original Invoice No</th>
                <th className="border p-2 text-left">Purchase Date</th>
                <th className="border p-2 text-left">Party Name</th>
                <th className="border p-2 text-left">Purchase Amount</th>
                <th className="border p-2 text-left">Notes</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((row, index) => (
                <tr
                  key={index}
                  className="border cursor-pointer hover:bg-gray-100 dark:border-gray-600"
                  onClick={() => {
                    console.log('Navigating to:', row.tid);
                    Navigate(`/purchasetheme1/${row.tid}`);
                  }}
                >
                  <td className="border p-2 text-left">{row.date}</td>
                  <td className="border p-2 text-left">{row.Purchase_no}</td>
                  <td className="border p-2 text-left">
                    {row.Original_invoice_no || '-'}
                  </td>
                  <td className="border p-2 text-left">
                    {row.date ? format(new Date(row.date), 'dd-MM-yyyy') : '-'}
                  </td>
                  <td className="border p-2 text-left">{row.party_name}</td>
                  <td className="border p-2 text-left">
                    ₹{parseFloat(row.purchase_amount)?.toLocaleString()}
                  </td>
                  <td className="border p-2 text-left">
                    {row.purchase_notes || '-'}
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

export default PurchaseSummary;
