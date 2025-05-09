import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
// import ChartOne from '../../components/Charts/ChartOne';
import ChartTwo from '../../components/Charts/ChartTwo';
import ChartThree from '../../components/Charts/ChartThree';
// import MapOne from '../../components/Maps/MapOne';
import TableOne from '../../components/Tables/TableOne';
// import ChatCard from '../../components/Chat/ChatCard';
import Preloader from '../../components/Preloader';
import { toast } from 'react-hot-toast';
import { ArrowUp, ArrowDown } from 'lucide-react';

// API responses ke liye types define kiye
type ToCollectResponse = {
  totalToCollect: number;
};

type ToPayResponse = {
  totalToPay: number;
};

type Transaction = {
  date: string;
  type: string;
  transaction_no: string;
  party_name: string;
  amount: number;
};

type DashboardResponse = {
  transactions: Transaction[];
};

const Dashboard: React.FC = () => {
  const [toRecieve, setToRecieve] = useState<number | null>(null);
  const [toSettle, setToSettle] = useState<number | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const API_URL = import.meta.env.VITE_API_URL as string;
  const navigate = useNavigate();
  const [pageLoaded, setPageLoaded] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const handleClick = () => {
    navigate('/forms/form-elements', { state: { filter: 'toCollect' } });
  };

  const handleChange = () => {
    navigate('/forms/form-elements', { state: { filter: 'toPay' } });
  };

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) throw new Error('Token not found');

    axios
      .get<ToCollectResponse>(`${API_URL}/parties/parties/to-collect/`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => setToRecieve(response.data.totalToCollect))
      .catch((error) =>
        console.error('Error fetching to receive data:', error),
      );
  }, [API_URL]);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) throw new Error('Token not found');

    axios
      .get<ToPayResponse>(`${API_URL}/parties/parties/to-pay/`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => setToSettle(response.data.totalToPay))
      .catch((error) => console.error('Error fetching to settle data:', error));
  }, [API_URL]);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) throw new Error('Token not found');

    axios
      .get<DashboardResponse>(`${API_URL}/dashboard/dashboard/`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const sortedTransactions = response.data.transactions
          .sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
          )
          .slice(0, 5);

        setTransactions(sortedTransactions);
      })
      .catch((error) => console.error('Error fetching transactions:', error));
  }, [API_URL]);

  useEffect(() => {
    // Track scroll progress
    const handleScroll = () => {
      const totalHeight = document.body.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
    };

    // Set up page load detection
    if (document.readyState === 'complete') {
      setPageLoaded(true);
    } else {
      window.addEventListener('load', () => setPageLoaded(true));
    }

    // Display welcome toast after page loads
    const timer = setTimeout(() => {
      // @ts-ignore
      toast.success('Welcome to BillBook!', {
        description:
          'Explore our features to streamline your business operations.',
        duration: 5000,
      });
    }, 2500);

    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(
          (this as HTMLAnchorElement).getAttribute('href')!,
        );
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
          });
        }
      });
    });

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('load', () => setPageLoaded(true));
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
    };
  }, []);

  return (
    <>
      <Preloader />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
        {/* To Receive */}
        <div
          onClick={handleClick}
          className="cursor-pointer rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-6 shadow-md hover:shadow-xl transition-all duration-300"
        >
          <div className="flex justify-between items-start">
            <div className="flex flex-col space-y-2">
              <span className="text-sm font-semibold uppercase text-gray-500 dark:text-gray-400 tracking-wider">
                To Receive
              </span>
              <div className="flex items-center gap-2">
                <h2 className="text-3xl font-bold text-green-600 dark:text-green-400">
                  ₹
                  {toRecieve !== null
                    ? toRecieve.toLocaleString()
                    : 'Loading...'}
                </h2>
                <ArrowUp
                  size={24}
                  className="text-green-500 dark:text-green-400"
                />
              </div>
            </div>
            {/* Right side icon */}
            <div className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* To Settle */}
        <div
          onClick={handleChange}
          className="cursor-pointer rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-6 shadow-md hover:shadow-xl transition-all duration-300"
        >
          <div className="flex justify-between items-start">
            <div className="flex flex-col space-y-2">
              <span className="text-sm font-semibold uppercase text-gray-500 dark:text-gray-400 tracking-wider">
                To Settle
              </span>
              <div className="flex items-center gap-2">
                <h2 className="text-3xl font-bold text-red-600 dark:text-red-400">
                  ₹
                  {toSettle !== null ? toSettle.toLocaleString() : 'Loading...'}
                </h2>
                <ArrowDown
                  size={24}
                  className="text-red-500 dark:text-red-400"
                />
              </div>
            </div>
            {/* Right side icon */}
            <div className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Latest Transactions Table */}
      <div className="mt-6 w-[70%]">
        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-x-auto">
          <h2 className="text-lg font-semibold text-gray-700 dark:text-white mb-3">
            Latest Transactions
          </h2>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200 dark:bg-gray-700">
                <th className="p-2 text-left text-gray-600 dark:text-white">
                  DATE
                </th>
                <th className="p-2 text-left text-gray-600 dark:text-white">
                  TYPE
                </th>
                <th className="p-2 text-left text-gray-600 dark:text-white">
                  TXN NO
                </th>
                <th className="p-2 text-left text-gray-600 dark:text-white">
                  PARTY NAME
                </th>
                <th className="p-2 text-left text-gray-600 dark:text-white">
                  AMOUNT
                </th>
              </tr>
            </thead>
            <tbody>
              {transactions.length > 0 ? (
                transactions.map((txn, index) => (
                  <tr key={index} className="border-b dark:border-gray-600">
                    <td className="p-2 text-gray-700 dark:text-white">
                      {txn.date}
                    </td>
                    <td className="p-2 text-gray-700 dark:text-white">
                      {txn.type}
                    </td>
                    <td className="p-2 text-gray-700 dark:text-white">
                      {txn.transaction_no}
                    </td>
                    <td className="p-2 text-gray-700 dark:text-white">
                      {txn.party_name}
                    </td>
                    <td className="p-2 text-gray-700 dark:text-white">
                      ₹ {txn.amount}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="p-2 text-center text-gray-600 dark:text-white"
                  >
                    No transactions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <div
            onClick={() => navigate('/transactions')}
            className="text-blue-500 dark:text-blue-400 text-center mt-2 cursor-pointer hover:underline"
          >
            See All Transactions
          </div>
        </div>
      </div>

      {/* Other Dashboard Components */}
      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        {/* <ChartOne /> */}
        <ChartTwo />
        <ChartThree />
        {/* <MapOne /> */}
        <div className="col-span-12 xl:col-span-8">
          <TableOne />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
