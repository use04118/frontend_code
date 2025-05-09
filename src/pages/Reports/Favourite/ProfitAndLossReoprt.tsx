import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import axios from 'axios';
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
import { useNavigate } from 'react-router-dom';

interface ReportData {
  name: string;
  closing_balance: number;
}

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

const ProfitAndLossReoprt: React.FC = () => {
  const [data, setData] = useState<ReportData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<DateRangeOption>('Last 30 Days');
  const [customStartDate, setCustomStartDate] = useState<Date | null>(null);
  const [customEndDate, setCustomEndDate] = useState<Date | null>(null);
  const Navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL;

  // 🔄 Fetch Report Data
  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('accessToken');
        const url = `${API_URL}/reports/profit-and-loss/`;
  
        const [startDate, endDate] = getDateRange(dateRange);
        if (!startDate || !endDate) {
          setLoading(false);
          return;
        }
  
        const response = await axios.get<Record<string, number>>(url, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          params: {
            start_date: startDate,
            end_date: endDate,
          },
        });
  
        console.log('API Result:', response.data);
  
        const transformedData = Object.entries(response.data).map(
          ([key, value]) => ({
            name: key
              .replace(/_/g, ' ')
              .replace(/\b\w/g, (c) => c.toUpperCase()),
            closing_balance: value,
          })
        );
  
        setData(transformedData);
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
  
    // Only fetch if custom dates are selected and valid or other predefined range
    if (
      dateRange !== 'Custom Date Range' ||
      (customStartDate && customEndDate)
    ) {
      fetchData();
    }
  }, [dateRange, customStartDate, customEndDate]);
  

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

  

  const handleBack = (): void => {
    Navigate(-1);
  };

  return (
    <div className="bg-white dark:bg-gray-900 overflow-x-auto min-h-screen p-4">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
        Profit And Loss Report
      </h2>

      {/* 📅 Date Range Filter */}
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
      {!loading && !error && data.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300">
            <thead className="bg-gray-200 dark:bg-gray-700">
              <tr>
                <th className="border p-2 text-left">Particulars</th>
                <th className="border p-2 text-left">Amount</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr key={index} className="border dark:border-gray-600">
                  <td className="border p-2 text-left">{row.name}</td>
                  <td className="border p-2 text-left">
                    {row.closing_balance}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && !error && data.length === 0 && (
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

export default ProfitAndLossReoprt;
