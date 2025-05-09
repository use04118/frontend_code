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

interface PurchaseOrder {
  id: string;
  purchase_order_no: string;
  date: string;
  due_date: string;
  total_amount: number;
  status: string;
  party: string;
}

const PurchaseOrderTable: React.FC = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [dateRange, setDateRange] = useState<string>('Last 365 Days');
  const [customStartDate, setCustomStartDate] = useState<Date | null>(null);
  const [customEndDate, setCustomEndDate] = useState<Date | null>(null);
  const [purchaseOrderData, setPurchaseOrderData] = useState<PurchaseOrder[]>(
    [],
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [partyData, setPartyData] = useState<PartyData>({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) throw new Error('Token not found');

        const response = await axios.get(`${API_URL}/purchase/purchaseorder/`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        console.log('Fetched Data:', response.data);

        if (Array.isArray(response.data.results)) {
          setPurchaseOrderData(response.data.results);
        } else {
          console.error('Unexpected API response format:', response.data);
          setPurchaseOrderData([]);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching purchase invoices:', error);
        setPurchaseOrderData([]);
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

        console.log('Fetched Parties:', response.data);

        if (Array.isArray(response.data.results)) {
          const partyMap: PartyData = {};
          response.data.results.forEach((party: any) => {
            partyMap[party.id] = party.party_name; // FIXED: `party_name` used
          });
          setPartyData(partyMap);
        }
      } catch (error) {
        console.error('Error fetching parties:', error);
      }
    };

    fetchOrders();
    fetchParties();
  }, []);

  const getDateRange = (option: string): [string | null, string | null] => {
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

  const filteredPurchaseOrder = purchaseOrderData.filter((purchaseOrder) => {
    const invoiceDate = format(new Date(purchaseOrder.date), 'yyyy-MM-dd');

    const isWithinDateRange =
      startDate && endDate
        ? invoiceDate >= startDate && invoiceDate <= endDate
        : true;

    return (
      purchaseOrder.purchase_order_no.toString().includes(searchTerm) &&
      isWithinDateRange
    );
  });

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Purchase Order Details</h2>

        {/* Search Bar */}
        <div className="relative w-1/3">
          <span className="absolute inset-y-0 left-3 flex items-center text-gray-500">
            <FaSearch />
          </span>
          <input
            type="text"
            placeholder="Search by Purchase Order Number..."
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
              onChange={(date: Date | null) => setCustomStartDate(date)}
              className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholderText="Start Date"
            />
            <DatePicker
              selected={customEndDate}
              onChange={(date: Date | null) => setCustomEndDate(date)}
              className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholderText="End Date"
            />
          </div>
        )}
      </div>

      {/* Purchase Purchase Order Table */}
      {loading ? (
        <p className="text-center text-lg">Loading...</p>
      ) : (
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-200 text-left dark:bg-gray-600 ">
              <th className="border px-4 py-2">Date</th>
              <th className="border px-4 py-2">Purchase Order Number</th>
              <th className="border px-4 py-2">Party Name</th>
              <th className="border px-4 py-2">Due Date</th>
              <th className="border px-4 py-2">Amount</th>
              <th className="border px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredPurchaseOrder.length > 0 ? (
              filteredPurchaseOrder.map((data) => (
                <tr
                  key={data.purchase_order_no}
                  onClick={() => {
                    console.log('Navigating to:', data.id);
                    navigate(`/purchasetheme4/${data.id}`);
                  }}
                  className="cursor-pointer hover:bg-gray-100"
                >
                  <td className="border px-4 py-2">{data.date}</td>
                  <td className="border px-4 py-2">{data.purchase_order_no}</td>
                  <td className="border px-4 py-2">
                    {partyData[data.party] || 'Loading...'}
                  </td>
                  <td className="border px-4 py-2">{data.due_date}</td>
                  <td className="border px-4 py-2">₹{data.total_amount}</td>
                  <td
                    className={`border px-4 py-2 font-semibold ${
                      data.status === 'Paid'
                        ? 'text-green-600'
                        : data.status === 'Unpaid'
                        ? 'text-red-600'
                        : data.status === 'Partially Paid'
                        ? 'text-yellow-600'
                        : ''
                    }`}
                  >
                    {data.status}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="border px-4 py-2 text-center" colSpan={6}>
                  No Purchase Order Found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PurchaseOrderTable;
