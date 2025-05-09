import React, { useEffect, useState } from 'react';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface ReceivableData {
  '0-30_days': number;
  '31-60_days': number;
  '61-90_days': number;
  '91_plus_days': number;
  total: number;
  pid: string;
}

interface ReceivableReport {
  [key: string]: ReceivableData;
}

interface TotalRow {
  days0_30: number;
  days31_60: number;
  days61_90: number;
  moreThan91: number;
  total: number;
}

const ReceivableAgingReport: React.FC = () => {
  const [data, setData] = useState<ReceivableReport>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const API_URL: string = import.meta.env.VITE_API_URL;
  const Navigate = useNavigate();

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) throw new Error('Token not found');

        const response = await axios.get<ReceivableReport>(
          `${API_URL}/reports/receivable-ageing-report/`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setData(response.data);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  
  // Calculate totals
  const totalRow: TotalRow = Object.values(data).reduce(
    (acc: TotalRow, row: ReceivableData) => {
      acc.days0_30 += row['0-30_days'] || 0;
      acc.days31_60 += row['31-60_days'] || 0;
      acc.days61_90 += row['61-90_days'] || 0;
      acc.moreThan91 += row['91_plus_days'] || 0;
      acc.total += row.total || 0; // Assuming 'total' exists in each row
      return acc;
    },
    { days0_30: 0, days31_60: 0, days61_90: 0, moreThan91: 0, total: 0 },
  );

  const handleBack = (): void => {
    Navigate(-1);
  };

  return (
    <>
      <Breadcrumb pageName="Receivable Ageing Reports" />
      <div className="bg-white dark:bg-gray-900 overflow-x-auto">
        {loading ? (
          <p className="text-gray-800 dark:text-gray-200 text-center">
            Loading...
          </p>
        ) : error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : (
          <table className="min-w-full border border-gray-300 dark:border-gray-700">
            <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
              <tr>
                <th className="border px-4 py-2 text-left">CUSTOMER NAME</th>
                <th className="border px-4 py-2">0-30 DAYS</th>
                <th className="border px-4 py-2">31-60 DAYS</th>
                <th className="border px-4 py-2">61-90 DAYS</th>
                <th className="border px-4 py-2">MORE THAN 91 DAYS</th>
                <th className="border px-4 py-2">TOTAL</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(data).map(([customerName, row], index) => (
                <tr
                  key={index}
                  className="cursor-pointer border text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 bg-white dark:bg-gray-800"
                  onClick={() => {
                    console.log('Navigating to:', data.pid);
                    Navigate(`/party/${row.pid}`);
                  }}
                >
                  <td className="border px-4 py-2 font-semibold">
                    {customerName}
                  </td>
                  <td className="border px-4 py-2">
                    ₹ {row['0-30_days'] || 0}
                  </td>
                  <td className="border px-4 py-2">
                    ₹ {row['31-60_days'] || 0}
                  </td>
                  <td className="border px-4 py-2">
                    ₹ {row['61-90_days'] || 0}
                  </td>
                  <td className="border px-4 py-2">
                    ₹ {row['91_plus_days'] || 0}
                  </td>
                  <td className="border px-4 py-2 font-bold">
                    ₹ {row.total || 0}
                  </td>
                </tr>
              ))}

              {/* Total Row */}
              <tr className="bg-gray-200 dark:bg-gray-700 font-bold text-gray-900 dark:text-white">
                <td className="border px-4 py-2">Total</td>
                <td className="border px-4 py-2">₹ {totalRow.days0_30}</td>
                <td className="border px-4 py-2">₹ {totalRow.days31_60}</td>
                <td className="border px-4 py-2">₹ {totalRow.days61_90}</td>
                <td className="border px-4 py-2">₹ {totalRow.moreThan91}</td>
                <td className="border px-4 py-2">₹ {totalRow.total}</td>
              </tr>
            </tbody>
          </table>
        )}
      </div>
      <div className="flex justify-start gap-4 mt-2">
        <button
          type="button"
          onClick={handleBack}
          className="rounded border border-blue-400 px-4 py-2 text-white bg-blue-500 dark:border-gray-600 dark:text-white dark:hover:bg-gray-700"
        >
          Back
        </button>
      </div>
    </>
  );
};

export default ReceivableAgingReport;
