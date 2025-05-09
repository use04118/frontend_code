import { useState, useEffect } from 'react';
import axios from 'axios';
import CreateSalesInvoice from './SalesInvoiceComponent/CreateSalesInvoice';
import SalesInvoiceTable from './SalesInvoiceComponent/SalesInvoiceTable';

const SalesInvoice: React.FC = () => {
  const API_URL = import.meta.env.VITE_API_URL as string;

  const [paid, setPaid] = useState<number | null>(null);
  const [unpaid, setUnpaid] = useState<number | null>(null);

  useEffect(() => {
    fetchPaid();
    fetchUnpaid();
  }, []);

  const fetchPaid = async (): Promise<void> => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) throw new Error('Token not found');

      const response = await axios.get<{ totalPaid: number }>(
        `${API_URL}/sales/invoice/paid/`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setPaid(response.data.totalPaid ?? 0);
    } catch (error) {
      console.error('Error fetching paid amount:', error);
      setPaid(0);
    }
  };

  const fetchUnpaid = async (): Promise<void> => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) throw new Error('Token not found');

      const response = await axios.get<{ totalUnPaid: number }>(
        `${API_URL}/sales/invoice/unpaid/`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setUnpaid(response.data.totalUnPaid ?? 0);
    } catch (error) {
      console.error('Error fetching unpaid amount:', error);
      setUnpaid(0);
    }
  };

  const totalSales = (paid ?? 0) + (unpaid ?? 0);

  return (
    <>
      <h4 className="text-2xl font-bold mb-4">Sales Invoices</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
        {/* Total Sales */}
        {/* Total Sales */}
        <div className="p-4 rounded-lg border bg-white dark:bg-gray-800 flex items-center justify-between shadow-sm transition hover:shadow-md hover:scale-[1.02] duration-300">
          <div>
            <h3 className="text-sm text-gray-500 dark:text-gray-400 mb-1">
              Total Sales
            </h3>
            <h2 className="text-2xl font-bold text-blue-600">
              ₹{totalSales.toLocaleString()}
            </h2>
          </div>
          <div className="bg-blue-100 dark:bg-blue-950 p-2 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800 transition cursor-pointer">
            <svg
              className="w-6 h-6 text-blue-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M2 11h16v2H2v-2zm0-4h16v2H2V7zm0-4h16v2H2V3z" />
            </svg>
          </div>
        </div>

        {/* Paid */}
        <div className="p-4 rounded-lg border bg-white dark:bg-gray-800 flex items-center justify-between shadow-sm transition hover:shadow-md hover:scale-[1.02] duration-300">
          <div>
            <h3 className="text-sm text-gray-500 dark:text-gray-400 mb-1">
              Paid
            </h3>
            <h2 className="text-2xl font-bold text-green-600">
              ₹{paid?.toLocaleString() ?? '0'}
            </h2>
          </div>
          <div className="bg-green-100 dark:bg-green-950 p-2 rounded-full hover:bg-green-200 dark:hover:bg-green-800 transition cursor-pointer">
            <svg
              className="w-6 h-6 text-green-600 transition-transform duration-300 transform hover:-translate-y-1"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M5 11l5-5 5 5H5z" />
            </svg>
          </div>
        </div>

        {/* Unpaid */}
        <div className="p-4 rounded-lg border bg-white dark:bg-gray-800 flex items-center justify-between shadow-sm transition hover:shadow-md hover:scale-[1.02] duration-300">
          <div>
            <h3 className="text-sm text-gray-500 dark:text-gray-400 mb-1">
              Unpaid
            </h3>
            <h2 className="text-2xl font-bold text-red-600">
              ₹{unpaid?.toLocaleString() ?? '0'}
            </h2>
          </div>
          <div className="bg-red-100 dark:bg-red-950 p-2 rounded-full hover:bg-red-200 dark:hover:bg-red-800 transition cursor-pointer">
            <svg
              className="w-6 h-6 text-red-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M5 9l5 5 5-5H5z" />
            </svg>
          </div>
        </div>
      </div>

      <CreateSalesInvoice />
      <SalesInvoiceTable />
    </>
  );
};

export default SalesInvoice;
