import React, { useState, useEffect, useRef } from 'react';
import Select from 'react-select';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import UploadSignature from './UploadSignature';
import { Trash2 } from 'lucide-react'; // Import delete icon
import { v4 as uuidv4 } from 'uuid';

const EditProformaInvoiceForm = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const [ProformaInvoiceNo, setSalesProformaInvoiceNo] = useState(1);
  const [proformaInvoiceDate, setProformaInvoiceDate] = useState(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  }); // Default to today with time set to midnight
  const [dueDate, setDueDate] = useState(new Date()); // Default to today
  const [showNotesInput, setShowNotesInput] = useState(false);
  const [notes, setNotes] = useState('');
  const [showDiscountInput, setShowDiscountInput] = useState(false);
  const [totalDiscount, setTotalDiscount] = useState(''); // Store discount value
  const [paymentTerms, setPaymentTerms] = useState(30);
  const [items, setItems] = useState([]); // Store fetched items
  const [selectedItems, setSelectedItems] = useState<any[]>([]); // Store selected items
  const [showDropdown, setShowDropdown] = useState(false);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [totalAmount, setTotalAmount] = useState(0);
  const [taxRates, setTaxRates] = useState([]); // Store tax rates
  const [amountReceived, setAmountReceived] = useState(0);
  const [isFullyPaid, setIsFullyPaid] = useState(false);
  const [taxableAmount, setTaxableAmount] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedParty, setSelectedParty] = useState(null);
  const [signatureUrl, setSignatureUrl] = useState<string | null>(null);
  const [selectedPaymentMode, setSelectedPaymentMode] = useState('Cash');
  //const [signatureFile, setSignatureFile] = useState<string | null>(null);
  const { id } = useParams();
  const location = useLocation();
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItemIds, setSelectedItemIds] = useState([]); // ✅ Store selected item IDs
  const [selectedQuantities, setSelectedQuantities] = useState({});
  const generateUID = (item) => `${item.id}-${item.type}`;
  const [businessState, setBusinessState] = useState('');
  const dropdownRef = useRef(null);
  const [parties, setParties] = useState([]);

  const [proformaInvoiceData, setProformaInvoiceData] = useState<{
    proformaInvoice_no: string;
    date: string;
    proforma_items: {
      uid: string;
      item_name: string;
      price_item: number;
      quantity: number;
      discount: number;
      amount: number;
      unit_price: number;
      salesPrice_with_tax?: number; // ✅ Mark as optional
      tax_rate: number;
      gstTaxRat: number;
    }[];
    due_date: string;
    payment_term: string;
    total_amount: string;
    amount_received: string;
    balance_amount: string;
    party: any;
  }>({
    proformaInvoice_no: '',
    date: '',
    proforma_items: [],
    due_date: '',
    payment_term: '',
    total_amount: '',
    amount_received: '',
    balance_amount: '',
    party: null,
  });

  const filteredItems = items.filter((item) =>
    (item.itemName || item.serviceName)
      .toLowerCase()
      .includes(searchQuery.toLowerCase()),
  );

  // ✅ Handle checkbox selection
  // ✅ Handle checkbox selection
  const handleToggleItem = (itemId) => {
    setSelectedItemIds((prevSelected) =>
      prevSelected.includes(itemId)
        ? prevSelected.filter((id) => id !== itemId)
        : [...prevSelected, itemId],
    );
  };

  useEffect(() => {
    const fetchParties = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) throw new Error('Token not found');

        const response = await fetch(`${API_URL}/parties/parties/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!data.results || !Array.isArray(data.results)) {
          throw new Error(
            'Invalid response format: Expected an array in "results"',
          );
        }

        const validParties = data.results.filter(
          (party) => party && party.party_name,
        );

        setParties(validParties);
      } catch (error) {
        console.error('Error fetching parties:', error);
      }
    };

    fetchParties();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  useEffect(() => {
    const fetchTcsSetting = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) throw new Error('Token not found');
        const response = await fetch(`${API_URL}/sales/settings/tcs-tds/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }); // 🛠️ Replace with your actual API
        const data = await response.json();
        // Assuming API response looks like: { isTcsEnabled: true }
        //setIsTcsEnabled(data.tcs);
        setBusinessState(data?.state); // ✅ Save the state
      } catch (error) {
        console.error('Error fetching TCS setting:', error);
      }
    };

    fetchTcsSetting();
  }, []);

  useEffect(() => {
    fetchProformaInvoiceDetails();
    if (location.state?.proformaInvoiceData) {
      setProformaInvoiceData(location.state.proformaInvoiceData);
      if (location.state.proformaInvoiceData.party) {
        fetchPartyDetails(location.state.proformaInvoiceData.party);
      }
    } else {
      fetchProformaInvoiceDetails();
    }
  }, [id]);

  const fetchPartyDetails = async (partyId) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${API_URL}/parties/parties/${partyId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const partyData = await response.json();
      console.log(partyData);
      setSelectedParty(partyData);
    } catch (error) {
      console.error('Error fetching party details:', error);
    }
  };

  const fetchProformaInvoiceDetails = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${API_URL}/sales/proforma/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      // Set the fetched data into state
      const proformaInvoiceDate = data.date; // Assuming date is in 'YYYY-MM-DD' format from backend
      const paymentTerms = data.payment_term; // payment_term from the backend
      const dueDate = data.due_date; // due_date from backend
      const amountReceived = data.amount_received;

      // Set the fetched values into the states
      setSalesProformaInvoiceNo(data.proforma_no);
      setProformaInvoiceDate(proformaInvoiceDate);
      setPaymentTerms(paymentTerms);
      setAmountReceived(amountReceived);
      if (typeof data.discount === 'number' && data.discount !== 0) {
        setShowDiscountInput(true);
        setTotalDiscount(data.discount);
      } else {
        setShowDiscountInput(false);
        setTotalDiscount(0);
      }
      // Recalculate due date based on the payment term if needed
      const updatedDueDate = new Date(proformaInvoiceDate);
      updatedDueDate.setDate(updatedDueDate.getDate() + paymentTerms); // Add payment term days
      setProformaInvoiceData((prevData) => ({
        ...prevData,
        due_date: updatedDueDate.toISOString().split('T')[0], // Format due date as 'YYYY-MM-DD'
      }));

      // Assuming the data includes 'proforma_items' array
      const proformaInvoiceItems = data.proforma_items.map((item) => {
        const quantity = parseFloat(item.quantity) || 1;
        const price = parseFloat(item.salesPrice_without_tax) || 0;
        const discount = parseFloat(item.discount || 0);

        // Select tax and cess rate using gstTaxRate ID
        // const selectedTax = taxRates.find((tax) => tax.id === item.gstTaxRate);
        const tax = parseFloat(item.tax_rate) || 0;
        const cess = parseFloat(item.cess_rate) || 0;
        const taxId = item.gstTaxRate;
        const amount = parseFloat(item.salesPrice_with_tax) || 0;
        const taxAmount = (price * tax) / 100;
        const cessAmount = (price * cess) / 100;
        const sgst = parseFloat(item.sgst);
        const cgst = parseFloat(item.cgst);
        return {
          ...item,
          uid: `${item.id}-${Date.now()}-${Math.random()}`, // UNIQUE ID FOR EVERY ROW
          quantity,
          price,
          discount,
          taxId, // Store tax ID
          tax,
          cessRate: cess, // Store cess rate
          taxAmount,
          sgst,
          cgst,
          cessAmount,
          amount,
          itemName: item.item_name || item.service_name, // Use item_name for product or service_name for service
          hsnCode: item.hsnCode || item.sacCode, // Use hsnCode for product or sacCode for service
        };
      });

      // Set the fetched items into the selectedItems state
      setSelectedItems(proformaInvoiceItems);
      console.log(proformaInvoiceItems); // Log the data to inspect
    } catch (error) {
      console.error('Error fetching proformaInvoice details:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setProformaInvoiceData((prevData) => {
      const updatedData = { ...prevData, [name]: value };

      // Agar payment_term update ho raha hai, toh due date bhi update karein
      if (name === 'payment_term') {
        const updatedDueDate = new Date(proformaInvoiceDate);
        updatedDueDate.setDate(updatedDueDate.getDate() + Number(value)); // Add new payment term days
        updatedData.due_date = updatedDueDate.toISOString().split('T')[0]; // Format date as YYYY-MM-DD
      }

      return updatedData;
    });
  };

  const handleSubmit2 = async (e) => {
    e.preventDefault();
    setIsSaving(true); // Button ko disable karne ke liye

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${API_URL}/sales/proforma/${id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(proformaInvoiceData), // Corrected data object
      });

      if (response.ok) {
        alert('ProformaInvoice updated successfully!');
        navigate(`/Sales/Sales-ProformaInvoice`);
      } else {
        alert('Failed to update proformaInvoice.');
      }
    } catch (error) {
      console.error('Error updating proformaInvoice:', error);
    } finally {
      setIsSaving(false); // Button ko re-enable karne ke liye
    }
  };

  const balanceAmount = isFullyPaid ? 0 : totalAmount - amountReceived;
  const resetTime = (date) => {
    const reset = new Date(date);
    reset.setHours(0, 0, 0, 0); // Set the time to midnight
    return reset;
  };

  const formatDate = (date: Date | string) => {
    // If date is a string, convert to Date object
    const d = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(d.getTime())) return ''; // Invalid date
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    let total = selectedItems.reduce((sum, item) => sum + item.amount, 0);
    total -= (total * (totalDiscount || 0)) / 100;
    setTotalAmount(total);
  }, [selectedItems, totalDiscount]);

  useEffect(() => {
    const total = selectedItems.reduce(
      (sum, item) =>
        sum +
        item.price * item.quantity -
        (item.price * item.quantity * item.discount) / 100,
      0,
    );
    setTaxableAmount(total);
  }, [selectedItems]);

  useEffect(() => {
    const updatedDueDate = new Date(proformaInvoiceDate);
    updatedDueDate.setDate(updatedDueDate.getDate() + paymentTerms); // Add days
    setDueDate(updatedDueDate);
  }, [proformaInvoiceDate, paymentTerms]);

  const fetchTaxRates = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) throw new Error('Token not found');

      const response = await fetch(`${API_URL}/inventory/gst-tax-rates/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (Array.isArray(data.results)) {
        setTaxRates(data.results);
      } else {
        throw new Error('Invalid tax data format');
      }
    } catch (error) {
      console.error('Error fetching tax rates:', error);
      setTaxRates([]); // Empty array on error
    }
  };

  useEffect(() => {
    fetchTaxRates();
  }, []);

  const fetchItems = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) throw new Error('Token not found');

      // Fetch items and services concurrently
      const [itemsResponse, servicesResponse] = await Promise.all([
        fetch(`${API_URL}/inventory/items/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }),
        fetch(`${API_URL}/inventory/service/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }),
      ]);

      // Convert responses to JSON
      const itemsData = await itemsResponse.json();
      const servicesData = await servicesResponse.json();

      // Combine fetched items and services
      const allItems = [
        ...itemsData.results.map((item: any) => ({ ...item, type: 'item' })),
        ...servicesData.results.map((service: any) => ({
          ...service,
          type: 'service',
        })),
      ];

      console.log('Fetched Items & Services:', allItems);

      // Store fetched data in state
      if (Array.isArray(allItems)) {
        setItems(allItems);
      } else {
        throw new Error('Invalid data format');
      }
    } catch (error) {
      console.error('Error fetching items:', error);
      setItems([]); // Set empty array on error
    }
  };

  const handleAddItemClick = () => {
    setShowModal(true);
    if (!items.length) fetchItems(); // API call only if items are not fetched
  };

  const handleQuantityChange = (uid, newQuantity) => {
    setSelectedItems((prevItems) =>
      prevItems.map((item) =>
        item.uid === uid
          ? {
              ...item,
              quantity: newQuantity,
              amount:
                newQuantity * item.salesPrice_with_tax -
                (newQuantity * item.salesPrice_with_tax * item.discount) / 100,
            }
          : item,
      ),
    );
  };

  const handleSelectItem = (item) => {
    const quantity = quantities[item.id] || 1;
    const price = parseFloat(
      item.salesPrice_without_tax || item.salesPrice || 0,
    );
    const discount = parseFloat(item.discount || 0);

    // ✅ Select tax and cess rate using gstTaxRate ID
    const selectedTax = taxRates.find((tax) => tax.id === item.gstTaxRate);
    const tax = parseFloat(selectedTax?.rate) || 0;
    const cess = parseFloat(selectedTax?.cess_rate) || 0;

    const amount = parseFloat(item.salesPrice_with_tax || item.salesPrice || 0);
    console.log(`Tax: ${tax}, Cess: ${cess}`);

    const taxAmount = (price * tax) / 100;
    const cessAmount = (price * cess) / 100;
    const sgst = taxAmount / 2;
    const cgst = taxAmount / 2;

    const selectedItem = {
      ...item,
      uid: `${item.id}-${Date.now()}-${Math.random()}`, // UNIQUE ID FOR EVERY ROW
      quantity,
      price,
      discount,
      taxId: item.gstTaxRate, // ✅ Store tax ID
      tax,
      cessRate: cess, // ✅ Store cess rate
      taxAmount,
      sgst,
      cgst,
      cessAmount,
      amount,
    };

    setSelectedItems([...selectedItems, selectedItem]);
    setShowDropdown(false);
  };

  console.log(selectedParty);

  const partyState =
    selectedParty?.state || selectedParty?.address?.state || '';
  console.log(partyState);

  const isSameState =
    partyState?.trim().toLowerCase() === businessState?.trim().toLowerCase();

  const handleConfirmSelection = () => {
    if (selectedItemIds.length === 0) return;

    const partyState =
      selectedParty?.state || selectedParty?.address?.state || '';
    const isSameState =
      businessState?.trim().toLowerCase() === partyState?.trim().toLowerCase();

    const newSelectedItems = items
      .filter((item) => selectedItemIds.includes(`${item.id}-${item.type}`))
      .map((item) => {
        const quantity = selectedQuantities[`${item.id}-${item.type}`] || 1;
        const price = item.salesPrice_without_tax || item.salesPrice || 0;
        const discount = item.discount || 0;
        const amount = item.salesPrice_with_tax || item.salesPrice || 0;

        const selectedTax = taxRates.find((tax) => tax.id === item.gstTaxRate);
        const tax = parseFloat(selectedTax?.rate) || 0;
        const cess = parseFloat(selectedTax?.cess_rate) || 0;

        const taxAmount = (price * tax) / 100;
        const cessAmount = (price * cess) / 100;

        const sgst = isSameState ? taxAmount / 2 : 0;
        const cgst = isSameState ? taxAmount / 2 : 0;
        const igst = !isSameState ? taxAmount : 0;

        return {
          ...item,
          uid: uuidv4(),
          quantity,
          price,
          discount,
          taxId: item.gstTaxRate,
          tax,
          cessRate: cess,
          taxAmount,
          sgst,
          cgst,
          igst,
          cessAmount,
          amount: amount * quantity,
        };
      });

    setSelectedItems((prevItems) => [...prevItems, ...newSelectedItems]);
    setShowModal(false);
    setSelectedItemIds([]);
    setSelectedQuantities({});
  };

  const handleDiscountChange = (uid, discountValue) => {
    const discount = discountValue === '' ? 0 : parseFloat(discountValue); // Empty string means no discount

    setSelectedItems((prevItems) =>
      prevItems.map((item) =>
        item.uid === uid
          ? {
              ...item,
              discount,
              amount:
                item.salesPriceType === 'Without Tax'
                  ? item.salesPrice_without_tax *
                      (1 + item.tax / 100 + item.cessRate / 100) * // Applying GST and Cess
                      item.quantity -
                    (item.salesPrice_without_tax *
                      (1 + item.tax / 100 + item.cessRate / 100) *
                      item.quantity *
                      discount) /
                      100 // Apply discount after tax
                  : item.salesPrice_with_tax * item.quantity -
                    (item.salesPrice_with_tax * item.quantity * discount) / 100, // Discount on tax-inclusive price
            }
          : item,
      ),
    );
  };

  const handleDeleteItem = (uid) => {
    setSelectedItems((prevItems) =>
      prevItems.filter((item) => item.uid !== uid),
    );
  };

  const handleTaxChange = (uid, newTaxRateID) => {
    const partyState =
      selectedParty?.state || selectedParty?.address?.state || '';
    const isSameState =
      businessState?.trim().toLowerCase() === partyState?.trim().toLowerCase();

    const selectedTax = taxRates.find((tax) => tax.id === newTaxRateID);

    const cessRate = parseFloat(selectedTax?.cess_rate) || 0;
    const newTaxRate = parseFloat(selectedTax?.rate) || 0;

    setSelectedItems((prevItems) =>
      prevItems.map((item) =>
        item.uid === uid
          ? (() => {
              const taxAmount = (item.salesPrice * newTaxRate) / 100;
              const cessAmount = (item.salesPrice * cessRate) / 100;
              const sgst = isSameState ? taxAmount / 2 : 0;
              const cgst = isSameState ? taxAmount / 2 : 0;
              const igst = !isSameState ? taxAmount : 0;

              const price =
                item.salesPriceType === 'With Tax'
                  ? (item.salesPrice_with_tax * 100) /
                    (100 + newTaxRate + cessRate)
                  : item.salesPrice_without_tax;

              const baseAmount =
                item.salesPriceType === 'Without Tax'
                  ? item.salesPrice_without_tax *
                    (1 + newTaxRate / 100 + cessRate / 100) *
                    item.quantity
                  : item.salesPrice_with_tax * item.quantity;

              const amount = baseAmount - (baseAmount * item.discount) / 100;

              return {
                ...item,
                taxId: newTaxRateID,
                tax: newTaxRate,
                cessRate,
                taxAmount,
                cessAmount,
                sgst,
                cgst,
                igst,
                price,
                amount,
              };
            })()
          : item,
      ),
    );
  };

  const groupedTaxes = selectedItems.reduce((acc, item) => {
    const totalAmount = item.price * item.quantity;
    const taxRate = item.tax;
    const cessRate = item.cessRate;

    if (!acc[taxRate]) {
      acc[taxRate] = {
        igst: 0,
        sgst: 0,
        cgst: 0,
        cessAmount: 0,
        cessRate,
      };
    }

    if (isSameState) {
      // Intra-state (SGST + CGST)
      acc[taxRate].sgst += (totalAmount * taxRate) / 200;
      acc[taxRate].cgst += (totalAmount * taxRate) / 200;
    } else {
      // Inter-state (IGST)
      acc[taxRate].igst += (totalAmount * taxRate) / 100;
    }

    acc[taxRate].cessAmount += (totalAmount * cessRate) / 100;

    return acc;
  }, {});

  const handleCheckboxChange = () => {
    if (!isFullyPaid) {
      setAmountReceived(totalAmount); // Set total amount
    } else {
      setAmountReceived(0); // Reset if unchecked
    }
    setIsFullyPaid(!isFullyPaid);
  };

  // useEffect(() => {
  //   const savedProformaInvoiceNo = localStorage.getItem('ProformaInvoiceNo');
  //   if (savedProformaInvoiceNo) {
  //     setSalesProformaInvoiceNo(parseInt(savedProformaInvoiceNo)); // Increment by 1
  //   }
  // }, []);

  const handleSubmit = async () => {
    if (!selectedParty) {
      alert('Please select a party before saving the proformaInvoice!');
      return;
    }

    setIsSaving(true); // Start loading
    console.log(selectedItems);
    // ✅ Extract only required fields from selectedItems
    const formattedItems = selectedItems.map((item) => ({
      service: item.type === 'service' ? item.service || item.id : null,
      item: item.type === 'item' ? item.item || item.id : null,
      gstTaxRate: item.taxId,
      quantity: item.quantity,
      discount: item.discount,
      /* sgst: item.sgst,        // ✅ SGST ko add kiya
    cgst: item.cgst,        // ✅ CGST ko add kiya
    cessAmount: item.cessAmount, */
    }));

    const proformaInvoiceData = {
      proforma_no: ProformaInvoiceNo,
      date: formatDate(proformaInvoiceDate),
      payment_term: paymentTerms,
      // due_date:dueDate,
      proforma_items: formattedItems, // Array of items
      // taxableAmount,
      discount: totalDiscount,
      // total_amount: totalAmount,
      amount_received: amountReceived,
      payment_method: selectedPaymentMode,
      is_fully_paid: isFullyPaid,
      // balance_amount: balanceAmount,
      notes,
      signature: signatureUrl, // Add signature URL here
      party: selectedParty.id,
      // termsConditions: [
      //   'Goods once sold will not be taken back or exchanged',
      //   'All disputes are subject to [ENTER_YOUR_CITY_NAME] jurisdiction only',
      // ],
    };

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) throw new Error('Token not found');
      const response = await fetch(`${API_URL}/sales/proforma/${id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(proformaInvoiceData),
      });

      if (response.ok) {
        const result = await response.json();
        alert('ProformaInvoice updated Successfully!');
        console.log(result);
        navigate(`/Sales/Proforma-Invoice`);
      } else {
        alert('Failed to save proformaInvoice');
      }
    } catch (error) {
      console.error('Error saving proformaInvoice:', error);
      alert('Something went wrong!');
    } finally {
      setIsSaving(false); // Stop loading
    }
  };

  const handleBack = () => {
    navigate(-1); // Navigates back to the previous page
  };

  return (
    <>
      <Breadcrumb pageName="Sales ProformaInvoices" />
      <div className="bg-gray-100 dark:bg-gray-900 p-4">
        <div className="max-w-7xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <div className="flex flex-col-reverse md:flex-row-reverse justify-between items-start gap-6 mb-12">
            {/* Party Section */}
            <div className="w-full md:w-1/2 flex flex-col items-end space-y-1">
              <div className="w-full">
                <div ref={dropdownRef} className="relative w-full">
                  {!selectedParty ? (
                    !showDropdown ? (
                      <div
                        className="border-2 border-blue-400 w-full h-16 flex items-center justify-center text-blue-400 cursor-pointer text-lg font-semibold rounded-lg"
                        onClick={() => setShowDropdown(true)}
                      >
                        + Add Party
                      </div>
                    ) : (
                      <Select
                        className="w-full"
                        options={[
                          ...parties.map((party) => ({
                            value: party.id,
                            label: `${party.party_name} (Balance: $${party.opening_balance})`,
                          })),
                          { value: 'create', label: '➕ Create Party' },
                        ]}
                        onChange={(selectedOption) => {
                          if (selectedOption?.value === 'create') {
                            navigate('/forms/form-layout');
                          } else {
                            const selected =
                              parties.find(
                                (p) => p.id === selectedOption?.value,
                              ) || null;
                            setSelectedParty(selected);
                          }
                        }}
                        placeholder="Select or search party..."
                        isSearchable={true}
                      />
                    )
                  ) : (
                    <div className="p-4 bg-white dark:bg-gray-800 border rounded-lg shadow-md w-full">
                      <label className="text-gray-700 font-bold">
                        Bill To :
                      </label>
                      <div className="border-b border-gray-400 py-0.5 mb-1"></div>

                      <div className="mb-3 flex flex-col gap-4 xl:flex-row">
                        {/* Party Name */}
                        <div className="w-full xl:w-1/2">
                          <label className="mb-1.5 block text-black dark:text-white text-sm">
                            Party Name
                          </label>
                          <input
                            type="text"
                            value={selectedParty.party_name}
                            readOnly
                            className="w-full rounded border bg-gray-100 dark:bg-gray-700 py-2 px-3 text-sm text-black dark:text-white outline-none"
                          />
                        </div>

                        {/* Mobile Number */}
                        <div className="w-full xl:w-1/2">
                          <label className="mb-1.5 block text-black dark:text-white text-sm">
                            Mobile Number
                          </label>
                          <input
                            type="tel"
                            value={selectedParty.mobile_number || ''}
                            readOnly
                            className="w-full rounded border bg-gray-100 dark:bg-gray-700 py-2 px-3 text-sm text-black dark:text-white outline-none"
                          />
                        </div>
                      </div>

                      {/* Shipping Address */}
                      <div className="mb-3">
                        <label className="mb-1.5 block text-black dark:text-white text-sm">
                          Shipping Address
                        </label>
                        <input
                          type="text"
                          value={selectedParty.shipping_address || ''}
                          readOnly
                          className="w-full rounded border bg-gray-100 dark:bg-gray-700 py-2 px-3 text-sm text-black dark:text-white outline-none"
                        />
                      </div>

                      {/* Change Party Button */}
                      <button
                        className="mt-2 w-full bg-blue-500 text-white py-2 text-sm rounded-md hover:bg-red-600 transition"
                        onClick={() => setSelectedParty(null)}
                      >
                        Change Party
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <label className="w-40 text-gray-700 font-bold">
                  ProformaInvoice No:
                </label>
                <input
                  type="text"
                  value={ProformaInvoiceNo}
                  readOnly
                  className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white p-2 rounded"
                />
              </div>

              <div className="flex items-center space-x-2">
                <label className="w-40 text-gray-700 font-bold">
                  ProformaInvoice Date:
                </label>
                <DatePicker
                  selected={proformaInvoiceDate}
                  onChange={(date: Date) => {
                    const resetDate = resetTime(date);
                    setProformaInvoiceDate(resetDate);
                  }}
                  className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white p-2 rounded"
                  dateFormat="yyyy-MM-dd"
                />
              </div>

              <div className="flex items-center space-x-2">
                <label className="w-40 text-gray-700 font-bold">
                  Payment Terms:
                </label>
                <input
                  type="text"
                  value={paymentTerms}
                  onChange={(e) => setPaymentTerms(Number(e.target.value))}
                  className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white p-2 rounded w-46"
                />
                <span>days</span>
              </div>

              <div className="flex items-center space-x-2">
                <label className="w-40 text-gray-700 font-bold">
                  Due Date:
                </label>
                <DatePicker
                  selected={dueDate}
                  onChange={() => {}}
                  className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white p-2 rounded"
                  dateFormat="dd MMM yyyy"
                  readOnly
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white dark:bg-gray-700 dark:text-white">
              <thead>
                <tr className="w-full bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-white">
                  <th className="py-2 px-4 border">NO</th>
                  <th className="py-2 px-4 border">ITEMS/ SERVICES</th>
                  <th className="py-2 px-4 border">HSN/ SAC</th>
                  <th className="py-2 px-4 border">QTY</th>
                  <th className="py-2 px-4 border">PRICE/ITEM (₹)</th>
                  <th className="py-2 px-4 border">Discount</th>

                  <th className="py-2 px-4 border">TAX</th>
                  <th className="py-2 px-4 border">AMOUNT (₹)</th>
                  <th className="py-2 px-4 border"></th>
                </tr>
              </thead>
              <tbody>
                {selectedItems.map((item, index) => (
                  <tr key={index} className="border">
                    <td className="py-2 px-4 border">{index + 1}</td>
                    <td className="py-2 px-4 border">
                      {item.itemName || item.serviceName}
                    </td>
                    <td className="py-2 px-4 border">
                      {item.hsnCode || item.sacCode}
                    </td>
                    <td className="py-2 px-4 border">
                      <input
                        type="number"
                        value={item.quantity === 0 ? '' : item.quantity}
                        min="1"
                        onChange={(e) =>
                          handleQuantityChange(item.uid, Number(e.target.value))
                        }
                        className="w-16 p-1 border rounded text-center dark:bg-gray-700 dark:text-white"
                      />
                    </td>

                    <td className="py-2 px-4 border">
                      ₹{item.price.toFixed(2)}
                    </td>
                    <td className="py-2 px-4 border">
                      <input
                        type="number"
                        value={item.discount === 0 ? '' : item.discount}
                        min="0"
                        onChange={(e) =>
                          handleDiscountChange(item.uid, e.target.value)
                        } // USE UID
                        className="w-20 p-1 border rounded  dark:bg-gray-700"
                      />
                    </td>
                    <td className="py-2 px-4 border">
                      <select
                        value={item.taxId || item.gstTaxRate} // Ensure correct selection
                        onChange={(e) =>
                          handleTaxChange(item.uid, Number(e.target.value))
                        }
                        className="px-4 py-2 cursor-pointer bg-gray-200 dark:bg-gray-700"
                      >
                        {/* Show default GST tax rate only if tax has not been changed */}
                        if(item.tax=="None"||"Exempted"||"GST @ 0%")
                        {<option value={item.tax}>{item.tax}%</option>}else
                        {!item.taxId ? (
                          <option value={item.gstTaxRate || 0}>
                            {taxRates.find((tax) => tax.id === item.gstTaxRate)
                              ?.rate || 'Select Tax'}
                            %
                          </option>
                        ) : (
                          /* Show currently selected tax after user selects a value */
                          <option value={item.taxId || 0}>
                            {taxRates.find((tax) => tax.id === item.taxId)
                              ? `${
                                  taxRates.find((tax) => tax.id === item.taxId)
                                    .rate
                                }% (${
                                  taxRates.find((tax) => tax.id === item.taxId)
                                    .description
                                })`
                              : 'Select Tax'}
                          </option>
                        )}
                        {/* Show backend tax rates */}
                        {taxRates.map((tax) => (
                          <option key={tax.id} value={tax.id}>
                            {tax.description}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="py-2 px-4 border">
                      ₹{Number(item.amount || 0).toFixed(2)}
                    </td>
                    {/* Delete Icon */}
                    <td className="py-2 px-4 border">
                      <button
                        onClick={() => handleDeleteItem(item.uid)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={20} />
                      </button>
                    </td>
                  </tr>
                ))}

                {/* Full-Width "+ Add Item" Row */}
                <tr>
                  <td
                    colSpan="9"
                    onClick={handleAddItemClick}
                    className="py-4 w-full text-center bg-gray-100 dark:bg-gray-700 dark:text-blue font-semibold text-blue-500 cursor-pointer hover:text-blue-700"
                  >
                    + Add Item
                  </td>
                </tr>
                {/* ✅ Modal for Item Selection */}
                {showModal && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-1/2">
                      {/* Modal Header */}
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-gray-700 dark:text-white">
                          Select Items
                        </h2>
                        <button
                          onClick={() => setShowModal(false)}
                          className="text-gray-500 hover:text-red-500"
                        >
                          ✖
                        </button>
                      </div>

                      {/* ✅ Search Bar */}
                      <input
                        type="text"
                        placeholder="Search Item..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white"
                      />

                      {/* ✅ Item List with Checkboxes */}
                      <ul className="max-h-60 overflow-y-auto border mt-2 rounded-md">
                        {filteredItems.length > 0 ? (
                          filteredItems.map((item) => (
                            <li
                              key={`${item.id}-${item.type}`}
                              className="p-2 flex items-center justify-between hover:bg-blue-100 cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                checked={selectedItemIds.includes(
                                  `${item.id}-${item.type}`,
                                )}
                                onChange={() =>
                                  handleToggleItem(`${item.id}-${item.type}`)
                                }
                                className="mr-2"
                              />
                              <span className="w-1/4">
                                {item.itemName
                                  ? `${item.itemName}`
                                  : `${item.serviceName}`}
                              </span>
                              <span className="w-1/4">
                                ₹
                                {item.salesPrice_with_tax ||
                                  item.salesPrice ||
                                  '0'}
                              </span>
                              <span className="w-1/4">
                                ₹
                                {item.purchasePrice_with_tax ||
                                  item.purchasePrice ||
                                  '0'}
                              </span>
                              <input
                                type="number"
                                min="1"
                                value={
                                  selectedQuantities[
                                    `${item.id}-${item.type}`
                                  ] === 0
                                    ? ''
                                    : selectedQuantities[
                                        `${item.id}-${item.type}`
                                      ]
                                }
                                onChange={(e) =>
                                  setSelectedQuantities((prev) => ({
                                    ...prev,
                                    [`${item.id}-${item.type}`]: Number(
                                      e.target.value,
                                    ), // ✅ Unique key store
                                  }))
                                }
                                className="w-16 p-1 border rounded text-center"
                              />
                            </li>
                          ))
                        ) : (
                          <li className="p-2 text-gray-500">
                            No items found...
                          </li>
                        )}
                      </ul>

                      {/* ✅ Confirm Button */}
                      <div className="flex justify-end mt-4">
                        <button
                          onClick={handleConfirmSelection}
                          disabled={selectedItemIds.length === 0}
                          className={`py-2 px-4 rounded-md ${
                            selectedItemIds.length === 0
                              ? 'bg-gray-400 cursor-not-allowed'
                              : 'bg-green-500 hover:bg-green-700 text-white'
                          }`}
                        >
                          Confirm Selection
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-start mt-4">
            <div className="w-1/2 mr-2">
              <button
                className="text-blue-400 mb-2"
                onClick={() => setShowNotesInput(!showNotesInput)}
              >
                + Add Notes
              </button>
              {/* Show input field when showNotesInput is true */}
              {showNotesInput && (
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-2 border border-gray-700 dark:bg-gray-900 dark:text-whiterounded mt-2"
                  placeholder="Enter your notes here..."
                />
              )}

              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded">
                <h3 className="text-gray-700 font-bold mb-2">
                  Terms and Conditions
                </h3>
                <p className="text-gray-600">
                  1. Goods once sold will not be taken back or exchanged
                </p>
                <p className="text-gray-600">
                  2. All disputes are subject to [ENTER_YOUR_CITY_NAME]
                  jurisdiction only
                </p>
              </div>
              <button className="text-blue-400 mt-4">+ Add New Account</button>
            </div>
            <div className="w-1/2">
              <div className="bg-gray-100 p-4 rounded dark:bg-gray-900 dark:text-white">
                {/* ✅ Taxable Amount */}
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-700">Taxable Amount</span>
                  <span className="text-gray-700">
                    ₹{taxableAmount.toFixed(2)}
                  </span>
                </div>
                {/* ✅ SGST & CGST */}
                {Object.keys(groupedTaxes).map((taxRate) => (
                  <div key={taxRate} className="flex flex-col gap-1 mb-2">
                    {isSameState ? (
                      <>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-700">
                            SGST ({taxRate / 2}%)
                          </span>
                          <span className="text-gray-700">
                            ₹{groupedTaxes[taxRate].sgst.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-700">
                            CGST ({taxRate / 2}%)
                          </span>
                          <span className="text-gray-700">
                            ₹{groupedTaxes[taxRate].cgst.toFixed(2)}
                          </span>
                        </div>
                      </>
                    ) : (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-700">IGST ({taxRate}%)</span>
                        <span className="text-gray-700">
                          ₹{groupedTaxes[taxRate].igst.toFixed(2)}
                        </span>
                      </div>
                    )}

                    {/* Cess amount display */}
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-700">
                        Cess ({groupedTaxes[taxRate].cessRate}%)
                      </span>
                      <span className="text-gray-700">
                        ₹{groupedTaxes[taxRate].cessAmount.toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
                {/* ✅ Discount Section */}
                <div className="flex justify-between items-center mb-2">
                  <button
                    className="text-blue-400 mb-2"
                    onClick={() => {
                      if (showDiscountInput) setTotalDiscount(0); // ✅ Reset discount when removing
                      setShowDiscountInput(!showDiscountInput);
                    }}
                  >
                    {showDiscountInput ? '- Remove Discount' : '+ Add Discount'}
                  </button>

                  {showDiscountInput && (
                    <div className="flex items-center space-x-2 mt-2">
                      <input
                        type="number"
                        value={totalDiscount}
                        onChange={(e) => setTotalDiscount(e.target.value)}
                        className="border border-gray-700 dark:bg-gray-900 dark:text-white p-2 rounded w-16 text-center"
                        placeholder="%"
                      />
                      <span className="text-gray-700">%</span>
                    </div>
                  )}
                </div>

                <div className="border-b border-gray-400 py-0.5 dark:border-gray-500 mb-2"></div>

                {/* ✅ Total Amount */}
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-700 font-bold">Total Amount</span>
                  <span className="text-gray-700">
                    ₹{totalAmount.toFixed(2)}
                  </span>
                </div>

                <div className="border-b border-gray-400 py-0.5 dark:border-gray-500 mb-2"></div>

                {/* ✅ Fully Paid Checkbox */}
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="fullyPaid"
                    checked={isFullyPaid}
                    onChange={handleCheckboxChange}
                    className="cursor-pointer"
                  />
                  <label
                    htmlFor="fullyPaid"
                    className="text-gray-700 cursor-pointer"
                  >
                    Mark as Fully Paid
                  </label>
                </div>

                <div className="border-b border-gray-400 py-0.5 dark:border-gray-500 mb-4 mt-2"></div>

                {/* ✅ Balance Amount */}
                <div className="flex justify-between items-center">
                  <span className="text-green-500">Balance Amount</span>
                  <span className="text-green-500">
                    ₹{balanceAmount.toFixed(2)}
                  </span>
                </div>

                <div className="border-b border-gray-400 py-0.5 dark:border-gray-500 mb-4 mt-4"></div>
              </div>{' '}
              {/* ✅ Background Container Ends Here */}
              <div className="flex justify-end items-center mt-4">
                <div className="text-right">
                  <p className="text-gray-700">
                    Authorized signatory for{' '}
                    <span className="font-bold">Business Name</span>
                  </p>
                  <div className="border-2 border border-blue-400 p-4 text-center text-blue-400 cursor-pointer mt-2">
                    <UploadSignature setSignatureUrl={setSignatureUrl} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-start gap-4">
            <button
              type="button"
              onClick={handleBack}
              className="rounded border border-blue-400 px-4 py-2 text-white bg-blue-500 dark:border-gray-600 dark:text-white dark:hover:bg-gray-700"
            >
              Back
            </button>
            <button
              onClick={handleSubmit}
              className={`bg-blue-500 text-white px-4 py-2 rounded flex items-center justify-center ${
                isSaving ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save ProformaInvoice'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditProformaInvoiceForm;
