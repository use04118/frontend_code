import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { Trash2 } from 'lucide-react'; // Import delete icon
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// TypeScript interfaces
interface Category {
  id: number;
  name: string;
}
interface Party {
  id: number;
  party_name: string;
}
interface TaxRate {
  id: number;
  rate: string;
  cess_rate: string;
  description: string;
}
interface Item {
  id: number;
  itemName?: string;
  serviceName?: string;
  type: 'item' | 'service';
  purchasePrice?: number;
  purchasePrice_with_tax?: number;
  purchasePrice_without_tax?: number;
  discount?: number;
  gstTaxRate?: number;
  hsnCode?: string;
  sacCode?: string;
  unit?: string;
  [key: string]: any;
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
  purchasePriceType?: 'With Tax' | 'Without Tax';
}

const CreateExpenseForm = () => {
  const API_URL = import.meta.env.VITE_API_URL;
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
  const [selectedPaymentMode, setSelectedPaymentMode] = useState<string>('Cash');
  const [showModal, setShowModal] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [signatureFile, setSignatureFile] = useState<File | null>(null);
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]); // ✅ Store selected item IDs
  const [selectedQuantities, setSelectedQuantities] = useState<{ [key: string]: number }>({});
  const generateUID = (item: Item) => `${item.id}-${item.type}`;
  const [withGst, setWithGst] = useState<boolean>(false);
  const [parties, setParties] = useState<Party[]>([]);
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [isCreatingCategory, setIsCreatingCategory] = useState<boolean>(false);
  const [newCategory, setNewCategory] = useState<string>('');
  const [partyCategory, setPartyCategory] = useState<string | number>('');
  const [expenseNo, setExpenseNo] = useState<number>(1);
  const [originalInvoiceNumber, setOriginalInvoiceNumber] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');

  const filteredItems = items.filter((item) =>
    (item.itemName || item.serviceName || '').toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // ✅ Handle checkbox selection
  const handleToggleItem = (itemId: string) => {
    setSelectedItemIds((prevSelected) =>
      prevSelected.includes(itemId)
        ? prevSelected.filter((id) => id !== itemId)
        : [...prevSelected, itemId],
    );
  };

  const balanceAmount = isFullyPaid ? 0 : totalAmount - amountReceived;
  /*  const resetTime = (date) => {
    const reset = new Date(date);
    reset.setHours(0, 0, 0, 0); // Set the time to midnight
    return reset;
  }; */

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

  const totalExpenseAmount = selectedItems.reduce(
    (total, item) => total + item.amount * item.quantity,
    0,
  );

  /*  useEffect(() => {
    const updatedDueDate = new Date(invoiceDate);
    updatedDueDate.setDate(updatedDueDate.getDate() + paymentTerms); // Add days
    setDueDate(updatedDueDate);
  }, [invoiceDate, paymentTerms]); */

  useEffect(() => {
    const today = new Date();
    const formatted = today.toISOString().split('T')[0]; // "YYYY-MM-DD"
    setCurrentDate(formatted);
  }, []);

  const fetchTaxRates = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) throw new Error('Token not found');
      const response = await axios.get(`${API_URL}/inventory/gst-tax-rates/`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
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
      const token = localStorage.getItem('accessToken');
      if (!token) throw new Error('Token not found');

      // Fetch items and services concurrently
      const [itemsResponse, servicesResponse] = await Promise.all([
        axios.get(`${API_URL}/expenses/items/`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }),
        axios.get(`${API_URL}/expenses/services/`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }),
      ]);

      // Convert responses to JSON
      const itemsData = itemsResponse.data;
      const servicesData = servicesResponse.data;

      // Combine fetched items and services
      const allItems: Item[] = [
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

  const handleQuantityChange = (uid: string, newQuantity: number) => {
    setSelectedItems((prevItems) =>
      prevItems.map((item) =>
        item.uid === uid
          ? {
              ...item,
              quantity: newQuantity,
              amount:
                newQuantity * (item.purchasePrice_with_tax ?? item.purchasePrice ?? 0) -
                (newQuantity * (item.purchasePrice_with_tax ?? item.purchasePrice ?? 0) * item.discount) /
                  100,
            }
          : item,
      ),
    );
  };

  const handleSelectItem = (item: Item) => {
    const quantity = quantities[item.id] || 1;
    const price = item.purchasePrice_without_tax ?? item.purchasePrice ?? 0;
    const discount = item.discount ?? 0;

    // ✅ Select tax and cess rate using gstTaxRate ID
    const selectedTax = taxRates.find((tax) => tax.id === item.gstTaxRate);
    const tax = parseFloat(selectedTax?.rate ?? '0');
    const cess = parseFloat(selectedTax?.cess_rate ?? '0');

    const amount = item.purchasePrice_with_tax ?? item.purchasePrice ?? 0;
    console.log(`Tax: ${tax}, Cess: ${cess}`);

    const taxAmount = (price * tax) / 100;
    const cessAmount = (price * cess) / 100;
    const sgst = taxAmount / 2;
    const cgst = taxAmount / 2;

    const selectedItem: SelectedItem = {
      ...item,
      uid: `${item.id}-${Date.now()}-${Math.random()}`, // UNIQUE ID FOR EVERY ROW
      quantity,
      price,
      discount,
      taxId: item.gstTaxRate ?? 0, // ✅ Store tax ID
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

  const handleConfirmSelection = () => {
    if (selectedItemIds.length === 0) return;

    const newSelectedItems: SelectedItem[] = items
      .filter((item) => selectedItemIds.includes(`${item.id}-${item.type}`))
      .map((item) => {
        const quantity = selectedQuantities[`${item.id}-${item.type}`] || 1; // ✅ selectedQuantities ka use kiya
        const price = item.purchasePrice_without_tax ?? item.purchasePrice ?? 0;
        const discount = item.discount ?? 0;
        const amount = item.purchasePrice_with_tax ?? item.purchasePrice ?? 0;
        const selectedTax = taxRates.find((tax) => tax.id === item.gstTaxRate);
        const tax = parseFloat(selectedTax?.rate ?? '0');
        const cess = parseFloat(selectedTax?.cess_rate ?? '0');

        const taxAmount = (price * tax) / 100;
        const cessAmount = (price * cess) / 100;
        const sgst = taxAmount / 2;
        const cgst = taxAmount / 2;

        return {
          ...item,
          uid: generateUID(item),
          quantity, // ✅ Modal me enter ki gayi quantity store ho rahi hai
          price,
          discount,
          taxId: item.gstTaxRate ?? 0,
          tax,
          cessRate: cess,
          taxAmount,
          sgst,
          cgst,
          cessAmount,
          amount: amount * quantity,
        };
      });

    setSelectedItems((prevItems) => [...prevItems, ...newSelectedItems]);
    setShowModal(false);
    setSelectedItemIds([]);
    setSelectedQuantities({}); // ✅ selectedQuantities reset kiya
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
                  : (item.purchasePrice_with_tax ?? 0) * item.quantity -
                    ((item.purchasePrice_with_tax ?? 0) * item.quantity * discount) /
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

  const handleTaxChange = (uid: string, newTaxRateID: number) => {
    console.log(newTaxRateID);

    // Find the selected tax rate
    const selectedTax = taxRates.find((tax) => {
      console.log(tax.id, '----', newTaxRateID);
      return tax.id === newTaxRateID;
    });

    // Extract the new GST and Cess rates
    const cessRate = parseFloat(selectedTax?.cess_rate ?? '0'); // Fetch Cess rate
    const newTaxRate = parseFloat(selectedTax?.rate ?? '0'); // Fetch GST rate
    console.log(`Selected Tax: ${newTaxRate}%, Cess: ${cessRate}%`);

    // Update the selected items with the new tax information
    setSelectedItems((prevItems) =>
      prevItems.map((item) =>
        item.uid === uid
          ? {
              ...item,
              taxId: newTaxRateID,
              tax: newTaxRate, // Update GST tax
              cessRate, // Store Cess rate
              taxAmount: (item.purchasePrice ?? 0) * newTaxRate / 100, // GST per item
              sgst: (item.purchasePrice ?? 0) * newTaxRate / 200, // Half of GST (SGST)
              cgst: (item.purchasePrice ?? 0) * newTaxRate / 200, // Half of GST (CGST)
              cessAmount: (item.purchasePrice ?? 0) * cessRate / 100, // Cess calculation

              // Update price and amount based on the purchasePriceType
              price:
                item.purchasePriceType === 'With Tax'
                  ? ((item.purchasePrice_with_tax ?? 0) * 100) /
                    (100 + newTaxRate + cessRate) // Extract price from tax-inclusive price
                  : item.purchasePrice_without_tax ?? 0, // Keep the price as is if it's "Without Tax"

              amount:
                item.purchasePriceType === 'Without Tax'
                  ? (item.purchasePrice_without_tax ?? 0) *
                      (1 + newTaxRate / 100 + cessRate / 100) *
                      item.quantity -
                    ((item.purchasePrice_without_tax ?? 0) *
                      (1 + newTaxRate / 100 + cessRate / 100) *
                      item.quantity *
                      item.discount) /
                      100 // Add tax and cess to the price
                  : (item.purchasePrice_with_tax ?? 0) * item.quantity -
                    ((item.purchasePrice_with_tax ?? 0) *
                      item.quantity *
                      item.discount) /
                      100, // Keep the amount as is if it's "With Tax"
            }
          : item,
      ),
    );
  };

  const groupedTaxes = selectedItems.reduce((acc: any, item) => {
    const totalAmount = item.price * item.quantity; // ✅ Total taxable amount

    if (!acc[item.tax]) {
      acc[item.tax] = {
        sgst: 0,
        cgst: 0,
        cessAmount: 0,
        cessRate: item.cessRate,
      }; // ✅ Cess rate add kiya
    }

    // ✅ Correct SGST & CGST calculation
    acc[item.tax].sgst += (totalAmount * item.tax) / 200;
    acc[item.tax].cgst += (totalAmount * item.tax) / 200;
    acc[item.tax].cessAmount += (totalAmount * item.cessRate) / 100; // ✅ Cess calculation

    return acc;
  }, {});

  useEffect(() => {
    const fetchParties = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) throw new Error('Token not found');
        const response = await axios.get(`${API_URL}/parties/parties/`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        const data = response.data;
        const validParties =
          data.results?.filter((party: Party) => party?.party_name) || [];
          data.results?.filter((party) => party?.party_name) || [];
        setParties(validParties);
      } catch (error) {
        console.error('Error fetching parties:', error);
      }
    };
    fetchParties();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) throw new Error('Token not found');

      console.log('Sending Token:', token);

      const response = await fetch(`${API_URL}/expenses/categories/`, {
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

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();
    const value = e.target.value;
    if (value === 'create') {
      setIsCreatingCategory(true);
      setPartyCategory('');
      setSelectedCategory('');
    } else {
      setPartyCategory(Number(value));
      setSelectedCategory(value);
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
      const response = await fetch(`${API_URL}/expenses/categories/`, {
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
        setSelectedCategory(data.name);
      } else {
        console.error('Error adding category:', data);
        alert('Error adding category');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to add category.');
    }
  };

  const handleSaveInvoice = async () => {
    if (!selectedParty && withGst) {
      alert('Please select a party before saving the invoice!');
      return;
    }

    setIsSaving(true);

    const formattedItems = selectedItems.map((item) => {
      const base = {
        service: item.type === 'service' ? item.id : null,
        item: item.type === 'item' ? item.id : null,
        quantity: item.quantity,
        discount: item.discount,
      };

      if (withGst) {
        base.gstTaxRate = item.taxId;
        // base.sgst = item.sgst;
        // base.cgst = item.cgst;
        // base.cessAmount = item.cessAmount;
      }

      return base;
    });

    const invoiceData = {
      expense_no: expenseNo,
      original_invoice_no: originalInvoiceNumber,
      date: currentDate,
      category:partyCategory,
      expense_with_gst:withGst,
      payment_term: paymentTerms,
      expense_items: formattedItems,
      discount: totalDiscount? totalDiscount:0.00,
      payment_method: selectedPaymentMode,
      notes,
      ...(withGst && { party: selectedParty?.id }), // ⬅️ Only add party if withGst is true
    };

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) throw new Error('Token not found');

      const response = await fetch(`${API_URL}/expenses/expenses/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(invoiceData),
      });

      if (response.ok) {
        const result = await response.json();
        alert('Invoice Saved Successfully!');
        console.log(result);
        const newInvoiceNo = expenseNo + 1;
        setExpenseNo(newInvoiceNo);
        localStorage.setItem('expenseNo', newInvoiceNo.toString());
        navigate('/Expenses');
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

  return (
    <div className="p-4 md:p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md max-w-100% mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Section with Border */}
        <div className="border border-gray-300 dark:border-gray-700 rounded-md p-4 space-y-4">
          {/* GST Toggle */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
              Expense With GST
            </label>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={withGst}
                onChange={() => setWithGst(!withGst)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none dark:bg-gray-700 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:left-[2px] after:top-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
            </label>
          </div>
          {withGst && (
            <>
              <label className="block mb-2 text-gray-700 dark:text-gray-300">
                Party Name
              </label>
              <select
                className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:text-gray-300"
                value={selectedParty?.id || ''}
                onChange={(e) => {
                  const selected = parties.find(
                    (party) => party.id === Number(e.target.value),
                  );
                  setSelectedParty(selected || null);
                }}
              >
                <option value="">Search party by name </option>
                {parties.map((party) => (
                  <option key={party.id} value={party.id}>
                    {party.party_name}
                  </option>
                ))}
              </select>

              {selectedParty && (
                <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl border">
                  <p className="text-gray-700 dark:text-gray-300">
                    Selected Party: {selectedParty.party_name}
                  </p>
                </div>
              )}
            </>
          )}

          {/* Expense Category */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200">
              Expense Category
            </label>
            <select
              className="w-full p-3 h-full border border-gray-300 dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
              value={partyCategory}
              onChange={handleCategoryChange}
            >
              <option value="">Select Category</option>
              {Array.isArray(categories) &&
                categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              <option value="create">Create Category</option>
            </select>
          </div>
          {/* Popup Modal for Creating Category */}
          {isCreatingCategory && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-900  bg-opacity-50">
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

          {/* Expense Number */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200">
              Expense Number
            </label>
            <input
              type="text"
              value={expenseNo} // Bind state
              readOnly // Prevent manual editing
              className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 dark:text-white"
            />
          </div>
        </div>

        {/* Right Section with Border */}
        <div className="border border-gray-300 dark:border-gray-700 rounded-md p-4 space-y-4">
          {/* Invoice Number & Date */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200">
                Original Invoice Number
              </label>
              <input
                type="text"
                value={originalInvoiceNumber}
                onChange={(e) => setOriginalInvoiceNumber(e.target.value)}
                className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 dark:text-white"
              />
            </div>
            <div className="flex-1">
              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200">
                Date
              </label>
              <input
                type="date"
                value={currentDate}
                onChange={(e) => setCurrentDate(e.target.value)}
                className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 dark:text-white"
              />
            </div>
          </div>

          {/* Payment Mode */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200">
              Payment Mode
            </label>
            <select
              value={selectedPaymentMode}
              onChange={(e) => setSelectedPaymentMode(e.target.value)}
              className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 dark:text-white"
            >
              <option value="Cash">Cash</option>
              <option value="Card">Card</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Netbanking">Netbanking</option>
              <option value="Upi">UPI</option>
              <option value="Cheque">Cheque</option>
            </select>
          </div>

          {/* Note */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200">
              Note
            </label>
            <textarea
              placeholder="Enter Notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows="2"
              className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 dark:text-white resize-none"
            ></textarea>
          </div>
        </div>
      </div>
      {withGst ? (
        <>
          <div className="overflow-x-auto mt-2">
            <table className="min-w-full bg-white dark:bg-gray-700 dark:text-white">
              <thead>
                <tr className="w-full bg-white-100 text-gray-700 dark:bg-gray-700 dark:text-white">
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

                      <div className="flex items-center justify-between gap-2 mb-2">
                        <input
                          type="text"
                          placeholder="Search Item..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="flex-1 p-2 border rounded-md dark:bg-gray-700 dark:text-white"
                        />
                        <button
                          onClick={() => {
                            setShowModal(false); // Close modal if needed
                            navigate('/Expenses/Create-Expense-Item'); // <-- Update this path to match your route
                          }}
                          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                        >
                          + Create Item
                        </button>
                      </div>

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
                                {item.purchasePrice_with_tax ||
                                  item.purchasePrice ||
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

          <div className="w-1/2 mt-2">
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
                    <span className="text-gray-700">SGST ({taxRate / 2}%)</span>
                    <span className="text-gray-700">
                      ₹{groupedTaxes[taxRate].sgst.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-700">CGST ({taxRate / 2}%)</span>
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
                <span className="text-gray-700">₹{totalAmount.toFixed(2)}</span>
              </div>
            </div>{' '}
          </div>
        </>
      ) : (
        <div className="overflow-x-auto mt-2">
          <table className="min-w-full bg-white dark:bg-gray-700 dark:text-white">
            <thead>
              <tr className="w-full bg-white-100 text-gray-700 dark:bg-gray-700 dark:text-white">
                <th className="py-2 px-4 border">NO</th>
                <th className="py-2 px-4 border">ITEMS</th>
                <th className="py-2 px-4 border">QTY</th>
                <th className="py-2 px-4 border">PRICE/ITEM</th>
                <th className="py-2 px-4 border">AMOUNT</th>
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
                  <td className="py-2 px-4 border flex items-center">
                    <input
                      type="number"
                      value={item.quantity === 0 ? '' : item.quantity}
                      min="1"
                      onChange={(e) =>
                        handleQuantityChange(item.uid, Number(e.target.value))
                      }
                      className="w-16 p-1 border rounded text-center dark:bg-gray-700 dark:text-white"
                    />
                    <span className="ml-2 text-sm text-gray-500 dark:text-gray-300">
                      {item.unit || 'G NEX'}
                    </span>
                  </td>
                  <td className="py-2 px-4 border">₹{item.price.toFixed(2)}</td>
                  <td className="py-2 px-4 border">
                    ₹{(item.amount * item.quantity).toFixed(2)}
                  </td>
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

              {/* "+ Add Item" row remains exactly as your code */}
              <tr>
                <td
                  colSpan="6"
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

                    {/* ✅ Search Bar with "Create New Item" Button */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <input
                        type="text"
                        placeholder="Search Item..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-1 p-2 border rounded-md dark:bg-gray-700 dark:text-white"
                      />
                      <button
                        onClick={() => {
                          setShowModal(false); // Close modal if needed
                          navigate('/Expenses/Create-Expense-Item'); // <-- Update this path to match your route
                        }}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                      >
                        + Create Item
                      </button>
                    </div>

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
                              {item.purchasePrice_without_tax.toFixed(2) ||
                                item.purchasePrice.toFixed(2) ||
                                '0'}
                            </span>
                            <span className="w-1/4">
                              ₹
                              {item.purchasePrice_with_tax.toFixed(2) ||
                                item.purchasePrice.toFixed(2) ||
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
                        <li className="p-2 text-gray-500">No items found...</li>
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
          {/* Total */}
          <div className="mt-4 font-semibold text-right">
            Total Expense Amount: ₹{totalExpenseAmount.toFixed(2)}
          </div>
        </div>
      )}
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
  );
};

export default CreateExpenseForm;
