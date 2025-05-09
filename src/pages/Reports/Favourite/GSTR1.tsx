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

// Define interfaces for our data structures
interface SalesData {
  GSTIN?: string;
  Customer_Name: string;
  state_code?: string;
  state_name?: string;
  invoice_no: string;
  invoice_date: string;
  invoice_value?: number;
  total_tax: number;
  taxable_amount?: number;
  cgst: number;
  sgst: number;
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

const GSTR1: React.FC = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [dateRange, setDateRange] = useState<DateRangeOption>('Last 30 Days');
  const [customStartDate, setCustomStartDate] = useState<Date | null>(null);
  const [customEndDate, setCustomEndDate] = useState<Date | null>(null);

  const [tableData, setTableData] = useState<SalesData[]>([]);
  const [filteredData, setFilteredData] = useState<SalesData[]>([]);
  const navigate = useNavigate();

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

  const [startDate, endDate] = getDateRange(dateRange);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get<{ sales_data: SalesData[] }>(`${API_URL}/reports/gstr-1/`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        setTableData(response.data.sales_data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (tableData.length > 0) {
      const [start, end] = getDateRange(dateRange);
      const filtered = tableData.filter((item) => {
        if (!item.invoice_date) return true;
        const itemDate = format(new Date(item.invoice_date), 'yyyy-MM-dd');
        return start && end ? itemDate >= start && itemDate <= end : true;
      });
      setFilteredData(filtered);
    }
  }, [tableData, dateRange, customStartDate, customEndDate]);

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="p-4 dark:bg-gray-900 min-h-screen">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
        GSTR-1 (Sales)
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

      {/* 📋 Data Table */}
      <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow">
        <table className="min-w-full table-auto text-sm">
          <thead className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
            <tr>
              <th className="p-3 text-left">GSTIN</th>
              <th className="p-3 text-left">Customer Name</th>
              <th className="p-3 text-left">State Code</th>
              <th className="p-3 text-left">State Name</th>
              <th className="p-3 text-left">Invoice Number</th>
              <th className="p-3 text-left">Invoice Date</th>
              <th className="p-3 text-left">Invoice Value</th>
              <th className="p-3 text-left">Total Tax(₹)</th>
              <th className="p-3 text-left">Taxable Value</th>
              <th className="p-3 text-left">CGST</th>
              <th className="p-3 text-left">SGST/UGST</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 dark:text-gray-300">
            {filteredData.map((row, idx) => (
              <tr key={idx} className="border-b dark:border-gray-700">
                <td className="p-3">{row.GSTIN || '-'}</td>
                <td className="p-3">{row.Customer_Name}</td>
                <td className="p-3">{row.state_code || '-'}</td>
                <td className="p-3">{row.state_name || '-'}</td>
                <td className="p-3">{row.invoice_no}</td>
                <td className="p-3">{row.invoice_date}</td>
                <td className="p-3">₹{row.invoice_value?.toLocaleString()}</td>
                <td className="p-3">{row.total_tax}%</td>
                <td className="p-3">₹{row.taxable_amount?.toLocaleString()}</td>
                <td className="p-3">{row.cgst}</td>
                <td className="p-3">{row.sgst}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredData.length === 0 && (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400">
            No data available for selected date range.
          </div>
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
    </div>
  );
};

export default GSTR1;
