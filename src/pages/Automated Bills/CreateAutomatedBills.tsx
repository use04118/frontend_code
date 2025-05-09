import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import CreatePartyDropdown from '../Sales/SalesInvoiceComponent/CreatePartyDropdown';
import UploadSignature from '../Sales/SalesInvoiceComponent/UploadSignature';
import { Trash2 } from 'lucide-react'; // Import delete icon
import axios from 'axios'; // ✅ Axios import
import Select from 'react-select';

// TypeScript interfaces
interface Item {
  id: number;
  type: 'item' | 'service';
  itemName?: string;
  serviceName?: string;
  hsnCode?: string;
  sacCode?: string;
  salesPrice?: number;
  salesPrice_with_tax?: number;
  salesPrice_without_tax?: number;
  purchasePrice?: number;
  purchasePrice_with_tax?: number;
  gstTaxRate?: number;
  discount?: number;
  salesPriceType?: 'With Tax' | 'Without Tax';
  [key: string]: any;
}

interface TaxRate {
  id: number;
  rate: string;
  cess_rate: string;
  description: string;
}

interface SelectedItem extends Item {
  uid: string;
  quantity: number;
  price: number;
  discount: number;
  taxId: number;
  tax: number;
  cessRate: number;
  taxAmount: number;
  sgst: number;
  cgst: number;
  cessAmount: number;
  amount: number;
}

interface Party {
  id: number;
  [key: string]: any;
}

const CreateAutomatedBills: React.FC = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const [salesInvoiceNo, setSalesInvoiceNo] = useState<number>(1);
  const [invoiceDate, setInvoiceDate] = useState<Date>(new Date()); // Default to today
  const [dueDate, setDueDate] = useState<Date>(new Date()); // Default to today
  const [showNotesInput, setShowNotesInput] = useState<boolean>(false);
  const [notes, setNotes] = useState<string>('');
  const [showDiscountInput, setShowDiscountInput] = useState<boolean>(false);
  const [totalDiscount, setTotalDiscount] = useState<string>(''); // Store discount value
  const [items, setItems] = useState<Item[]>([]);
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [taxRates, setTaxRates] = useState<TaxRate[]>([]);
  const [amountReceived, setAmountReceived] = useState<number>(0);
  const [isFullyPaid, setIsFullyPaid] = useState<boolean>(false);
  const [taxableAmount, setTaxableAmount] = useState<number>(0);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [selectedParty, setSelectedParty] = useState<Party | null>(null);
  const [signatureUrl, setSignatureUrl] = useState<string | null>(null);
  const [selectedPaymentMode, setSelectedPaymentMode] =
    useState<string>('Cash');
  const [showModal, setShowModal] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [signatureFile, setSignatureFile] = useState<File | null>(null);
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]); // ✅ Store selected item IDs
  const [selectedQuantities, setSelectedQuantities] = useState<{
    [key: string]: number;
  }>({});
  const generateUID = (item: Item) => `${item.id}-${item.type}`;
  const [repeatValue, setRepeatValue] = useState<number>(1); // number
  const [repeatUnit, setRepeatUnit] = useState<'Weeks' | 'Days' | 'Months'>(
    'Weeks',
  ); // "Days" | "Weeks" | "Months"
  const [showPartyDropdown, setShowPartyDropdown] = useState(false);
  const [partyList, setPartyList] = useState([]);
  const partyDropdownRef = useRef(null);
  const dropdownRef = useRef(null);
  const [parties, setParties] = useState([]);

  const filteredItems = items.filter((item) =>
    (item.itemName || item.serviceName || '')
      .toLowerCase()
      .includes(searchQuery.toLowerCase()),
  );

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

  // ✅ Handle checkbox selection
  const handleToggleItem = (itemId: string) => {
    setSelectedItemIds((prevSelected) =>
      prevSelected.includes(itemId)
        ? prevSelected.filter((id) => id !== itemId)
        : [...prevSelected, itemId],
    );
  };

  const balanceAmount = isFullyPaid ? 0 : totalAmount - amountReceived;
  const resetTime = (date: Date) => {
    const reset = new Date(date);
    reset.setHours(0, 0, 0, 0); // Set the time to midnight
    return reset;
  };

  const [startDate, setStartDate] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split('T')[0]; // Format: YYYY-MM-DD
  });

  const [paymentTerms, setPaymentTerms] = useState<number>(30); // default 30 days
  const [endDate, setEndDate] = useState<string>('');

  // Update endDate when startDate or paymentTerms change
  useEffect(() => {
    const newStartDate = new Date(startDate);
    newStartDate.setDate(newStartDate.getDate() + Number(paymentTerms));
    setEndDate(newStartDate.toISOString().split('T')[0]); // format YYYY-MM-DD
  }, [startDate, paymentTerms]);

  // Custom format function to convert date to 'YYYY-MM-DD'
  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Add leading zero for months < 10
    const day = String(date.getDate()).padStart(2, '0'); // Add leading zero for days < 10
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    let total = selectedItems.reduce((sum, item) => sum + item.amount, 0);
    total -= (total * (parseFloat(totalDiscount) || 0)) / 100;
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
    const updatedDueDate = new Date(invoiceDate);
    updatedDueDate.setDate(updatedDueDate.getDate() + paymentTerms); // Add days
    setDueDate(updatedDueDate);
  }, [invoiceDate, paymentTerms]);

  const fetchTaxRates = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) throw new Error('Token not found');

      const response = await axios.get<{ results: TaxRate[] }>(
        `${API_URL}/inventory/gst-tax-rates/`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (Array.isArray(response.data.results)) {
        setTaxRates(response.data.results);
      } else {
        throw new Error('Invalid tax data format');
      }
    } catch (error) {
      console.error('Error fetching tax rates:', error);
      setTaxRates([]);
    }
  };

  useEffect(() => {
    fetchTaxRates();
  }, []);

  const fetchItems = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) throw new Error('Token not found');

      const [itemsResponse, servicesResponse] = await Promise.all([
        axios.get<{ results: Item[] }>(`${API_URL}/inventory/items/`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }),
        axios.get<{ results: Item[] }>(`${API_URL}/inventory/service/`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }),
      ]);

      const allItems: Item[] = [
        ...itemsResponse.data.results.map((item) => ({
          ...item,
          type: 'item',
        })),
        ...servicesResponse.data.results.map((service) => ({
          ...service,
          type: 'service',
        })),
      ];

      setItems(allItems);
    } catch (error) {
      console.error('Error fetching items:', error);
      setItems([]);
    }
  };

  const handleAddItemClick = () => {
    setShowModal(true);
    if (!items.length) fetchItems(); // API call only if items are not fetched
  };

  const handleQuantityChange = (uid: string, newQuantity: number) => {
    setSelectedItems((prevItems) =>
      prevItems.map((item) =>
        item.uid === uid
          ? {
              ...item,
              quantity: newQuantity,
              amount:
                newQuantity * (item.salesPrice_with_tax || 0) -
                (newQuantity *
                  (item.salesPrice_with_tax || 0) *
                  (item.discount || 0)) /
                  100,
            }
          : item,
      ),
    );
  };

  const handleSelectItem = (item: Item) => {
    const quantity = quantities[item.id] || 1;
    const price = item.salesPrice_without_tax || item.salesPrice || 0;
    const discount = item.discount || 0;
    const selectedTax = taxRates.find((tax) => tax.id === item.gstTaxRate);
    const tax = parseFloat(selectedTax?.rate || '0');
    const cess = parseFloat(selectedTax?.cess_rate || '0');
    const amount = item.salesPrice_with_tax || item.salesPrice || 0;
    const taxAmount = (price * tax) / 100;
    const cessAmount = (price * cess) / 100;
    const sgst = taxAmount / 2;
    const cgst = taxAmount / 2;

    const selectedItem: SelectedItem = {
      ...item,
      uid: `${item.id}-${Date.now()}-${Math.random()}`,
      quantity,
      price,
      discount,
      taxId: item.gstTaxRate || 0,
      tax,
      cessRate: cess,
      taxAmount,
      sgst,
      cgst,
      cessAmount,
      amount,
    };

    setSelectedItems([...selectedItems, selectedItem]);
    setShowModal(false);
  };

  const handleConfirmSelection = () => {
    if (selectedItemIds.length === 0) return;

    const newSelectedItems: SelectedItem[] = items
      .filter((item) => selectedItemIds.includes(`${item.id}-${item.type}`))
      .map((item) => {
        const quantity = selectedQuantities[`${item.id}-${item.type}`] || 1;
        const price = item.salesPrice_without_tax || item.salesPrice || 0;
        const discount = item.discount || 0;
        const amount =
          (item.salesPrice_with_tax || item.salesPrice || 0) * quantity;
        const selectedTax = taxRates.find((tax) => tax.id === item.gstTaxRate);
        const tax = parseFloat(selectedTax?.rate || '0');
        const cess = parseFloat(selectedTax?.cess_rate || '0');
        const taxAmount = (price * tax) / 100;
        const cessAmount = (price * cess) / 100;
        const sgst = taxAmount / 2;
        const cgst = taxAmount / 2;

        return {
          ...item,
          uid: generateUID(item),
          quantity,
          price,
          discount,
          taxId: item.gstTaxRate || 0,
          tax,
          cessRate: cess,
          taxAmount,
          sgst,
          cgst,
          cessAmount,
          amount,
        };
      });

    setSelectedItems((prevItems) => [...prevItems, ...newSelectedItems]);
    setShowModal(false);
    setSelectedItemIds([]);
    setSelectedQuantities({});
  };

  const handleDiscountChange = (uid: string, discountValue: string) => {
    const discount = discountValue === '' ? 0 : parseFloat(discountValue);

    setSelectedItems((prevItems) =>
      prevItems.map((item) =>
        item.uid === uid
          ? {
              ...item,
              discount,
              amount:
                item.salesPriceType === 'Without Tax'
                  ? (item.salesPrice_without_tax || 0) *
                      (1 + item.tax / 100 + item.cessRate / 100) *
                      item.quantity -
                    ((item.salesPrice_without_tax || 0) *
                      (1 + item.tax / 100 + item.cessRate / 100) *
                      item.quantity *
                      discount) /
                      100
                  : (item.salesPrice_with_tax || 0) * item.quantity -
                    ((item.salesPrice_with_tax || 0) *
                      item.quantity *
                      discount) /
                      100,
            }
          : item,
      ),
    );
  };

  const handleDeleteItem = (uid: string) => {
    setSelectedItems((prevItems) =>
      prevItems.filter((item) => item.uid !== uid),
    );
  };

  const handleTaxChange = (uid: string, newTaxRateID: number) => {
    const selectedTax = taxRates.find((tax) => tax.id === newTaxRateID);
    const cessRate = parseFloat(selectedTax?.cess_rate || '0');
    const newTaxRate = parseFloat(selectedTax?.rate || '0');

    setSelectedItems((prevItems) =>
      prevItems.map((item) =>
        item.uid === uid
          ? {
              ...item,
              taxId: newTaxRateID,
              tax: newTaxRate,
              cessRate,
              taxAmount: ((item.salesPrice || 0) * newTaxRate) / 100,
              sgst: ((item.salesPrice || 0) * newTaxRate) / 200,
              cgst: ((item.salesPrice || 0) * newTaxRate) / 200,
              cessAmount: ((item.salesPrice || 0) * cessRate) / 100,
              price:
                item.salesPriceType === 'With Tax'
                  ? ((item.salesPrice_with_tax || 0) * 100) /
                    (100 + newTaxRate + cessRate)
                  : item.salesPrice_without_tax || 0,
              amount:
                item.salesPriceType === 'Without Tax'
                  ? (item.salesPrice_without_tax || 0) *
                      (1 + newTaxRate / 100 + cessRate / 100) *
                      item.quantity -
                    ((item.salesPrice_without_tax || 0) *
                      (1 + newTaxRate / 100 + cessRate / 100) *
                      item.quantity *
                      item.discount) /
                      100
                  : (item.salesPrice_with_tax || 0) * item.quantity -
                    ((item.salesPrice_with_tax || 0) *
                      item.quantity *
                      item.discount) /
                      100,
            }
          : item,
      ),
    );
  };

  const groupedTaxes = selectedItems.reduce((acc: any, item) => {
    const totalAmount = item.price * item.quantity;
    if (!acc[item.tax]) {
      acc[item.tax] = {
        sgst: 0,
        cgst: 0,
        cessAmount: 0,
        cessRate: item.cessRate,
      };
    }
    acc[item.tax].sgst += (totalAmount * item.tax) / 200;
    acc[item.tax].cgst += (totalAmount * item.tax) / 200;
    acc[item.tax].cessAmount += (totalAmount * item.cessRate) / 100;
    return acc;
  }, {});

  const handleCheckboxChange = () => {
    if (!isFullyPaid) {
      setAmountReceived(totalAmount);
    } else {
      setAmountReceived(0);
    }
    setIsFullyPaid(!isFullyPaid);
  };

  useEffect(() => {
    const savedInvoiceNo = localStorage.getItem('salesInvoiceNo');
    if (savedInvoiceNo) {
      setSalesInvoiceNo(parseInt(savedInvoiceNo));
    }
  }, []);

  const handleSaveInvoice = async () => {
    if (!selectedParty) {
      alert('Please select a party before saving the invoice!');
      return;
    }

    setIsSaving(true);

    const formattedItems = selectedItems.map((item) => ({
      service: item.type === 'service' ? item.id : null,
      item: item.type === 'item' ? item.id : null,
      gstTaxRate: item.taxId,
      quantity: item.quantity,
      discount: item.discount,
    }));

    const invoiceData = {
      automated_invoice_no: salesInvoiceNo,
      date: invoiceDate,
      start_date: startDate,
      end_date: endDate,
      repeat_every: repeatValue,
      repeat_unit: repeatUnit,
      payment_term: paymentTerms,
      automatedinvoice_items: formattedItems,
      discount: totalDiscount ? parseFloat(totalDiscount) : 0.0,
      amount_received: amountReceived,
      payment_method: selectedPaymentMode,
      is_fully_paid: isFullyPaid,
      notes,
      signature: signatureUrl,
      party: selectedParty.id,
    };

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) throw new Error('Token not found');
      const response = await axios.post(
        `${API_URL}/automated-bills/automated-invoices/`,
        invoiceData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.status === 200 || response.status === 201) {
        const result = response.data;
        alert('Invoice Saved Successfully!');
        const newInvoiceNo = salesInvoiceNo + 1;
        setSalesInvoiceNo(newInvoiceNo);
        localStorage.setItem('salesInvoiceNo', newInvoiceNo.toString());
        navigate('/Automated-Bills');
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
    navigate(-1);
  };

  return (
    <>
      <Breadcrumb pageName="Create Automated Bills" />
      <div className="p-4 md:p-6 bg-white dark:bg-gray-900 shadow rounded-md w-full">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
          Schedule Details
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          {/* Start Date */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
              Start Date:
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-3 py-2 border dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* End Date */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
              End Date:
            </label>
            <input
              type="date"
              value={endDate}
              readOnly
              className="px-3 py-2 border dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Repeat Every */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
              Repeat Every:
            </label>
            <div className="flex">
              <input
                type="number"
                value={repeatValue}
                onChange={(e) => setRepeatValue(e.target.value)}
                className="w-1/2 px-3 py-2 border dark:border-gray-700 rounded-l-md bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                defaultValue={1}
                min={1}
              />
              <select
                value={repeatUnit}
                onChange={(e) =>
                  setRepeatUnit(e.target.value as 'Weeks' | 'Days' | 'Months')
                }
                className="w-1/2 px-2 py-2 border-t border-b border-r dark:border-gray-700 rounded-r-md bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none"
              >
                <option>Weeks</option>
                <option>Days</option>
                <option>Months</option>
              </select>
            </div>
          </div>

          {/* Payment Terms */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
              Payment Terms:
            </label>
            <div className="flex">
              <input
                type="number"
                value={paymentTerms}
                onChange={(e) => setPaymentTerms(e.target.value)}
                className="w-2/3 px-3 py-2 border dark:border-gray-700 rounded-l-md bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                min={0}
              />
              <span className="w-1/3 flex items-center justify-center bg-gray-100 dark:bg-gray-700 border-t border-b border-r dark:border-gray-700 rounded-r-md text-gray-800 dark:text-gray-200">
                Days
              </span>
            </div>
          </div>

          {/* Right Side Icon */}
          <div className="hidden md:flex justify-center items-center">
            <div className="flex flex-col items-center">
              <img
                src="https://cdn-icons-png.flaticon.com/512/4712/4712037.png"
                alt="Auto Send"
                className="w-14 h-14 mb-2 dark:invert"
              />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Auto Send
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full min-w-0 bg-gray-100 dark:bg-gray-900 p-2">
        <div className="w-full mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
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

                {/* ✅ Amount Received */}
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Amount Received</span>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-700 font-bold">₹</span>
                      <input
                        type="number"
                        value={amountReceived == 0 ? '' : amountReceived}
                        onChange={(e) =>
                          setAmountReceived(Number(e.target.value))
                        }
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
                      <option value="Upi">UPI</option>
                      <option value="Cheque">Cheque</option>
                    </select>
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
              onClick={handleSaveInvoice}
              className={`bg-blue-500 text-white px-4 py-2 rounded flex items-center justify-center ${
                isSaving ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Invoice'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateAutomatedBills;
