import React, { useState, useEffect, useRef } from 'react';
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import UploadSignature from './UploadSignature';
import { Trash2 } from 'lucide-react'; // Import delete icon
import { v4 as uuidv4 } from 'uuid';

const CreateCreditNoteForm = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const [creditNoteNo, setCreditNoteNo] = useState(1);
  const [invoiceDate, setCreditNoteDate] = useState(() => {
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
  const [signatureFile, setSignatureFile] = useState<File | null>(null);
  const [allInvoices, setAllInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [selectedItemIds, setSelectedItemIds] = useState([]); // ✅ Store selected item IDs
  const [selectedQuantities, setSelectedQuantities] = useState({});
  const generateUID = (item) => `${item.id}-${item.type}`;
  const [businessState, setBusinessState] = useState('');
  const [applyTcs, setApplyTcs] = useState(false);
  const [tcsRate, setTcsRate] = useState(1.0);
  const [tcsBasis, setTcsBasis] = useState('taxable');
  const [isTcsEnabled, setIsTcsEnabled] = useState<boolean>(false);
  const [tcsRates, setTcsRates] = useState<number[]>([]);
  const [showAddTcsModal, setShowAddTcsModal] = useState(false);
  const [taxName, setTaxName] = useState('');
  const [sectionName, setSectionName] = useState('');
  const [rate, setRate] = useState<number>(0);
  const [tcsAmount, setTcsAmount] = useState(0);
  const [selectedTcsRate, setSelectedTcsRate] = useState(null);
  const [bankAccounts, setBankAccounts] = useState([]);
  const [selectedBankAccountId, setSelectedBankAccountId] = useState('');
  const [showAddAccountModal, setShowAddAccountModal] = useState(false);
  const [accountName, setAccountName] = useState('');
  const [openingBalance, setOpeningBalance] = useState('');
  const [asOfDate, setAsOfDate] = useState('');
  const [showBankDetails, setShowBankDetails] = useState(false);
  const [bankAccountNumber, setBankAccountNumber] = useState('');
  const [reEnterBankAccountNumber, setReEnterBankAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [bankBranchName, setBankBranchName] = useState('');
  const [accountHolderName, setAccountHolderName] = useState('');
  const [upiId, setUpiId] = useState('');
  const [accountError, setAccountError] = useState(null);
  const dropdownRef = useRef(null);
  const [parties, setParties] = useState([]);

  const [returnData, setReturnData] = useState<{
    invoicen_no: string;
    date: string;
    invoice_items: {
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
    invoice_no: '',
    date: '',
    invoice_items: [],
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
        setIsTcsEnabled(data.tcs);
        setBusinessState(data?.state); // ✅ Save the state
      } catch (error) {
        console.error('Error fetching TCS setting:', error);
      }
    };

    fetchTcsSetting();
  }, []);

  useEffect(() => {
    const fetchTcsRates = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) throw new Error('Token not found');
        const response = await fetch(`${API_URL}/sales/tcs/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        // Suppose API gives: { rates: [1.0, 0.75, 0.5] }
        setTcsRates(data.results || []);
      } catch (error) {
        console.error('Error fetching TCS rates:', error);
      }
    };

    fetchTcsRates();
  }, []);

  const fetchReturnDetails = async (id) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${API_URL}/sales/salesreturn/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      // Set the fetched data into state
      const returnDate = data.date; // Assuming date is in 'YYYY-MM-DD' format from backend
      const paymentTerms = data.payment_term; // payment_term from the backend

      const amountReceived = data.amount_received;

      // Set the fetched values into the states
      setCreditNoteDate(returnDate);
      setPaymentTerms(paymentTerms);
      setAmountReceived(amountReceived);
      setSelectedPaymentMode(data.payment_method);
      if (data.payment_method !== 'Cash') {
        setSelectedBankAccountId(data.bank_account);
      }

      if (typeof data.discount === 'number' && data.discount !== 0) {
        setShowDiscountInput(true);
        setTotalDiscount(data.discount);
      } else {
        setShowDiscountInput(false);
        setTotalDiscount(0);
      }

      setReturnData((prevData) => ({
        ...prevData,
      }));

      // ✅ NEW: Handle TCS info if present
      if (data.tcs && data.apply_tcs) {
        setApplyTcs(true);

        // Find matching TCS rate object from tcsRates
        const matchedRate = tcsRates.find((rate) => rate.id === data.tcs);
        if (matchedRate) {
          setSelectedTcsRate(matchedRate);
        }

        // If tcs_basis (e.g., 'total' or 'taxable') is coming from backend
        if (data.tcs_on) {
          setTcsBasis(data.tcs_on);
        }
      }

      // Assuming the data includes 'return_items' array
      const returnItems = data.salesreturn_items.map((item) => {
        const quantity = parseFloat(item.quantity) || 1;
        const price = parseFloat(item.salesPrice_without_tax) || 0;
        const discount = parseFloat(item.discount || 0);

        // Select tax and cess rate using gstTaxRate ID
        // const selectedTax = taxRates.find((tax) => tax.id === item.gstTaxRate);
        const tax = parseFloat(item.tax_rate) || 0;
        const cess = parseFloat(item.cess_rate) || 0;
        const taxId = item.gstTaxRate;
        const amount = parseFloat(item.amount) || 0;
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
      setSelectedItems(returnItems);
      console.log(returnItems); // Log the data to inspect
    } catch (error) {
      console.error('Error fetching return details:', error);
    }
  };

  const fetchAllInvoices = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) throw new Error('Token not found');

      const response = await fetch(`${API_URL}/sales/salesreturn`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch invoices');

      const data = await response.json();
      setAllInvoices(data.results || []);
    } catch (error) {
      console.error('Error fetching invoices:', error);
    }
  };

  useEffect(() => {
    fetchAllInvoices();
  }, []);

  useEffect(() => {
    if (selectedParty) {
      const filteredData = allInvoices.filter(
        (invoice) => invoice.party === selectedParty.id,
      );
      console.log(filteredData);
      setFilteredInvoices(filteredData);
    } else {
      setFilteredInvoices([]);
    }
  }, [selectedParty, allInvoices]);

  useEffect(() => {
    if (selectedInvoice) {
      console.log('Selected Invoice:', selectedInvoice);
      fetchReturnDetails(selectedInvoice); // Pass the invoice ID directly
    }
  }, [selectedInvoice]);

  const balanceAmount = isFullyPaid ? 0 : totalAmount - amountReceived;
  const resetTime = (date) => {
    const reset = new Date(date);
    reset.setHours(0, 0, 0, 0); // Set the time to midnight
    return reset;
  };

  // Custom format function to convert date to 'YYYY-MM-DD'
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
    if (!applyTcs || !selectedTcsRate?.rate) {
      setTcsAmount(0);
      return;
    }

    const baseTotal = selectedItems.reduce((sum, item) => sum + item.amount, 0);
    const discountedBase = baseTotal - (baseTotal * (totalDiscount || 0)) / 100;

    const baseAmount = tcsBasis === 'total' ? discountedBase : taxableAmount;
    const calculatedTcs = (baseAmount * selectedTcsRate.rate) / 100;

    setTcsAmount(calculatedTcs);
  }, [
    applyTcs,
    selectedTcsRate,
    tcsBasis,
    selectedItems,
    totalDiscount,
    taxableAmount,
  ]);

  useEffect(() => {
    let total = selectedItems.reduce((sum, item) => sum + item.amount, 0);
    total -= (total * (totalDiscount || 0)) / 100;

    if (applyTcs && tcsBasis === 'total' && selectedTcsRate?.rate) {
      total += (total * selectedTcsRate.rate) / 100;
    }

    if (applyTcs && tcsBasis === 'taxable' && selectedTcsRate?.rate) {
      total += (taxableAmount * selectedTcsRate.rate) / 100;
    }

    setTotalAmount(total);
  }, [
    selectedItems,
    totalDiscount,
    applyTcs,
    tcsBasis,
    selectedTcsRate,
    taxableAmount,
  ]);

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
    const updatedDueDate = new Date(invoiceDate);
    updatedDueDate.setDate(updatedDueDate.getDate() + paymentTerms); // Add days
    setDueDate(updatedDueDate);
  }, [invoiceDate, paymentTerms]);

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
    const price = item.salesPrice_without_tax || item.salesPrice || 0;
    const discount = item.discount || 0;

    // ✅ Select tax and cess rate using gstTaxRate ID
    const selectedTax = taxRates.find((tax) => tax.id === item.gstTaxRate);
    const tax = parseFloat(selectedTax?.rate) || 0;
    const cess = parseFloat(selectedTax?.cess_rate) || 0;

    const amount = item.salesPrice_with_tax || item.salesPrice || 0;
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
    setShowModal(false);
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

  const handleAddNewTcs = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) throw new Error('Token not found');
      const response = await fetch(`${API_URL}/sales/tcs/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // ⬅️ if token needed
        },
        body: JSON.stringify({
          description: taxName,
          section: sectionName,
          rate: rate,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add new TCS rate');
      }

      const newRate = await response.json();

      // Update dropdown
      setTcsRates([...tcsRates, newRate]);
      setTcsRate(newRate.rate); // Optionally select new one
      setShowAddTcsModal(false); // Close modal

      // Reset form
      setTaxName('');
      setSectionName('');
      setRate(0);
    } catch (error) {
      console.error('Error:', error);
      // Optionally: show toast or error message to user
    }
  };

  const handleCheckboxChange = () => {
    if (!isFullyPaid) {
      setAmountReceived(Number(totalAmount.toFixed(2))); // Set total amount
    } else {
      setAmountReceived(0); // Reset if unchecked
    }
    setIsFullyPaid(!isFullyPaid);
  };

  const fetchNextInvoiceNumber = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${API_URL}/sales/creditnote/next-number/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        // Get the simple number directly

        const nextNumber = data.next_creditnote_number;
        setCreditNoteNo(nextNumber);
        console.log(creditNoteNo);
        localStorage.setItem('creditNoteNo', nextNumber.toString());
      }
    } catch (error) {
      console.error('Error fetching next invoice number:', error);
    }
  };

  useEffect(() => {
    fetchNextInvoiceNumber();
  }, []);

  const handleSaveCreditNote = async () => {
    if (!selectedParty) {
      alert('Please select a party before saving the invoice!');
      return;
    }

    setIsSaving(true); // Start loading

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

    const invoiceData = {
      credit_note_no: creditNoteNo,
      date: formatDate(invoiceDate),
      salesreturn_id: parseInt(selectedInvoice),

      // due_date:dueDate,
      creditnote_items: formattedItems, // Array of items
      // taxableAmount,
      discount: totalDiscount,
      // total_amount: totalAmount,
      amount_received: amountReceived,
      payment_method: selectedPaymentMode,
      bank_account:
        selectedPaymentMode !== 'Cash' ? selectedBankAccountId : null,
      is_fully_paid: isFullyPaid,
      // balance_amount: balanceAmount,
      notes,
      signature: signatureUrl, // Add signature URL here
      party: selectedParty.id,
      // termsConditions: [
      //   'Goods once sold will not be taken back or exchanged',
      //   'All disputes are subject to [ENTER_YOUR_CITY_NAME] jurisdiction only',
      // ],
      apply_tcs: applyTcs,
      tcs: applyTcs ? selectedTcsRate?.id : null, // send only if applyTcs is true
      tcs_on: applyTcs ? tcsBasis : 'total',
    };

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) throw new Error('Token not found');
      const response = await fetch(`${API_URL}/sales/creditnote/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(invoiceData),
      });

      if (response.ok) {
        const result = await response.json();
        alert('CreditNote Saved Successfully!');
        console.log(result);
        fetchNextInvoiceNumber();
        navigate('/Sales/Credit-Note');
        /*  if (amountReceived > 0) {
          const isCash = selectedPaymentMode === 'Cash';
          if (!isCash && !selectedBankAccountId) {
            alert('Please select a bank account for this payment mode.');
            setIsSaving(false);
            return;
          }
          const paymentPayload = {
            type: 'add',
            money_type: isCash ? 'Cash' : 'Bank',
            date: invoiceDate,
            amount: amountReceived,
            remarks: `Received for Sales Invoice #${creditNoteNo}`,
            ...(isCash ? {} : { account_id: selectedBankAccountId }),
          };

          await fetch(`${API_URL}/cash-bank/transactions/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(paymentPayload),
          });
          // Optionally: show a toast or refresh cash/bank dashboard
        } */
      } else {
        alert('Failed to save invoice');
      }
    } catch (error) {
      console.error('Error saving invoice:', error);
      alert('Something went wrong!');
    } finally {
      setIsSaving(false);
    }
  };

  const handleBack = () => {
    navigate(-1); // Navigates back to the previous page
  };

  useEffect(() => {
    const fetchBankAccounts = async () => {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${API_URL}/cash-bank/accounts/`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setBankAccounts(data.results || []);
    };
    fetchBankAccounts();
  }, []);

  return (
    <>
      <Breadcrumb pageName="Credit Notes" />
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
                  Credit Notes No:
                </label>
                <input
                  type="text"
                  value={creditNoteNo}
                  readOnly
                  className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white p-2 rounded"
                />
              </div>

              <div className="flex items-center space-x-2">
                <label className="w-40 text-gray-700 font-bold">
                  Credit Notes Date:
                </label>
                <DatePicker
                  selected={invoiceDate}
                  onChange={(date: Date) => {
                    const resetDate = resetTime(date);
                    setCreditNoteDate(resetDate);
                  }}
                  className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white p-2 rounded"
                  dateFormat="yyyy-MM-dd"
                />
              </div>

              <div className="flex items-center space-x-2">
                <label className="w-40 text-gray-700 font-bold">
                  Sale Return No:
                </label>
                <select
                  value={selectedInvoice}
                  onChange={(e) => setSelectedInvoice(e.target.value)}
                  className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white p-2 rounded"
                >
                  <option value="">Select Invoice</option>
                  {filteredInvoices.map((invoice) => (
                    <option key={invoice.id} value={invoice.id}>
                      {`Sales Return No :${invoice.salesreturn_no} (Balance: ${invoice.total_amount})`}
                    </option>
                  ))}
                </select>
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
                        value={item.discount || ''}
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
              <button
                className="text-blue-400 mt-4"
                type="button"
                onClick={() => setShowAddAccountModal(true)}
              >
                + Add New Account
              </button>
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

                {isTcsEnabled && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      {/* Apply TCS Checkbox */}
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="applyTcs"
                          checked={applyTcs}
                          onChange={(e) => setApplyTcs(e.target.checked)}
                          className="accent-purple-500 w-4 h-4"
                        />
                        <label
                          htmlFor="applyTcs"
                          className="text-gray-700 font-medium"
                        >
                          Apply TCS
                        </label>
                      </div>

                      {/* Amount + Dropdown */}
                      {applyTcs && (
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-700 font-medium">
                            ₹{tcsAmount.toFixed(2)}
                          </span>
                          <select
                            className="border border-gray-300 p-2 rounded dark:bg-gray-900 dark:text-white w-full max-w-xs "
                            value={
                              selectedTcsRate
                                ? JSON.stringify(selectedTcsRate)
                                : ''
                            }
                            onChange={(e) => {
                              if (e.target.value === 'add_new') {
                                setShowAddTcsModal(true);
                              } else {
                                setSelectedTcsRate(JSON.parse(e.target.value));
                              }
                            }}
                          >
                            <option value="" disabled hidden>
                              Select TCS Rate
                            </option>

                            {tcsRates.map((rate) => (
                              <option
                                key={rate.id}
                                value={JSON.stringify(rate)}
                              >
                                {rate.rate} % ({rate.description})
                              </option>
                            ))}

                            <option
                              value="add_new"
                              className="text-purple-600 font-semibold"
                            >
                              ➕ Add new TCS Rate
                            </option>
                          </select>
                        </div>
                      )}
                    </div>

                    {/* ✅ TCS Calculation Based On */}
                    {applyTcs && (
                      <div className="flex space-x-6 pl-6 mb-4">
                        <label className="flex items-center space-x-1 cursor-pointer">
                          <input
                            type="radio"
                            name="tcsBasis"
                            value="total"
                            checked={tcsBasis === 'total'}
                            onChange={() => setTcsBasis('total')}
                            className="accent-purple-500"
                          />
                          <span className="text-sm text-gray-700">
                            Total Amount
                          </span>
                        </label>
                        <label className="flex items-center space-x-1 cursor-pointer">
                          <input
                            type="radio"
                            name="tcsBasis"
                            value="taxable"
                            checked={tcsBasis === 'taxable'}
                            onChange={() => setTcsBasis('taxable')}
                            className="accent-purple-500"
                          />
                          <span className="text-sm text-gray-700">
                            Taxable Amount
                          </span>
                        </label>
                      </div>
                    )}
                  </div>
                )}

                <div className="border-b border-gray-400 py-0.5 dark:border-gray-500 mb-2"></div>

                {/* ✅ Total Amount */}
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-700 font-bold">Total Amount</span>
                  <span className="text-gray-700">
                    ₹{totalAmount.toFixed(2)}
                  </span>
                </div>

                <div className="border-b border-gray-400 py-0.5 dark:border-gray-500 mb-2"></div>

                {/* ✅ Amount Received */}
                <div className="flex flex-col space-y-2 sm:flex-row sm:justify-between sm:items-center">
                  <span className="text-gray-700">Amount Received</span>
                  <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-700 font-bold">₹</span>
                      <input
                        type="number"
                        value={amountReceived == 0 ? '' : amountReceived}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value);
                          if (!isNaN(value)) {
                            setAmountReceived(Number(value.toFixed(2))); // ✅ Round input to 2 decimal places
                          } else {
                            setAmountReceived('');
                          }
                        }}
                        className="border border-gray-700 dark:bg-gray-900 dark:text-white p-2 rounded w-24 text-right font-bold"
                        placeholder="0"
                        disabled={isFullyPaid}
                      />
                    </div>

                    {/* Payment Mode Dropdown */}
                    <select
                      className="border border-gray-300 p-2 rounded dark:bg-gray-900 dark:text-white"
                      value={selectedPaymentMode}
                      onChange={(e) => setSelectedPaymentMode(e.target.value)}
                    >
                      <option value="Cash">Cash</option>
                      <option value="Card">Card</option>
                      <option value="Bank Transfer">Bank Transfer</option>
                      <option value="Netbanking">Netbanking</option>
                      <option value="UPI">UPI</option>
                      <option value="Cheque">Cheque</option>
                    </select>

                    {/* Bank Account Dropdown */}
                    {selectedPaymentMode !== 'Cash' && (
                      <select
                        className="border border-gray-300 p-2 rounded dark:bg-gray-900 dark:text-white"
                        value={selectedBankAccountId}
                        onChange={(e) =>
                          setSelectedBankAccountId(e.target.value)
                        }
                      >
                        <option value="">Select Bank Account</option>
                        {bankAccounts
                          .filter((acc) => acc.account_type !== 'Cash') // Only show non-cash accounts
                          .map((acc) => (
                            <option key={acc.id} value={acc.id}>
                              {acc.account_name || acc.name} (₹
                              {acc.current_balance || acc.balance})
                            </option>
                          ))}
                      </select>
                    )}
                  </div>
                </div>

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
                    <UploadSignature
                      setSignatureUrl={setSignatureUrl}
                      setSignatureFile={setSignatureFile}
                    />
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
              onClick={handleSaveCreditNote}
              className={`bg-blue-500 text-white px-4 py-2 rounded flex items-center justify-center ${
                isSaving ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save CreditNote'}
            </button>
          </div>
        </div>
        {showAddTcsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-md w-[90%] max-w-md relative">
              <h2 className="text-lg font-bold mb-4">Add Tcs Rate</h2>
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                onClick={() => setShowAddTcsModal(false)}
              >
                ✕
              </button>

              {/* Modal Form */}
              <div className="flex flex-col gap-3">
                <input
                  type="text"
                  placeholder="Enter Tax Name"
                  className="border px-3 py-2 rounded"
                  value={taxName}
                  onChange={(e) => setTaxName(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Enter Section Name"
                  className="border px-3 py-2 rounded"
                  value={sectionName}
                  onChange={(e) => setSectionName(e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Enter Rate (%)"
                  className="border px-3 py-2 rounded"
                  value={rate}
                  onChange={(e) => setRate(Number(e.target.value))}
                />
              </div>

              <div className="flex justify-end mt-4">
                <button
                  onClick={() => setShowAddTcsModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded mr-2"
                >
                  Close
                </button>
                <button
                  onClick={handleAddNewTcs}
                  className="px-4 py-2 bg-purple-600 text-white rounded disabled:opacity-50"
                  disabled={!taxName || !sectionName || rate <= 0}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
        {showAddAccountModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 mt-20 p-4">
            <div className="bg-white dark:bg-gray-800 w-full max-w-2xl rounded-lg shadow-lg p-4 relative max-h-[85vh] overflow-y-auto">
              <div className="flex justify-between items-center border-b pb-4 mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Add Bank Account
                </h2>
                <button
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-400"
                  onClick={() => setShowAddAccountModal(false)}
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  setAccountError(null);
                  const token = localStorage.getItem('accessToken');
                  const payload = {
                    account_name: accountName,
                    account_type: 'Bank',
                    opening_balance: openingBalance,
                    as_of_date: asOfDate,
                  };
                  if (showBankDetails) {
                    if (bankAccountNumber)
                      payload.bank_account_number = bankAccountNumber;
                    if (ifscCode) payload.ifsc_code = ifscCode;
                    if (bankBranchName)
                      payload.bank_branch_name = bankBranchName;
                    if (accountHolderName)
                      payload.account_holder_name = accountHolderName;
                    if (upiId) payload.upi_id = upiId;
                  }
                  try {
                    const res = await fetch(`${API_URL}/cash-bank/accounts/`, {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                      },
                      body: JSON.stringify(payload),
                    });
                    if (res.ok) {
                      const newAccount = await res.json();
                      setBankAccounts((prev) => [...prev, newAccount]);
                      setShowAddAccountModal(false);
                      setAccountName('');
                      setOpeningBalance('');
                      setAsOfDate('');
                      setShowBankDetails(false);
                      setBankAccountNumber('');
                      setReEnterBankAccountNumber('');
                      setIfscCode('');
                      setBankBranchName('');
                      setAccountHolderName('');
                      setUpiId('');
                    } else {
                      const err = await res.json();
                      setAccountError(
                        typeof err === 'object' && err !== null
                          ? Object.values(err).flat().join('\n')
                          : 'Failed to save account',
                      );
                    }
                  } catch (error) {
                    setAccountError('Error: ' + error.message);
                  }
                }}
              >
                {/* Account Name */}
                <div className="mb-4">
                  <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                    Account Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                    placeholder="ex: Personal Account"
                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                    required
                  />
                </div>
                {/* Opening Balance & As of Date */}
                <div className="flex flex-col md:flex-row md:space-x-4 mb-4">
                  <div className="w-full md:w-1/2 mb-4 md:mb-0">
                    <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                      Opening Balance
                    </label>
                    <div className="flex items-center border rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600">
                      <span className="text-gray-500 dark:text-gray-300">
                        ₹
                      </span>
                      <input
                        type="text"
                        value={openingBalance}
                        onChange={(e) => setOpeningBalance(e.target.value)}
                        placeholder="ex: ₹10,000"
                        className="w-full focus:outline-none focus:ring-2 focus:ring-blue-500 ml-2 dark:bg-gray-700 dark:text-gray-300"
                      />
                    </div>
                  </div>
                  <div className="w-full md:w-1/2">
                    <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                      As of Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={asOfDate}
                      onChange={(e) => setAsOfDate(e.target.value)}
                      className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-300"
                      required
                    />
                  </div>
                </div>
                {/* Add Bank Details Toggle */}
                <div className="flex justify-between items-center border-b pb-4 mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    Add Bank Details
                  </h2>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={showBankDetails}
                      onChange={() => setShowBankDetails(!showBankDetails)}
                    />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                {/* Bank Detail Fields - conditional render */}
                {showBankDetails && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                        Bank Account Number{' '}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={bankAccountNumber}
                        onChange={(e) => setBankAccountNumber(e.target.value)}
                        placeholder="ex: 123456789157950"
                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                        Re-Enter Bank Account Number{' '}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={reEnterBankAccountNumber}
                        onChange={(e) =>
                          setReEnterBankAccountNumber(e.target.value)
                        }
                        placeholder="ex: 123456789157950"
                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                        IFSC Code <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={ifscCode}
                        onChange={(e) => setIfscCode(e.target.value)}
                        placeholder="ex: HDFC000075"
                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                        Bank & Branch Name{' '}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={bankBranchName}
                        onChange={(e) => setBankBranchName(e.target.value)}
                        placeholder="ex: HDFC, Old Madras"
                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                        Account Holders Name{' '}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={accountHolderName}
                        onChange={(e) => setAccountHolderName(e.target.value)}
                        placeholder="ex: Elisa wolf"
                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                        UPI ID
                      </label>
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="ex: elisa@okhdfc"
                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                      />
                    </div>
                  </div>
                )}
                {/* Action Buttons */}
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowAddAccountModal(false)}
                    className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Submit
                  </button>
                </div>
                {accountError && (
                  <div className="mb-4 text-red-600 font-medium">
                    {accountError}
                  </div>
                )}
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CreateCreditNoteForm;
