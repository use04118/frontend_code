import React, { useState, useEffect } from 'react';
import { MdRepeat } from 'react-icons/md';
import { FaRobot, FaMoneyCheckAlt } from 'react-icons/fa';
import { FiBell } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import axios from 'axios';

interface Bill {
  party: number;
  repeat_unit: string;
  start_date?: string;
  end_date?: string;
  total_bills: number;
  pending_bills: number;
  total_amount: number;
  status: string;
}

interface Party {
  id: number;
  party_name: string;
}

interface BillsApiResponse {
  results: Bill[];
}

interface PartiesApiResponse {
  results: Party[];
}

const AutomatedBills: React.FC = () => {
  const navigate = useNavigate();
  const [hasAutomatedBills, setHasAutomatedBills] = useState(false);
  const [bills, setBills] = useState<Bill[]>([]);
  const API_URL = import.meta.env.VITE_API_URL as string;
  const [partyData, setPartyData] = useState<Record<number, string>>({});
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchAutomatedBills = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) throw new Error('Token not found');
        const response = await axios.get<BillsApiResponse>(
          `${API_URL}/automated-bills/automated-invoices/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          },
        );

        if (response.status === 200) {
          const data = response.data;
          setBills(data.results);
          setHasAutomatedBills(data.results.length > 0);
        } else {
          console.error('Failed to fetch automated bills');
        }
      } catch (error) {
        console.error('Error fetching automated bills:', error);
      }
    };

    const fetchParties = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get<PartiesApiResponse>(
          `${API_URL}/parties/parties`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const data = response.data;
        if (Array.isArray(data.results)) {
          const partyMap: Record<number, string> = {};
          data.results.forEach((party) => {
            partyMap[party.id] = party.party_name;
          });
          setPartyData(partyMap);
        }
      } catch (error) {
        console.error('Error fetching parties:', error);
      }
    };

    fetchAutomatedBills();
    fetchParties();
  }, [API_URL]);

  const filteredBills = bills.filter((bill) =>
    (partyData[bill.party] || '')
      .toLowerCase()
      .includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen p-6 text-gray-800 dark:text-gray-100">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-2">
        <h1 className="text-2xl font-bold">Automated Bills</h1>
      </div>

      {!hasAutomatedBills ? (
        <>
          {/* Cards Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-100 dark:bg-gray-800 p-5 rounded-lg shadow text-center">
              <MdRepeat size={64} className="text-blue-500 mx-auto mb-4" />
              <p className="font-medium text-lg">Creating repeated bills?</p>
              <p className="mt-2 text-sm">
                Automate sending of repeat bills based on a schedule of your
                choice
              </p>
            </div>

            <div className="bg-gray-100 dark:bg-gray-800 p-5 rounded-lg shadow text-center">
              <FaRobot size={64} className="text-purple-500 mx-auto mb-4" />
              <p className="font-medium text-lg">Automated Billing</p>
              <p className="mt-2 text-sm">
                Send SMS reminders to customers daily/weekly/monthly
              </p>
            </div>

            <div className="bg-gray-100 dark:bg-gray-800 p-5 rounded-lg shadow text-center">
              <div className="flex justify-center gap-3 mb-4">
                <FiBell size={36} className="text-yellow-400" />
                <FaMoneyCheckAlt size={36} className="text-green-500" />
              </div>
              <p className="font-medium text-lg">Easy Reminders & Payment</p>
              <p className="mt-2 text-sm">
                Automatically receive notifications and collect payments
              </p>
            </div>
          </div>

          {/* Create Button */}
          <div className="text-center mt-10">
            <button
              onClick={() => navigate('/Create-Automated-Bills')}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Create Automated Bill
            </button>
          </div>
        </>
      ) : (
        // Table with actual data from API
        <div className="overflow-x-auto mt-6">
          <div className="relative w-full md:w-1/3 mb-4">
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
          <table className="min-w-full border border-gray-300">
            <thead className="bg-gray-200 dark:bg-gray-700 text-left">
              <tr>
                <th className="p-2 border">Party</th>
                <th className="p-2 border">Frequency</th>
                <th className="p-2 border">Previous Bill Date</th>
                <th className="p-2 border">Next Bill Date</th>
                <th className="p-2 border">Bills Made</th>
                <th className="p-2 border">Pending Bills</th>
                <th className="p-2 border">Amount</th>
                <th className="p-2 border">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredBills.map((bill, index) => (
                <tr key={index} className="bg-white dark:bg-gray-800">
                  <td className="p-2 border">{partyData[bill.party]}</td>
                  <td className="p-2 border">{bill.repeat_unit}</td>
                  <td className="p-2 border">{bill.start_date || '-'}</td>
                  <td className="p-2 border">{bill.end_date || '-'}</td>
                  <td className="p-2 border">{bill.total_bills}</td>
                  <td className="p-2 border">{bill.pending_bills}</td>
                  <td className="p-2 border text-right">
                    ₹ {bill.total_amount}
                  </td>
                  <td className="p-2 border">
                    <span
                      className={`px-2 py-1 rounded ${
                        bill.status === 'Stopped'
                          ? 'bg-red-200 text-red-800'
                          : 'bg-green-200 text-green-800'
                      }`}
                    >
                      {bill.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AutomatedBills;
