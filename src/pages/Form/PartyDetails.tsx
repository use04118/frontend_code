import { useEffect, useState } from 'react';
//import { useParams } from 'react-router-dom';
import axios from 'axios';

const PartyDetails = ({ partyId, isEditing, onBack, onUpdateParty }) => {
  const API_URL = import.meta.env.VITE_API_URL;
  //const { partyId } = useParams(); // ✅ Get ID from URL
  const [party, setParty] = useState<any>(null); // Updated to accept any type (since the data could be dynamic)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    party_name: '',
    category: '',
    mobile_number: '',
    party_type: '',
    opening_balance: '',
    shipping_address: '',
    billing_address: '',
    credit_period: '',
    credit_limit: '',
    email: '',
    gstin: '',
    pan: '',
  });

  useEffect(() => {
    // Fetch categories from API
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) throw new Error('Token not found');
        const response = await axios.get(`${API_URL}/parties/categories/`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (Array.isArray(response.data.results)) {
          setCategories(response.data.results); // Save categories in state
        } else {
          console.error(
            'Expected an array of categories, but got:',
            response.data,
          );
          setError('Categories data format error.');
        } // Save categories in state
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Failed to load categories.');
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchPartyDetails = async () => {
      if (!partyId) return; // Avoid running if there's no ID

      try {
        const token = localStorage.getItem('accessToken');
        if (!token) throw new Error('Token not found');

        const response = await axios.get(
          `${API_URL}/parties/parties/${partyId}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          },
        );

        setParty(response.data);
        setFormData(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching party details:', err);
        setError('Failed to load party details.');
        setLoading(false);
      }
    };

    fetchPartyDetails();
  }, [partyId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  // Null check for party
  if (!party) return <p>Party not found.</p>;

  const categoryName = categories.find(
    (category) => category.id === party.category,
  )?.name;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    // e.preventDefault();
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) throw new Error('Token not found');
      await axios.put(`${API_URL}/parties/parties/${partyId}/`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      onUpdateParty(formData);
      onBack();
    } catch (err) {
      setError('Failed to update party details.');
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Party Details</h2>
      <div className="bg-white dark:bg-gray-800 p-6 shadow-lg rounded-lg">
        {isEditing ? (
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div>
              <label>Party Name:</label>
              <input
                type="text"
                name="party_name"
                value={formData.party_name}
                onChange={handleChange}
                className="border p-2 w-full dark:bg-gray-900"
              />
            </div>

            <div>
              <label>Category:</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="border p-2 w-full dark:bg-gray-900"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label>Mobile Number:</label>
              <input
                type="text"
                name="mobile_number"
                value={formData.mobile_number}
                onChange={handleChange}
                className="border p-2 w-full dark:bg-gray-900"
              />
            </div>

            <div>
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="border p-2 w-full dark:bg-gray-900"
              />
            </div>

            <div>
              <label>GSTIN:</label>
              <input
                type="text"
                name="gstin"
                value={formData.gstin}
                onChange={handleChange}
                className="border p-2 w-full dark:bg-gray-900"
              />
            </div>

            <div>
              <label>Pan:</label>
              <input
                type="text"
                name="pan"
                value={formData.pan}
                onChange={handleChange}
                className="border p-2 w-full dark:bg-gray-900"
              />
            </div>

            {/* New Fields Added */}
            <div>
              <label>Opening Balance:</label>
              <input
                type="text"
                name="opening_balance"
                value={formData.opening_balance}
                onChange={handleChange}
                className="border p-2 w-full dark:bg-gray-900"
              />
            </div>

            <div>
              <label>Party Type:</label>
              <input
                type="text"
                name="party_type"
                value={formData.party_type}
                onChange={handleChange}
                className="border p-2 w-full dark:bg-gray-900"
              />
            </div>

            <div>
              <label>Billing Address:</label>
              <textarea
                name="billing_address"
                value={formData.billing_address}
                onChange={handleChange}
                className="border p-2 w-full dark:bg-gray-900"
              />
            </div>

            <div>
              <label>Shipping Address:</label>
              <textarea
                name="shipping_address"
                value={formData.shipping_address}
                onChange={handleChange}
                className="border p-2 w-full dark:bg-gray-900"
              />
            </div>

            <div>
              <label>Credit Period (in days):</label>
              <input
                type="number"
                name="credit_period"
                value={formData.credit_period}
                onChange={handleChange}
                className="border p-2 w-full dark:bg-gray-900"
              />
            </div>

            <div>
              <label>Credit Limit:</label>
              <input
                type="number"
                name="credit_limit"
                value={formData.credit_limit}
                onChange={handleChange}
                className="border p-2 w-full dark:bg-gray-900"
              />
            </div>

            {/* Buttons */}
            <div className="col-span-2 flex justify-end gap-4">
              <button
                type="button"
                onClick={onBack}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Save
              </button>
            </div>
          </form>
        ) : (
          <div className="bg-white dark:bg-gray-800 shadow-lg border border-gray-500 dark:border-gray-700 rounded-lg p-6">
            {/* Heading */}

            {/* Grid Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 text-gray-600 dark:text-gray-300">
              <div>
                <strong className="text-gray-700 dark:text-gray-400">
                  PARTY NAME
                </strong>
                <p>{party.party_name}</p>
              </div>

              <div>
                <strong className="text-gray-700 dark:text-gray-400">
                  CATEGORY
                </strong>
                <p>
                  {categories.find((cat) => cat.id === party.category)?.name ||
                    'Not Found'}
                </p>
              </div>

              <div>
                <strong className="text-gray-700 dark:text-gray-400">
                  MOBILE NUMBER
                </strong>
                <p>{party.mobile_number}</p>
              </div>

              <div>
                <strong className="text-gray-700 dark:text-gray-400">
                  EMAIL
                </strong>
                <p>{party.email}</p>
              </div>

              <div>
                <strong className="text-gray-700 dark:text-gray-400">
                  GSTIN
                </strong>
                <p>{party.gstin}</p>
              </div>

              <div>
                <strong className="text-gray-700 dark:text-gray-400">
                  PAN
                </strong>
                <p>{party.pan}</p>
              </div>

              <div>
                <strong className="text-gray-700 dark:text-gray-400">
                  OPENING BALANCE
                </strong>
                <p>{party.opening_balance || '0.00'}</p>
              </div>

              <div>
                <strong className="text-gray-700 dark:text-gray-400">
                  PARTY TYPE
                </strong>
                <p>{party.party_type || 'Not Specified'}</p>
              </div>

              <div>
                <strong className="text-gray-700 dark:text-gray-400">
                  BILLING ADDRESS
                </strong>
                <p>{party.billing_address || 'Not Provided'}</p>
              </div>

              <div>
                <strong className="text-gray-700 dark:text-gray-400">
                  SHIPPING ADDRESS
                </strong>
                <p>{party.shipping_address || 'Not Provided'}</p>
              </div>

              <div>
                <strong className="text-gray-700 dark:text-gray-400">
                  CREDIT PERIOD (IN DAYS)
                </strong>
                <p>{party.credit_period || '0'}</p>
              </div>

              <div>
                <strong className="text-gray-700 dark:text-gray-400">
                  CREDIT LIMIT
                </strong>
                <p>
                  {party.credit_limit ? `₹${party.credit_limit}` : 'Not Set'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PartyDetails;
