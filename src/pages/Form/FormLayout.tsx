import { useState, useEffect } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Modal from './Modal';
{
  /*import SelectGroupOne from '../../components/Forms/SelectGroup/SelectGroupOne';*/
}

interface Category {
  id: number;
  name: string;
}

const FormLayout: React.FC = () => {
  const [partyType, setPartyType] = useState('');
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [showError, setShowError] = useState('');
  const [partyCategory, setPartyCategory] = useState<string | number>('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [partyName, setPartyName] = useState('');
  const [billingAddress, setBillingAddress] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [sameAsBilling, setSameAsBilling] = useState(false);
  const [balanceType, setBalanceType] = useState('To Collect'); // Default selection
  const [gstin, setGstin] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiFetched, setApiFetched] = useState(false);
  const [mobileNumber, setMobileNumber] = useState('');
  const [creditPeriod, setCreditPeriod] = useState('');
  const [creditLimit, setCreditLimit] = useState('');
  const [email, setEmail] = useState('');
  const [openingBalance, setOpeningBalance] = useState('');
  const [shouldSubmit, setShouldSubmit] = useState(false);
  const [panNumber, setPanNumber] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;
  const [billingDetails, setFormData] = useState({
    streetAddress: '',
    pincode: '',
    city: '',
    state: '',
  });
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState('');

  // Handle category selection
  {
    /*const handleCategoryChange = (e) => {
    const value = e.target.value;
    if (value === 'create') {
      setIsCreatingCategory(true); // Show popup
      setPartyCategory('');
    } else {
      setPartyCategory(value);
    }
  };*/
  }

  // Handle creating a new category
  {
    /*const handleCreateCategory = (e) => {
    e.preventDefault();
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      setCategories([...categories, newCategory.trim()]);
      setPartyCategory(newCategory.trim());
      setNewCategory('');
      setIsCreatingCategory(false);
    } else {
      alert('Please enter a valid category.');
    }
  };*/
  }

  const handleSameAsBilling = () => {
    setSameAsBilling(!sameAsBilling);
    if (!sameAsBilling) {
      setShippingAddress(billingAddress);
    } else {
      setShippingAddress('');
    }
  };

  useEffect(() => {
    if (
      gstin.length === 15 &&
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9]{1}[Z]{1}[0-9A-Z]{1}$/.test(gstin)
    ) {
      fetchGSTDetails();
    } else {
      setPartyName('');
      setBillingAddress('');
      setShippingAddress('');
      setError('');
    }
  }, [gstin]);

  const fetchGSTDetails = async () => {
    if (!gstin) {
      alert('Please enter a valid GSTIN number.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log(`Requesting GST details for GSTIN: ${gstin}`);
      const token = localStorage.getItem('accessToken');
      if (!token) throw new Error('Token not found');
      const response = await axios.get(
        `${API_URL}/parties/fetch-gst/${gstin}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      ); // Replace with your actual API

      if (response.data) {
        const { name, billing_address, shipping_address } = response.data;

        setPartyName(name || '');
        setBillingAddress(billing_address || '');
        if (sameAsBilling) {
          setShippingAddress(billing_address || '');
        } else if (shipping_address) {
          setShippingAddress(shipping_address);
        }
        setApiFetched(true);
      } else {
        setError('No details found for this GSTIN.');
      }
    } catch (err) {
      console.error('Error fetching GST details:', err);
      setError('Failed to fetch GST details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // **UseEffect to submit data when shouldSubmit is true**
  useEffect(() => {
    if (!shouldSubmit) return; // Only run when shouldSubmit is true

    const submitData = async () => {
      setLoading(true);
      setError('');

      const formData = {
        party_name: partyName,
        party_type: partyType,
        category: partyCategory,
        mobile_number: mobileNumber,
        email: email,
        gstin: gstin,
        pan: panNumber,
        billing_address: billingAddress,
        street_address: billingDetails.streetAddress,
        city: billingDetails.city,
        pincode: billingDetails.pincode,
        state: billingDetails.state,
        shipping_address: sameAsBilling ? billingAddress : shippingAddress,
        opening_balance: parseFloat(openingBalance) || 0,
        balance_type: balanceType,
        credit_period: parseInt(creditPeriod) || 0,
        credit_limit: parseFloat(creditLimit) || 0,
      };

      try {
        console.log(formData);
        const token = localStorage.getItem('accessToken');
        if (!token) throw new Error('Token not found');
        await axios.post(`${API_URL}/parties/parties/`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        alert('Party details saved successfully!');
        resetForm();
      } catch (err) {
        console.error('Error saving party details:', err);
        setError('Failed to save data. Please try again.');
      } finally {
        setLoading(false);
        setShouldSubmit(false); // Reset after submission
      }
    };

    submitData();
  }, [shouldSubmit]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      !partyType ||
      !partyName ||
      !mobileNumber ||
      !email ||
      !billingAddress
    ) {
      alert('Please fill all required fields');
      return;
    }
    setShouldSubmit(true); // Trigger useEffect to submit data
  };

  // Reset form fields
  const resetForm = () => {
    setPartyType('');
    setPartyName('');
    setBillingAddress('');
    setShippingAddress('');
    setMobileNumber('');
    setCategories([]);
    setBalanceType('to-collect');
    setGstin('');
    setPanNumber('');
    setEmail('');
    setOpeningBalance('');
    setCreditPeriod('');
    setCreditLimit('');
    setSameAsBilling(false);
  };

  // Fetch categories from API when component mounts
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) throw new Error('Token not found');

      const response = await fetch(`${API_URL}/parties/categories/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }); // Replace with actual API
      const data: Category[] = await response.json();
      console.log(data);
      if (data && Array.isArray(data.results)) {
        setCategories(data.results); // Update categories with the results array
      } else {
        throw new Error('Invalid data format');
      } // Assuming API returns an array of categories
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    }
  };

  // Handle category selection
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();
    const value = e.target.value;
    if (value === 'create') {
      setIsCreatingCategory(true);
      setPartyCategory('');
    } else {
      setPartyCategory(Number(value));
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault(); // ✅ Prevent page refresh immediately

    if (!newCategory.trim()) {
      alert('Please enter a valid category.');
      return;
    }

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) throw new Error('Token not found');

      const response = await fetch(`${API_URL}/parties/categories/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: newCategory.trim() }),
      });

      const data = await response.json();
      console.log('Response from API:', data); // Debugging

      if (response.ok) {
        setNewCategory('');
        setIsCreatingCategory(false);
        await fetchCategories(); // ✅ Re-fetch categories from API to update dropdown
      } else {
        console.error('Error adding category:', data);
        alert('Error adding category');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to add category.');
    }
  };

  // Handle new category creation with API call
  {
    /*const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newCategory.trim()) {
      try {
        const response = await fetch('${API_URL}/parties/categories/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: newCategory.trim() }),
        });

        if (response.ok) {
          const data: Category = await response.json();
          setCategories([...categories, data]); // Update category list
          setPartyCategory(data.id);
          setNewCategory('');
          setIsCreatingCategory(false);
        } else {
          alert('Error adding category');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Failed to add category.');
      }
    } else {
      alert('Please enter a valid category.');
    }
  };*/
  }
  const handleBack = () => {
    navigate(-1); // Navigates back to the previous page
  };

  const handleModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submit triggered!'); // <-- Add this
  
    const {
      streetAddress = '',
      city = '',
      pincode = '',
      state = '',
    } = billingDetails;
  
    const fullAddress = `${streetAddress}, ${city} - ${pincode}, ${state}`;
    setBillingAddress(fullAddress);
    setIsModalOpen(false);
  };
  

  useEffect(() => {
    if (isModalOpen) {
      fetchStatesFromAPI();
    }
  }, [isModalOpen]);

  const fetchStatesFromAPI = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) throw new Error('Token not found');
      const response = await fetch(`${API_URL}/users/indian-states`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }); // Replace with actual API);
      const data = await response.json();
      setStates(data); // Make sure your API returns an array of state names or objects
    } catch (error) {
      console.error('Error fetching states:', error);
    }
  };

  return (
    <>
      <Breadcrumb pageName="Create Party" />

      <div className="w-full flex flex-col gap-9">
        {/* <!-- Contact Form --> */}
        <div className="w-full rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">
              General Details
            </h3>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="p-6.5">
              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                <div className="w-full xl:w-1/2">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Party name <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your first name"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    value={partyName}
                    onChange={(e) => setPartyName(e.target.value)}
                    disabled={apiFetched}
                    required
                  />
                </div>

                <div className="w-full xl:w-1/2">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Mobile Number <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="Enter your mobile number"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    pattern="[6-9]{1}[0-9]{9}"
                    title="Please enter a valid 10-digit mobile number starting with 6-9"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Email <span className="text-meta-1">*</span>
                </label>
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Opening Balance
                </label>
                <div className="flex gap-2">
                  {/* Opening Balance Input */}
                  <div className="relative w-full">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black dark:text-white">
                      ₹
                    </span>
                    <input
                      type="number"
                      placeholder="0"
                      className="w-full pl-8 rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      value={openingBalance}
                      onChange={(e) => setOpeningBalance(e.target.value)}
                    />
                  </div>

                  {/* Dropdown for "To Collect / To Pay" */}
                  <select
                    className="w-1/3 rounded border-[1.5px] border-stroke bg-transparent py-3 px-4 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    value={balanceType}
                    onChange={(e) => setBalanceType(e.target.value)}
                  >
                    <option value="To Collect">To Collect</option>
                    <option value="To Pay">To Pay</option>
                  </select>
                </div>
              </div>

              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  GSTIN <span className="text-meta-1">*</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter GSTIN"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    pattern="[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9]{1}[Z]{1}[0-9A-Z]{1}"
                    value={gstin}
                    onChange={(e) => setGstin(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    onClick={fetchGSTDetails}
                    disabled={loading}
                  >
                    {loading ? 'Fetching...' : 'Check Details'}
                  </button>
                </div>
                {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
              </div>

              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  PAN Number
                </label>
                <input
                  type="text"
                  placeholder="Enter PAN Number"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
                  value={panNumber}
                  onChange={(e) => setPanNumber(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Party Type <span className="text-meta-1">*</span>
                </label>
                <select
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  value={partyType}
                  onChange={(e) => setPartyType(e.target.value)}
                  required
                >
                  <option value="">Select Party Type</option>
                  <option value="Customer">Customer</option>
                  <option value="Supplier">Supplier</option>
                </select>
                {showError && (
                  <p className="text-red-500 text-sm mt-1">{showError}</p>
                )}
              </div>

              {/* Party Category*/}
              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Party Category
                </label>
                <select
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  value={partyCategory}
                  onChange={handleCategoryChange}
                >
                  <option value="">All Categories</option>
                  {Array.isArray(categories) &&
                    categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  <option value="create">Create Category</option>
                </select>
              </div>

              {/* New Section Heading */}
              <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark mb-6 mt-6">
                <h3 className="font-medium text-black dark:text-white">
                  Additional Information
                </h3>
              </div>

              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                {/* Billing Address Textarea */}
                <div className="w-full xl:w-1/2">
                  <div className="flex items-center gap-2 mb-2">
                    <label className="block text-black dark:text-white">
                      Billing Address
                    </label>
                  </div>
                  <textarea
                    rows={3}
                    placeholder="Enter Billing Address"
                    value={billingAddress}
                    onClick={() => setIsModalOpen(true)} // open modal
                    readOnly
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-not-allowed disabled:bg-gray-200 dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  ></textarea>
                </div>

                {isModalOpen && (
                  <div className="fixed inset-0 z-50 mt-10 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white dark:bg-boxdark p-4 rounded-lg shadow-lg w-[90%] max-w-2xl">
                    <div className="space-y-3">
                        <h2 className="text-lg font-semibold text-black dark:text-white mb-2">
                          Enter Billing Address Details
                        </h2>

                        <div>
                          <label className="block mb-1 text-black dark:text-white">
                            Street Address
                          </label>
                          <textarea
                            rows={2}
                            name="streetAddress"
                            placeholder="Enter Street Address"
                            value={billingDetails.streetAddress}
                            onChange={(e) =>
                              setFormData({
                                ...billingDetails,
                                streetAddress: e.target.value,
                              })
                            }
                            className="w-full rounded border border-stroke bg-transparent py-2 px-3 text-black outline-none dark:border-form-strokedark dark:bg-form-input dark:text-white"
                          />
                        </div>

                        <div>
                          <label className="block mb-1 text-black dark:text-white">
                            Pincode
                          </label>
                          <input
                            type="number"
                            name="pincode"
                            placeholder="e.g. 560029"
                            value={billingDetails.pincode}
                            onChange={(e) =>
                              setFormData({
                                ...billingDetails,
                                pincode: e.target.value,
                              })
                            }
                            className="w-full rounded border border-stroke bg-transparent py-2 px-3 text-black outline-none dark:border-form-strokedark dark:bg-form-input dark:text-white"
                          />
                        </div>

                        <div>
                          <label className="block mb-1 text-black dark:text-white">
                            City <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="city"
                            placeholder="e.g. Bangalore"
                            value={billingDetails.city}
                            onChange={(e) =>
                              setFormData({ ...billingDetails, city: e.target.value })
                            }
                            className="w-full rounded border border-stroke bg-transparent py-2 px-3 text-black outline-none dark:border-form-strokedark dark:bg-form-input dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="block mb-1 text-black dark:text-white">
                            State <span className="text-red-500">*</span>
                          </label>
                          <select
                            name="state"
                            value={billingDetails.state}
                            onChange={(e) =>
                              setFormData({
                                ...billingDetails,
                                state: e.target.value,
                              })
                            }
                            className="w-full rounded border border-stroke bg-transparent py-2 px-3 text-black outline-none dark:border-form-strokedark dark:bg-form-input dark:text-white"
                            required
                          >
                            <option value="">Select a State</option>
                            {states.map((state, index) => (
                              <option key={index} value={state.name || state}>
                                {state.name || state}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Buttons */}
                        <div className="flex justify-end gap-3 mt-3">
                          <button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="px-3 py-1.5 rounded border border-gray-400 text-gray-700 dark:text-white dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            Close
                          </button>
                          <button
                            type="submit"
                            onClick={handleModalSubmit}
                            className="px-4 py-1.5 rounded bg-primary text-white hover:bg-opacity-90"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Shipping Address */}
                <div className="w-full xl:w-1/2">
                  <div className="flex items-center gap-2 mb-2">
                    <label className="block text-black dark:text-white">
                      Shipping Address
                    </label>
                    <input
                      type="checkbox"
                      checked={sameAsBilling}
                      onChange={handleSameAsBilling}
                      className="w-4 h-4 cursor-pointer"
                    />
                    <span className="text-sm text-black dark:text-white">
                      Same as Billing Address
                    </span>
                  </div>
                  <textarea
                    rows={3}
                    placeholder="Enter Shipping Address"
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    disabled={sameAsBilling}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-not-allowed disabled:bg-gray-200 dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  ></textarea>
                </div>
              </div>

              <div className="border-b border-stroke py-0.5 px-6.5 dark:border-strokedark mb-6"></div>

              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Credit Period (in days)
                  </label>
                  <input
                    type="number"
                    placeholder="Enter Credit Period"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    value={creditPeriod}
                    onChange={(e) => setCreditPeriod(e.target.value)}
                  />
                </div>
                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Credit Limit
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black dark:text-white">
                      ₹
                    </span>
                    <input
                      type="number"
                      placeholder="0"
                      className="w-full pl-8 rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      value={creditLimit}
                      onChange={(e) => setCreditLimit(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={handleBack}
                  className="rounded border border-gray-400 px-4 py-2 text-gray-600 hover:bg-gray-100 dark:border-gray-600 dark:text-white dark:hover:bg-gray-700"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="rounded bg-primary px-4 py-2 text-white hover:bg-opacity-90"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save'}
                </button>
              </div>
              {error && <p className="text-red-500 mt-2">{error}</p>}
            </div>
          </form>
          {/* Popup Modal for Creating Category*/}
          {isCreatingCategory && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h3 className="text-xl font-bold mb-2">
                  Create a New Category
                </h3>
                <form
                  onSubmit={handleCreateCategory}
                  className="flex flex-col space-y-3"
                >
                  <input
                    type="text"
                    className="p-2 border border-gray-300 rounded-lg w-full"
                    placeholder="Enter new category"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    required
                  />
                  <div className="flex justify-end space-x-2">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                      Add
                    </button>
                    <button
                      type="button"
                      className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                      onClick={() => setIsCreatingCategory(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default FormLayout;
