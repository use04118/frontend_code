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

interface PartyData {
  [key: string]: string;
}

interface CreditNoteData {
  credit_note_no: number;
  date: string;
  total_amount: number;
  status: string;
  party: string;
  id: string;
}

const CreditNoteTable: React.FC = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [dateRange, setDateRange] = useState<string>('Last 365 Days');
  const [customStartDate, setCustomStartDate] = useState<Date | null>(null);
  const [customEndDate, setCustomEndDate] = useState<Date | null>(null);
  const [saleCreditNoteData, setCreditNoteData] = useState<CreditNoteData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [partyData, setPartyData] = useState<PartyData>({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCreditNotes = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) throw new Error('Token not found');

        const response = await axios.get(`${API_URL}/sales/creditnote/`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const data = response.data;
        console.log('Fetched Data:', data);

        if (Array.isArray(data.results)) {
          setCreditNoteData(data.results);
        } else {
          console.error('Unexpected API response format:', data);
          setCreditNoteData([]); // Default to empty array if data is not an array
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching sales creditNotes:', error);
        setCreditNoteData([]); // Ensure it's always an array
        setLoading(false);
      }
    };

    const fetchParties = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get(`${API_URL}/parties/parties`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const data = response.data;
        console.log('Fetched Parties:', data);

        if (Array.isArray(data.results)) {
          const partyMap: PartyData = {};
          data.results.forEach((party: { id: string; party_name: string }) => {
            partyMap[party.id] = party.party_name; // Fixed: `party_name` use
          });
          setPartyData(partyMap);
        }
      } catch (error) {
        console.error('Error fetching parties:', error);
      }
    };

    fetchCreditNotes();
    fetchParties();
  }, []);

  const getDateRange = (option: string) => {
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
      case 'This Quarter':
        return [
          format(startOfMonth(today), 'yyyy-MM-dd'),
          format(endOfMonth(today), 'yyyy-MM-dd'),
        ];
      case 'Previous Quarter':
        return [
          format(startOfMonth(subMonths(today, 3)), 'yyyy-MM-dd'),
          format(endOfMonth(subMonths(today, 3)), 'yyyy-MM-dd'),
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

  const filteredCreditNote = saleCreditNoteData.filter((creditNote) => {
    const creditNoteDate = format(new Date(creditNote.date), 'yyyy-MM-dd');

    const isWithinDateRange =
      startDate && endDate
        ? creditNoteDate >= startDate && creditNoteDate <= endDate
        : true;

    return (
      creditNote.credit_note_no.toString().includes(searchTerm) && isWithinDateRange
    );
  });

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">CreditNote Details</h2>

        {/* Search Bar */}
        <div className="relative w-1/3">
          <span className="absolute inset-y-0 left-3 flex items-center text-gray-500">
            <FaSearch />
          </span>
          <input
            type="text"
            placeholder="Search by CreditNote Number..."
            className="w-full p-3 pl-10 border border-gray-300 dark:bg-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Dropdown for Date Filtering */}
        <select
          className="w-60 p-3 h-full border border-gray-300 dark:bg-gray-900 rounded-lg focus:ring-2 focus:ring-blue-500"
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
            'This Quarter',
            'Previous Quarter',
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

        {/* Custom Date Range Pickers */}
        {dateRange === 'Custom Date Range' && (
          <div className="flex gap-2">
            <DatePicker
              selected={customStartDate}
              onChange={(date) => setCustomStartDate(date)}
              className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholderText="Start Date"
            />
            <DatePicker
              selected={customEndDate}
              onChange={(date) => setCustomEndDate(date)}
              className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholderText="End Date"
            />
          </div>
        )}
      </div>

      {/* Sales CreditNote Table */}
      {loading ? (
        <p className="text-center text-lg">Loading...</p>
      ) : (
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-200 text-left dark:bg-gray-600">
              <th className="border px-4 py-2">Date</th>
              <th className="border px-4 py-2">CreditNote Number</th>
              <th className="border px-4 py-2">Party Name</th>
              <th className="border px-4 py-2">Amount</th>
              <th className="border px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredCreditNote.length > 0 ? (
              filteredCreditNote.map((creditNote) => (
                <tr
                  key={creditNote.id}
                  onClick={() => navigate(`/credit-notes/${creditNote.id}`)}
                  className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <td className="border px-4 py-2">{creditNote.date}</td>
                  <td className="border px-4 py-2">{creditNote.credit_note_no}</td>
                  <td className="border px-4 py-2">
                    {partyData[creditNote.party] || 'Unknown'}
                  </td>
                  <td className="border px-4 py-2">{creditNote.total_amount}</td>
                  <td className="border px-4 py-2">{creditNote.status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-4">
                  No data found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CreditNoteTable;

