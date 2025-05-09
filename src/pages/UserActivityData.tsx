import React, { useEffect, useState } from 'react';
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

const UserActivityData = () => {
  const [activityData, setActivityData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]); // New state for users
  const [selectedUser, setSelectedUser] = useState('');
  const [dateRange, setDateRange] = useState('Last 30 Days');
  const [customStartDate, setCustomStartDate] = useState(null);
  const [customEndDate, setCustomEndDate] = useState(null);
  const [selectedTransactionType, setSelectedTransactionType] = useState('All Transactions');

  const API_URL = import.meta.env.VITE_API_URL;

  // Fetch activity logs
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setError('Access token not found');
      setLoading(false);
      return;
    }

    // Fetch Activity Logs
    fetch(`${API_URL}/users/user-activity-log/`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch activity logs');
        return res.json();
      })
      .then((data) => {
        setActivityData(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Something went wrong');
        setLoading(false);
      });

    // Fetch Users for Dropdown
    fetch(`${API_URL}/users/`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch users');
        return res.json();
      })
      .then((data) => setUsers(data))
      .catch((err) => console.error(err));
  }, []);

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

  const filteredActivity = activityData.filter((item) => {
    const term = searchTerm.toLowerCase();
    const userMatch =
      selectedUser === '' ||
      item.user?.toLowerCase() ===
        (selectedUser.toLowerCase() === 'you'
          ? 'admin'
          : selectedUser.toLowerCase());

    const dateMatch =
      startDate && endDate
        ? format(new Date(item.timestamp), 'yyyy-MM-dd') >= startDate &&
          format(new Date(item.timestamp), 'yyyy-MM-dd') <= endDate
        : true;

    return (
      userMatch &&
      dateMatch &&
      (item.details?.toLowerCase().includes(term) ||
        item.user?.toLowerCase().includes(term))
    );
  });

  return (
    <div className="p-4 md:p-6 dark:bg-gray-900 min-h-screen">
      <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="relative w-1/3 mb-2 mt-4">
          <span className="absolute inset-y-0 left-3 flex items-center text-gray-500">
            <FaSearch />
          </span>
          <input
            type="text"
            placeholder="Search by Party Name..."
            className="w-full p-3 pl-10 border border-gray-300 dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <select
            className="px-3 py-2 rounded-md border dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
          >
            <option value="">All Users</option>
            {users.map((user, index) => (
              <option key={index} value={user.username.toLowerCase()}>
                {user.username.toLowerCase() === 'admin'
                  ? 'YOU'
                  : user.username}
              </option>
            ))}
          </select>

          <select
            className="px-3 py-2 rounded-md border dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            value={selectedTransactionType}
            onChange={(e) => setSelectedTransactionType(e.target.value)}
          >
            <option>All Transactions</option>
            <option>Edited Old Transaction</option>
            <option>Transactions edited 1 day after they were created</option>
            <option>Edited Any Transaction</option>
            <option>Deleted Transaction</option>
            <option>Created Transaction</option>
          </select>
          <select
            className="px-3 py-2 rounded-md border dark:border-gray-700 dark:bg-gray-800 dark:text-white"
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
        </div>
      </div>

      {/* Table section remains unchanged */}
      <div className="overflow-x-auto mb-4">
        {loading ? (
          <p className="text-center text-lg">Loading activity logs...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <table className="min-w-full border border-gray-300 text-left">
            <thead>
              <tr className="bg-gray-200 dark:bg-gray-600">
                <th className="border px-4 py-2">Time of Activity</th>
                <th className="border px-4 py-2">Activity</th>
                <th className="border px-4 py-2">Transaction Details</th>
                <th className="border px-4 py-2">Amount</th>
                <th className="border px-4 py-2">Performed By</th>
              </tr>
            </thead>
            <tbody>
              {filteredActivity.length > 0 ? (
                filteredActivity.map((item, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-200 dark:hover:bg-gray-800 cursor-pointer"
                  >
                    <td className="border px-4 py-2">{item.timestamp}</td>
                    <td className="border px-4 py-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          item.isEdited
                            ? 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300'
                            : 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300'
                        }`}
                      >
                        {item.activity}
                      </span>
                    </td>
                    <td className="border px-4 py-2">{item.details}</td>
                    <td className="border px-4 py-2">{item.amount}</td>
                    <td className="border px-4 py-2">{item.user}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="border px-4 py-2 text-center" colSpan="5">
                    No activity logs found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default UserActivityData;
