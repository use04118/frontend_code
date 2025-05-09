import React, { useEffect, useState } from 'react';
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

// Define interfaces for our data structures
interface Transaction {
  date: string;
  Voucher_type: string;
  transaction_no: string;
  party_name: string;
  paid: number;
  received: number;
  balance: number;
  notes: string;
  tid?: string;
  id?: string;
}

interface ReportData {
  transactions: Transaction[];
  total_paid: number;
  total_received: number;
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

type AccountType = 'All Cash+Bank Accounts' | 'Cash';

type VoucherType = 
  | 'All Transactions'
  | 'Invoice'
  | 'Purchase'
  | 'Payment In'
  | 'Payment Out'
  | 'Sales Return'
  | 'Purchase Return'
  | 'Add Money'
  | 'Reduce Money'
  | 'Credit Note'
  | 'Debit Note'
  | 'Expense';

const CashAndBankReports: React.FC = () => {
  const [dateRange, setDateRange] = useState<DateRangeOption>('Last 30 Days');
  const [customStartDate, setCustomStartDate] = useState<Date | null>(null);
  const [customEndDate, setCustomEndDate] = useState<Date | null>(null);
  const [data, setData] = useState<ReportData>({
    transactions: [],
    total_paid: 0,
    total_received: 0,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [accountType, setAccountType] = useState<AccountType>('Cash');
  const [voucherType, setVoucherType] = useState<VoucherType>('All Transactions');
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

  const fetchData = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('accessToken');
      const url = `${API_URL}/reports/cash-and-bank-report`;

      const response = await axios.get<ReportData>(url, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      setData(response.data);
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

  useEffect(() => {
    fetchData();
  }, []);

  const filteredTransactions = data.transactions?.filter((item: Transaction) => {
    if (!item.date) return false;

    const itemDate = format(new Date(item.date), 'yyyy-MM-dd');
    const matchDate =
      startDate && endDate
        ? itemDate >= startDate && itemDate <= endDate
        : true;

    const matchVoucherType =
      voucherType === 'All Transactions' || item.Voucher_type === voucherType;

    return matchDate && matchVoucherType;
  });

  const handleBack = (): void => {
    Navigate(-1);
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-900 min-h-screen">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
        Cash and Bank Report
      </h2>

      <div className="mb-4 flex items-center gap-2 flex-wrap">
        <select
          value={accountType}
          onChange={(e) => setAccountType(e.target.value as AccountType)}
          className="p-2 border rounded dark:bg-gray-700 dark:text-white"
        >
          <option value="All Cash+Bank Accounts">All Cash+Bank Accounts</option>
          <option value="Cash">Cash</option>
        </select>
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value as DateRangeOption)}
          className="p-2 border rounded dark:bg-gray-700 dark:text-white"
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
              placeholderText="Start Date"
              className="p-2 border rounded dark:bg-gray-700 dark:text-white"
            />
            <DatePicker
              selected={customEndDate}
              onChange={(date: Date | null) => setCustomEndDate(date)}
              placeholderText="End Date"
              className="p-2 border rounded dark:bg-gray-700 dark:text-white"
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
            'Purchase',
            'Payment In',
            'Payment Out',
            'Sales Return',
            'Purchase Return',
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

      {loading && <p className="text-gray-500">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && filteredTransactions?.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300">
            <thead className="bg-gray-200 dark:bg-gray-700">
              <tr>
                <th className="p-2 border text-left">Date</th>
                <th className="p-2 border text-left">Voucher Type</th>
                <th className="p-2 border text-left">Transaction No</th>
                <th className="p-2 border text-left">Party</th>
                <th className="p-2 border text-right">Paid</th>
                <th className="p-2 border text-right">Received</th>
                <th className="p-2 border text-right">Balance</th>
                <th className="p-2 border text-left">Notes</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((item: Transaction, index: number) => (
                <tr
                  key={index}
                  onClick={() => {
                    const typeKey = item.Voucher_type?.replace(
                      /\s+/g,
                      '',
                    ).toLowerCase();
                    const route = typeRoutes[typeKey];
                    if (route && item.tid) {
                      console.log(item.tid);
                      Navigate(`/${route}/${item.tid}`);
                    } else {
                      console.warn('No route or tid for:', item.id);
                    }
                  }}
                  className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 border-t dark:border-gray-600"
                >
                  <td className="p-2 border">{item.date}</td>
                  <td className="p-2 border">{item.Voucher_type}</td>
                  <td className="p-2 border">{item.transaction_no}</td>
                  <td className="p-2 border">{item.party_name}</td>
                  <td className="p-2 border text-right">{item.paid}</td>
                  <td className="p-2 border text-right">{item.received}</td>
                  <td className="p-2 border text-right">{item.balance}</td>
                  <td className="p-2 border">{item.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-4 text-gray-800 dark:text-gray-100">
            <p>Total Paid: ₹{data.total_paid}</p>
            <p>Total Received: ₹{data.total_received}</p>
          </div>
        </div>
      )}

      {!loading && !error && filteredTransactions?.length === 0 && (
        <p className="text-gray-500 dark:text-gray-400">No data found.</p>
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

export default CashAndBankReports;
