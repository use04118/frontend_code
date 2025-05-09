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

interface Party {
  id: number;
  party_name: string;
}

interface Transaction {
  date: string;
  transaction_type: string;
  transaction_no: string;
  original_invoice_no: string;
  credit_amount: number;
  debit_amount: number;
  tds_by_party: number;
  tds_by_self: number;
  mode: string;
  tid?: number;
}

interface PartyLedgerResponse {
  transactions: Transaction[];
  opening_balance: number;
  closing_balance: number;
  total_credit: number;
  total_debit: number;
}

const PartyStatement: React.FC = () => {
  const [partyList, setPartyList] = useState<Party[]>([]);
  const [selectedParty, setSelectedParty] = useState<string>('');
  const [data, setData] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<DateRangeOption>('Last 30 Days');
  const [customStartDate, setCustomStartDate] = useState<Date | null>(null);
  const [customEndDate, setCustomEndDate] = useState<Date | null>(null);
  const Navigate = useNavigate();
  const [openingBalance, setOpeningBalance] = useState(0);
  const [closingBalance, setClosingBalance] = useState(0);
  const [totalCredit, setTotalCredit] = useState(0);
  const [totalDebit, setTotalDebit] = useState(0);

  const API_URL = import.meta.env.VITE_API_URL;

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

  // 🔄 Fetch Parties
  useEffect(() => {
    const fetchParties = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get<{ results: Party[] }>(`${API_URL}/parties/parties/`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const result = response.data;
        const newPartyList = result.results || [];
        setPartyList(newPartyList);

        if (!newPartyList.find((p) => p.id === Number(selectedParty))) {
          setSelectedParty('');
        }
      } catch (error) {
        console.error('Error fetching parties:', error instanceof Error ? error.message : 'Unknown error');
      }
    };

    fetchParties();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedParty) return;

      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('accessToken');
        const url = `${API_URL}/reports/party-ledger/${selectedParty}`;

        const response = await axios.get(url, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const result = response.data;

        setData(Array.isArray(result) ? result : result.transactions || []);
        setOpeningBalance(result.opening_balance || 0);
        setClosingBalance(result.closing_balance || 0);
        setTotalCredit(result.total_credit || 0);
        setTotalDebit(result.total_debit || 0);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to fetch reports');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedParty]); // ✅ Dependency on selectedParty only

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
  const filteredData = data.filter((item) => {
    if (!item.date) return true;
    const itemDate = format(new Date(item.date), 'yyyy-MM-dd');
    return startDate && endDate
      ? itemDate >= startDate && itemDate <= endDate
      : true;
  });

  const handleBack = () => {
    Navigate(-1);
  };

  return (
    <div className="bg-white dark:bg-gray-900 overflow-x-auto min-h-screen p-4">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
        Party Statement(ledger)
      </h2>

      {/* 🔘 Party Dropdown + Date Filter */}
      <div className="mb-4">
        <select
          value={selectedParty}
          onChange={(e) => setSelectedParty(e.target.value)}
          className="border rounded p-2  dark:bg-gray-700 dark:text-white"
        >
          <option value="">Select Parties</option>
          {partyList.length > 0 ? (
            partyList.map((party) => (
              <option key={party.id} value={party.id}>
                {party.party_name}
              </option>
            ))
          ) : (
            <option disabled>Loading parties...</option>
          )}
        </select>

        <select
          className="p-2 border ml-2 rounded dark:bg-gray-700 dark:text-white"
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
              onChange={setCustomEndDate}
              className="p-2 border rounded dark:bg-gray-700 dark:text-white ml-2"
              placeholderText="End Date"
            />
          </>
        )}
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
              {selectedParty && (
                <tr className="bg-gray-100 dark:bg-gray-800">
                  <td
                    colSpan={9}
                    className="p-4 font-semibold text-left text-gray-700 dark:text-white"
                  >
                    <div>
                      <div>
                        <strong>Party:</strong>{' '}
                        {
                          partyList.find((p) => p.id === Number(selectedParty))?.party_name
                        }
                      </div>
                      <div className="flex flex-wrap gap-4 mt-2 text-sm">
                        <div>
                          <strong>Opening Balance:</strong> ₹{openingBalance}
                        </div>
                        <div>
                          <strong>Total Credit:</strong> ₹{totalCredit}
                        </div>
                        <div>
                          <strong>Total Debit:</strong> ₹{totalDebit}
                        </div>
                        <div>
                          <strong>Closing Balance:</strong> ₹{closingBalance}
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              )}

              <tr>
                <th className="border p-2">Date</th>
                <th className="border p-2">Transaction Type</th>
                <th className="border p-2">Transaction No</th>
                <th className="border p-2">Original Invoice No</th>
                <th className="border p-2">Credit</th>
                <th className="border p-2">Debit</th>
                <th className="border p-2">TDS By Party</th>
                <th className="border p-2">TDS By Self</th>
                <th className="border p-2">Payment Mode</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((row, index) => {
                  const typeKey = row.transaction_type
                    ?.replace(/\s+/g, '')
                    .toLowerCase(); // Normalize type
                  const route = typeRoutes[typeKey];

                  return (
                    <tr
                      key={index}
                      onClick={() => {
                        if (route && row.tid) {
                          Navigate(`/${route}/${row.tid}`);
                        } else {
                          console.warn('No route or tid found for:', row);
                        }
                      }}
                      className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 border-t dark:border-gray-600"
                    >
                      <td className="border p-2">{row.date}</td>
                      <td className="border p-2">{row.transaction_type}</td>
                      <td className="border p-2">{row.transaction_no}</td>
                      <td className="border p-2">{row.original_invoice_no}</td>
                      <td className="border p-2">{row.credit_amount}</td>
                      <td className="border p-2">{row.debit_amount}</td>
                      <td className="border p-2">{row.tds_by_party}</td>
                      <td className="border p-2">{row.tds_by_self}</td>
                      <td className="border p-2">{row.mode}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-2 text-center text-gray-500 dark:text-white"
                  >
                    No records found.
                  </td>
                </tr>
              )}
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

export default PartyStatement;
