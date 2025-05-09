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
interface GSTR3bData {
  // Add specific properties based on your API response
  [key: string]: any;
}

interface DateRangeOption {
  label: string;
  value: string;
}

const GSTR3b: React.FC = () => {
  const [data, setData] = useState<GSTR3bData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<string>('Last 30 Days');
  const [customStartDate, setCustomStartDate] = useState<Date | null>(null);
  const [customEndDate, setCustomEndDate] = useState<Date | null>(null);
  const Navigate = useNavigate();

  const API_URL: string = import.meta.env.VITE_API_URL;

  // 🔄 Fetch All Report Data
  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      setLoading(true);
      setError(null);
      try {
        const token: string | null = localStorage.getItem('accessToken');
        const url: string = `${API_URL}/reports/gstr-3b/`;

        const response = await axios.get<GSTR3bData>(url, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        setData([response.data]);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.data) {
          const errorData = error.response.data as { message?: string };
          setError(errorData.message || error.message);
        } else {
          setError('An unexpected error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getDateRange = (option: string): [string | null, string | null] => {
    const today: Date = new Date();
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
  /*  const filteredData = data.filter((item) => {
    if (!item.date) return true;
    const itemDate = format(new Date(item.date), 'yyyy-MM-dd');
    return startDate && endDate
      ? itemDate >= startDate && itemDate <= endDate
      : true;
  }); */

  const handleBack = (): void => {
    Navigate(-1);
  };

  const dateRangeOptions: DateRangeOption[] = [
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
  ].map(option => ({ label: option, value: option }));

  return (
    <div className="bg-white dark:bg-gray-900 overflow-x-auto min-h-screen p-4">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
        GSTR-3b
      </h2>

      {/* 🔘 Date Range Dropdown */}
      <div className="mb-4">
        <select
          className="p-2 border rounded dark:bg-gray-700 dark:text-white"
          value={dateRange}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setDateRange(e.target.value)}
        >
          {dateRangeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
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
              onChange={(date: Date | null) => setCustomEndDate(date)}
              className="p-2 border rounded dark:bg-gray-700 dark:text-white ml-2"
              placeholderText="End Date"
            />
          </>
        )}
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
      {!loading && !error && data.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300">
            <thead className="bg-gray-200 dark:bg-gray-700">
              <tr>
                <th className="border p-2 text-left">Nature of Supplies</th>
                <th className="border p-2 text-right">Total Taxable Value</th>
                <th className="border p-2 text-right">Integrated Tax</th>
                <th className="border p-2 text-right">Central Tax</th>
                <th className="border p-2 text-right">State/UT Tax</th>
                <th className="border p-2 text-right">CESS</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800">
              <tr>
                <td className="border p-2">
                  Outward taxable supplies (Other than zero rated, nil rated and
                  exempted)
                </td>
                <td className="border p-2 text-right">2,317.9</td>
                <td className="border p-2 text-right">83.1</td>
                <td className="border p-2 text-right">0</td>
                <td className="border p-2 text-right">0</td>
                <td className="border p-2 text-right">0</td>
              </tr>
              <tr>
                <td className="border p-2">
                  Outward taxable supplies (Zero rated)
                </td>
                <td className="border p-2 text-right">0</td>
                <td className="border p-2 text-right">0</td>
                <td className="border p-2 text-right">0</td>
                <td className="border p-2 text-right">0</td>
                <td className="border p-2 text-right">0</td>
              </tr>
              <tr>
                <td className="border p-2">
                  Other outward supplies (Nil rated and exempted)
                </td>
                <td className="border p-2 text-right">0</td>
                <td className="border p-2 text-right">0</td>
                <td className="border p-2 text-right">0</td>
                <td className="border p-2 text-right">0</td>
                <td className="border p-2 text-right">0</td>
              </tr>
              <tr>
                <td className="border p-2">
                  Inward supplies (Liable to reverse charge)
                </td>
                <td className="border p-2 text-right">0</td>
                <td className="border p-2 text-right">0</td>
                <td className="border p-2 text-right">0</td>
                <td className="border p-2 text-right">0</td>
                <td className="border p-2 text-right">0</td>
              </tr>
              <tr>
                <td className="border p-2">Non-GST outward supplies</td>
                <td className="border p-2 text-right">0</td>
                <td className="border p-2 text-right">0</td>
                <td className="border p-2 text-right">0</td>
                <td className="border p-2 text-right">0</td>
                <td className="border p-2 text-right">0</td>
              </tr>
            </tbody>
          </table>
          {/* 📋 Section 3.2 Table */}
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mt-8 mb-2">
            3.2 Details of Inter-State supplies made to unregistered persons,
            composition dealer and UIN holders
          </h3>
          <table className="min-w-full border border-gray-300">
            <thead className="bg-gray-200 dark:bg-gray-700">
              <tr>
                <th className="border p-2 text-left" rowSpan={2}>
                  Place of Supply
                </th>
                <th className="border p-2 text-center" colSpan={2}>
                  Supplies made to Unregistered Persons
                </th>
                <th className="border p-2 text-center" colSpan={2}>
                  Supplies made to Composition Taxable Persons
                </th>
                <th className="border p-2 text-center" colSpan={2}>
                  Supplies made to UIN Holders
                </th>
              </tr>
              <tr>
                <th className="border p-2 text-right">Total Taxable Value</th>
                <th className="border p-2 text-right">
                  Amount of Integrated Tax
                </th>
                <th className="border p-2 text-right">Total Taxable Value</th>
                <th className="border p-2 text-right">
                  Amount of Integrated Tax
                </th>
                <th className="border p-2 text-right">Total Taxable Value</th>
                <th className="border p-2 text-right">
                  Amount of Integrated Tax
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800">
              {/* Example Row */}
              <tr>
                <td className="border p-2">Karnataka</td>
                <td className="border p-2 text-right">5,000</td>
                <td className="border p-2 text-right">900</td>
                <td className="border p-2 text-right">2,000</td>
                <td className="border p-2 text-right">360</td>
                <td className="border p-2 text-right">1,000</td>
                <td className="border p-2 text-right">180</td>
              </tr>
              {/* Add dynamic rows here later */}
            </tbody>
          </table>
          {/* 📋 Section 4 Table */}
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mt-8 mb-2">
            4. Details of Eligible Input Tax Credit
          </h3>
          <table className="min-w-full border border-gray-300">
            <thead className="bg-gray-200 dark:bg-gray-700">
              <tr>
                <th className="border p-2 text-left">Details</th>
                <th className="border p-2 text-right">Integrated Tax</th>
                <th className="border p-2 text-right">Central Tax</th>
                <th className="border p-2 text-right">State/UT Tax</th>
                <th className="border p-2 text-right">Cess</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800">
              {/* Section A: ITC Available */}
              <tr>
                <td className="border p-2 font-semibold" colSpan={5}>
                  (A) ITC Available (Whether in full or part)
                </td>
              </tr>
              <tr>
                <td className="border p-2">(1) Import of goods</td>
                <td className="border p-2 text-right">0</td>
                <td className="border p-2 text-right">0</td>
                <td className="border p-2 text-right">0</td>
                <td className="border p-2 text-right">0</td>
              </tr>
              <tr>
                <td className="border p-2">(2) Import of services</td>
                <td className="border p-2 text-right">0</td>
                <td className="border p-2 text-right">0</td>
                <td className="border p-2 text-right">0</td>
                <td className="border p-2 text-right">0</td>
              </tr>
              <tr>
                <td className="border p-2">
                  (3) Inward supplies liable for reverse charge (other than 1 &
                  2 above)
                </td>
                <td className="border p-2 text-right">0</td>
                <td className="border p-2 text-right">0</td>
                <td className="border p-2 text-right">0</td>
                <td className="border p-2 text-right">0</td>
              </tr>
              <tr>
                <td className="border p-2">(4) Inward Supplies for ISD</td>
                <td className="border p-2 text-right">0</td>
                <td className="border p-2 text-right">0</td>
                <td className="border p-2 text-right">0</td>
                <td className="border p-2 text-right">0</td>
              </tr>
              <tr>
                <td className="border p-2">(5) All Other ITC</td>
                <td className="border p-2 text-right">0</td>
                <td className="border p-2 text-right">0</td>
                <td className="border p-2 text-right">0</td>
                <td className="border p-2 text-right">0</td>
              </tr>

              {/* Section D: Ineligible */}
              <tr>
                <td className="border p-2 font-semibold" colSpan={5}>
                  (D) Ineligible
                </td>
              </tr>
              <tr>
                <td className="border p-2">(1) As per section 17(5)</td>
                <td className="border p-2 text-right">0</td>
                <td className="border p-2 text-right">0</td>
                <td className="border p-2 text-right">0</td>
                <td className="border p-2 text-right">0</td>
              </tr>
              <tr>
                <td className="border p-2">(5) Others</td>
                <td className="border p-2 text-right">0</td>
                <td className="border p-2 text-right">0</td>
                <td className="border p-2 text-right">0</td>
                <td className="border p-2 text-right">0</td>
              </tr>
            </tbody>
          </table>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mt-8 mb-2">
            5. Details of exempt, nil-rated and non-GST inward supplies
          </h3>
          <table className="min-w-full border border-gray-300">
            <thead className="bg-gray-200 dark:bg-gray-700">
              <tr>
                <th className="border p-2 text-left">Nature of Supplies</th>
                <th className="border p-2 text-right">Inter State Supplies</th>
                <th className="border p-2 text-right">Intra State Supplies</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800">
              <tr>
                <td className="border p-2">
                  From a supplier under composition scheme, Exempt and Nil rated
                  supply
                </td>
                <td className="border p-2 text-right">0</td>
                <td className="border p-2 text-right">0</td>
              </tr>
              <tr>
                <td className="border p-2">Non GST supply</td>
                <td className="border p-2 text-right">0</td>
                <td className="border p-2 text-right">0</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {!loading && !error && data.length === 0 && (
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

export default GSTR3b;
