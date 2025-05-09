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

interface Transaction {
  date: string;
  type: string;
  transaction_no: string | number;
  party_name: string;
  amount: number;
  tid: string | number;
}

const AllTransactions: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [dateRange, setDateRange] = useState<string>('Last 365 Days');
  const [customStartDate, setCustomStartDate] = useState<Date | null>(null);
  const [customEndDate, setCustomEndDate] = useState<Date | null>(null);
  const API_URL = import.meta.env.VITE_API_URL as string;
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) throw new Error('Token not found');

    axios
      .get<{ transactions: Transaction[] }>(`${API_URL}/dashboard/dashboard/`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => setTransactions(response.data.transactions))
      .catch((error) => console.error('Error fetching transactions:', error));
  }, [API_URL]);

  const getDateRange = (option: string): [string | null, string | null] => {
    const today = new Date();
    switch (option) {
      case 'Today':
        return [format(today, 'yyyy-MM-dd'), format(today, 'yyyy-MM-dd')];
      case 'Last 7 Days':
        return [
          format(subDays(today, 7), 'yyyy-MM-dd'),
          format(today, 'yyyy-MM-dd'),
        ];
      case 'Last 30 Days':
        return [
          format(subDays(today, 30), 'yyyy-MM-dd'),
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

  const filteredTransactions = transactions.filter((txn) => {
    const txnDate = format(new Date(txn.date), 'yyyy-MM-dd');

    const matchesSearch =
      txn.transaction_no
        .toString()
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      txn.type.toLowerCase().includes(searchTerm.toLowerCase());

    return (
      matchesSearch &&
      (startDate && endDate ? txnDate >= startDate && txnDate <= endDate : true)
    );
  });

  const typeRoutes: Record<string, string> = {
    purchaseorder: 'purchasetheme4',
    paymentout: 'Payment-Out-Details',
    debitnote: 'ddebittheme3',
    purchasereturn: 'purchasetheme2',
    purchase: 'purchasetheme1',
    proforma: 'theme5',
    creditnote: 'theme3',
    deliverychallan: 'theme4',
    paymentin: 'Payment-In-Details',
    salesreturn: 'theme2',
    quotation: 'theme1',
    invoice: 'theme',
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-gray-700 dark:text-white mb-3">
        All Transactions
      </h2>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-4">
        {/* Search Bar */}
        <div className="relative w-1/3 ">
          <span className="absolute inset-y-0 left-3 flex items-center text-gray-500 ">
            <FaSearch />
          </span>
          <input
            type="text"
            placeholder="Search by Transaction Number..."
            className="w-full p-3 pl-10 border border-gray-300 dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select
          className="p-3 border rounded-lg dark:bg-gray-800"
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
        >
          {[
            'Today',
            'Last 7 Days',
            'Last 30 Days',
            'This Month',
            'Previous Month',
            'Last 365 Days',
            'Custom Date Range',
          ].map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        {dateRange === 'Custom Date Range' && (
          <div className="flex gap-2">
            <DatePicker
              selected={customStartDate}
              onChange={(date) => setCustomStartDate(date)}
              className="p-2 border rounded-lg"
              placeholderText="Start Date"
            />
            <DatePicker
              selected={customEndDate}
              onChange={(date) => setCustomEndDate(date)}
              className="p-2 border rounded-lg"
              placeholderText="End Date"
            />
          </div>
        )}
      </div>

      {/* Scrollable Table Wrapper */}
      <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500">
        <table className="w-full border-collapse">
          <thead className="bg-gray-200 dark:bg-gray-700 sticky top-0 z-10">
            <tr>
              <th className="p-2 text-left text-gray-600 dark:text-white">
                DATE
              </th>
              <th className="p-2 text-left text-gray-600 dark:text-white">
                TYPE
              </th>
              <th className="p-2 text-left text-gray-600 dark:text-white">
                TXN NO
              </th>
              <th className="p-2 text-left text-gray-600 dark:text-white">
                PARTY NAME
              </th>
              <th className="p-2 text-left text-gray-600 dark:text-white">
                AMOUNT
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((txn, index) => {
                const typeKey = txn.type.replace(/\s+/g, '').toLowerCase(); // Remove spaces & lowercase
                const route = typeRoutes[typeKey]; // Get corresponding route

                return (
                  <tr
                    key={index}
                    onClick={() => {
                      if (route) {
                        navigate(`/${route}/${txn.tid}`);
                      } else {
                        console.warn('No route found for type:', txn.type);
                      }
                    }}
                    className="border-b dark:border-gray-600 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <td className="p-2 text-gray-700 dark:text-white">
                      {txn.date}
                    </td>
                    <td className="p-2 text-gray-700 dark:text-white">
                      {txn.type}
                    </td>
                    <td className="p-2 text-gray-700 dark:text-white">
                      {txn.transaction_no}
                    </td>
                    <td className="p-2 text-gray-700 dark:text-white">
                      {txn.party_name}
                    </td>
                    <td className="p-2 text-gray-700 dark:text-white">
                      ₹ {txn.amount}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="p-2 text-center text-gray-600 dark:text-white"
                >
                  No transactions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-4 mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        Back to Dashboard
      </button>
    </div>
  );
};

export default AllTransactions;
