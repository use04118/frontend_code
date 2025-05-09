import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  format,
  subDays,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  subMonths,
} from 'date-fns';

type Transaction = {
  date: string;
  transaction_number: string | number;
  type: string;
  party_name: string;
  amount: number;
  status: string;
  ack_number?: string | null;
};

const TransactionTable = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState('Last 30 Days');
  const [customStartDate, setCustomStartDate] = useState(null);
  const [customEndDate, setCustomEndDate] = useState(null);
  const [transactionType, setTransactionType] = useState('All Transactions');
  const [invoiceStatus, setInvoiceStatus] = useState('All');
  const [filteredData, setFilteredData] = useState([]);

  // Replace with your actual API URL
  const API_URL = 'https://your-api.com/api/einvoice-transactions';

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get(API_URL, {
          headers: {
            Authorization: `Bearer YOUR_AUTH_TOKEN`, // if needed
          },
        });
        setTransactions(response.data);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Generated':
        return 'text-green-600 dark:text-green-400';
      case 'Failed':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-gray-600 dark:text-gray-300';
    }
  };

  const getDateRange = (option) => {
    const today = new Date();
    switch (option) {
      case 'Today':
        return [format(today, 'yyyy-MM-dd'), format(today, 'yyyy-MM-dd')];
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

  const filteredTransactions = transactions.filter((txn: Transaction) => {
    const txnDate = format(new Date(txn.date), 'yyyy-MM-dd');
  
    const matchesSearch = txn.transaction_number
      .toString()
      .includes(searchTerm);
  
    const isWithinDateRange =
      startDate && endDate ? txnDate >= startDate && txnDate <= endDate : true;
  
    const matchesType =
      transactionType === 'All Transactions' || txn.type === transactionType;
  
    const matchesStatus =
      invoiceStatus === 'All' || txn.status === invoiceStatus;
  
    return (
      matchesSearch &&
      isWithinDateRange &&
      matchesType &&
      matchesStatus
    );
  });
  

  return (
    <div className="overflow-x-auto w-full">
      <div className="flex flex-wrap items-center gap-4 mb-4">
        {/* Search Input */}
        <input
          type="text"
          placeholder="Search by Transaction Number..."
          className="p-2 border rounded-md dark:bg-gray-900"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* Date Range Dropdown */}
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="p-2 border rounded-md dark:bg-gray-900"
        >
          {[
            'Today',
            'Last 7 Days',
            'This Month',
            'Previous Month',
            'Last 30 Days',
            'Custom Date Range',
          ].map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        {/* Custom Date Pickers */}
        {dateRange === 'Custom Date Range' && (
          <>
            <DatePicker
              selected={customStartDate}
              onChange={(date) => setCustomStartDate(date)}
              placeholderText="Start Date"
              className="p-2 border rounded-md"
            />
            <DatePicker
              selected={customEndDate}
              onChange={(date) => setCustomEndDate(date)}
              placeholderText="End Date"
              className="p-2 border rounded-md"
            />
          </>
        )}

        {/* Transaction Type Filter */}
        <select
          value={transactionType}
          onChange={(e) => setTransactionType(e.target.value)}
          className="p-2 border rounded-md dark:bg-gray-900"
        >
          <option value="All Transactions">All Transactions</option>
          <option value="Sales">Sales</option>
          <option value="Credit Note">Credit Note</option>
          <option value="Debit Note">Debit Note</option>
        </select>

        {/* E-Invoice Status Filter */}
        <select
          value={invoiceStatus}
          onChange={(e) => setInvoiceStatus(e.target.value)}
          className="p-2 border rounded-md dark:bg-gray-900"
        >
          <option value="All">All</option>
          <option value="Generated">Generated</option>
          <option value="Failed">Failed</option>
          <option value="Yet To Be Pushed">Yet To Be Pushed</option>
        </select>
      </div>
      {loading ? (
        <div className="text-center py-10 text-gray-600 dark:text-gray-300">
          Loading transactions...
        </div>
      ) : (
        <table className="min-w-full text-sm text-left text-gray-700 dark:text-gray-200">
          <thead className="bg-gray-100 dark:bg-gray-700 text-xs uppercase text-gray-600 dark:text-gray-300">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Transaction Number</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Party Name</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">e-Invoice Status</th>
              <th className="px-4 py-3">Ack Number</th>
              <th className="px-4 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredTransactions.map((txn: Transaction, index: number) => (
              <tr
                key={index}
                className="hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <td className="px-4 py-3 whitespace-nowrap">{txn.date}</td>
                <td className="px-4 py-3">{txn.transaction_number}</td>
                <td className="px-4 py-3">{txn.type}</td>
                <td className="px-4 py-3">{txn.party_name}</td>
                <td className="px-4 py-3">₹ {txn.amount}</td>
                <td
                  className={`px-4 py-3 font-medium ${getStatusStyle(
                    txn.status,
                  )}`}
                >
                  {txn.status}
                </td>
                <td className="px-4 py-3">{txn.ack_number || '-'}</td>
                <td className="px-4 py-3 text-center">
                  {txn.status === 'Yet To Be Pushed' && (
                    <button
                      onClick={() =>
                        console.log(
                          'Generate e-Invoice',
                          txn.transaction_number,
                        )
                      }
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded-md text-sm"
                    >
                      Generate e-Invoice
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TransactionTable;
