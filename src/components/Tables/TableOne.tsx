import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Party {
  id: number;
  name: string;
  total_sales: number;
  total_revenue: number;
  total_purchases: number;
  total_purchase_amount: number;
}

const periodOptions = [
  { label: 'Weekly', value: 'weekly' },
  { label: 'Monthly', value: 'monthly' },
  { label: 'Yearly', value: 'yearly' },
];

const TableOne = () => {
  const [period, setPeriod] = useState('monthly');
  const [parties, setParties] = useState<Party[]>([]);

  useEffect(() => {
    const fetchParties = async () => {
      const API_URL = import.meta.env.VITE_API_URL;
      const token = localStorage.getItem('accessToken');
      const response = await axios.get(`${API_URL}/dashboard/top-parties-combined/?period=${period}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setParties(response.data.parties);
    };
    fetchParties();
  }, [period]);

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="flex justify-between items-center mb-6">
        <h4 className="text-xl font-semibold text-black dark:text-white">
          Top 5 Parties Overview
        </h4>
        <select
          value={period}
          onChange={e => setPeriod(e.target.value)}
          className="py-1 pl-3 pr-8 text-sm font-medium outline-none border rounded"
        >
          {periodOptions.map(opt => (
            <option key={opt.value} value={opt.value} className="dark:bg-boxdark">
              {opt.label}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col">
        <div className="grid grid-cols-5 rounded-sm bg-gray-2 dark:bg-meta-4">
          <div className="p-2.5 xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">Party Name</h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">Sales</h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">Sales Revenue</h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">Purchases</h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">Purchase Amount</h5>
          </div>
        </div>
        {parties.map((party) => (
          <div
            className="grid grid-cols-5 border-b border-stroke dark:border-strokedark"
            key={party.id}
          >
            <div className="flex items-center gap-3 p-2.5 xl:p-5">
              <p className="text-black dark:text-white">{party.name}</p>
            </div>
            <div className="flex items-center justify-center p-2.5 xl:p-5">
              <p className="text-meta-3">{party.total_sales}</p>
            </div>
            <div className="flex items-center justify-center p-2.5 xl:p-5">
              <p className="text-meta-3">{party.total_revenue}</p>
            </div>
            <div className="flex items-center justify-center p-2.5 xl:p-5">
              <p className="text-meta-3">{party.total_purchases}</p>
            </div>
            <div className="flex items-center justify-center p-2.5 xl:p-5">
              <p className="text-meta-3">{party.total_purchase_amount}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableOne;
