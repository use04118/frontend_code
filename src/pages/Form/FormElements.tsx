//import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
//import CheckboxFive from '../../components/Checkboxes/CheckboxFive';
//import CheckboxFour from '../../components/Checkboxes/CheckboxFour';
//import CheckboxOne from '../../components/Checkboxes/CheckboxOne';
//import CheckboxThree from '../../components/Checkboxes/CheckboxThree';
//import CheckboxTwo from '../../components/Checkboxes/CheckboxTwo';
//import SwitcherFour from '../../components/Switchers/SwitcherFour';
//import SwitcherOne from '../../components/Switchers/SwitcherOne';
//import SwitcherThree from '../../components/Switchers/SwitcherThree';
//import SwitcherTwo from '../../components/Switchers/SwitcherTwo';
//import DatePickerOne from '../../components/Forms/DatePicker/DatePickerOne';
//import DatePickerTwo from '../../components/Forms/DatePicker/DatePickerTwo';
//import SelectGroupTwo from '../../components/Forms/SelectGroup/SelectGroupTwo';
//import MultiSelect from '../../components/Forms/MultiSelect';
import Transactiontable from './Transactiontable';
import CreateParty from './CreateParty';
import TotalTransactions from './TotalTransactions';
import { useState, useEffect } from 'react';
import axios from 'axios';
import PartyDetails from './PartyDetails';
import { useNavigate } from "react-router-dom";
import { useParams } from 'react-router-dom';

interface Transaction {
  id: number;
  party_name: string;
  party_type: string;
  balance: number;
  // Add other fields if necessary
}
const FormElements = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [totalToCollect, setTotalToCollect] = useState(0);
  const [totalToPay, setTotalToPay] = useState(0);
  const [filter, setFilter] = useState('all');
  const [selectedPartyId, setSelectedPartyId] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate()
  const API_URL = import.meta.env.VITE_API_URL;
  const { partyId } = useParams();

  // Fetch transactions from API on component mount
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) throw new Error('Token not found');
        const response = await axios.get(
          `${API_URL}/parties/parties/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          },
        );

        // console.log('Full API Response:', response); // Debugging
        // console.log('Response Data:', response.data); // Debugging

        let transactionsArray = [];

        // Check if response.data is an object with a `results` array
        if (Array.isArray(response.data.results)) {
          transactionsArray = response.data.results;
        }
        // If response.data is directly an array
        else if (Array.isArray(response.data)) {
          transactionsArray = response.data;
        } else {
          setError('Unexpected response format');
          setLoading(false);
          return;
        }

        const formattedData = transactionsArray.map(async (txn) => {
          // If txn.category is just an id, you can fetch category details here
          let categoryName = 'N/A';
          if (txn.category) {
            // Fetch the category name (you may need to adjust the API path)
            try {
              const token = localStorage.getItem('accessToken');
              if (!token) throw new Error('Token not found');
              const categoryResponse = await axios.get(
                `${API_URL}/parties/categories/${txn.category}/`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                  },
                },
              );
              categoryName = categoryResponse.data.name || 'N/A';
            } catch (err) {
              console.error('Error fetching category name:', err);
              categoryName = 'Error fetching category';
            }
          }

          return {
            id: txn.id,
            partyName: txn.party_name || 'N/A',
            category: categoryName, // Ensure category is the name
            MobileNumber: txn.mobile_number || 'N/A',
            partytype: txn.party_type || 'N/A',
            amount: txn.closing_balance || 0, // Fix incorrect key Amount
            balanceType: txn.balance_type,
          };
        });

        // Wait for all async category fetches to finish
        const resolvedData = await Promise.all(formattedData);

        setTransactions(resolvedData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to fetch transactions. Please try again.');
        setLoading(false);
      }
    };

    const fetchTotalAmounts = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) throw new Error('Token not found');
        const collectResponse = await axios.get(
          `${API_URL}/parties/parties/to-collect/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          },
        );
        setTotalToCollect(collectResponse.data.totalToCollect || 0);
      } catch (err) {
        console.error('Error fetching total to collect:', err);
      }

      try {
        const token = localStorage.getItem('accessToken');
        if (!token) throw new Error('Token not found');
        const payResponse = await axios.get(
          `${API_URL}/parties/parties/to-pay/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          },
        );
        setTotalToPay(payResponse.data.totalToPay || 0);
      } catch (err) {
        console.error('Error fetching total to pay:', err);
      }
    };

    fetchTransactions();
    fetchTotalAmounts();
  }, []);

  {
    /*useEffect(() => {
    const fetchTotalAmounts = async () => {
      try {
        const collectResponse = await axios.get('${API_URL}/parties/parties/to-collect/');
        setTotalToCollect(collectResponse.data.totalToCollect || 0);
      } catch (err) {
        console.error('Error fetching total to collect:', err);
      }

      try {
        const payResponse = await axios.get('${API_URL}/parties/parties/to-pay/');
        setTotalToPay(payResponse.data.totalToPay || 0);
      } catch (err) {
        console.error('Error fetching total to pay:', err);
      }
    };

    fetchTotalAmounts();
  }, []);*/
  }

  const handleFilterChange = (type) => {
    setFilter(type);
  };

  const filteredTransactions = transactions.filter((txn) => {
    if (filter === 'toCollect') return txn.balanceType == 'To Collect';
    if (filter === 'toPay') return txn.balanceType == 'To Pay';
    return true;
  });

  const allParties = transactions.length;

  const handleDelete = async (partyId) => {
    if (!window.confirm('Are you sure you want to delete this party?')) return;

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) throw new Error('Token not found');

      await axios.delete(`${API_URL}/parties/parties/${partyId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      // Remove the deleted party from transactions state
      setTransactions((prevTransactions) =>
        prevTransactions.filter((txn) => txn.id !== partyId),
      );

      setSelectedPartyId(null);
      alert('Party deleted successfully!');
    } catch (err) {
      console.error('Error deleting party:', err);
      alert('Failed to delete party. Please try again.');
    }
  };

  const handleEdit = (partyId) => {
    setSelectedPartyId(partyId);
    setIsEditing(true);
  };

  const handleBack = () => {
    setIsEditing(false);  // Set editing mode to false
    setSelectedPartyId(null);  // Clear selected party id
    
  };

  const handleUpdatePartyDetails = (updatedParty: Transaction) => {
    setTransactions((prevTransactions) =>
      prevTransactions.map((txn) =>
        txn.id === updatedParty.id
          ? {
              ...txn,
              category: updatedParty.category, // Ensure category name is updated
              party_name: updatedParty.party_name,
              mobile_number: updatedParty.mobile_number,
              email: updatedParty.email,
              gstin: updatedParty.gstin,
              pan: updatedParty.pan,
              // Add other fields as necessary
            }
          : txn
      )
    );
  };

  
  return (
    <>
      <h4 className="text-2xl font-bold mb-4">Parties</h4>
      <TotalTransactions
        totalParties={allParties}
        totalToCollect={totalToCollect}
        totalToPay={totalToPay}
        onFilterChange={handleFilterChange}
      />
      <div className="mb-12">
        {' '}
        {/* Increase space here */}
        <CreateParty />
      </div>
      {selectedPartyId ? (
        <>
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={() => setSelectedPartyId(null)}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              ← Back
            </button>
            {!isEditing && (
              <div className="flex gap-6">
                <button
                  onClick={() => handleEdit(selectedPartyId)}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(selectedPartyId)}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
          <PartyDetails partyId={selectedPartyId ||partyId} isEditing={isEditing} onBack={handleBack} onUpdateParty={handleUpdatePartyDetails}  />
        </>
      ) : (
        <Transactiontable
          transactions={filteredTransactions}
          loading={loading}
          error={error}
          onPartyClick={(partyId) => setSelectedPartyId(partyId)}
        />
      )}
    </>
  );
};

export default FormElements;
