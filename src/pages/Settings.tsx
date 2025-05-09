import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import React, { useState, useEffect, useRef } from 'react';
import { FaSearch } from 'react-icons/fa';
import AddNewUser from './AddNewUser';
import UserActivityData from './UserActivityData';
import { FiMoreVertical } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const [toRecieve, setToRecieve] = useState<number | null>(null);
  const [toSettle, setToSettle] = useState<number | null>(null);
  const [selectedTab, setSelectedTab] = useState<'toReceive' | 'toSettle'>(
    'toReceive',
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const API_URL = import.meta.env.VITE_API_URL;
  const [menuOpenIndex, setMenuOpenIndex] = useState<number | null>(null);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) throw new Error('Token not found');

    fetch(`${API_URL}/parties/parties/to-collect/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setToRecieve(data.totalToCollect))
      .catch((error) =>
        console.error('Error fetching to receive data:', error),
      );
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) throw new Error('Token not found');

    fetch(`${API_URL}/parties/parties/to-pay/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setToSettle(data.totalToPay))
      .catch((error) => console.error('Error fetching to settle data:', error));
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) throw new Error('Token not found');

    fetch(`${API_URL}/users/staff/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setTransactions(data.staff || []);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load users');
        setLoading(false);
      });
  }, []);

  const filteredUsers = transactions.filter((user) => {
    const nameMatch = user.name
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const mobileMatch = user.mobile
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    return nameMatch || mobileMatch;
  });

  const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);

  const currentTransactions = filteredUsers.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  );

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleDeleteUser = async (userId) => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    try {
      const response = await fetch(`${API_URL}/users/staff/${userId}/`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setTransactions(transactions.filter((user) => user.id !== userId));
      } else {
        console.error('Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpenIndex(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      <div className="mx-auto">
        <Breadcrumb pageName="Manage Staff" />
        <div className="flex gap-4 flex-wrap">
          {/* To Receive */}
          <div
            onClick={() => setSelectedTab('toReceive')}
            className={`w-[47%] p-4 rounded-xl border cursor-pointer shadow-sm transition-transform hover:scale-[1.02]
      ${
        selectedTab === 'toReceive'
          ? 'bg-[#f1f5ff] border-blue-500'
          : 'bg-white border-gray-200'
      }`}
          >
            <div className="flex items-center gap-2 text-sm text-blue-600 justify-center">
              <span className="font-medium">To Receive</span>
            </div>
            <div className="mt-2 text-2xl font-bold text-center text-gray-800">
              ₹{toRecieve !== null ? toRecieve.toLocaleString() : 'Loading...'}
            </div>
          </div>

          {/* To Settle */}
          <div
            onClick={() => setSelectedTab('toSettle')}
            className={`w-[47%] p-4 rounded-xl border cursor-pointer shadow-sm transition-transform hover:scale-[1.02]
      ${
        selectedTab === 'toSettle'
          ? 'bg-[#fff1f2] border-red-400'
          : 'bg-white border-gray-200'
      }`}
          >
            <div className="flex items-center gap-2 text-sm text-red-500 justify-center">
              <span className="font-medium">To Settle</span>
            </div>
            <div className="mt-2 text-2xl font-bold text-center text-gray-800">
              ₹{toSettle !== null ? toSettle.toLocaleString() : 'Loading...'}
            </div>
          </div>
        </div>
      </div>

      <AddNewUser />

      {selectedTab === 'toReceive' && (
        <>
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

          <div className="mb-4">
            {loading ? (
              <p className="text-center text-lg">Loading transactions...</p>
            ) : error ? (
              <p className="text-center text-red-500">{error}</p>
            ) : (
              <table className="min-w-full border border-gray-300">
                <thead>
                  <tr className="bg-gray-200 text-left dark:bg-gray-600">
                    <th className="border px-4 py-2">User Name</th>
                    <th className="border px-4 py-2">Mobile Number</th>
                    <th className="border px-4 py-2">Role Type</th>
                    <th className="border px-4 py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {currentTransactions.map((txn, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-200 text-left cursor-pointer relative"
                    >
                      <td className="border px-4 py-2">{txn.name}</td>
                      <td className="border px-4 py-2">{txn.mobile}</td>
                      <td className="border px-4 py-2">{txn.role}</td>
                      <td className="border px-4 py-2">{txn.status}</td>
                      {txn.role !== 'admin' && (
                        <td className="border px-4 py-2 relative">
                          <button onClick={() => setMenuOpenIndex(index)}>
                            <FiMoreVertical className="text-xl" />
                          </button>

                          {menuOpenIndex === index && (
                            <div
                              ref={menuRef}
                              className="absolute right-2 top-8 bg-white border rounded shadow-md z-10 w-32"
                            >
                              <button
                                onClick={() => {
                                  console.log(`navigating to:${txn.user_id}`);
                                  navigate(`/Create-New-User/${txn.user_id}`);
                                }}
                                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteUser(txn.id)}
                                className="block w-full text-left px-4 py-2 hover:bg-red-100 text-red-600"
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="flex justify-between items-center mb-6">
            <button
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg disabled:opacity-50"
            >
              Previous
            </button>
            <div className="flex items-center space-x-2">
              <span>Page</span>
              <span className="font-semibold">{currentPage}</span>
              <span>of {totalPages}</span>
            </div>
            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}

      {selectedTab === 'toSettle' && <UserActivityData />}
    </>
  );
};

export default Settings;
