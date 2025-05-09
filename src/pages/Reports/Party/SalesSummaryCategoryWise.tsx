import React, { useEffect, useState } from 'react';
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

interface CategoryGroup {
  category_name: string;
  transactions: {
    date: string;
    Invoice_no: string;
    party_name: string;
    Due_date: string;
    amount: string;
    Balance_amount: string;
    invoice_type: string;
    invoice_status: string;
  }[];
  total: number;
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

const SalesSummaryCategoryWise = () => {
  const [categories, setCategories] = useState<CategoryGroup[]>([]);
  const [grandTotal, setGrandTotal] = useState<number>(0);
  const [dateRange, setDateRange] = useState<DateRangeOption>('Last 30 Days');
  const [customStartDate, setCustomStartDate] = useState<Date | null>(null);
  const [customEndDate, setCustomEndDate] = useState<Date | null>(null);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL;

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
    const fetchInvoices = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) throw new Error('Token not found');
  
        const response = await axios.get<CategoryGroup[]>(`${API_URL}/reports/sales-summary-categorywise/`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
  
        const data = response.data;
  
        // Apply date filtering
        const filtered = data.map((group) => {
          const filteredTransactions = group.transactions.filter((invoice) => {
            const invoiceDate = format(new Date(invoice.date), 'yyyy-MM-dd');
            return startDate && endDate
              ? invoiceDate >= startDate && invoiceDate <= endDate
              : true;
          });
  
          return {
            ...group,
            transactions: filteredTransactions,
            total: filteredTransactions.reduce(
              (sum, txn) => sum + parseFloat(txn.amount || '0'),
              0
            ),
          };
        });
  
        // Remove groups with no transactions
        const finalFiltered = filtered.filter(
          (group) => group.transactions.length > 0
        );
  
        setCategories(finalFiltered);
  
        const totalSum = finalFiltered.reduce(
          (acc, group) => acc + group.total,
          0
        );
        setGrandTotal(Number(totalSum.toFixed(2)));
      } catch (error) {
        console.error('Error fetching invoices:', error);
      }
    };
  
    fetchInvoices();
  }, [dateRange, customStartDate, customEndDate]);

  return (
    <div className="p-4 min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      <h2 className="text-xl font-bold mb-4">Sales Summary - Category Wise</h2>

      {/* 📆 Date Range Filter */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
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

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300 dark:border-gray-600 rounded-lg shadow-md">
          <thead className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white">
            <tr>
              <th className="p-3 border dark:border-gray-600">DATE</th>
              <th className="p-3 border dark:border-gray-600">INVOICE NO</th>
              <th className="p-3 border dark:border-gray-600">PARTY SALE</th>
              <th className="p-3 border dark:border-gray-600">DUE DATE</th>
              <th className="p-3 border dark:border-gray-600">AMOUNT</th>
              <th className="p-3 border dark:border-gray-600">BALANCE</th>
              <th className="p-3 border dark:border-gray-600">INVOICE TYPE</th>
              <th className="p-3 border dark:border-gray-600">STATUS</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((group, index) => (
              <React.Fragment key={index}>
                <tr className="bg-gray-100 dark:bg-gray-800">
                  <td colSpan={8} className="p-4 font-semibold text-left">
                    Category Name - {group.category_name}
                  </td>
                </tr>
                {group.transactions.map((invoice, idx) => (
                  <tr
                    key={idx}
                    className="border dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
                  >
                    <td className="p-3 border dark:border-gray-600">
                      {invoice.date}
                    </td>
                    <td className="p-3 border dark:border-gray-600">
                      {invoice.Invoice_no}
                    </td>
                    <td className="p-3 border dark:border-gray-600">
                      {invoice.party_name}
                    </td>
                    <td className="p-3 border dark:border-gray-600">
                      {invoice.Due_date}
                    </td>
                    <td className="p-3 border dark:border-gray-600">
                      ₹ {invoice.amount}
                    </td>
                    <td className="p-3 border dark:border-gray-600">
                      ₹ {invoice.Balance_amount}
                    </td>
                    <td className="p-3 border dark:border-gray-600">
                      {invoice.invoice_type}
                    </td>
                    <td className="p-3 border dark:border-gray-600">
                      <span
                        className={`px-3 py-1 rounded text-sm ${
                          invoice.invoice_status === 'Unpaid'
                            ? 'bg-red-100 text-red-600 dark:bg-red-800 dark:text-red-300'
                            : 'bg-green-100 text-green-600 dark:bg-green-800 dark:text-green-300'
                        }`}
                      >
                        {invoice.invoice_status}
                      </span>
                    </td>
                  </tr>
                ))}
                <tr className="bg-gray-200 dark:bg-gray-800 font-semibold">
                  <td
                    colSpan={4}
                    className="p-3 border dark:border-gray-600 text-left"
                  >
                    Subtotal
                  </td>
                  <td colSpan={4} className="p-3 border dark:border-gray-600">
                    ₹ {group.total}
                  </td>
                </tr>
              </React.Fragment>
            ))}
            <tr className="bg-gray-300 dark:bg-gray-700 font-bold">
              <td
                colSpan={4}
                className="p-3 border dark:border-gray-600 text-left"
              >
                Grand Total
              </td>
              <td colSpan={4} className="p-3 border dark:border-gray-600">
                ₹ {grandTotal}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 🔙 Back Button */}
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

export default SalesSummaryCategoryWise;
