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

interface PurchaseData {
  gstin: string;
  customer_name: string;
  state_code: string;
  state_name: string;
  Invoice_no: string;
  Original_invoice_no: string;
  date: string;
  invoice_value: number;
  total_tax_percentage: number;
  total_taxable_value: number;
  sgst: number;
  cgst: number;
  igst: number;
  cess: number;
  total_tax: number;
}

interface PurchaseReturnData extends PurchaseData {
  original_no: string;
  invoice_type: string;
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

interface ErrorResponse {
  message: string;
}

const GSTR2: React.FC = () => {
  const [data, setData] = useState<PurchaseData[]>([]);
  const [purchaseReturnData, setPurchaseReturnData] = useState<PurchaseReturnData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<DateRangeOption>('Last 30 Days');
  const [customStartDate, setCustomStartDate] = useState<Date | null>(null);
  const [customEndDate, setCustomEndDate] = useState<Date | null>(null);
  const [activeTab, setActiveTab] = useState<'Purchase' | 'Purchase Return'>('Purchase');
  const Navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL;

  // 🔄 Fetch All Report Data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('accessToken');
        const url = `${API_URL}/reports/gstr-2-purchase/`;
  
        const response = await axios.get(url, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
  
        const result = response.data;
        setData(Array.isArray(result) ? result : result.purchases || []);
        setPurchaseReturnData(
          Array.isArray(result) ? result : result.purchase_returns || [],
        );
      } catch (error) {
        if (axios.isAxiosError(error)) {
          setError((error.response?.data as ErrorResponse)?.message || (error as Error).message || 'Something went wrong');
        } else {
          setError('Something went wrong');
        }
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
  const filteredData = data.filter((item) => {
    if (!item.date) return true;
    const itemDate = format(new Date(item.date), 'yyyy-MM-dd');
    return startDate && endDate
      ? itemDate >= startDate && itemDate <= endDate
      : true;
  });

  const filteredPurchaseReturnData = purchaseReturnData.filter((item) => {
    if (!item.date) return true;
    const itemDate = format(new Date(item.date), 'yyyy-MM-dd');
    return startDate && endDate
      ? itemDate >= startDate && itemDate <= endDate
      : true;
  });

  const handleBack = (): void => {
    Navigate(-1);
  };

  return (
    <div className="bg-white dark:bg-gray-900 overflow-x-auto min-h-screen p-4">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
        GSTR-2(Purchase)
      </h2>

      {/* 🔘 Date Range Dropdown */}
      <div className="mb-4">
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
        {/* Tabs */}
        <div className="flex space-x-4 border-b border-gray-300 mb-4">
          <button
            onClick={() => setActiveTab('Purchase')}
            className={`px-4 py-2 rounded-t-md font-medium ${
              activeTab === 'Purchase'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600'
            }`}
          >
            Purchase
          </button>
          <button
            onClick={() => setActiveTab('Purchase Return')}
            className={`px-4 py-2 rounded-t-md font-medium ${
              activeTab === 'Purchase Return'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600'
            }`}
          >
            Purchase Return
          </button>
        </div>
      </div>

      {/* 🔁 Loading */}
      {loading && (
        <p className="text-center text-gray-600 dark:text-gray-300">
          Loading...
        </p>
      )}

      {/* ❌ Error */}
      {error && <p className="text-center text-red-500">Error: {error}</p>}

      {/* 📊 Data Table */}
      {!loading && !error && filteredData.length > 0 && (
        <div className="overflow-x-auto">
          {activeTab === 'Purchase' && (
            <table className="min-w-full border border-gray-300 dark:border-gray-700">
              <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-100">
                <tr>
                  <th rowSpan={2} className="border p-2 text-left">
                    GSTIN
                  </th>
                  <th rowSpan={2} className="border p-2 text-left">
                    Customer Name
                  </th>
                  <th colSpan={2} className="border p-2 text-center">
                    Place of Supply
                  </th>
                  <th colSpan={2} className="border p-2 text-center">
                    Invoice Details
                  </th>
                  <th rowSpan={2} className="border p-2 text-left">
                    Total Tax %
                  </th>
                  <th rowSpan={2} className="border p-2 text-left">
                    Taxable Value
                  </th>
                  <th colSpan={5} className="border p-2 text-center">
                    Amount of Tax
                  </th>
                </tr>
                <tr>
                  <th className="border p-2 text-left">State Code</th>
                  <th className="border p-2 text-left">State Name</th>
                  <th className="border p-2 text-left">Invoice No</th>
                  <th className="border p-2 text-left">Original No</th>
                  <th className="border p-2 text-left">Invoice Date</th>
                  <th className="border p-2 text-left">Invoice Value</th>
                  <th className="border p-2 text-left">SGST</th>
                  <th className="border p-2 text-left">CGST</th>
                  <th className="border p-2 text-left">IGST</th>
                  <th className="border p-2 text-left">CESS</th>
                  <th className="border p-2 text-left">Total Tax</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((row, index) => (
                  <tr
                    key={index}
                    className="border dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <td className="border p-2">{row.gstin}</td>
                    <td className="border p-2">{row.customer_name}</td>
                    <td className="border p-2">{row.state_code}</td>
                    <td className="border p-2">{row.state_name}</td>
                    <td className="border p-2">{row.Invoice_no}</td>
                    <td className="border p-2">{row.Original_invoice_no}</td>
                    <td className="border p-2">{row.date}</td>
                    <td className="border p-2">{row.invoice_value}</td>
                    <td className="border p-2">{row.total_tax_percentage}</td>
                    <td className="border p-2">{row.total_taxable_value}</td>
                    <td className="border p-2">{row.sgst}</td>
                    <td className="border p-2">{row.cgst}</td>
                    <td className="border p-2">{row.igst}</td>
                    <td className="border p-2">{row.cess}</td>
                    <td className="border p-2">{row.total_tax}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {activeTab === 'Purchase Return' && (
            <table className="min-w-full border border-gray-300 dark:border-gray-700">
              <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-100">
                <tr>
                  <th rowSpan={2} className="border p-2 text-left">
                    GSTIN
                  </th>
                  <th rowSpan={2} className="border p-2 text-left">
                    Customer Name
                  </th>
                  <th colSpan={2} className="border p-2 text-center">
                    Place of Supply
                  </th>
                  <th colSpan={4} className="border p-2 text-center">
                    Invoice Details
                  </th>
                  <th rowSpan={2} className="border p-2 text-left">
                    Total Tax %
                  </th>
                  <th rowSpan={2} className="border p-2 text-left">
                    Taxable Value
                  </th>
                  <th colSpan={5} className="border p-2 text-center">
                    Amount of Tax
                  </th>
                </tr>
                <tr>
                  <th className="border p-2 text-left">State Code</th>
                  <th className="border p-2 text-left">State Name</th>
                  <th className="border p-2 text-left">
                    Invoice No
                    <br />
                    Original No
                  </th>
                  <th className="border p-2 text-left">Invoice Date</th>
                  <th className="border p-2 text-left">Invoice Value</th>
                  <th className="border p-2 text-left">Invoice Type</th>
                  <th className="border p-2 text-left">SGST</th>
                  <th className="border p-2 text-left">CGST</th>
                  <th className="border p-2 text-left">IGST</th>
                  <th className="border p-2 text-left">CESS</th>
                  <th className="border p-2 text-left">Total Tax</th>
                </tr>
              </thead>
              <tbody>
                {filteredPurchaseReturnData.map((item, index) => (
                  <tr
                    key={index}
                    className="border dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <td className="border p-2">{item.gstin}</td>
                    <td className="border p-2">{item.customer_name}</td>
                    <td className="border p-2">{item.state_code}</td>
                    <td className="border p-2">{item.state_name}</td>
                    <td className="border p-2">
                      {item.Invoice_no}
                      <br />
                      {item.original_no}
                    </td>
                    <td className="border p-2">{item.date}</td>
                    <td className="border p-2">{item.invoice_value}</td>
                    <td className="border p-2">{item.invoice_type}</td>
                    <td className="border p-2">{item.total_tax_percentage}</td>
                    <td className="border p-2">{item.total_taxable_value}</td>
                    <td className="border p-2">{item.sgst}</td>
                    <td className="border p-2">{item.cgst}</td>
                    <td className="border p-2">{item.igst}</td>
                    <td className="border p-2">{item.cess}</td>
                    <td className="border p-2">{item.total_tax}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
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

export default GSTR2;
