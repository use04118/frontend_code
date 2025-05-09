import React, { useState, useEffect } from 'react';
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
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Define interfaces for our data structures
interface Transaction {
  date: string;
  party_name: string;
  transaction_type: string;
  transaction_no: string;
  amount_annotated: string;
  money_in: string;
  money_out: string;
  Balance_amount: string;
  tid?: string;
  id?: string;
}

interface ApiResponse {
  transactions?: Transaction[];
  total_net_amount?: number;
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

type VoucherType = 
  | 'All Transactions'
  | 'Invoice'
  | 'Quotation'
  | 'Delivery Challan'
  | 'Proforma'
  | 'Purchase'
  | 'Payment In'
  | 'Payment Out'
  | 'Sales Return'
  | 'Purchase Return'
  | 'Purchase Order'
  | 'Add Money'
  | 'Reduce Money'
  | 'Credit Note'
  | 'Debit Note'
  | 'Expense';

const DayBook: React.FC = () => {
  const [data, setData] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<DateRangeOption>('Last 30 Days');
  const [customStartDate, setCustomStartDate] = useState<Date | null>(null);
  const [customEndDate, setCustomEndDate] = useState<Date | null>(null);
  const [voucherType, setVoucherType] = useState<VoucherType>('All Transactions');
  const [netAmount, setNetAmount] = useState<number>(0);
  const Navigate = useNavigate();

  const API_URL: string = import.meta.env.VITE_API_URL;

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

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('accessToken');
        const url = `${API_URL}/reports/daybook/`;

        const response = await axios.get<ApiResponse>(url, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const result = response.data;
        setData(Array.isArray(result) ? result : result.transactions || []);
        setNetAmount(result.total_net_amount || 0);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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

  const filteredData = data.filter((item: Transaction) => {
    if (!item.date) return false;

    const itemDate = format(new Date(item.date), 'yyyy-MM-dd');
    const matchDate =
      startDate && endDate
        ? itemDate >= startDate && itemDate <= endDate
        : true;

    const matchVoucherType =
      voucherType === 'All Transactions' ||
      item.transaction_type === voucherType;

    return matchDate && matchVoucherType;
  });

  const handleBack = (): void => {
    Navigate(-1);
  };

  return (
    <div className="bg-white dark:bg-gray-900 overflow-x-auto min-h-screen p-4">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
        Day Book
      </h2>

      <div className="mb-4 flex flex-wrap gap-4 items-center">
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
              onChange={(date: Date | null) => setCustomEndDate(date)}
              className="p-2 border rounded dark:bg-gray-700 dark:text-white"
              placeholderText="End Date"
            />
          </>
        )}

        <select
          value={voucherType}
          onChange={(e) => setVoucherType(e.target.value as VoucherType)}
          className="p-2 border rounded dark:bg-gray-700 dark:text-white"
        >
          {[
            'All Transactions',
            'Invoice',
            'Quotation',
            'Delivery Challan',
            'Proforma',
            'Purchase',
            'Payment In',
            'Payment Out',
            'Sales Return',
            'Purchase Return',
            'Purchase Order',
            'Add Money',
            'Reduce Money',
            'Credit Note',
            'Debit Note',
            'Expense',
          ].map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      {loading && (
        <p className="text-center text-gray-600 dark:text-gray-300">
          Loading...
        </p>
      )}

      {error && <p className="text-center text-red-500">Error: {error}</p>}

      {!loading && !error && filteredData.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300">
            <thead className="bg-gray-200 dark:bg-gray-700">
              <tr className="bg-gray-100 dark:bg-gray-800">
                <td
                  colSpan={6}
                  className="p-6 font-semibold text-left text-gray-700 dark:text-white"
                >
                  Net Amount: ₹
                  {filteredData.reduce(
                    (acc, item) => acc + parseFloat(item.money_out || '0.0'),
                    0.0,
                  )}
                </td>
              </tr>
              <tr>
                <th className="border p-2 text-left">Date</th>
                <th className="border p-2 text-left">Party Name</th>
                <th className="border p-2 text-left">Transaction Type</th>
                <th className="border p-2 text-left">Transaction No.</th>
                <th className="border p-2 text-left">Total Amount</th>
                <th className="border p-2 text-left">Money In</th>
                <th className="border p-2 text-left">Money Out</th>
                <th className="border p-2 text-left">Balance Amount</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((row, index) => (
                <tr
                  key={index}
                  onClick={() => {
                    const typeKey = row.transaction_type
                      ?.replace(/\s+/g, '')
                      .toLowerCase();
                    const route = typeRoutes[typeKey];
                    if (route && row.tid) {
                      console.log(row.tid);
                      Navigate(`/${route}/${row.tid}`);
                    } else {
                      console.warn('No route or tid for:', row.id);
                    }
                  }}
                  className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 border-t dark:border-gray-600"
                >
                  <td className="border p-2 text-left">{row.date}</td>
                  <td className="border p-2 text-left">{row.party_name}</td>
                  <td className="border p-2 text-left">
                    {row.transaction_type}
                  </td>
                  <td className="border p-2 text-left">{row.transaction_no}</td>
                  <td className="border p-2 text-left">
                    {row.amount_annotated}
                  </td>
                  <td className="border p-2 text-left">{row.money_in}</td>
                  <td className="border p-2 text-left">{row.money_out}</td>
                  <td className="border p-2 text-left">{row.Balance_amount}</td>
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

export default DayBook;
