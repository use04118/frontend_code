import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import GodownDropdown from './GodownDropdown';
import CreateGodown from './CreateGodown';

// Item interface for type safety
interface Item {
  item_name: string;
  item_code: string;
  item_batch: string;
  stock_qty: number;
  stock_value: number;
  sales_price: number;
  purchase_price: number;
  // Add more fields if needed
}

interface GodownType {
  id: number | string;
  // Add more fields if needed
}

const Godown: React.FC = () => {
  const API_URL = import.meta.env.VITE_API_URL as string;
  const [items, setItems] = useState<Item[]>([]);
  const [godownId, setGodownId] = useState<number | string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [editingGodown, setEditingGodown] = useState<GodownType | null>(null);
  const [selectedGodownId, setSelectedGodownId] = useState<number | string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;

  // Fetch items based on selected godownId
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) throw new Error('Token not found');
        
        let url = `${API_URL}/godown/dashboard/`;
        if (godownId) {
          url = `${API_URL}/godown/dashboard/${godownId}/`; // Append Godown ID to the URL
        }

        // Using axios as requested
        const response = await axios.get<{ transactions: Item[] }>(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        setItems(response.data.transactions); // Access transactions directly
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load items');
        setLoading(false);
      }
    };

    fetchItems();
  }, [godownId, API_URL]);

  // Handle Godown selection change
  const handleGodownSelect = (godownId: number | string) => {
    setGodownId(godownId); // Update the selected Godown ID
    setSelectedGodownId(godownId);
  };

  const handleEditGodown = (godown: GodownType) => {
    setEditingGodown(godown);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(items.length / itemsPerPage);

  return (
    <>
      <Breadcrumb pageName="Godown Management" />
      <div className="w-full flex flex-col gap-3">
        <div className="mb-2 flex flex-col gap-6 xl:flex-row xl:gap-4">
          {/* Godown Dropdown */}
          <div className="w-full ">
            <GodownDropdown onSelectGodown={handleGodownSelect} onEditGodown={handleEditGodown}/>
            <div className='mt-2'>
              <CreateGodown editingGodown={editingGodown} />
            </div>
          </div>
        </div>

        {/* Display Loading Message */}
        {loading && <p>Loading items...</p>}
        
        {/* Display Error Message */}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && !error && (
          <>
            <table className="min-w-full border border-gray-300 ">
              <thead>
                <tr className="bg-gray-200 text-left dark:bg-gray-600 ">
                  <th className="border px-4 py-2 ">Item Name</th>
                  <th className="border px-4 py-2">Item Code</th>
                  <th className="border px-4 py-2">Item Batch</th>
                  <th className="border px-4 py-2">Stock QTY</th>
                  <th className="border px-4 py-2">Stock Value</th>
                  <th className="border px-4 py-2">Selling Price</th>
                  <th className="border px-4 py-2">Purchase Price</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.length > 0 ? (
                  currentItems.map((item, index) => (
                    <tr key={index}>
                      <td className="border px-4 py-2">{item.item_name}</td>
                      <td className="border px-4 py-2">{item.item_code}</td>
                      <td className="border px-4 py-2">{item.item_batch}</td>
                      <td className="border px-4 py-2">{item.stock_qty}</td>
                      <td className="border px-4 py-2">₹{item.stock_value}</td>
                      <td className="border px-4 py-2">₹{item.sales_price}</td>
                      <td className="border px-4 py-2">₹{item.purchase_price}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="border px-4 py-2 text-center" colSpan={7}>
                      No items found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <div className="flex justify-between mt-4">
              <button 
                className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50" 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
                disabled={currentPage === 1}>
                Previous
              </button>
              <span>Page {currentPage} of {totalPages}</span>
              <button 
                className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50" 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
                disabled={currentPage === totalPages}>
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Godown;