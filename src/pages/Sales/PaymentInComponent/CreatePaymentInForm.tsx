import React, { useState, useEffect } from 'react';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import { useNavigate } from 'react-router-dom';
import { FaEdit } from 'react-icons/fa';

const CreatePaymentInForm = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [parties, setParties] = useState([]);
  const [selectedParty, setSelectedParty] = useState(null);
  const navigate = useNavigate();
  const [allInvoices, setAllInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [paymentAmount, setPaymentAmount] = useState();
  const [paymentDate, setPaymentDate] = useState('');
  const [paymentMode, setPaymentMode] = useState('Cash');
  const [paymentInNumber, setPaymentInNumber] = useState(1);
  const [notes, setNotes] = useState('');
  const [tdsEnabled, setTdsEnabled] = useState(false); // Default false
  const [showTdsModal, setShowTdsModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [tdsRate, setTdsRate] = useState('');
  const [tdsAmount, setTdsAmount] = useState(0);
  const [tdsRates, setTdsRates] = useState<number[]>([]);
  const [showAddTdsModal, setShowAddTdsModal] = useState(false);
  const [newTdsName, setNewTdsName] = useState('');
  const [newTdsSection, setNewTdsSection] = useState('');
  const [newTdsRate, setNewTdsRate] = useState('');
  const [tdsAppliedInvoices, setTdsAppliedInvoices] = useState({});
  const [taxableAmount, setTaxableAmount] = useState();
  const [editMode, setEditMode] = useState(false);
  const [bankAccounts, setBankAccounts] = useState([]);
  const [selectedBankAccountId, setSelectedBankAccountId] = useState('');
  const [showAddAccountModal, setShowAddAccountModal] = useState(false);
  const [accountName, setAccountName] = useState('');
  const [openingBalance, setOpeningBalance] = useState('');
  const [asOfDate, setAsOfDate] = useState('');
  const [accountError, setAccountError] = useState(null);

  const openTdsModal = (invoice) => {
    setSelectedInvoice(invoice);
    setShowTdsModal(true);
  };

  const closeTdsModal = () => {
    setShowTdsModal(false);
    setTdsRate('');
    setTdsAmount(0);
    setSelectedInvoice(null);
    setEditMode(false);
  };

  const handleTdsChange = (e) => {
    const rate = parseFloat(e.target.value);
    setTdsRate(rate);
    if (selectedInvoice) {
      const amount = (selectedInvoice.total_amount || 0) * (rate / 100);
      setTdsAmount(amount.toFixed(2));
    }
  };

  console.log(taxableAmount);

  const handleTdsSave = () => {
    const rateObj = tdsRates.find((r) => r.id === parseInt(tdsRate));
    const rate = rateObj?.rate || 0;

    const amount = (selectedInvoice.taxable_amount || 0) * (rate / 100);

    setTdsAppliedInvoices((prev) => ({
      ...prev,
      [selectedInvoice.id]: {
        rate: rate,
        amount: parseFloat(amount.toFixed(2)),
      },
    }));

    closeTdsModal();
  };
  useEffect(() => {
    const fetchTdsSetting = async () => {
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
        setTdsEnabled(data.tds);
        //setBusinessState(data?.state); // ✅ Save the state
      } catch (error) {
        console.error('Error fetching TCS setting:', error);
      }
    };

    fetchTdsSetting();
  }, []);

  useEffect(() => {
    const fetchTdsRates = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) throw new Error('Token not found');
        const response = await fetch(`${API_URL}/sales/tds/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        // Suppose API gives: { rates: [1.0, 0.75, 0.5] }
        setTdsRates(data.results || []);
      } catch (error) {
        console.error('Error fetching TCS rates:', error);
      }
    };

    fetchTdsRates();
  }, []);

  const handleSaveNewTdsRate = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) throw new Error('Token not found');
      const response = await fetch(`${API_URL}/sales/tds/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // ⬅️ if token needed
        },
        body: JSON.stringify({
          description: newTdsName,
          section: newTdsSection,
          rate: newTdsRate,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add new TCS rate');
      }

      const newRate = await response.json();

      // Update dropdown
      setTdsRates([...tdsRates, newRate]);
      setTdsRate(newRate.rate); // Optionally select new one
      setShowAddTdsModal(false); // Close modal

      // Reset form
      setNewTdsName('');
      setNewTdsSection('');
      setNewTdsRate(0);
    } catch (error) {
      console.error('Error:', error);
      // Optionally: show toast or error message to user
    }
  };

  const openEditTdsModal = (invoice) => {
    const selected = tdsAppliedInvoices[invoice.id];
    setSelectedInvoice(invoice);
    setTdsRate(selected?.id); // Assuming you're storing `id` in rate too
    setTdsAmount(selected?.amount || 0);
    setNewTdsName(selected?.tax_name || ''); // Assuming you store these fields
    setNewTdsSection(selected?.section || '');
    setNewTdsRate(selected?.rate || '');
    setShowTdsModal(true);
    setEditMode(true); // new flag
  };

  const handleApplyTDS = (invoice) => {
    // Your TDS logic here
    console.log('Apply TDS for invoice:', invoice);
  };

  const handleDeleteTdsRate = () => {
    if (selectedInvoice?.id) {
      const updated = { ...tdsAppliedInvoices };
      delete updated[selectedInvoice.id];
      setTdsAppliedInvoices(updated);
      closeTdsModal();
    }
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
        const validParties =
          data.results?.filter((party) => party?.party_name) || [];
        setParties(validParties);
      } catch (error) {
        console.error('Error fetching parties:', error);
      }
    };
    

    const fetchAllInvoices = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) throw new Error('Token not found');

        const response = await fetch(`${API_URL}/sales/invoices`, {
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

    fetchParties();
    fetchAllInvoices();
  }, []);
  console.log(allInvoices);

  useEffect(() => {
    if (selectedParty) {
      const filteredData = allInvoices.filter(
        (invoice) => invoice.party === selectedParty.id,
      );
      console.log(filteredData);
      setFilteredInvoices(filteredData);

      // Calculate total taxable amount
      const totalTaxable = filteredData.reduce(
        (sum, invoice) => sum + parseFloat(invoice.taxable_amount || 0),
        0,
      );
      setTaxableAmount(totalTaxable.toFixed(2));
    } else {
      setFilteredInvoices([]);
      setTaxableAmount(0);
    }
  }, [selectedParty, allInvoices]);

  const handleBack = () => {
    navigate(-1);
  };

  const handlePaymentChange = (e) => {
    let enteredAmount = parseFloat(e.target.value) || 0;
    setPaymentAmount(enteredAmount);

    let remainingAmount = enteredAmount;

    const updatedInvoices = filteredInvoices.map((invoice) => {
      const originalBalanceAmount = invoice.original_balance_amount || invoice.balance_amount || 0;
      const tdsData = tdsAppliedInvoices[invoice.id];
      const tdsAmount = tdsData ? parseFloat(tdsData.amount || 0) : 0;
      
      // Calculate effective balance only once
      const effectiveBalance = Math.max(originalBalanceAmount - tdsAmount, 0);

      if (remainingAmount <= 0) {
        return {
          ...invoice,
          amountSettled: 0,
          balance_amount: effectiveBalance,
          original_balance_amount: originalBalanceAmount,
        };
      }

      const amountToSettle = Math.min(remainingAmount, effectiveBalance);
      remainingAmount -= amountToSettle;

      return {
        ...invoice,
        amountSettled: amountToSettle,
        balance_amount: originalBalanceAmount - amountToSettle,
        original_balance_amount: originalBalanceAmount,
      };
    });

    setFilteredInvoices(updatedInvoices);
  };

  const totalInvoiceAmount = filteredInvoices.reduce(
    (sum, invoice) => sum + parseFloat(invoice.total_amount || 0),
    0,
  );

  const totalInvoiceBalanceAmount = filteredInvoices.reduce((sum, invoice) => {
    const originalBalance = parseFloat(invoice.original_balance_amount || invoice.balance_amount || 0);
    const tdsData = tdsAppliedInvoices[invoice.id];
    const tdsAmount = tdsData ? parseFloat(tdsData.amount || 0) : 0;
    // Calculate effective balance only once
    const effectiveBalance = Math.max(originalBalance - tdsAmount, 0);
    return sum + (effectiveBalance - (invoice.amountSettled || 0));
  }, 0);

  const totalSettledAmount = filteredInvoices.reduce(
    (sum, invoice) => sum + parseFloat(invoice.amountSettled || 0),
    0,
  );

  const fetchNextInvoiceNumber = async () => {
        try {
          const token = localStorage.getItem('accessToken');
          const response = await fetch(`${API_URL}/sales/payment_in/next-number/`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });
    
          if (response.ok) {
            const data = await response.json();
            // Get the simple number directly
            const nextNumber = data.next_payment_in_number;
            setPaymentInNumber(nextNumber);
            localStorage.setItem('paymentInNo', nextNumber.toString());
          }
        } catch (error) {
          console.error('Error fetching next invoice number:', error);
        }
      };
    
      useEffect(() => {
        fetchNextInvoiceNumber();
      }, []);
    

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedParty || paymentAmount <= 0 || !paymentDate) {
      alert('Please select a valid party, enter a valid payment amount, and provide a payment date.');
      return;
    }

    // Add bank account validation
    if (paymentMode !== 'Cash' && !selectedBankAccountId) {
      alert('Please select a bank account for non-cash payment modes.');
      return;
    }

    const invoiceSettlements = filteredInvoices
      .filter((invoice) => invoice.amountSettled && invoice.amountSettled > 0)
      .map((invoice) => {
        const tdsData = tdsAppliedInvoices[invoice.id];
        return {
          invoice: invoice.id,
          settled_amount: invoice.amountSettled,
          tds_rate: tdsData ? tdsData.rate : null,
          apply_tds: tdsEnabled ? tdsEnabled : false,
        };
      });

    const paymentData = {
      party: selectedParty.id,
      amount: paymentAmount,
      date: paymentDate,
      payment_mode: paymentMode,
      payment_in_number: paymentInNumber,
      notes: notes || null,
      settled_invoices: invoiceSettlements,
      bank_account: paymentMode !== 'Cash' ? selectedBankAccountId : null, // Add bank account ID
    };

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) throw new Error('Token not found');

      const response = await fetch(`${API_URL}/sales/paymentin/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(paymentData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.message || 'Failed to create payment');
      }

      alert('Payment created successfully!');
      fetchNextInvoiceNumber();
      navigate('/Sales/Payment-In');
    } catch (error) {
      console.error('Error creating payment:', error);
      alert(error.message);
    }
  };

  useEffect(() => {
    handlePaymentChange({ target: { value: paymentAmount || 0 } });
    // eslint-disable-next-line
  }, [tdsAppliedInvoices]);

  useEffect(() => {
    const fetchBankAccounts = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await fetch(`${API_URL}/cash-bank/accounts/`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setBankAccounts(data.results || []);
      } catch (error) {
        console.error('Error fetching bank accounts:', error);
      }
    };
    fetchBankAccounts();
  }, []);

  return (
    <>
      <Breadcrumb pageName="Create Payment In" />

      <div className="w-full flex flex-col gap-9">
        <div className="w-full rounded-sm border border-stroke bg-white shadow-default dark:bg-gray-800 dark:bg-boxdark">
          <div className="border-b border-stroke py-4 px-6.5 dark:bg-gray-800">
            <h3 className="font-medium text-black dark:text-white">
              PaymentIn Details
            </h3>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 mb-2 ml-2">
              {/* Left Section */}
              <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-stroke shadow-lg mr-2">
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

                <label className="block mt-4 mb-2 text-gray-700 dark:text-gray-300">
                  Enter Payment Amount
                </label>
                <input
                  type="number"
                  value={paymentAmount === 0 ? '' : paymentAmount}
                  onChange={handlePaymentChange}
                  placeholder="Enter Amount"
                  className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:text-gray-300"
                />
              </div>

              {/* Right Section */}
              {/* Right Section */}
              <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-stroke shadow-lg mr-2">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block mb-2 text-gray-700 dark:text-gray-300">
                      Payment Date
                    </label>
                    <input
                      type="date"
                      value={paymentDate}
                      onChange={(e) => setPaymentDate(e.target.value)}
                      className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:text-gray-300"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-gray-700 dark:text-gray-300">
                      Payment Mode
                    </label>
                    <select
                      value={paymentMode}
                      onChange={(e) => {
                        setPaymentMode(e.target.value);
                        if (e.target.value === 'Cash') {
                          setSelectedBankAccountId('');
                        }
                      }}
                      className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:text-gray-300"
                    >
                      <option value="Cash">Cash</option>
                      <option value="Card">Card</option>
                      <option value="Bank Transfer">Bank Transfer</option>
                      <option value="Netbanking">Netbanking</option>
                      <option value="Upi">UPI</option>
                      <option value="Cheque">Cheque</option>
                    </select>
                  </div>

                  {/* Add bank account selection if payment mode is not Cash */}
                  {paymentMode !== 'Cash' && (
                    <div>
                      <label className="block mb-2 text-gray-700 dark:text-gray-300">
                        Bank Account
                      </label>
                      <select
                        value={selectedBankAccountId}
                        onChange={(e) => setSelectedBankAccountId(e.target.value)}
                        className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:text-gray-300"
                        required
                      >
                        <option value="">Select Bank Account</option>
                        {bankAccounts
                          .filter((acc) => acc.account_type !== 'Cash')
                          .map((acc) => (
                            <option key={acc.id} value={acc.id}>
                              {acc.account_name} (₹{acc.current_balance})
                            </option>
                          ))}
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="block mb-2 text-gray-700 dark:text-gray-300">
                      Payment In Number
                    </label>
                    <input
                      type="number"
                      value={paymentInNumber}
                      readOnly
                      className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:text-gray-300"
                    />
                  </div>
                </div>
                <label className="block mt-4 mb-2 text-gray-700 dark:text-gray-300">
                  Notes
                </label>
                <textarea
                  className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:text-gray-300"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Enter Notes"
                ></textarea>
              </div>
            </div>
            {/* Buttons: Close & Save */}
            <div className="flex justify-end gap-4 mb-2 mr-2">
              <button
                type="button"
                onClick={handleBack}
                className="rounded border border-gray-400 px-4 py-2 text-gray-600 hover:bg-gray-100 dark:border-gray-600 dark:text-white dark:hover:bg-gray-700"
              >
                Close
              </button>
              <button
                type="submit"
                className="rounded bg-primary px-4 py-2 text-white hover:bg-opacity-90"
              >
                Save
              </button>
            </div>
          </form>
          <div className="mr-2 ml-2 mb-2">
            <table className="min-w-full border border-gray-300 mt-4">
              <thead>
                <tr className="bg-gray-200 text-left">
                  <th className="border px-4 py-2">Date</th>
                  <th className="border px-4 py-2">Due Date</th>
                  <th className="border px-4 py-2">Invoice Number</th>
                  <th className="border px-4 py-2">Invoice Amount</th>
                  <th className="border px-4 py-2">Invoice Balance Amount</th>
                  <th className="border px-4 py-2">Amount Settled</th>
                  <th className="border px-4 py-2">Actions</th>{' '}
                  {/* New column */}
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.length > 0 ? (
                  filteredInvoices.map((invoice, index) => (
                    <tr key={index}>
                      <td className="border px-4 py-2">
                        {invoice.date || '-'}
                      </td>
                      <td className="border px-4 py-2">
                        {invoice.due_date || '-'}
                      </td>
                      <td className="border px-4 py-2">
                        {invoice.invoice_no || '-'}
                      </td>
                      <td className="border px-4 py-2">
                        ₹{invoice.total_amount || 0}
                      </td>
                      <td className="border px-4 py-2">
                        ₹
                        {Math.max(
                          tdsAppliedInvoices[invoice.id]
                            ? invoice.balance_amount - tdsAppliedInvoices[invoice.id].amount
                            : invoice.balance_amount || 0,
                          0
                        ).toFixed(2)}
                      </td>
                      <td className="border px-4 py-2">
                        ₹{invoice.amountSettled || 0}
                      </td>
                      <td className="border px-4 py-2">
                        {tdsAppliedInvoices[invoice.id] ? (
                          <div className="text-green-700 font-medium flex items-center justify-between gap-2">
                            <span>
                              ₹{tdsAppliedInvoices[invoice.id].amount} (
                              {tdsAppliedInvoices[invoice.id].rate}%)
                            </span>
                            <button
                              onClick={() => openEditTdsModal(invoice)}
                              className="text-blue-500 hover:text-blue-700"
                            >
                              <FaEdit />
                            </button>
                          </div>
                        ) : tdsEnabled && paymentAmount > 0 ? (
                          <button
                            onClick={() => openTdsModal(invoice)}
                            className="text-blue-500 underline hover:text-blue-700 p-0 m-0 inline"
                          >
                            Apply TDS
                          </button>
                        ) : (
                          '-'
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="border px-4 py-2 text-center" colSpan="7">
                      No Invoices Found
                    </td>
                  </tr>
                )}
                <tr className="bg-gray-100 font-semibold">
                  <td className="border px-4 py-2" colSpan="3">
                    Total
                  </td>
                  <td className="border px-4 py-2">₹{totalInvoiceAmount}</td>
                  <td className="border px-4 py-2">
                    ₹{totalInvoiceBalanceAmount}
                  </td> 
                  <td className="border px-4 py-2">₹{totalSettledAmount}</td>
                  <td className="border px-4 py-2"></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        {showTdsModal && (
          <div className="fixed inset-0 z-100 flex items-center justify-center bg-black bg-opacity-30">
            <div className="bg-white rounded-lg shadow-lg w-96 p-6 relative">
              <button
                onClick={closeTdsModal}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
              <h2 className="text-lg font-semibold mb-4">Apply TDS</h2>

              <label className="block text-sm font-medium text-gray-700 mb-1">
                TDS
              </label>
              <select
                className="border border-gray-300 p-2 rounded dark:bg-gray-900 dark:text-white max-w-[250px] truncate"
                value={tdsRate}
                onChange={(e) => {
                  if (e.target.value === 'add_new') {
                    setShowAddTdsModal(true);
                  } else {
                    setTdsRate(e.target.value);
                  }
                }}
              >
                {tdsRates.map((rate) => (
                  <option key={rate.id} value={rate.id}>
                    {rate.rate} % ({rate.description})
                  </option>
                ))}

                <option
                  value="add_new"
                  className="text-purple-600 font-semibold"
                >
                  ➕ Add new TdS Rate
                </option>
              </select>

              <div className="bg-gray-100 text-sm text-gray-700 px-3 py-2 rounded mb-4 flex justify-between">
                <span>TDS Applicable on bill</span>
                <span>- ₹ {tdsAmount}</span>
              </div>

              <div className="flex justify-between items-center">
                {editMode && (
                  <button
                    onClick={handleDeleteTdsRate}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    🗑 Delete
                  </button>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={closeTdsModal}
                    className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleTdsSave}
                    className="px-4 py-2 rounded bg-purple-600 text-white hover:bg-purple-700"
                  >
                    {editMode ? 'Update' : 'Save'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {showAddTdsModal && (
          <div className="fixed inset-0 z-60 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-lg shadow-lg w-96 p-6 relative">
              <button
                onClick={() => setShowAddTdsModal(false)}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
              <h2 className="text-lg font-semibold mb-4">Add Tds Rate</h2>

              <label className="block text-sm mb-1 text-gray-700">
                Tax name
              </label>
              <input
                type="text"
                value={newTdsName}
                onChange={(e) => setNewTdsName(e.target.value)}
                placeholder="Enter Tax Name"
                className="w-full border px-3 py-2 rounded mb-3"
              />

              <label className="block text-sm mb-1 text-gray-700">
                Enter Section Name
              </label>
              <input
                type="text"
                value={newTdsSection}
                onChange={(e) => setNewTdsSection(e.target.value)}
                placeholder="Enter Section Name"
                className="w-full border px-3 py-2 rounded mb-3"
              />

              <label className="block text-sm mb-1 text-gray-700">
                Enter Rate (in %)
              </label>
              <input
                type="number"
                value={newTdsRate}
                onChange={(e) => setNewTdsRate(e.target.value)}
                placeholder="Enter Rate"
                className="w-full border px-3 py-2 rounded mb-4"
              />

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowAddTdsModal(false)}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Close
                </button>
                <button
                  onClick={handleSaveNewTdsRate}
                  disabled={!newTdsName || !newTdsSection || !newTdsRate}
                  className={`px-4 py-2 rounded text-white ${
                    newTdsName && newTdsSection && newTdsRate
                      ? 'bg-purple-600 hover:bg-purple-700'
                      : 'bg-purple-300 cursor-not-allowed'
                  }`}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
        <button
          className="text-blue-400 mt-4"
          type="button"
          onClick={() => setShowAddAccountModal(true)}
        >
          + Add New Account
        </button>
      </div>
      {showAddAccountModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-4">Add Bank Account</h2>
            <form onSubmit={async (e) => {
              e.preventDefault();
              setAccountError(null);
              
              const token = localStorage.getItem('accessToken');
              const payload = {
                account_name: accountName,
                account_type: 'Bank',
                opening_balance: openingBalance,
                as_of_date: asOfDate,
              };

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
                  setBankAccounts(prev => [...prev, newAccount]);
                  setShowAddAccountModal(false);
                  // Reset form
                  setAccountName('');
                  setOpeningBalance('');
                  setAsOfDate('');
                } else {
                  const err = await res.json();
                  setAccountError(err.message || 'Failed to save account');
                }
              } catch (error) {
                setAccountError('Error: ' + error.message);
              }
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Account Name</label>
                  <input
                    type="text"
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Opening Balance</label>
                  <input
                    type="number"
                    value={openingBalance}
                    onChange={(e) => setOpeningBalance(e.target.value)}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">As of Date</label>
                  <input
                    type="date"
                    value={asOfDate}
                    onChange={(e) => setAsOfDate(e.target.value)}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
              </div>
              
              {accountError && (
                <div className="mt-2 text-red-500 text-sm">{accountError}</div>
              )}

              <div className="mt-4 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddAccountModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Save Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default CreatePaymentInForm;
