import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { FaUniversity } from 'react-icons/fa';
import { BsDownload } from 'react-icons/bs';
import AdjustBalanceModal from './AdjustBalanceModal';
import { IoMdClose } from 'react-icons/io';
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
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';


interface BankAccount {
  id: string | number;
  name: string;
  balance: number;
  [key: string]: any;
}

interface Transaction {
  date: string;
  type: string;
  txnNo: string;
  party: string;
  mode: string;
  paid: number;
  received: number;
  balance: number;
  [key: string]: any;
}

const CashAndBank = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [type, setType] = useState('add');
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [isAddAccountModalOpen, setIsAddAccountModalOpen] = useState(false);
  const [showBankDetails, setShowBankDetails] = useState(false);
  const [data, setData] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL;
  const [dateRange, setDateRange] = useState('Last 30 Days');
  const [customStartDate, setCustomStartDate] = useState(null);
  const [customEndDate, setCustomEndDate] = useState(null);
  const [totalBalance, setTotalBalance] = useState(0);
  const [cash, setCash] = useState(0);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [unlinkedTransactions, setUnlinkedTransactions] = useState(0);
  const [adjustType, setAdjustType] = useState('add');
  const [moneyType, setMoneyType] = useState('Cash');
  const [adjustDate, setAdjustDate] = useState(
    new Date().toISOString().split('T')[0],
  );
  const [amount, setAmount] = useState('');
  const [remarks, setRemarks] = useState('');
  const [transferFrom, setTransferFrom] = useState('cash');
  const [transferTo, setTransferTo] = useState('bank');
  const [transferAmount, setTransferAmount] = useState('');
  const [transferDate, setTransferDate] = useState(
    new Date().toISOString().split('T')[0],
  );
  const [transferRemarks, setTransferRemarks] = useState('');
  const [accountName, setAccountName] = useState('');
  const [openingBalance, setOpeningBalance] = useState('');
  const [asOfDate, setAsOfDate] = useState('');
  const [bankAccountNumber, setBankAccountNumber] = useState('');
  const [reEnterBankAccountNumber, setReEnterBankAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [bankBranchName, setBankBranchName] = useState('');
  const [accountHolderName, setAccountHolderName] = useState('');
  const [upiId, setUpiId] = useState('');
  const [accountError, setAccountError] = useState<string | null>(null);
  const [selectedBankAccountId, setSelectedBankAccountId] = useState('');
  const [transferFromBankId, setTransferFromBankId] = useState('');
  const [transferToBankId, setTransferToBankId] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('accessToken');
      let url = `${API_URL}/cash-bank/transactions/dashboard/`;
      if (startDate && endDate) {
        url += `?start_date=${startDate}&end_date=${endDate}`;
      }
      const response = await axios.get(url, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const result = response.data;
      setData(Array.isArray(result.transactions) ? result.transactions : []);
      setTotalBalance(result.total_balance || 0);
      setCash(result.cash || 0);
      setBankAccounts(result.bank_accounts || []);
      setUnlinkedTransactions(result.unlinked_transactions || 0);
    } catch (error) {
      console.error('Error fetching data:', error);
      setData([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getDateRange = (option) => {
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

  const filteredData = Array.isArray(data)
    ? data.filter((item) => {
        if (!item.date) return true;
        const itemDate = format(new Date(item.date), 'yyyy-MM-dd');
        return startDate && endDate
          ? itemDate >= startDate && itemDate <= endDate
          : true;
      })
    : [];

  const handleSubmit = async () => {
    const payload = {
      type: type,
      money_type: moneyType,
      date: adjustDate,
      amount: parseFloat(amount),
      remarks: remarks,
      account_id:
        moneyType === 'Bank' && selectedBankAccountId
          ? selectedBankAccountId
          : null,
    };

    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.post(
        `${API_URL}/cash-bank/transactions/`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        setIsModalOpen(false);
        setAmount('');
        setRemarks('');
        fetchData();
      } else {
        alert(response.data.error || 'Error saving data');
      }
    } catch (error: any) {
      alert('Error: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleTransfer = async () => {
    const payload = {
      from: transferFrom,
      to: transferTo,
      amount: parseFloat(transferAmount),
      date: transferDate,
      remarks: transferRemarks,
      from_account_id: transferFrom === 'bank' ? transferFromBankId : null,
      to_account_id: transferTo === 'bank' ? transferToBankId : null,
    };

    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.post(
        `${API_URL}/cash-bank/transactions/`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        setIsTransferModalOpen(false);
        fetchData();
      } else {
        alert(response.data.error || 'Transfer Failed');
      }
    } catch (error: any) {
      console.error('Error:', error);
    }
  };

  const handleBankAccountSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAccountError(null);

    const payload: any = {
      account_name: accountName,
      account_type: 'Bank',
      opening_balance: openingBalance,
      as_of_date: asOfDate,
    };

    if (showBankDetails) {
      if (bankAccountNumber) payload.bank_account_number = bankAccountNumber;
      if (ifscCode) payload.ifsc_code = ifscCode;
      if (bankBranchName) payload.bank_branch_name = bankBranchName;
      if (accountHolderName) payload.account_holder_name = accountHolderName;
      if (upiId) payload.upi_id = upiId;
    }

    try {
      const token = localStorage.getItem('accessToken');
      const res = await axios.post(
        `${API_URL}/cash-bank/accounts/`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 200 || res.status === 201) {
        setIsAddAccountModalOpen(false);
        fetchData();
      } else {
        setAccountError(
          typeof res.data === 'object' && res.data !== null
            ? Object.values(res.data).flat().join('\n')
            : 'Failed to save account'
        );
      }
    } catch (error: any) {
      setAccountError('Error: ' + (error.response?.data?.error || error.message));
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Cash and Bank</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setIsModalOpen(true)}
            className="border px-4 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            + Add/Reduce Money
          </button>
          <button
            onClick={() => setIsTransferModalOpen(true)}
            className="border px-4 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Transfer Money
          </button>
          <button
            onClick={() => setIsAddAccountModalOpen(true)}
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
          >
            + Add New Account
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        {/* Sidebar */}
        <div className="md:col-span-1 border rounded-lg p-4 space-y-4">
          <div>
            <p className="text-sm font-medium">Total Balance:</p>
            <p className="text-xl font-semibold">₹{totalBalance}</p>
          </div>

          <div className="border rounded p-2">
            <p className="font-medium">Cash</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Cash in hand
            </p>
            <p className="font-semibold">₹{cash}</p>
          </div>

          <div className="flex justify-between items-center">
            <p className="font-medium">Bank Accounts</p>
            <button
              onClick={() => setIsAddAccountModalOpen(true)}
              className="text-blue-600 dark:text-blue-400 text-sm hover:underline"
            >
              + Add New Bank
            </button>
          </div>

          {bankAccounts.map((account, index) => (
            <div
              key={index}
              className="flex items-center bg-purple-50 dark:bg-purple-900 text-purple-700 dark:text-purple-300 p-2 rounded mb-2"
            >
              <FaUniversity className="mr-2" />
              <div className="flex-1">
                <p className="text-sm font-medium">{account.name}</p>
                <p className="text-sm">₹{account.balance}</p>
              </div>
            </div>
          ))}

          <div className="flex items-center bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 p-2 rounded">
            <FaUniversity className="mr-2" />
            <div className="flex-1">
              <p className="text-sm font-medium">Unlinked Transactions</p>
              <p className="text-sm">₹{unlinkedTransactions}</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="md:col-span-3 border rounded-lg p-4">
          {/* Tabs */}
          <div className="border-b mb-4">
            <button className="border-b-2 border-purple-600 px-4 py-2 font-medium">
              Transactions
            </button>
          </div>

          {/* Filter + Export */}
          <div className="flex flex-wrap gap-2 items-center mb-4">
            <select
              className="p-2 border rounded bg-white dark:bg-gray-800 dark:text-white"
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
                  onChange={setCustomStartDate}
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

            <button className="p-2 border rounded hover:bg-gray-100 dark:hover:bg-gray-700">
              <BsDownload />
            </button>
          </div>

          {isLoading ? (
            <div className="text-center text-gray-500 dark:text-gray-400">
              Loading...
            </div>
          ) : filteredData.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left border">
                <thead className="bg-gray-100 dark:bg-gray-700">
                  <tr className="text-xs text-gray-700 uppercase dark:text-gray-400">
                    <th className="p-2 border">DATE</th>
                    <th className="p-2 border">TYPE</th>
                    <th className="p-2 border">TXN NO</th>
                    <th className="p-2 border">PARTY</th>
                    <th className="p-2 border">MODE</th>
                    <th className="p-2 border">PAID</th>
                    <th className="p-2 border">RECEIVED</th>
                    <th className="p-2 border">BALANCE</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((txn, index) => (
                    <tr key={index} className="bg-white dark:bg-gray-800">
                      <td className="p-2 border">{txn.date}</td>
                      <td className="p-2 border">{txn.type}</td>
                      <td className="p-2 border">{txn.txnNo}</td>
                      <td className="p-2 border">{txn.party}</td>
                      <td className="p-2 border">{txn.mode}</td>
                      <td className="p-2 border text-right">
                        {txn.paid || '-'}
                      </td>
                      <td className="p-2 border text-right">
                        ₹ {txn.received}
                      </td>
                      <td className="p-2 border text-right">₹ {txn.balance}</td>
                    </tr>
                  ))}
                  {/* Total Row */}
                  <tr className="font-bold bg-gray-100 dark:bg-gray-700">
                    <td colSpan={6} className="p-2 border text-right">
                      Total:
                    </td>
                    <td className="p-2 border text-right">
                      ₹{' '}
                      {filteredData
                        .reduce((acc, curr) => acc + Number(curr.received), 0)
                        .toFixed(2)}
                    </td>
                    <td className="p-2 border text-right">
                      ₹{' '}
                      {filteredData
                        .reduce((acc, curr) => acc + Number(curr.balance), 0)
                        .toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center h-64 text-gray-500 dark:text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-16 h-16 mb-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 10h18M9 16h6M12 4v2m0 10v2m7-7h.01M5 13h.01M5 7h.01"
                />
              </svg>
              <p className="font-semibold text-lg">No Transactions</p>
              <p className="text-sm">
                You don't have any transaction in selected period
              </p>
            </div>
          )}
        </div>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 mt-20 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-lg shadow-lg p-6 relative">
            <button
              className="absolute top-3 right-3 text-xl text-gray-500 dark:text-gray-300 hover:text-black dark:hover:text-white"
              onClick={() => setIsModalOpen(false)}
            >
              <IoMdClose />
            </button>
            <h2 className="text-xl font-semibold mb-4">Adjust Balance</h2>

            <label className="block mb-2">Adjust money in</label>
            <select
              value={moneyType}
              onChange={(e) => {
                setMoneyType(e.target.value);
                setSelectedBankAccountId(''); // Reset bank selection when switching
              }}
            >
              <option>Cash</option>
              <option>Bank</option>
            </select>

            {/* Show bank account dropdown if Bank is selected */}
            {moneyType === 'Bank' && (
              <div className="mb-4">
                <label className="block text-sm mb-1">
                  Select Bank Account
                </label>
                <select
                  value={selectedBankAccountId}
                  onChange={(e) => setSelectedBankAccountId(e.target.value)}
                  className="w-full border p-2 rounded"
                >
                  <option value="">Select Bank</option>
                  {bankAccounts.map((acc, idx) => (
                    <option key={acc.id || idx} value={acc.id}>
                      {acc.name} (₹{acc.balance})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex items-center gap-4 mb-4">
              <button
                className={`px-4 py-1 rounded border ${
                  type === 'add' ? 'bg-purple-100 text-purple-700' : ''
                }`}
                onClick={() => setType('add')}
              >
                + Add Money
              </button>
              <button
                className={`px-4 py-1 rounded border ${
                  type === 'reduce' ? 'bg-gray-200 dark:bg-gray-600' : ''
                }`}
                onClick={() => setType('reduce')}
              >
                - Reduce Money
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm">Current Balance</p>
                <p className="font-semibold">
                  ₹
                  {moneyType === 'Cash'
                    ? cash
                    : moneyType === 'Bank' && selectedBankAccountId
                    ? bankAccounts.find(
                        (acc) =>
                          String(acc.id) === String(selectedBankAccountId),
                      )?.balance || 0
                    : 0}
                </p>
              </div>
              <div>
                <p className="text-sm">Date</p>
                <input
                  type="date"
                  className="w-full border p-2 rounded dark:bg-gray-700 dark:text-white"
                  value={adjustDate}
                  onChange={(e) => setAdjustDate(e.target.value)}
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="text-sm block">Enter Amount</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="₹"
                className="w-full border p-2 rounded mt-1 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div className="mb-4">
              <label className="text-sm block">+ Add Remarks</label>
              <input
                type="text"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Optional"
                className="w-full border p-2 rounded mt-1 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                className="border px-4 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
      {isTransferModalOpen && (
        <div className="fixed mt-20 inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-lg shadow-lg p-3 relative">
            <button
              className="absolute top-3 right-3 text-xl text-gray-500 dark:text-gray-300 hover:text-black dark:hover:text-white"
              onClick={() => setIsTransferModalOpen(false)}
            >
              <IoMdClose />
            </button>

            <h2 className="text-xl font-semibold mb-4">Transfer Money</h2>

            {/* Transfer From */}
            <div className="mb-4">
              <label className="block text-sm mb-1">Transfer From</label>
              <select
                value={transferFrom}
                onChange={(e) => {
                  setTransferFrom(e.target.value);
                  setTransferFromBankId('');
                }}
              >
                <option value="cash">Cash</option>
                <option value="bank">Bank</option>
              </select>
              {transferFrom === 'bank' && (
                <select
                  value={transferFromBankId}
                  onChange={(e) => setTransferFromBankId(e.target.value)}
                  className="w-full border p-2 rounded mt-2"
                >
                  <option value="">Select Bank</option>
                  {bankAccounts.map((acc, idx) => (
                    <option key={acc.id || idx} value={acc.id}>
                      {acc.name} (₹{acc.balance})
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Transfer To */}
            <div className="mb-4">
              <label className="block text-sm mb-1">Transfer To</label>
              <select
                value={transferTo}
                onChange={(e) => {
                  setTransferTo(e.target.value);
                  setTransferToBankId('');
                }}
              >
                <option value="bank">Bank</option>
                <option value="cash">Cash</option>
              </select>
              {transferTo === 'bank' && (
                <select
                  value={transferToBankId}
                  onChange={(e) => setTransferToBankId(e.target.value)}
                  className="w-full border p-2 rounded mt-2"
                >
                  <option value="">Select Bank</option>
                  {bankAccounts.map((acc, idx) => (
                    <option key={acc.id || idx} value={acc.id}>
                      {acc.name} (₹{acc.balance})
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm mb-1">Amount</label>
              <input
                type="number"
                value={transferAmount}
                onChange={(e) => setTransferAmount(e.target.value)}
                placeholder="₹"
                className="w-full border p-2 rounded dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm mb-1">Date</label>
              <input
                type="date"
                value={transferDate}
                onChange={(e) => setTransferDate(e.target.value)}
                className="w-full border p-2 rounded dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm mb-1">Remarks</label>
              <input
                type="text"
                value={transferRemarks}
                onChange={(e) => setTransferRemarks(e.target.value)}
                placeholder="Optional"
                className="w-full border p-2 rounded dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                className="border px-4 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => setIsTransferModalOpen(false)}
              >
                Cancel
              </button>
              <button
                onClick={handleTransfer}
                className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
              >
                Transfer
              </button>
            </div>
          </div>
        </div>
      )}
      {isAddAccountModalOpen && (
        <div className="fixed mt-20 inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white dark:bg-gray-800 w-full max-w-2xl rounded-lg shadow-lg p-4 relative max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-4 mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Add Bank Account
              </h2>
              <button className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-400">
                <i className="fas fa-times"></i>
              </button>
            </div>

            <form>
              {/* Account Name */}
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                  Account Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  placeholder="ex: Personal Account"
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                />
              </div>

              {/* Opening Balance & As of Date */}
              <div className="flex flex-col md:flex-row md:space-x-4 mb-4">
                <div className="w-full md:w-1/2 mb-4 md:mb-0">
                  <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                    Opening Balance
                  </label>
                  <div className="flex items-center border rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600">
                    <span className="text-gray-500 dark:text-gray-300">₹</span>
                    <input
                      type="text"
                      value={openingBalance}
                      onChange={(e) => setOpeningBalance(e.target.value)}
                      placeholder="ex: ₹10,000"
                      className="w-full focus:outline-none focus:ring-2 focus:ring-blue-500 ml-2 dark:bg-gray-700 dark:text-gray-300"
                    />
                  </div>
                </div>
                <div className="w-full md:w-1/2">
                  <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                    As of Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={asOfDate}
                    onChange={(e) => setAsOfDate(e.target.value)}
                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-300"
                    required
                  />
                </div>
              </div>

              {/* Add Bank Details Toggle */}
              <div className="flex justify-between items-center border-b pb-4 mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Add Bank Details
                </h2>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={showBankDetails}
                    onChange={() => setShowBankDetails(!showBankDetails)}
                  />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {/* Bank Detail Fields - conditional render */}
              {showBankDetails && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                      Bank Account Number{' '}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={bankAccountNumber}
                      onChange={(e) => setBankAccountNumber(e.target.value)}
                      placeholder="ex: 123456789157950"
                      className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                      Re-Enter Bank Account Number{' '}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={reEnterBankAccountNumber}
                      onChange={(e) =>
                        setReEnterBankAccountNumber(e.target.value)
                      }
                      placeholder="ex: 123456789157950"
                      className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                      IFSC Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={ifscCode}
                      onChange={(e) => setIfscCode(e.target.value)}
                      placeholder="ex: HDFC000075"
                      className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                      Bank & Branch Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={bankBranchName}
                      onChange={(e) => setBankBranchName(e.target.value)}
                      placeholder="ex: HDFC, Old Madras"
                      className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                      Account Holders Name{' '}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={accountHolderName}
                      onChange={(e) => setAccountHolderName(e.target.value)}
                      placeholder="ex: Elisa wolf"
                      className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                      UPI ID
                    </label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="ex: elisa@okhdfc"
                      className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                    />
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setIsAddAccountModalOpen(false)}
                  className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  onClick={handleBankAccountSubmit}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Submit
                </button>
              </div>
            </form>

            {accountError && (
              <div className="mb-4 text-red-600 font-medium">
                {accountError}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CashAndBank;
