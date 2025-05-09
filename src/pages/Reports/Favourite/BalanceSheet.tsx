/// <reference types="vite/client" />

import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Entry interfaces
interface BaseEntry {
  id: number;
  date: string;
  ledger_name: string;
  amount: number;
}

interface CapitalEntry extends BaseEntry {}
interface LoanEntry extends BaseEntry {}
interface FixedAssetEntry extends BaseEntry {}
interface InvestmentEntry extends BaseEntry {}
interface LoansAdvanceEntry extends BaseEntry {}
interface CurrentLiabilityEntry extends BaseEntry {}
interface CurrentAssetEntry extends BaseEntry {}

// Balance Sheet interfaces
interface CurrentAsset {
  name: string;
  amount: number;
}

interface BalanceSheetData {
  assets: {
    'Current Assets': CurrentAsset[];
    'Fixed Assets': number;
    'Investments': number;
    'Loan Advance': number;
    'Total Assets': number;
  };
  liabilities: {
    'Capital': number;
    'Current Liabilities': CurrentAsset[];
    'Loans': number;
    'Net Income': number;
    'Total Liabilities': number;
  };
  net_income: number;
}

interface ApiResponse<T> {
  data: T;
  status: number;
  statusText: string;
}

interface BalanceSheetProps {
  // Add any props if needed
}

interface ModalState {
  isOpen: boolean;
  isTaxModalOpen: boolean;
  isLoansModalOpen: boolean;
  isTaxReceivableModalOpen: boolean;
  isFixedAssetsModalOpen: boolean;
  isInvestmentsModalOpen: boolean;
  isLoansAdvanceModalOpen: boolean;
  isEditOpen: boolean;
}

const BalanceSheet: React.FC<BalanceSheetProps> = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [isOpen, setIsOpen] = useState(false);
  const [isTaxModalOpen, setIsTaxModalOpen] = useState(false);
  const [isLoansModalOpen, setIsLoansModalOpen] = useState(false);
  const [isTaxReceivableModalOpen, setIsTaxReceivableModalOpen] = useState(false);
  const [isFixedAssetsModalOpen, setIsFixedAssetsModalOpen] = useState(false);
  const [isInvestmentsModalOpen, setIsInvestmentsModalOpen] = useState(false);
  const [isLoansAdvanceModalOpen, setIsLoansAdvanceModalOpen] = useState(false);
  const [capitalEntries, setCapitalEntries] = useState<CapitalEntry[]>([]);
  const [loanEntries, setLoanEntries] = useState<LoanEntry[]>([]);
  const [fixedAssetEntries, setFixedAssetEntries] = useState<FixedAssetEntry[]>([]);
  const [investmentEntries, setInvestmentEntries] = useState<InvestmentEntry[]>([]);
  const [loansAdvanceEntries, setLoansAdvanceEntries] = useState<LoansAdvanceEntry[]>([]);
  const [currentLiabilityEntries, setCurrentLiabilityEntries] = useState<CurrentLiabilityEntry[]>([]);
  const [currentAssetEntries, setCurrentAssetEntries] = useState<CurrentAssetEntry[]>([]);
  const [balanceSheetData, setBalanceSheetData] = useState<BalanceSheetData | null>(null);
  const [capitalDate, setCapitalDate] = useState('');
  const [capitalLedgerName, setCapitalLedgerName] = useState('');
  const [capitalAmount, setCapitalAmount] = useState('');
  const [taxDate, setTaxDate] = useState('');
  const [taxLedgerName, setTaxLedgerName] = useState('');
  const [taxAmount, setTaxAmount] = useState('');
  const [loansDate, setLoansDate] = useState('');
  const [loansLedgerName, setLoansLedgerName] = useState('');
  const [loansAmount, setLoansAmount] = useState('');
  const [taxReceivableDate, setTaxReceivableDate] = useState('');
  const [taxReceivableLedgerName, setTaxReceivableLedgerName] = useState('');
  const [taxReceivableAmount, setTaxReceivableAmount] = useState('');
  const [fixedAssetsDate, setFixedAssetsDate] = useState('');
  const [fixedAssetsLedgerName, setFixedAssetsLedgerName] = useState('');
  const [fixedAssetsAmount, setFixedAssetsAmount] = useState('');
  const [investmentsDate, setInvestmentsDate] = useState('');
  const [investmentsLedgerName, setInvestmentsLedgerName] = useState('');
  const [investmentsAmount, setInvestmentsAmount] = useState('');
  const [loansAdvanceDate, setLoansAdvanceDate] = useState('');
  const [loansAdvanceLedgerName, setLoansAdvanceLedgerName] = useState('');
  const [loansAdvanceAmount, setLoansAdvanceAmount] = useState('');
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editEntryId, setEditEntryId] = useState<number | null>(null);
  const [editDate, setEditDate] = useState('');
  const [editLedgerName, setEditLedgerName] = useState('');
  const [editAmount, setEditAmount] = useState('');
  const navigate = useNavigate();

  // const liabilities = {
  //   Capital: 0,
  //   'Current Liability': [
  //     { name: 'Tax Payable', amount: 0 },
  //     { name: 'TCS Payable', amount: 0 },
  //     { name: 'TDS Payable', amount: 0 },
  //   ],
  //   'Account Payable': 0,
  //   Loans: 0,
  //   'Net Income': 302549.61,
  //   'Total Liabilities': 302549.61,
  // };

  // const assets = {
  //   'Current Assets': [
  //     { name: 'Tax Receivable', amount: 0 },
  //     { name: 'TCS Receivable', amount: 0 },
  //     { name: 'TDS Receivable', amount: 0 },
  //     { name: 'Cash In Hand', amount: 11043.59 },
  //     { name: 'Cash In Bank', amount: 12000 },
  //     { name: 'Accounts Receivables', amount: 3325 },
  //     { name: 'Inventory In Hand', amount: 288958.08 },
  //   ],
  //   'Fixed Assets': 0,
  //   Investments: 0,
  //   'Loans Advance': 0,
  //   'Total Assets': 315327.67,
  // };

  // const groupedCurrentAssets = assets['Current Assets'].slice(0, 3);
  // const otherCurrentAssets = assets['Current Assets'].slice(3);

  // Fetch all lists on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          fetchAllEntries(),
          fetchBalanceSheet()
        ]);
      } catch (error) {
        console.error('Error fetching initial data:', error);
      }
    };
    fetchData();
  }, []);

  const fetchBalanceSheet = async (): Promise<void> => {
    setIsLoading(true);
    const token = localStorage.getItem('accessToken');
    try {
      const response: ApiResponse<{ balance_sheet: BalanceSheetData }> = await axios.get(
        `${API_URL}/reports/balance-sheet/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setBalanceSheetData(response.data.balance_sheet);
    } catch (error) {
      console.error('Error fetching balance sheet:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAllEntries = async () => {
    // You may want to add error handling and loading states
    const token = localStorage.getItem('accessToken');
    try {
      setCapitalEntries((await axios.get(`${API_URL}/reports/capital-entries/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })).data);
      setLoanEntries((await axios.get(`${API_URL}/reports/loan-entries/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })).data);
      setFixedAssetEntries((await axios.get(`${API_URL}/reports/fixed-asset-entries/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })).data);
      setInvestmentEntries((await axios.get(`${API_URL}/reports/investment-entries/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })).data);
      setLoansAdvanceEntries((await axios.get(`${API_URL}/reports/loans-advance-entries/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })).data);
      setCurrentLiabilityEntries((await axios.get(`${API_URL}/reports/current-liability-entries/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })).data);
      setCurrentAssetEntries((await axios.get(`${API_URL}/reports/current-asset-entries/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })).data);
    } catch (error) {
      console.error('Error fetching entries:', error);
    }
  };

  // Add this function to handle all operations
  const handleOperation = async (operation: Function, ...args: any[]): Promise<void> => {
    try {
      await operation(...args);
      await Promise.all([
        fetchAllEntries(),
        fetchBalanceSheet()
      ]);
    } catch (error) {
      console.error('Error performing operation:', error);
    }
  };

  // Remove all duplicate function declarations and keep only these updated versions
  // Capital Entry
  const addCapitalEntry = async (entry: Omit<CapitalEntry, 'id'>): Promise<void> => {
    const token = localStorage.getItem('accessToken');
    try {
      await axios.post(`${API_URL}/reports/capital-entries/add/`, entry, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      await handleOperation(fetchAllEntries, fetchBalanceSheet);
    } catch (error) {
      console.error('Error adding capital entry:', error);
    }
  };

  const deleteCapitalEntry = async (id: number): Promise<void> => {
    const token = localStorage.getItem('accessToken');
    try {
      await axios.delete(`${API_URL}/reports/capital-entries/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      await handleOperation(fetchAllEntries, fetchBalanceSheet);
    } catch (error) {
      console.error('Error deleting capital entry:', error);
    }
  };

  const editCapitalEntry = async (id: number, entry: Omit<CapitalEntry, 'id'>): Promise<void> => {
    const token = localStorage.getItem('accessToken');
    try {
      await axios.put(`${API_URL}/reports/capital-entries/${id}/`, entry, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      await handleOperation(fetchAllEntries, fetchBalanceSheet);
    } catch (error) {
      console.error('Error editing capital entry:', error);
    }
  };

  // Current Liability Entry

  const addCurrentLiabilityEntry = async (entry: Omit<CurrentLiabilityEntry, 'id'>): Promise<void> => {
    const token = localStorage.getItem('accessToken');
    try {
      await axios.post(`${API_URL}/reports/current-liability-entries/add/`, entry, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      await handleOperation(fetchAllEntries, fetchBalanceSheet);
    } catch (error) {
      console.error('Error adding current liability entry:', error);
    }
  };

  const deleteCurrentLiabilityEntry = async (id: number): Promise<void> => {
    const token = localStorage.getItem('accessToken');
    try {
      await axios.delete(`${API_URL}/reports/current-liability-entries/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      await handleOperation(fetchAllEntries, fetchBalanceSheet);
    } catch (error) {
      console.error('Error deleting current liability entry:', error);
    }
  };

  const editCurrentLiabilityEntry = async (id: number, entry: Omit<CurrentLiabilityEntry, 'id'>): Promise<void> => {
    const token = localStorage.getItem('accessToken');
    try {
      await axios.put(`${API_URL}/reports/current-liability-entries/${id}/`, entry, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      await handleOperation(fetchAllEntries, fetchBalanceSheet);
    } catch (error) {
      console.error('Error editing current liability entry:', error);
    }
  };

  // Loan Entry Operations
  const addLoanEntry = async (entry: Omit<LoanEntry, 'id'>): Promise<void> => {
    const token = localStorage.getItem('accessToken');
    try {
      await axios.post(`${API_URL}/reports/loan-entries/add/`, entry, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      await handleOperation(fetchAllEntries, fetchBalanceSheet);
    } catch (error) {
      console.error('Error adding loan entry:', error);
    }
  };

  const deleteLoanEntry = async (id: number): Promise<void> => {
    const token = localStorage.getItem('accessToken');
    try {
      await axios.delete(`${API_URL}/reports/loan-entries/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      await handleOperation(fetchAllEntries, fetchBalanceSheet);
    } catch (error) {
      console.error('Error deleting loan entry:', error);
    }
  };

  const editLoanEntry = async (id: number, entry: Omit<LoanEntry, 'id'>): Promise<void> => {
    const token = localStorage.getItem('accessToken');
    try {
      await axios.put(`${API_URL}/reports/loan-entries/${id}/`, entry, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      await handleOperation(fetchAllEntries, fetchBalanceSheet);
    } catch (error) {
      console.error('Error editing loan entry:', error);
    }
  };

  // Current Asset Entry Operations
  const addCurrentAssetEntry = async (entry: Omit<CurrentAssetEntry, 'id'>): Promise<void> => {
    const token = localStorage.getItem('accessToken');
    try {
      await axios.post(`${API_URL}/reports/current-asset-entries/add/`, entry, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      await handleOperation(fetchAllEntries, fetchBalanceSheet);
    } catch (error) {
      console.error('Error adding current asset entry:', error);
    }
  };

  const deleteCurrentAssetEntry = async (id: number): Promise<void> => {
    const token = localStorage.getItem('accessToken');
    try {
      await axios.delete(`${API_URL}/reports/current-asset-entries/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      await handleOperation(fetchAllEntries, fetchBalanceSheet);
    } catch (error) {
      console.error('Error deleting current asset entry:', error);
    }
  };

  const editCurrentAssetEntry = async (id: number, entry: Omit<CurrentAssetEntry, 'id'>): Promise<void> => {
    const token = localStorage.getItem('accessToken');
    try {
      await axios.put(`${API_URL}/reports/current-asset-entries/${id}/`, entry, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      await handleOperation(fetchAllEntries, fetchBalanceSheet);
    } catch (error) {
      console.error('Error editing current asset entry:', error);
    }
  };

  // Fixed Asset Entry Operations
  const addFixedAssetEntry = async (entry: Omit<FixedAssetEntry, 'id'>): Promise<void> => {
    const token = localStorage.getItem('accessToken');
    try {
      await axios.post(`${API_URL}/reports/fixed-asset-entries/add/`, entry, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      await handleOperation(fetchAllEntries, fetchBalanceSheet);
    } catch (error) {
      console.error('Error adding fixed asset entry:', error);
    }
  };

  const deleteFixedAssetEntry = async (id: number): Promise<void> => {
    const token = localStorage.getItem('accessToken');
    try {
      await axios.delete(`${API_URL}/reports/fixed-asset-entries/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      await handleOperation(fetchAllEntries, fetchBalanceSheet);
    } catch (error) {
      console.error('Error deleting fixed asset entry:', error);
    }
  };

  const editFixedAssetEntry = async (id: number, entry: Omit<FixedAssetEntry, 'id'>): Promise<void> => {
    const token = localStorage.getItem('accessToken');
    try {
      await axios.put(`${API_URL}/reports/fixed-asset-entries/${id}/`, entry, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      await handleOperation(fetchAllEntries, fetchBalanceSheet);
    } catch (error) {
      console.error('Error editing fixed asset entry:', error);
    }
  };

  // Investment Entry Operations
  const addInvestmentEntry = async (entry: Omit<InvestmentEntry, 'id'>): Promise<void> => {
    const token = localStorage.getItem('accessToken');
    try {
      await axios.post(`${API_URL}/reports/investment-entries/add/`, entry, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      await handleOperation(fetchAllEntries, fetchBalanceSheet);
    } catch (error) {
      console.error('Error adding investment entry:', error);
    }
  };

  const deleteInvestmentEntry = async (id: number): Promise<void> => {
    const token = localStorage.getItem('accessToken');
    try {
      await axios.delete(`${API_URL}/reports/investment-entries/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      await handleOperation(fetchAllEntries, fetchBalanceSheet);
    } catch (error) {
      console.error('Error deleting investment entry:', error);
    }
  };

  const editInvestmentEntry = async (id: number, entry: Omit<InvestmentEntry, 'id'>): Promise<void> => {
    const token = localStorage.getItem('accessToken');
    try {
      await axios.put(`${API_URL}/reports/investment-entries/${id}/`, entry, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      await handleOperation(fetchAllEntries, fetchBalanceSheet);
    } catch (error) {
      console.error('Error editing investment entry:', error);
    }
  };

  // Loans Advance Entry Operations
  const addLoansAdvanceEntry = async (entry: Omit<LoansAdvanceEntry, 'id'>): Promise<void> => {
    const token = localStorage.getItem('accessToken');
    try {
      await axios.post(`${API_URL}/reports/loans-advance-entries/add/`, entry, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      await handleOperation(fetchAllEntries, fetchBalanceSheet);
    } catch (error) {
      console.error('Error adding loans advance entry:', error);
    }
  };

  const deleteLoansAdvanceEntry = async (id: number): Promise<void> => {
    const token = localStorage.getItem('accessToken');
    try {
      await axios.delete(`${API_URL}/reports/loans-advance-entries/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      await handleOperation(fetchAllEntries, fetchBalanceSheet);
    } catch (error) {
      console.error('Error deleting loans advance entry:', error);
    }
  };

  const editLoansAdvanceEntry = async (id: number, entry: Omit<LoansAdvanceEntry, 'id'>): Promise<void> => {
    const token = localStorage.getItem('accessToken');
    try {
      await axios.put(`${API_URL}/reports/loans-advance-entries/${id}/`, entry, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      await handleOperation(fetchAllEntries, fetchBalanceSheet);
    } catch (error) {
      console.error('Error editing loans advance entry:', error);
    }
  };

  const handleBack = () => {
    navigate(-1)
  }

  // Add loading state
  const [isLoading, setIsLoading] = useState(true);

  // Update the render condition
  if (isLoading || !balanceSheetData) {
    return <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>;
  }

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setCapitalDate(e.target.value);
  };

  const handleLedgerNameChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setCapitalLedgerName(e.target.value);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setCapitalAmount(e.target.value);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
        <div className="border-r border-gray-300 dark:border-gray-700 pr-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
            LIABILITIES
          </h2>

          {/* Capital */}
          <div className="border border-gray-300 dark:border-gray-700 p-3 rounded-lg mb-1">
            <div className="flex justify-between items-center">
              <h3 className="text-gray-700 dark:text-gray-300 font-medium">
                Capital
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                ₹ {balanceSheetData.liabilities.Capital.toFixed(2)}
              </p>
            </div>
            {/* Capital Entries List */}
            <div className="mt-2">
              <ul>
                {capitalEntries.map(entry => (
                  <li key={entry.id} className="flex justify-between items-center text-xs py-1 border-b border-gray-100 dark:border-gray-700">
                    <span>{entry.ledger_name} ({entry.date}): ₹{entry.amount}</span>
                    <span>
                      <button
                        className="text-blue-500 hover:underline mr-2"
                        onClick={() => {
                          setEditEntryId(entry.id);
                          setEditDate(entry.date);
                          setEditLedgerName(entry.ledger_name);
                          setEditAmount(entry.amount.toString());
                          setIsEditOpen(true);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="text-red-500 hover:underline"
                        onClick={() => deleteCapitalEntry(entry.id)}
                      >
                        Delete
                      </button>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <p
              className="text-blue-500 text-sm cursor-pointer mt-2"
              onClick={() => setIsOpen(true)}
            >
              + Add New Entry
            </p>
          </div>

          {/* Current Liability */}
          <div className="border border-gray-300 dark:border-gray-700 p-3 rounded-lg mb-3">
            <h3 className="text-gray-700 dark:text-gray-300 font-medium mb-2">
              Current Liability
            </h3>
            <ul className="ml-2 text-sm">
              {balanceSheetData.liabilities['Current Liabilities'].map((item, idx) => (
                <li
                  key={idx}
                  className="flex justify-between text-gray-600 dark:text-gray-400"
                >
                  <span>{item.name}</span>
                  <span>₹ {item.amount.toFixed(2)}</span>
                </li>
              ))}
            </ul>
            {/* Current Liability Entries List */}
            <div className="mt-2">
              <ul>
                {currentLiabilityEntries.map(entry => (
                  <li key={entry.id} className="flex justify-between items-center text-xs py-1 border-b border-gray-100 dark:border-gray-700">
                    <span>{entry.ledger_name} ({entry.date}): ₹{entry.amount}</span>
                    <span>
                      <button
                        className="text-blue-500 hover:underline mr-2"
                        onClick={() => {
                          setEditEntryId(entry.id);
                          setEditDate(entry.date);
                          setEditLedgerName(entry.ledger_name);
                          setEditAmount(entry.amount.toString());
                          setIsEditOpen(true);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="text-red-500 hover:underline"
                        onClick={() => deleteCurrentLiabilityEntry(entry.id)}
                      >
                        Delete
                      </button>
                    </span>
                  </li>
                ))}
              </ul>
              <p
                className="text-blue-500 text-sm cursor-pointer mt-2"
                onClick={() => setIsTaxModalOpen(true)}
              >
                + Add New Entry
              </p>
            </div>
          </div>

          {/* Loans */}
          <div className="border border-gray-300 dark:border-gray-700 p-3 rounded-lg mb-3 flex justify-between">
            <h3 className="text-gray-700 dark:text-gray-300 font-medium">
              Loans
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              ₹ {balanceSheetData.liabilities.Loans.toFixed(2)}
            </p>
          </div>
          {/* Loan Entries List */}
          <ul className="ml-2 text-xs mb-3">
            {loanEntries.map(entry => (
              <li key={entry.id} className="flex justify-between items-center py-1">
                <span>{entry.ledger_name} ({entry.date}): ₹{entry.amount}</span>
                <span>
                  <button
                    className="text-blue-500 hover:underline mr-2"
                    onClick={() => {
                      setEditEntryId(entry.id);
                      setEditDate(entry.date);
                      setEditLedgerName(entry.ledger_name);
                      setEditAmount(entry.amount.toString());
                      setIsEditOpen(true);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-500 hover:underline"
                    onClick={() => deleteLoanEntry(entry.id)}
                  >
                    Delete
                  </button>
                </span>
              </li>
            ))}
          </ul>
          <p
            className="text-blue-500 text-sm cursor-pointer mb-3"
            onClick={() => setIsLoansModalOpen(true)}
          >
            + Add New Entry
          </p>

          {/* Net Income */}
          <div className="border border-gray-300 dark:border-gray-700 p-3 rounded-lg mb-3 flex justify-between">
            <h3 className="text-gray-700 dark:text-gray-300 font-medium">
              Net Income
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              ₹ {balanceSheetData.liabilities['Net Income'].toFixed(2)}
            </p>
          </div>

          {/* Total Liabilities */}
          <div className="border border-gray-300 dark:border-gray-700 p-3 rounded-lg mt-3 flex justify-between">
            <h3 className="text-gray-800 dark:text-gray-100 font-semibold">
              Total Liabilities
            </h3>
            <p className="text-gray-900 dark:text-white font-bold">
              ₹ {balanceSheetData.liabilities['Total Liabilities'].toFixed(2)}
            </p>
          </div>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
            ASSETS
          </h2>

          {/* Current Assets */}
          <div className="border border-gray-300 dark:border-gray-700 p-3 rounded-lg mb-3">
            <h3 className="text-gray-700 dark:text-gray-300 font-medium mb-2">
              Current Assets
            </h3>
            <ul className="ml-2 text-sm">
              {balanceSheetData.assets['Current Assets'].map((item, idx) => (
                <li
                  key={idx}
                  className="flex justify-between text-gray-600 dark:text-gray-400"
                >
                  <span>{item.name}</span>
                  <span>₹ {item.amount.toFixed(2)}</span>
                </li>
              ))}
            </ul>
            {/* Current Asset Entries List */}
            <ul className="ml-2 text-xs mt-2">
              {currentAssetEntries.map(entry => (
                <li key={entry.id} className="flex justify-between items-center py-1">
                  <span>{entry.ledger_name} ({entry.date}): ₹{entry.amount}</span>
                  <span>
                    <button
                      className="text-blue-500 hover:underline mr-2"
                      onClick={() => {
                        setEditEntryId(entry.id);
                        setEditDate(entry.date);
                        setEditLedgerName(entry.ledger_name);
                        setEditAmount(entry.amount.toString());
                        setIsEditOpen(true);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-500 hover:underline"
                      onClick={() => deleteCurrentAssetEntry(entry.id)}
                    >
                      Delete
                    </button>
                  </span>
                </li>
              ))}
            </ul>
            <p
              className="text-blue-500 text-sm cursor-pointer mt-2"
              onClick={() => setIsTaxReceivableModalOpen(true)}
            >
              + Add New Entry
            </p>
          </div>

          {/* <div className="grid gap-3 mb-3">
            {otherCurrentAssets.map((item, idx) => (
              <div
                key={idx}
                className="border border-gray-300 dark:border-gray-700 p-3 rounded-lg flex justify-between text-gray-700 dark:text-gray-300 text-sm"
              >
                <span>{item.name}</span>
                <span className="text-gray-600 dark:text-gray-400">
                  ₹ {item.amount}
                </span>
              </div>
            ))}
          </div> */}

          {/* Fixed Assets */}
          <div className="border border-gray-300 dark:border-gray-700 p-3 rounded-lg mb-1">
            <div className="flex justify-between items-center">
              <h3 className="text-gray-700 dark:text-gray-300 font-medium">
                Fixed Assets
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                ₹ {balanceSheetData.assets['Fixed Assets'].toFixed(2)}
              </p>
            </div>
            {/* Fixed Asset Entries List */}
            <div className="mt-2">
              <ul>
                {fixedAssetEntries.map(entry => (
                  <li key={entry.id} className="flex justify-between items-center text-xs py-1 border-b border-gray-100 dark:border-gray-700">
                    <span>{entry.ledger_name} ({entry.date}): ₹{entry.amount}</span>
                    <span>
                      <button
                        className="text-blue-500 hover:underline mr-2"
                        onClick={() => {
                          setEditEntryId(entry.id);
                          setEditDate(entry.date);
                          setEditLedgerName(entry.ledger_name);
                          setEditAmount(entry.amount.toString());
                          setIsEditOpen(true);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="text-red-500 hover:underline"
                        onClick={() => deleteFixedAssetEntry(entry.id)}
                      >
                        Delete
                      </button>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <p
              className="text-blue-500 text-sm cursor-pointer mt-2"
              onClick={() => setIsFixedAssetsModalOpen(true)}
            >
              + Add New Entry
            </p>
          </div>

          {/* Investments */}
          <div className="border border-gray-300 dark:border-gray-700 p-3 rounded-lg mb-1">
            <div className="flex justify-between items-center">
              <h3 className="text-gray-700 dark:text-gray-300 font-medium">
                Investments
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                ₹ {balanceSheetData.assets['Investments'].toFixed(2)}
              </p>
            </div>
            {/* Investment Entries List */}
            <div className="mt-2">
              <ul>
                {investmentEntries.map(entry => (
                  <li key={entry.id} className="flex justify-between items-center text-xs py-1 border-b border-gray-100 dark:border-gray-700">
                    <span>{entry.ledger_name} ({entry.date}): ₹{entry.amount}</span>
                    <span>
                      <button
                        className="text-blue-500 hover:underline mr-2"
                        onClick={() => {
                          setEditEntryId(entry.id);
                          setEditDate(entry.date);
                          setEditLedgerName(entry.ledger_name);
                          setEditAmount(entry.amount.toString());
                          setIsEditOpen(true);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="text-red-500 hover:underline"
                        onClick={() => deleteInvestmentEntry(entry.id)}
                      >
                        Delete
                      </button>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <p
              className="text-blue-500 text-sm cursor-pointer mt-2"
              onClick={() => setIsInvestmentsModalOpen(true)}
            >
              + Add New Entry
            </p>
          </div>

          {/* Loans Advance */}
          <div className="border border-gray-300 dark:border-gray-700 p-3 rounded-lg mb-1">
            <div className="flex justify-between items-center">
              <h3 className="text-gray-700 dark:text-gray-300 font-medium">
                Loans Advance
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                ₹ {balanceSheetData.assets['Loan Advance'].toFixed(2)}
              </p>
            </div>
            {/* Loans Advance Entries List */}
            <div className="mt-2">
              <ul>
                {loansAdvanceEntries.map(entry => (
                  <li key={entry.id} className="flex justify-between items-center text-xs py-1 border-b border-gray-100 dark:border-gray-700">
                    <span>{entry.ledger_name} ({entry.date}): ₹{entry.amount}</span>
                    <span>
                      <button
                        className="text-blue-500 hover:underline mr-2"
                        onClick={() => {
                          setEditEntryId(entry.id);
                          setEditDate(entry.date);
                          setEditLedgerName(entry.ledger_name);
                          setEditAmount(entry.amount.toString());
                          setIsEditOpen(true);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="text-red-500 hover:underline"
                        onClick={() => deleteLoansAdvanceEntry(entry.id)}
                      >
                        Delete
                      </button>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <p
              className="text-blue-500 text-sm cursor-pointer mt-2"
              onClick={() => setIsLoansAdvanceModalOpen(true)}
            >
              + Add New Entry
            </p>
          </div>

          {/* Total Assets */}
          <div className="border border-gray-300 dark:border-gray-700 p-3 rounded-lg mt-3 flex justify-between">
            <h3 className="text-gray-800 dark:text-gray-100 font-semibold">
              Total Assets
            </h3>
            <p className="text-gray-900 dark:text-white font-bold">
              ₹ {balanceSheetData.assets['Total Assets'].toFixed(2)}
            </p>
          </div>
        </div>

        {/* Modal */}
        <Dialog
          open={isOpen}
          onClose={() => setIsOpen(false)}
          className="relative z-50"
        >
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="w-full max-w-md rounded bg-white p-6 dark:bg-gray-800">
              <Dialog.Title className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Add New Entry for Capital
              </Dialog.Title>
              <div className="mb-2 text-sm text-gray-600 dark:text-gray-300">
                Ledger Category: Capital
              </div>
              <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">
                Date
              </label>
              <input
                type="date"
                className="w-full border rounded px-3 py-2 mb-2"
                value={capitalDate}
                onChange={handleDateChange}
              />
              <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">
                Ledger Name
              </label>
              <input
                type="text"
                className="w-full border rounded px-3 py-2 mb-2"
                value={capitalLedgerName}
                onChange={handleLedgerNameChange}
              />
              <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">
                Amount
              </label>
              <input
                type="number"
                className="w-full border rounded px-3 py-2 mb-4"
                value={capitalAmount}
                onChange={handleAmountChange}
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                  onClick={() => {
                    addCapitalEntry({
                      date: capitalDate,
                      ledger_name: capitalLedgerName,
                      amount: Number(capitalAmount),
                    });
                    setIsOpen(false);
                    setCapitalDate('');
                    setCapitalLedgerName('');
                    setCapitalAmount('');
                  }}
                >
                  Save
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
        
        <Dialog
          open={isTaxModalOpen}
          onClose={() => setIsTaxModalOpen(false)}
          className="relative z-50"
        >
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="w-full max-w-md rounded bg-white p-6">
              <Dialog.Title className="text-lg font-semibold text-gray-900 mb-2">
                Add New Entry for Tax Payable
              </Dialog.Title>
              <div className="bg-gray-100 rounded p-2 text-sm text-gray-700 mb-4">
                Ledger Category: Tax Payable
              </div>

              <label className="block text-sm text-gray-600 mb-1">Date</label>
              <input
                type="date"
                className="w-full border border-gray-300 rounded px-3 py-2 mb-3"
                value={taxDate}
                onChange={e => setTaxDate(e.target.value)}
              />

              <label className="block text-sm text-gray-600 mb-1">
                Ledger Name
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded px-3 py-2 mb-3"
                placeholder="Enter Ledger Name"
                value={taxLedgerName}
                onChange={e => setTaxLedgerName(e.target.value)}
              />

              <label className="block text-sm text-gray-600 mb-1">Amount</label>
              <input
                type="number"
                className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
                placeholder="Enter Amount"
                value={taxAmount}
                onChange={e => setTaxAmount(e.target.value)}
              />

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsTaxModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                  onClick={() => {
                    addCurrentLiabilityEntry({
                      date: taxDate,
                      ledger_name: taxLedgerName,
                      amount: Number(taxAmount),
                    });
                    setIsTaxModalOpen(false);
                    setTaxDate('');
                    setTaxLedgerName('');
                    setTaxAmount('');
                  }}
                >
                  Save
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
        
        <Dialog
          open={isLoansModalOpen}
          onClose={() => setIsLoansModalOpen(false)}
          className="relative z-50"
        >
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="w-full max-w-md rounded bg-white p-6">
              <Dialog.Title className="text-lg font-semibold text-gray-900 mb-2">
                Add New Entry for Loans
              </Dialog.Title>
              <div className="bg-gray-100 rounded p-2 text-sm text-gray-700 mb-4">
                Ledger Category: Loans
              </div>

              <label className="block text-sm text-gray-600 mb-1">Date</label>
              <input
                type="date"
                className="w-full border border-gray-300 rounded px-3 py-2 mb-3"
                value={loansDate}
                onChange={e => setLoansDate(e.target.value)}
              />

              <label className="block text-sm text-gray-600 mb-1">
                Ledger Name
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded px-3 py-2 mb-3"
                placeholder="Enter Ledger Name"
                value={loansLedgerName}
                onChange={e => setLoansLedgerName(e.target.value)}
              />

              <label className="block text-sm text-gray-600 mb-1">Amount</label>
              <input
                type="number"
                className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
                placeholder="Enter Amount"
                value={loansAmount}
                onChange={e => setLoansAmount(e.target.value)}
              />

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsLoansModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                  onClick={() => {
                    addLoanEntry({
                      date: loansDate,
                      ledger_name: loansLedgerName,
                      amount: Number(loansAmount),
                    });
                    setIsLoansModalOpen(false);
                    setLoansDate('');
                    setLoansLedgerName('');
                    setLoansAmount('');
                  }}
                >
                  Save
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
        {/* Modal */}
        
        <Dialog
          open={isTaxReceivableModalOpen}
          onClose={() => setIsTaxReceivableModalOpen(false)}
          className="relative z-50"
        >
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="w-full max-w-md rounded bg-white p-6 dark:bg-gray-800">
              <Dialog.Title className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Add New Entry forTaxReceivable
              </Dialog.Title>
              <div className="mb-2 text-sm text-gray-600 dark:text-gray-300">
                Ledger Category: Tax Receivable
              </div>
              <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">
                Date
              </label>
              <input
                type="date"
                className="w-full border rounded px-3 py-2 mb-2"
                value={taxReceivableDate}
                onChange={e => setTaxReceivableDate(e.target.value)}
              />
              <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">
                Ledger Name
              </label>
              <input
                type="text"
                className="w-full border rounded px-3 py-2 mb-2"
                value={taxReceivableLedgerName}
                onChange={e => setTaxReceivableLedgerName(e.target.value)}
              />
              <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">
                Amount
              </label>
              <input
                type="number"
                className="w-full border rounded px-3 py-2 mb-4"
                value={taxReceivableAmount}
                onChange={e => setTaxReceivableAmount(e.target.value)}
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsTaxReceivableModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                  onClick={() => {
                    addCurrentAssetEntry({
                      date: taxReceivableDate,
                      ledger_name: taxReceivableLedgerName,
                      amount: Number(taxReceivableAmount),
                    });
                    setIsTaxReceivableModalOpen(false);
                    setTaxReceivableDate('');
                    setTaxReceivableLedgerName('');
                    setTaxReceivableAmount('');
                  }}
                >
                  Save
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
        
        <Dialog
          open={isFixedAssetsModalOpen}
          onClose={() => setIsFixedAssetsModalOpen(false)}
          className="relative z-50"
        >
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="w-full max-w-md rounded bg-white p-6">
              <Dialog.Title className="text-lg font-semibold text-gray-900 mb-2">
                Add New Entry for Fixed Assets
              </Dialog.Title>
              <div className="bg-gray-100 rounded p-2 text-sm text-gray-700 mb-4">
                Ledger Category: Fixed Assets
              </div>

              {/* Form fields here */}
              <label className="block text-sm text-gray-600 mb-1">Date</label>
              <input
                type="date"
                className="w-full border rounded px-3 py-2 mb-2"
                value={fixedAssetsDate}
                onChange={e => setFixedAssetsDate(e.target.value)}
              />
              <label className="block text-sm text-gray-600 mb-1">
                Ledger Name
              </label>
              <input
                type="text"
                className="w-full border rounded px-3 py-2 mb-2"
                value={fixedAssetsLedgerName}
                onChange={e => setFixedAssetsLedgerName(e.target.value)}
              />
              <label className="block text-sm text-gray-600 mb-1">Amount</label>
              <input
                type="number"
                className="w-full border rounded px-3 py-2 mb-4"
                value={fixedAssetsAmount}
                onChange={e => setFixedAssetsAmount(e.target.value)}
              />

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsFixedAssetsModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                  onClick={() => {
                    addFixedAssetEntry({
                      date: fixedAssetsDate,
                      ledger_name: fixedAssetsLedgerName,
                      amount: Number(fixedAssetsAmount),
                    });
                    setIsFixedAssetsModalOpen(false);
                    setFixedAssetsDate('');
                    setFixedAssetsLedgerName('');
                    setFixedAssetsAmount('');
                  }}
                >
                  Save
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
        
        <Dialog
          open={isInvestmentsModalOpen}
          onClose={() => setIsInvestmentsModalOpen(false)}
          className="relative z-50"
        >
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="w-full max-w-md rounded bg-white p-6">
              <Dialog.Title className="text-lg font-semibold text-gray-900 mb-2">
                Add New Entry for Investments
              </Dialog.Title>
              <div className="bg-gray-100 rounded p-2 text-sm text-gray-700 mb-4">
                Ledger Category: Investments
              </div>

              {/* Form fields here */}
              <label className="block text-sm text-gray-600 mb-1">Date</label>
              <input
                type="date"
                className="w-full border rounded px-3 py-2 mb-2"
                value={investmentsDate}
                onChange={e => setInvestmentsDate(e.target.value)}
              />
              <label className="block text-sm text-gray-600 mb-1">
                Ledger Name
              </label>
              <input
                type="text"
                className="w-full border rounded px-3 py-2 mb-2"
                value={investmentsLedgerName}
                onChange={e => setInvestmentsLedgerName(e.target.value)}
              />
              <label className="block text-sm text-gray-600 mb-1">Amount</label>
              <input
                type="number"
                className="w-full border rounded px-3 py-2 mb-4"
                value={investmentsAmount}
                onChange={e => setInvestmentsAmount(e.target.value)}
              />

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsInvestmentsModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                  onClick={() => {
                    addInvestmentEntry({
                      date: investmentsDate,
                      ledger_name: investmentsLedgerName,
                      amount: Number(investmentsAmount),
                    });
                    setIsInvestmentsModalOpen(false);
                    setInvestmentsDate('');
                    setInvestmentsLedgerName('');
                    setInvestmentsAmount('');
                  }}
                >
                  Save
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
        
        <Dialog
          open={isLoansAdvanceModalOpen}
          onClose={() => setIsLoansAdvanceModalOpen(false)}
          className="relative z-50"
        >
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="w-full max-w-md rounded bg-white p-6">
              <Dialog.Title className="text-lg font-semibold text-gray-900 mb-2">
                Add New Entry for Loans Advance
              </Dialog.Title>
              <div className="bg-gray-100 rounded p-2 text-sm text-gray-700 mb-4">
                Ledger Category: Loans Advance
              </div>

              {/* Form fields here */}
              <label className="block text-sm text-gray-600 mb-1">Date</label>
              <input
                type="date"
                className="w-full border rounded px-3 py-2 mb-2"
                value={loansAdvanceDate}
                onChange={e => setLoansAdvanceDate(e.target.value)}
              />
              <label className="block text-sm text-gray-600 mb-1">
                Ledger Name
              </label>
              <input
                type="text"
                className="w-full border rounded px-3 py-2 mb-2"
                value={loansAdvanceLedgerName}
                onChange={e => setLoansAdvanceLedgerName(e.target.value)}
              />
              <label className="block text-sm text-gray-600 mb-1">Amount</label>
              <input
                type="number"
                className="w-full border rounded px-3 py-2 mb-4"
                value={loansAdvanceAmount}
                onChange={e => setLoansAdvanceAmount(e.target.value)}
              />

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsLoansAdvanceModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                  onClick={() => {
                    addLoansAdvanceEntry({
                      date: loansAdvanceDate,
                      ledger_name: loansAdvanceLedgerName,
                      amount: Number(loansAdvanceAmount),
                    });
                    setIsLoansAdvanceModalOpen(false);
                    setLoansAdvanceDate('');
                    setLoansAdvanceLedgerName('');
                    setLoansAdvanceAmount('');
                  }}
                >
                  Save
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
        
        {/* Edit Capital Entry */}
        <Dialog
          open={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          className="relative z-50"
        >
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="w-full max-w-md rounded bg-white p-6 dark:bg-gray-800">
              <Dialog.Title className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Edit Capital Entry
              </Dialog.Title>
              <div className="mb-2 text-sm text-gray-600 dark:text-gray-300">
                Ledger Category: Capital
              </div>
              <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">
                Date
              </label>
              <input
                type="date"
                className="w-full border rounded px-3 py-2 mb-2"
                value={editDate}
                onChange={e => setEditDate(e.target.value)}
              />
              <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">
                Ledger Name
              </label>
              <input
                type="text"
                className="w-full border rounded px-3 py-2 mb-2"
                value={editLedgerName}
                onChange={e => setEditLedgerName(e.target.value)}
              />
              <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">
                Amount
              </label>
              <input
                type="number"
                className="w-full border rounded px-3 py-2 mb-4"
                value={editAmount}
                onChange={e => setEditAmount(e.target.value)}
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsEditOpen(false)}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                  onClick={() => {
                    if (editEntryId !== null) {
                      editCapitalEntry(editEntryId as number, {
                        date: editDate,
                        ledger_name: editLedgerName,
                        amount: Number(editAmount),
                      });
                      setIsEditOpen(false);
                    }
                  }}
                >
                  Save
                </button>
              </div>
            </Dialog.Panel>
          </div>
        
        </Dialog>

        {/* Edit Current Liability Entry */}
        <Dialog
          open={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          className="relative z-50"
        >
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="w-full max-w-md rounded bg-white p-6 dark:bg-gray-800">
              <Dialog.Title className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Edit Current Liability Entry
              </Dialog.Title>
              <div className="mb-2 text-sm text-gray-600 dark:text-gray-300">
                Ledger Category: Current Liability
              </div>
              <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">
                Date
              </label>
              <input
                type="date"
                className="w-full border rounded px-3 py-2 mb-2"
                value={editDate}
                onChange={e => setEditDate(e.target.value)}
              />
              <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">
                Ledger Name
              </label>
              <input
                type="text"
                className="w-full border rounded px-3 py-2 mb-2"
                value={editLedgerName}
                onChange={e => setEditLedgerName(e.target.value)}
              />
              <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">
                Amount
              </label>
              <input
                type="number"
                className="w-full border rounded px-3 py-2 mb-4"
                value={editAmount}
                onChange={e => setEditAmount(e.target.value)}
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsEditOpen(false)}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                  onClick={() => {
                    editCurrentLiabilityEntry(editEntryId as number, {
                      date: editDate,
                      ledger_name: editLedgerName,
                      amount: Number(editAmount),
                    });
                    setIsEditOpen(false);
                  }}
                >
                  Save
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>

        {/* Edit Loan Entry */}
        <Dialog
          open={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          className="relative z-50"
        >
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="w-full max-w-md rounded bg-white p-6 dark:bg-gray-800">
              <Dialog.Title className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Edit Loan Entry
              </Dialog.Title>
              <div className="mb-2 text-sm text-gray-600 dark:text-gray-300">
                Ledger Category: Loan
              </div>
              <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">
                Date
              </label>
              <input
                type="date"
                className="w-full border rounded px-3 py-2 mb-2"
                value={editDate}
                onChange={e => setEditDate(e.target.value)}
              />
              <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">
                Ledger Name
              </label>
              <input
                type="text"
                className="w-full border rounded px-3 py-2 mb-2"
                value={editLedgerName}
                onChange={e => setEditLedgerName(e.target.value)}
              />
              <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">
                Amount
              </label>
              <input
                type="number"
                className="w-full border rounded px-3 py-2 mb-4"
                value={editAmount}
                onChange={e => setEditAmount(e.target.value)}
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsEditOpen(false)}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                  onClick={() => {
                    editLoanEntry(editEntryId as number, {
                      date: editDate,
                      ledger_name: editLedgerName,
                      amount: Number(editAmount),
                    });
                    setIsEditOpen(false);
                  }}
                >
                  Save
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>

        {/* Edit Current Asset Entry */}
        <Dialog
          open={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          className="relative z-50"
        >
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="w-full max-w-md rounded bg-white p-6 dark:bg-gray-800">
              <Dialog.Title className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Edit Current Asset Entry
              </Dialog.Title>
              <div className="mb-2 text-sm text-gray-600 dark:text-gray-300">
                Ledger Category: Current Asset
              </div>
              <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">
                Date
              </label>
              <input
                type="date"
                className="w-full border rounded px-3 py-2 mb-2"
                value={editDate}
                onChange={e => setEditDate(e.target.value)}
              />
              <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">
                Ledger Name
              </label>
              <input
                type="text"
                className="w-full border rounded px-3 py-2 mb-2"
                value={editLedgerName}
                onChange={e => setEditLedgerName(e.target.value)}
              />
              <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">
                Amount
              </label>
              <input
                type="number"
                className="w-full border rounded px-3 py-2 mb-4"
                value={editAmount}
                onChange={e => setEditAmount(e.target.value)}
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsEditOpen(false)}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                  onClick={() => {
                    editCurrentAssetEntry(editEntryId as number, {
                      date: editDate,
                      ledger_name: editLedgerName,
                      amount: Number(editAmount),
                    });
                    setIsEditOpen(false);
                  }}
                >
                  Save
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>

        {/* Edit Fixed Asset Entry */}
        <Dialog
          open={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          className="relative z-50"
        >
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="w-full max-w-md rounded bg-white p-6 dark:bg-gray-800">
              <Dialog.Title className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Edit Fixed Asset Entry
              </Dialog.Title>
              <div className="mb-2 text-sm text-gray-600 dark:text-gray-300">
                Ledger Category: Fixed Asset
              </div>
              <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">
                Date
              </label>
              <input
                type="date"
                className="w-full border rounded px-3 py-2 mb-2"
                value={editDate}
                onChange={e => setEditDate(e.target.value)}
              />
              <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">
                Ledger Name
              </label>
              <input
                type="text"
                className="w-full border rounded px-3 py-2 mb-2"
                value={editLedgerName}
                onChange={e => setEditLedgerName(e.target.value)}
              />
              <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">
                Amount
              </label>
              <input
                type="number"
                className="w-full border rounded px-3 py-2 mb-4"
                value={editAmount}
                onChange={e => setEditAmount(e.target.value)}
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsEditOpen(false)}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                  onClick={() => {
                    editFixedAssetEntry(editEntryId as number, {
                      date: editDate,
                      ledger_name: editLedgerName,
                      amount: Number(editAmount),
                    });
                    setIsEditOpen(false);
                  }}
                >
                  Save
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>

        {/* Edit Investment Entry */}
        <Dialog
          open={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          className="relative z-50"
        >
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="w-full max-w-md rounded bg-white p-6 dark:bg-gray-800">
              <Dialog.Title className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Edit Investment Entry
              </Dialog.Title>
              <div className="mb-2 text-sm text-gray-600 dark:text-gray-300">
                Ledger Category: Investment
              </div>
              <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">
                Date
              </label>
              <input
                type="date"
                className="w-full border rounded px-3 py-2 mb-2"
                value={editDate}
                onChange={e => setEditDate(e.target.value)}
              />
              <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">
                Ledger Name
              </label>
              <input
                type="text"
                className="w-full border rounded px-3 py-2 mb-2"
                value={editLedgerName}
                onChange={e => setEditLedgerName(e.target.value)}
              />
              <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">
                Amount
              </label>
              <input
                type="number"
                className="w-full border rounded px-3 py-2 mb-4"
                value={editAmount}
                onChange={e => setEditAmount(e.target.value)}
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsEditOpen(false)}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                  onClick={() => {
                    editInvestmentEntry(editEntryId as number, {
                      date: editDate,
                      ledger_name: editLedgerName,
                      amount: Number(editAmount),
                    });
                    setIsEditOpen(false);
                  }}
                >
                  Save
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>

        {/* Edit Loans Advance Entry */}
        <Dialog
          open={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          className="relative z-50"
        >
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="w-full max-w-md rounded bg-white p-6 dark:bg-gray-800">
              <Dialog.Title className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Edit Loans Advance Entry
              </Dialog.Title>
              <div className="mb-2 text-sm text-gray-600 dark:text-gray-300">
                Ledger Category: Loans Advance
              </div>
              <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">
                Date
              </label>
              <input
                type="date"
                className="w-full border rounded px-3 py-2 mb-2"
                value={editDate}
                onChange={e => setEditDate(e.target.value)}
              />
              <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">
                Ledger Name
              </label>
              <input
                type="text"
                className="w-full border rounded px-3 py-2 mb-2"
                value={editLedgerName}
                onChange={e => setEditLedgerName(e.target.value)}
              />
              <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">
                Amount
              </label>
              <input
                type="number"
                className="w-full border rounded px-3 py-2 mb-4"
                value={editAmount}
                onChange={e => setEditAmount(e.target.value)}
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsEditOpen(false)}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                  onClick={() => {
                    editLoansAdvanceEntry(editEntryId as number, {
                      date: editDate,
                      ledger_name: editLedgerName,
                      amount: Number(editAmount),
                    });
                    setIsEditOpen(false);
                  }}
                >
                  Save
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>

      </div>
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

export default BalanceSheet;
