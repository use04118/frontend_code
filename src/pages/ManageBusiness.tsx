import { useState, useEffect, useRef } from 'react';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, Verified } from 'lucide-react';
import { Store, MonitorSmartphone } from 'lucide-react'; // Use `Store` instead


{
  /*import SelectGroupOne from '../../components/Forms/SelectGroup/SelectGroupOne';*/
}

const ManageBusiness: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [error1, setError1] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [billingAddress, setBillingAddress] = useState('');
  const [validated, setValidated] = useState('');
  const [gstin, setGstin] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiFetched, setApiFetched] = useState(false);
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [shouldSubmit, setShouldSubmit] = useState(false);
  const [panNumber, setPanNumber] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOpenCompany, setIsOpenCompany] = useState(false);
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState('');
  const [industryOptions, setIndustryOptions] = useState([]);
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [isOpenIndustry, setIsOpenIndustry] = useState(false);
  const industryDropdownRef = useRef(null);
  const businessDropdownRef = useRef(null);
  const registrationDropdownRef = useRef(null);
  const [isTdsEnabled, setIsTdsEnabled] = useState(false);
  const [isTcsEnabled, setIsTcsEnabled] = useState(false);
  const [businessWebsite, setBusinessWebsite] = useState('');
  const [signatureFile, setSignatureFile] = useState(null);
  const [signaturePreview, setSignaturePreview] = useState('');
  const [businesses, setBusinesses] = useState([]);
  const [businessLoading, setBusinessLoading] = useState(true); // ✅ loading state renamed
  const [businessError, setBusinessError] = useState('');
  const [currentBusinessId, setCurrentBusinessId] = useState(null);
  const [switchBusinessId, setSwitchBusinessId] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL;

  const [billingDetails, setBillingDetails] = useState({
    streetAddress: '',
    pincode: '',
    city: '',
    state: '',
  });
  const [states, setStates] = useState([]);

  const businessOptions = [
    'Retailer',
    'Wholesaler',
    'Distributor',
    'Manufacturer',
    'Services',
  ];

  const [isOpen, setIsOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);

  const toggleOption = (option) => {
    if (selectedOptions.includes(option)) {
      setSelectedOptions(selectedOptions.filter((item) => item !== option));
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
  };

  useEffect(() => {
    const fetchIndustryTypes = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) throw new Error('Token not found');
        const response = await fetch(`${API_URL}/users/industry-types/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();

        // Assuming API returns [{ label: 'IT', value: 'it' }, ...]
        setIndustryOptions(data);
      } catch (error) {
        console.error('Failed to fetch industry types:', error);
      }
    };

    fetchIndustryTypes();
  }, []);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) throw new Error('Token not found');
        const response = await fetch(`${API_URL}/users/registration-types/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch');
        }
        const data = await response.json();
        setOptions(data); // assuming `data` is an array like: ["Private Limited", "Public Limited", ...]
      } catch (error) {
        console.error('Error fetching options:', error);
      }
    };

    fetchOptions();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        industryDropdownRef.current &&
        !industryDropdownRef.current.contains(event.target)
      ) {
        setIsOpenIndustry(false);
      }

      if (
        businessDropdownRef.current &&
        !businessDropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }

      if (
        registrationDropdownRef.current &&
        !registrationDropdownRef.current.contains(event.target)
      ) {
        setIsOpenCompany(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (gstin && error) {
      fetchGSTDetails();
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
        `${API_URL}/users/validate-gst/${gstin}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      ); // Replace with your actual API

      if (response.data) {
        setApiFetched(true);
        setValidated('Validated GSTIN');
        setError('');
      } else {
        setError('No details found for this GSTIN.');
        setValidated('');
      }
    } catch (err) {
      console.error('Error inavalid GST details:', err);
      setError('Invalid GST details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignatureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSignatureFile(file);
      setSignaturePreview(URL.createObjectURL(file));
    }
  };

  // **UseEffect to submit data when shouldSubmit is true**
  useEffect(() => {
    if (!shouldSubmit) return; // Only run when shouldSubmit is true

    const submitData = async () => {
      setLoading(true);
      setError('');
      setError1('');
      const formData = new FormData();
      formData.append('name', businessName);
      formData.append('phone', mobileNumber);
      formData.append('email', email);
      formData.append('gstin', gstin);
      formData.append('pan_number', panNumber);
      formData.append('business_address', billingAddress);
      formData.append('street_address', billingDetails.streetAddress);
      formData.append('city', billingDetails.city);
      formData.append('pincode', billingDetails.pincode);
      formData.append('state', billingDetails.state);
      formData.append('business_type', JSON.stringify(selectedOptions)); // if it's array
      formData.append('industry_type', selectedIndustry);
      formData.append('registration_type', selectedOption);
      formData.append('tds', isTdsEnabled);
      formData.append('tcs', isTcsEnabled);
      formData.append('website', businessWebsite);

      // 👇 Signature file append karo
      if (signatureFile) {
        formData.append('signature', signatureFile);
      }

      try {
        console.log(formData);
        const token = localStorage.getItem('accessToken');
        if (!token) throw new Error('Token not found');
        // 🔁 Step 1: Get current business info to extract ID
        const businessRes = await axios.get(
          `${API_URL}/users/current-business/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        console.log(1, businessRes.data);
        // const businessList = businessRes.data;
        const currentBusiness = businessRes.data; // or use logic to find current if multiple exist
        console.log(2, currentBusiness);

        if (!currentBusiness?.id) throw new Error('Business ID not found');

        const businessId = currentBusiness.id;
        console.log(3, businessId);

        await axios.put(`${API_URL}/users/business/${businessId}/`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
        alert('Business details updated successfully!');
      } catch (err) {
        console.error('Error saving party details:', err);
        setError1('Failed to save data. Please try again.');
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
      !businessName ||
      !mobileNumber ||
      !email ||
      !billingAddress ||
      selectedOptions.length === 0 ||
      !selectedIndustry ||
      !selectedOption
    ) {
      alert('Please fill all required fields');
      return;
    }
    if (validated !== 'Validated GSTIN') {
      alert('Please fill the correct GSTIN');
      return;
    }
    setShouldSubmit(true); // Trigger useEffect to submit data
  };

 /*  // Reset form fields
  const resetForm = () => {
    setBillingAddress('');
    setMobileNumber('');
    setGstin('');
    setPanNumber('');
    setEmail('');
    setBusinessName('');
    setBillingDetails({
      streetAddress: '',
      city: '',
      pincode: '',
      state: '',
    });
    setSelectedOptions([]);
    setSelectedIndustry('');
    setSelectedOption('');
    setIsTdsEnabled(false);
    setIsTcsEnabled(false);
    setBusinessWebsite('');
    setSignatureFile(null);
    setSignaturePreview(null);
  }; */

  
    const fetchBusinessData = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) throw new Error('Token not found');

        // 🔁 Step 1: Get current business info to extract ID
        const businessRes = await axios.get(
          `${API_URL}/users/current-business/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        console.log(1, businessRes.data);
        // const businessList = businessRes.data;
        const currentBusiness = businessRes.data; // or use logic to find current if multiple exist
        console.log(2, currentBusiness);

        if (!currentBusiness?.id) throw new Error('Business ID not found');

        const businessId = currentBusiness.id;
        setCurrentBusinessId(businessId);
        console.log(3, currentBusinessId);

        // 🔁 Step 2: Use businessId to fetch detailed info
        const detailRes = await axios.get(
          `${API_URL}/users/business/${businessId}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const data = detailRes.data;

        // ✅ Set all form states with fetched data
        setBusinessName(data.name || '');
        setMobileNumber(data.phone || '');
        setEmail(data.email || '');
        setPanNumber(data.pan_number || '');
        setGstin(data.gstin || '');
        setBillingAddress(data.business_address || '');
        setBillingDetails({
          streetAddress: data.street_address || '',
          city: data.city || '',
          pincode: data.pincode || '',
          state: data.state || '',
        });
        setSelectedOptions(data.business_type || []);
        setSelectedIndustry(data.industry_type || '');
        setSelectedOption(data.registration_type || '');
        setIsTdsEnabled(data.tds || false);
        setIsTcsEnabled(data.tcs || false);
        setBusinessWebsite(data.website || '');
        setSignaturePreview(data.signature || '');
        setApiFetched(true);
      } catch (error) {
        console.error('Error fetching business data:', error);
      }
    };

    
  

 

  // Fetch categories from API when component mounts

  const handleBack = () => {
    navigate(-1); // Navigates back to the previous page
  };

  const handleModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submit triggered!'); // <-- Add this

    const fullAddress = `${billingDetails.streetAddress}, ${billingDetails.city} - ${billingDetails.pincode}, ${billingDetails.state}`;
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

  const getInitial = (name) => name?.charAt(0).toUpperCase() || '';

  const getRandomColor = () => {
    const colors = [
      'bg-purple-500',
      'bg-teal-500',
      'bg-blue-500',
      'bg-green-500',
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };
  const fetchCurrentBusinesses = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const res = await axios.get(`${API_URL}/users/current-business/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Current business from API:", res.data); // ✅ Add this log
      if (res.data?.id) {
        setCurrentBusinessId(res.data.id);
      }
    } catch (err) {
      console.error('Failed to fetch current business', err);
    }
  };
  
  // 👇 Move this outside so both useEffect & handleSwitchBusiness can use it
  const fetchBusinesses = async () => {
    try {
      setBusinessLoading(true);
      setBusinessError('');
      const token = localStorage.getItem('accessToken');
      const response = await axios.get(`${API_URL}/users/my-business/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const dataWithColor = response.data.businesses.map((biz) => ({
        ...biz,
        initial: getInitial(biz.name),
        color: getRandomColor(),
      }));
      setBusinesses([...dataWithColor]);

      // Also update current business ID from the response if needed
      if (response.data.businesses.id) {
        setSwitchBusinessId(response.data.businesses.id);
      }
    } catch (err) {
      console.error('Error fetching businesses:', err);
      setBusinessError('Failed to fetch businesses.');
    } finally {
      setBusinessLoading(false);
    }
  };

  // 👇 useEffect just calls fetchBusinesses once on mount
  useEffect(() => {
    fetchBusinesses();
    fetchCurrentBusinesses();
    fetchBusinessData();
  }, []);

  // 👇 handle switch and then re-fetch updated businesses
  const handleSwitchBusiness = async (switchBusinessId) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) throw new Error('Token not found');
  
      console.log("Switching to:", switchBusinessId);
  
      await axios.post(
        `${API_URL}/users/switch-business/`,
        { business_id: switchBusinessId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      console.log("Switched. Now fetching current...");
  
      await fetchCurrentBusinesses();
      await fetchBusinesses();
      await fetchBusinessData();
      
      console.log("Switched successfully");
  
      alert('Switched successfully!');
    } catch (err) {
      console.error('Switch error:', err);
      alert('Failed to switch business');
    }
  };
  

  return (
    <>
      <Breadcrumb pageName="Manage Business" />

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
                    Business name <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your business name"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    disabled={apiFetched}
                    required
                  />
                </div>

                <div className="w-full xl:w-1/2">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Comapany Mobile Number{' '}
                    <span className="text-meta-1">*</span>
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

              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                <div className="w-full xl:w-1/2">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Company Email <span className="text-meta-1">*</span>
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
                <div className="w-full xl:w-1/2">
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

                {/* Business Type Dropdown (updated to match layout) */}
              </div>
              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                {/* Business Type Dropdown (updated to match layout) */}
                <div className="w-full xl:w-1/2 " ref={businessDropdownRef}>
                  <label className="mb-2.5 block text-black dark:text-white">
                    Business Type{' '}
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      (Select multiple, if applicable)
                    </span>
                  </label>
                  <div className="relative">
                    <button
                      onClick={() => setIsOpen(!isOpen)}
                      type="button"
                      className="w-full border-[1.5px] border-stroke dark:border-form-strokedark rounded bg-white dark:bg-form-input px-5 py-3 text-left text-black dark:text-white flex justify-between items-center outline-none transition focus:border-primary active:border-primary"
                    >
                      <span className="truncate">
                        {selectedOptions.length > 0
                          ? selectedOptions.join(', ')
                          : 'Select'}
                      </span>
                      <ChevronDown className="w-4 h-4 ml-2" />
                    </button>

                    {isOpen && (
                      <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-md max-h-60 overflow-y-auto">
                        {businessOptions.map((option) => (
                          <label
                            key={option}
                            className="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <input
                              type="checkbox"
                              className="form-checkbox h-4 w-4 text-blue-600"
                              checked={selectedOptions.includes(option)}
                              onChange={() => toggleOption(option)}
                            />
                            <span className="ml-2 text-gray-800 dark:text-gray-100">
                              {option}
                            </span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Selected values display */}
                  {selectedOptions.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {selectedOptions.map((option) => (
                        <span
                          key={option}
                          className="px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 text-xs"
                        >
                          {option}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="w-full xl:w-1/2" ref={industryDropdownRef}>
                  <label className="mb-2.5 block text-black dark:text-white">
                    Industry Type
                  </label>

                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsOpenIndustry(!isOpenIndustry)}
                      className="w-full border-[1.5px] border-stroke dark:border-form-strokedark rounded bg-white dark:bg-form-input px-5 py-3 text-left text-black dark:text-white flex justify-between items-center outline-none transition focus:border-primary active:border-primary"
                    >
                      <span className="truncate">
                        {selectedIndustry || 'Select Industry Type'}
                      </span>
                      <ChevronDown className="w-4 h-4 ml-2" />
                    </button>

                    {isOpenIndustry && (
                      <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-md max-h-60 overflow-y-auto">
                        {industryOptions.length > 0 ? (
                          industryOptions.map((option, index) => (
                            <div
                              key={index}
                              onClick={() => {
                                setSelectedIndustry(option.label);
                                setIsOpenIndustry(false);
                              }}
                              className="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-100"
                            >
                              {option.label}
                            </div>
                          ))
                        ) : (
                          <div className="px-4 py-2 text-gray-500 dark:text-gray-400">
                            Loading...
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                <div
                  className="w-full xl:w-1/2 mb-2"
                  ref={registrationDropdownRef}
                >
                  <label className="mb-2.5 block text-black dark:text-white">
                    Business Registration Type
                  </label>

                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsOpenCompany(!isOpenCompany)}
                      className="w-full border-[1.5px] border-stroke dark:border-form-strokedark rounded bg-white dark:bg-form-input px-5 py-3 text-left text-black dark:text-white flex justify-between items-center outline-none transition focus:border-primary active:border-primary"
                    >
                      <span className="truncate">
                        {selectedOption || 'Select Business Registration Type'}
                      </span>
                      <ChevronDown className="w-4 h-4 ml-2" />
                    </button>

                    {isOpenCompany && (
                      <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-md max-h-60 overflow-y-auto">
                        {options.length > 0 ? (
                          options.map((option, index) => (
                            <div
                              key={index}
                              onClick={() => {
                                setSelectedOption(option.label);
                                setIsOpenCompany(false);
                              }}
                              className="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-100"
                            >
                              {option.label}
                            </div>
                          ))
                        ) : (
                          <div className="px-4 py-2 text-gray-500 dark:text-gray-400">
                            Loading...
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="w-full xl:w-1/2 mb-2">
                  <label className="mb-2.5 block text-black dark:text-white">
                    GSTIN <span className="text-meta-1">*</span>
                  </label>
                  <div className="relative flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter GSTIN"
                      value={gstin}
                      onChange={(e) => setGstin(e.target.value)}
                      className="w-full border-[1.5px] border-stroke dark:border-form-strokedark rounded bg-white dark:bg-form-input px-5 py-3 text-black dark:text-white outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:focus:border-primary"
                      required
                    />
                    <button
                      type="button"
                      className="px-5 py-3 bg-blue-500 text-white rounded border-[1.5px] border-blue-500 hover:bg-blue-600 transition text-sm"
                      onClick={fetchGSTDetails}
                      disabled={loading}
                    >
                      {loading ? (
                        'Fetching...'
                      ) : (
                        <div className="flex flex-col leading-tight">
                          <span>Check</span>
                          <span>Details</span>
                        </div>
                      )}
                    </button>
                  </div>
                  {error && (
                    <p className="text-red-500 text-sm mt-1">{error}</p>
                  )}
                  {!error && validated && (
                    <p className="text-green-500 text-sm mt-1">{validated}</p>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-2 w-full mb-2">
                {/* TDS */}
                <div className="flex items-center gap-2">
                  <label className="text-black dark:text-white text-sm md:text-base mb-0">
                    Enable TDS
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsTdsEnabled(!isTdsEnabled)}
                    className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors ${
                      isTdsEnabled
                        ? 'bg-purple-500'
                        : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        isTdsEnabled ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* TCS */}
                <div className="flex items-center gap-2">
                  <label className="text-black dark:text-white text-sm md:text-base mb-0">
                    Enable TCS
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsTcsEnabled(!isTcsEnabled)}
                    className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors ${
                      isTcsEnabled
                        ? 'bg-purple-500'
                        : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        isTcsEnabled ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>

              <div className="border-b border-stroke py-0.5 px-6.5 dark:border-strokedark mb-6"></div>

              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                {/* Billing Address Textarea */}
                <div className="w-full xl:w-1/2">
                  <label className="block mb-2 text-black dark:text-white">
                    Billing Address
                  </label>
                  <textarea
                    rows={6} // increase rows for height match
                    placeholder="Enter Billing Address"
                    value={billingAddress}
                    onClick={() => setIsModalOpen(true)} // open modal
                    readOnly
                    className="h-28 w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-not-allowed disabled:bg-gray-200 dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  ></textarea>
                </div>

                <div className="w-full xl:w-1/2">
                  <label className="block mb-2 text-black dark:text-white">
                    Signature
                  </label>
                  <div className="mb-4 flex items-center gap-3">
                    <div className="h-28 w-100 rounded border overflow-hidden bg-white dark:bg-form-input">
                      {signaturePreview ? (
                        <img
                          src={signaturePreview}
                          alt="Signature Preview"
                          className="h-full w-full object-contain"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-primary text-sm">
                          No Signature
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="relative block h-28 w-48 cursor-pointer rounded border border-dashed border-primary bg-gray py-4 px-4 dark:bg-meta-4 sm:py-7.5">
                    <input
                      id="signature"
                      type="file"
                      accept="image/*"
                      onChange={handleSignatureChange}
                      className="absolute inset-0 z-50 m-0 h-full w-full cursor-pointer p-0 opacity-0 outline-none"
                    />
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full border border-stroke bg-white dark:border-strokedark dark:bg-boxdark">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M1.99967 9.33337C2.36786 9.33337 2.66634 9.63185 2.66634 10V12.6667C2.66634 12.8435 2.73658 13.0131 2.8616 13.1381C2.98663 13.2631 3.1562 13.3334 3.33301 13.3334H12.6663C12.8431 13.3334 13.0127 13.2631 13.1377 13.1381C13.2628 13.0131 13.333 12.8435 13.333 12.6667V10C13.333 9.63185 13.6315 9.33337 13.9997 9.33337C14.3679 9.33337 14.6663 9.63185 14.6663 10V12.6667C14.6663 13.1971 14.4556 13.7058 14.0806 14.0809C13.7055 14.456 13.1968 14.6667 12.6663 14.6667H3.33301C2.80257 14.6667 2.29387 14.456 1.91879 14.0809C1.54372 13.7058 1.33301 13.1971 1.33301 12.6667V10C1.33301 9.63185 1.63148 9.33337 1.99967 9.33337Z"
                            fill="#3C50E0"
                          />
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M7.5286 1.52864C7.78894 1.26829 8.21106 1.26829 8.4714 1.52864L11.8047 4.86197C12.0651 5.12232 12.0651 5.54443 11.8047 5.80478C11.5444 6.06513 11.1223 6.06513 10.8619 5.80478L8.00002 2.94289L5.13813 5.80478C4.87778 6.06513 4.45566 6.06513 4.19532 5.80478C3.93497 5.54443 3.93497 5.12232 4.19532 4.86197L7.5286 1.52864Z"
                            fill="#3C50E0"
                          />
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M8.00002 2.66663C8.36821 2.66663 8.66669 2.96511 8.66669 3.33329V9.99996C8.66669 10.3681 8.36821 10.6666 8.00002 10.6666C7.63183 10.6666 7.33335 10.3681 7.33335 9.99996V3.33329C7.33335 2.96511 7.63183 2.66663 8.00002 2.66663Z"
                            fill="#3C50E0"
                          />
                        </svg>
                      </span>
                      <p className="text-sm font-medium text-black dark:text-white">
                        <span className="text-primary">Click to upload</span>
                      </p>
                    </div>
                  </div>
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
                              setBillingDetails({
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
                              setBillingDetails({
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
                              setBillingDetails({
                                ...billingDetails,
                                city: e.target.value,
                              })
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
                              setBillingDetails({
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
              </div>

              <div>
                <label className="block mb-2 mt-2 text-black dark:text-white">
                  Business Website
                </label>
                <input
                  type="url"
                  value={businessWebsite}
                  onChange={(e) => setBusinessWebsite(e.target.value)}
                  placeholder="e.g. https://yourbusiness.com"
                  className="w-full mb-3 rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>

              <div className="border-b border-stroke py-0.5 px-6.5 dark:border-strokedark mb-6"></div>

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
              {error1 && <p className="text-red-500 mt-2">{error1}</p>}
            </div>
          </form>
          {!businessLoading && businesses.length > 1 && (
            <div className="w-full mx-auto p-4 dark:bg-gray-900 dark:text-white">
              <h2 className="text-lg font-semibold mb-4 border-b border-gray-300 pb-2 dark:border-gray-700">
                Businesses
              </h2>

              <div className="space-y-4">
                {businesses.map((biz) => {
                  const isCurrent = String(biz.id) === String(currentBusinessId);

                  return (
                    <div
                      key={biz.id}
                      className="flex items-center justify-between p-4 border rounded-md dark:border-gray-700"
                    >
                      <div className="flex items-center space-x-4">
                        <div
                          className={`w-10 h-10 rounded-md text-white flex items-center justify-center font-bold text-lg ${biz.color}`}
                        >
                          {biz.initial}
                        </div>
                        <span className="capitalize text-base">{biz.name}</span>
                      </div>

                      {isCurrent ? (
                        <span className="text-green-500 font-medium text-sm">
                          Current
                        </span>
                      ) : (
                        <button
                          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm"
                          onClick={() => handleSwitchBusiness(biz.id)}
                        >
                          Switch
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="border-b border-stroke py-0.5 px-6.5 dark:border-strokedark"></div>
          <div className="bg-white dark:bg-boxdark p-4 rounded shadow-sm mb-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Add New Business
            </h3>
            <div className="border-b border-stroke py-0.5 px-6.5 dark:border-strokedark mb-6"></div>

            <div className="flex flex-col items-center justify-center gap-6 md:flex-row md:justify-around">
              {/* Store 1 */}
              <div className="flex flex-col items-center gap-2">
                <Store className="w-14 h-14 text-primary" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  STORE 1
                </span>
              </div>

              {/* Connector Section */}
              <div className="flex flex-col items-center gap-2 text-center">
                <MonitorSmartphone className="w-10 h-10 text-blue-500" />
                <p className="text-sm text-gray-600 dark:text-gray-300 max-w-xs">
                  Easily manage all your businesses in one place on myBillBook
                  app
                </p>
                <button
                  className="mt-2 px-4 py-2 bg-primary text-white text-sm rounded hover:bg-opacity-90 transition"
                  onClick={() => navigate('/Create-Business')}
                >
                  Create New Business
                </button>
              </div>

              {/* Store 2 */}
              <div className="flex flex-col items-center gap-2">
                <Store className="w-14 h-14 text-primary" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  STORE 2
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ManageBusiness;
