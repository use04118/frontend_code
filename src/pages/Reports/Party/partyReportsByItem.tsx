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

interface Item {
  id: number;
  itemName: string;
}

interface SalesTransaction {
  quantity: number;
  amount: number;
}

interface PurchaseTransaction {
  quantity: number;
  amount: number;
}

interface ReportData {
  item_date: string;
  party_name: string;
  sales?: SalesTransaction[];
  purchases?: PurchaseTransaction[];
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

const PartyReportsByItem: React.FC = () => {
  const [itemList, setItemList] = useState<Item[]>([]);
  const [selectedItem, setSelectedItem] = useState<string>('');
  const [data, setData] = useState<ReportData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<DateRangeOption>('Last 30 Days');
  const [customStartDate, setCustomStartDate] = useState<Date | null>(null);
  const [customEndDate, setCustomEndDate] = useState<Date | null>(null);
  const Navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL;

  // 🔄 Fetch Items
  useEffect(() => {
    const fetchItems = async (): Promise<void> => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get<{ results: Item[] }>(`${API_URL}/inventory/items/`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const result = response.data;
        setItemList(result.results || []);
      } catch (error: unknown) {
        console.error('Error fetching items:', error instanceof Error ? error.message : 'Unknown error');
      }
    };

    fetchItems();
  }, []);

  // 🔄 Fetch Report Data (based on selected item)
  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      if (!selectedItem) return;

      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('accessToken');
        const url = `${API_URL}/reports/party-report-by-item/?item_id=${selectedItem}`;

        const response = await axios.get(url, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const result = response.data;
        setData(Array.isArray(result) ? result : result.transactions || []);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to fetch reports');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedItem]);

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
    if (!item.item_date) return true;
    const itemDate = format(new Date(item.item_date), 'yyyy-MM-dd');
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
        Party Report By Item
      </h2>

      {/* 🔘 Item Dropdown */}
      <div className="mb-4">
        <select
          value={selectedItem}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedItem(e.target.value)}
          className="border rounded p-2 dark:bg-gray-700 dark:text-white"
        >
          <option value="">Select Item</option>
          {itemList.map((item) => (
            <option key={item.id} value={item.id}>
              {item.itemName}
            </option>
          ))}
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
      </div>

      {loading && (
        <p className="text-center text-gray-600 dark:text-gray-300">
          Loading...
        </p>
      )}

      {error && <p className="text-center text-red-500">Error: {error}</p>}

      {!loading && !error && filteredData.length > 0 && (
        <>
          {/* Show Selected Item Name */}
          <h3 className="text-lg font-semibold text-gray-700 dark:text-white mb-2">
            Item Name:{' '}
            {
              itemList.find((item) => item.id === parseInt(selectedItem))
                ?.itemName
            }
          </h3>

          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300">
              <thead className="bg-gray-200 dark:bg-gray-700">
                <tr>
                  <th className="border p-2">Date</th>
                  <th className="border p-2">PARTY NAME</th>
                  <th className="border p-2">SALES QUANTITY</th>
                  <th className="border p-2">SALES AMOUNT</th>
                  <th className="border p-2">PURCHASE QUANTITY</th>
                  <th className="border p-2">PURCHASE AMOUNT</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((row, index) => {
                  const totalSalesQty =
                    row.sales?.reduce((sum, s) => sum + s.quantity, 0) || 0;
                  const totalSalesAmt =
                    row.sales?.reduce((sum, s) => sum + s.amount, 0) || 0;
                  const totalPurchaseQty =
                    row.purchases?.reduce((sum, p) => sum + p.quantity, 0) || 0;
                  const totalPurchaseAmt =
                    row.purchases?.reduce((sum, p) => sum + p.amount, 0) || 0;

                  return (
                    <tr key={index} className="border dark:border-gray-600">
                      <td className="border p-2">{row.item_date}</td>
                      <td className="border p-2">{row.party_name}</td>
                      <td className="border p-2">{totalSalesQty}</td>
                      <td className="border p-2">{totalSalesAmt}</td>
                      <td className="border p-2">{totalPurchaseQty}</td>
                      <td className="border p-2">{totalPurchaseAmt}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {!loading && !error && selectedItem && filteredData.length === 0 && (
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

export default PartyReportsByItem;
