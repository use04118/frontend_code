import React, { useState, useEffect, useRef } from 'react';
import Select from 'react-select';
import UploadSignature from './UploadSignature';

import { Trash2 } from 'lucide-react'; // Import delete icon
import { useNavigate } from 'react-router-dom';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { v4 as uuidv4 } from 'uuid';
import axios, { AxiosResponse } from 'axios';

// Interfaces
interface Party {
  id: string;
  party_name: string;
  mobile_number?: string;
  shipping_address?: string;
  state?: string;
  address?: {
    state?: string;
  };
  opening_balance?: number;
}

interface TaxRate {
  id: string;
  rate: number;
  description: string;
  cess_rate: number;
}

interface Item {
  id: string;
  type: 'item' | 'service';
  itemName?: string;
  serviceName?: string;
  hsnCode?: string;
  sacCode?: string;
  purchasePrice?: number;
  purchasePrice_with_tax?: number;
  purchasePrice_without_tax?: number;
  purchasePriceType?: string;
  gstTaxRate?: string;
  discount?: number;
}

interface SelectedItem extends Item {
  uid: string;
  quantity: number;
  price: number;
  taxId: string;
  tax: number;
  cessRate: number;
  taxAmount: number;
  sgst: number;
  cgst: number;
  igst: number;
  cessAmount: number;
  amount: number;
}

interface GroupedTax {
  igst: number;
  sgst: number;
  cgst: number;
  cessAmount: number;
  cessRate: number;
}

const CreatePurchaseOrderForm = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const [purchaseOrderNo, setPurchaseOrderNo] = useState<number>(1);
  const [orderDate, setOrderDate] = useState<Date>(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  }); // Default to today with time set to midnight
  const [dueDate, setDueDate] = useState<Date>(new Date()); // Default to today
  const [showNotesInput, setShowNotesInput] = useState<boolean>(false);
  const [notes, setNotes] = useState<string>('');
  const [showDiscountInput, setShowDiscountInput] = useState<boolean>(false);
  const [totalDiscount, setTotalDiscount] = useState<string>(''); // Store discount value
  const [paymentTerms, setPaymentTerms] = useState<number>(30);
  const [items, setItems] = useState<Item[]>([]); // Store fetched items
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]); // Store selected items
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [taxRates, setTaxRates] = useState<TaxRate[]>([]); // Store tax rates
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
  const [businessState, setBusinessState] = useState<string>('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [parties, setParties] = useState<Party[]>([]);

  // Create axios instance with default config
  const api = axios.create({
    baseURL: API_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Add request interceptor to add auth token
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  useEffect(() => {
    const fetchParties = async () => {
      try {
        const response: AxiosResponse<{ results: Party[] }> = await api.get(
          '/parties/parties/',
        );

        if (!response.data.results || !Array.isArray(response.data.results)) {
          throw new Error(
            'Invalid response format: Expected an array in "results"',
          );
        }

        const validParties = response.data.results.filter(
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
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
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
        const response: AxiosResponse<{ state: string }> = await api.get(
          '/sales/settings/tcs-tds/',
        );
        setBusinessState(response.data.state);
      } catch (error) {
        console.error('Error fetching TCS setting:', error);
      }
    };

    fetchTcsSetting();
  }, []);

  const filteredItems = items.filter((item) =>
    ((item.itemName || item.serviceName) ?? '')
      .toLowerCase()
      .includes(searchQuery.toLowerCase()),
  );

  // ✅ Handle checkbox selection
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

  // Custom format function to convert date to 'YYYY-MM-DD'
  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    let total = selectedItems.reduce(
      (sum, item) => sum + (Number(item.amount) || 0),
      0,
    ); // Fix NaN

    total -= (total * (Number(totalDiscount) || 0)) / 100; // Ensure Discount is Number

    setTotalAmount(Number(total.toFixed(2))); // Ensure valid total
  }, [selectedItems, totalDiscount]);

  useEffect(() => {
    const total = selectedItems.reduce(
      (sum, item) =>
        sum +
        item.price * item.quantity -
        (item.price * item.quantity * (item.discount ?? 0)) / 100,
      0,
    );
    setTaxableAmount(total);
  }, [selectedItems]);

  useEffect(() => {
    const updatedDueDate = new Date(orderDate);
    updatedDueDate.setDate(updatedDueDate.getDate() + paymentTerms); // Add days
    setDueDate(updatedDueDate);
  }, [orderDate, paymentTerms]);

  const fetchTaxRates = async () => {
    try {
      const response: AxiosResponse<{ results: TaxRate[] }> = await api.get(
        '/inventory/gst-tax-rates/',
      );
      if (Array.isArray(response.data.results)) {
        setTaxRates(response.data.results);
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
      const [itemsResponse, servicesResponse] = await Promise.all([
        api.get<{ results: Item[] }>('/inventory/items/'),
        api.get<{ results: Item[] }>('/inventory/service/'),
      ]);

      const allItems = [
        ...itemsResponse.data.results.map((item) => ({
          ...item,
          type: 'item' as const,
        })),
        ...servicesResponse.data.results.map((service) => ({
          ...service,
          type: 'service' as const,
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

  const handleQuantityChange = (uid: string, newQuantity: number) => {
    setSelectedItems((prevItems) =>
      prevItems.map((item) =>
        item.uid === uid
          ? {
              ...item,
              quantity: newQuantity,
              amount:
                newQuantity * (item.purchasePrice_with_tax ?? 0) -
                (newQuantity *
                  (item.purchasePrice_with_tax ?? 0) *
                  (item.discount ?? 0)) /
                  100,
            }
          : item,
      ),
    );
  };

  const handleSelectItem = (item: Item) => {
    const quantity = quantities[item.id] || 1;
    const price = item.purchasePrice_without_tax || item.purchasePrice || 0;
    const discount = item.discount || 0;

    // ✅ Select tax and cess rate using gstTaxRate ID
    const selectedTax = taxRates.find((tax) => tax.id === item.gstTaxRate);
    const tax = parseFloat(String(selectedTax?.rate ?? 0));
    const cess = parseFloat(String(selectedTax?.cess_rate ?? 0));

    const amount = item.purchasePrice_with_tax || item.purchasePrice || 0;
    console.log(`Tax: ${tax}, Cess: ${cess}`);

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
      taxId: item.gstTaxRate,
      tax,
      cessRate: cess,
      taxAmount,
      sgst,
      cgst,
      igst: 0,
      cessAmount,
      amount,
    };

    setSelectedItems([...selectedItems, selectedItem]);
    setShowModal(false);
  };

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
        const price = item.purchasePrice_without_tax || item.purchasePrice || 0;
        const discount = item.discount || 0;
        const amount = item.purchasePrice_with_tax || item.purchasePrice || 0;

        const selectedTax = taxRates.find((tax) => tax.id === item.gstTaxRate);
        const tax = parseFloat(String(selectedTax?.rate ?? 0));
        const cess = parseFloat(String(selectedTax?.cess_rate ?? 0));

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

    setSelectedItems(
      (prevItems) => [...prevItems, ...newSelectedItems] as SelectedItem[],
    );
    setShowModal(false);
    setSelectedItemIds([]);
    setSelectedQuantities({});
  };

  const handleDiscountChange = (uid: string, discountValue: string) => {
    const discount = discountValue === '' ? 0 : parseFloat(discountValue); // Empty string means no discount

    setSelectedItems((prevItems) =>
      prevItems.map((item) =>
        item.uid === uid
          ? {
              ...item,
              discount,
              amount:
                item.purchasePriceType === 'Without Tax'
                  ? (item.purchasePrice_without_tax ?? 0) *
                      (1 + item.tax / 100 + item.cessRate / 100) * // Applying GST and Cess
                      item.quantity -
                    ((item.purchasePrice_without_tax ?? 0) *
                      (1 + item.tax / 100 + item.cessRate / 100) *
                      item.quantity *
                      discount) /
                      100 // Apply discount after tax
                  : item.purchasePrice_with_tax * item.quantity -
                    (item.purchasePrice_with_tax * item.quantity * discount) /
                      100, // Discount on tax-inclusive price
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

  const handleTaxChange = (uid: string, newTaxRateID: string) => {
    const partyState =
      selectedParty?.state || selectedParty?.address?.state || '';
    const isSameState =
      businessState?.trim().toLowerCase() === partyState?.trim().toLowerCase();

    const selectedTax = taxRates.find((tax) => tax.id === newTaxRateID);

    const cessRate = parseFloat(String(selectedTax?.cess_rate ?? 0));
    const newTaxRate = parseFloat(String(selectedTax?.rate ?? 0));

    setSelectedItems((prevItems) =>
      prevItems.map((item) =>
        item.uid === uid
          ? (() => {
              const taxAmount = (item.purchasePrice * newTaxRate) / 100;
              const cessAmount = (item.purchasePrice * cessRate) / 100;
              const sgst = isSameState ? taxAmount / 2 : 0;
              const cgst = isSameState ? taxAmount / 2 : 0;
              const igst = !isSameState ? taxAmount : 0;

              const price =
                item.purchasePriceType === 'With Tax'
                  ? (item.purchasePrice_with_tax * 100) /
                    (100 + newTaxRate + cessRate)
                  : item.purchasePrice_without_tax;

              const baseAmount =
                item.purchasePriceType === 'Without Tax'
                  ? item.purchasePrice_without_tax *
                    (1 + newTaxRate / 100 + cessRate / 100) *
                    item.quantity
                  : item.purchasePrice_with_tax * item.quantity;

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
  }, {} as GroupedTax);

  const handleAddNewTcs = async () => {
    try {
      const response: AxiosResponse = await api.post('/sales/tcs/', {
        description: taxName,
        section: sectionName,
        rate: rate,
      });

      if (!response.ok) {
        throw new Error('Failed to add new TCS rate');
      }

      const newRate = await response.data;

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
      setAmountReceived(totalAmount); // Set total amount
    } else {
      setAmountReceived(0); // Reset if unchecked
    }
    setIsFullyPaid(!isFullyPaid);
  };

  const fetchNextInvoiceNumber = async () => {
    try {
      const response: AxiosResponse<{ next_purchase_order_number: number }> =
        await api.get('/purchase/purchaseorder/next-number/');

      const nextNumber = response.data.next_purchase_order_number;
      setPurchaseOrderNo(nextNumber);
      localStorage.setItem('purchaseOrderNo', nextNumber.toString());
    } catch (error) {
      console.error('Error fetching next invoice number:', error);
    }
  };

  useEffect(() => {
    fetchNextInvoiceNumber();
  }, []);

  const handleSaveOrder = async () => {
    if (!selectedParty) {
      alert('Please select a party before saving the order!');
      return;
    }

    setIsSaving(true); // Start loading

    // ✅ Extract only required fields from selectedItems
    const formattedItems = selectedItems.map((item) => ({
      service: item.type === 'service' ? item.id : null,
      item: item.type === 'item' ? item.id : null,
      gstTaxRate: item.taxId,
      quantity: item.quantity,
      discount: item.discount,
      /* sgst: item.sgst,        // ✅ SGST ko add kiya
           cgst: item.cgst,        // ✅ CGST ko add kiya
           cessAmount: item.cessAmount, */
    }));

    const orderData = {
      purchase_order_no: purchaseOrderNo,
      date: formatDate(orderDate),
      payment_term: paymentTerms,
      // due_date:dueDate,
      purchaseorder_items: formattedItems, // Array of items
      // taxableAmount,
      discount: totalDiscount,
      // total_amount: totalAmount,
      //amount_received: amountReceived,
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
      const response: AxiosResponse = await api.post(
        '/purchase/purchaseorder/',
        orderData,
      );

      if (response.status === 201 || response.status === 200) {
        alert('Order Saved Successfully!');
        console.log(response.data);
        fetchNextInvoiceNumber();
        navigate('/Purchase/Purchase-Orders');
      } else {
        alert('Failed to save order');
      }
    } catch (error) {
      console.error('Error saving order:', error);
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
      <Breadcrumb pageName="Purchase Orders" />
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
                  Purchase Order No:
                </label>
                <input
                  type="text"
                  value={purchaseOrderNo}
                  readOnly
                  className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white p-2 rounded"
                />
              </div>

              <div className="flex items-center space-x-2">
                <label className="w-40 text-gray-700 font-bold">
                  Purchase Order Date:
                </label>
                <DatePicker
                  selected={orderDate}
                  onChange={(date: Date) => {
                    const resetDate = resetTime(date);
                    setOrderDate(resetDate);
                  }}
                  className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white p-2 rounded"
                  dateFormat="yyyy-MM-dd"
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
                          handleTaxChange(item.uid, e.target.value)
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
              onClick={handleSaveOrder}
              className={`bg-blue-500 text-white px-4 py-2 rounded flex items-center justify-center ${
                isSaving ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Order'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
export default CreatePurchaseOrderForm;
