import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';

const CreatePaymentOutForm = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [parties, setParties] = useState([]);
  const [selectedParty, setSelectedParty] = useState(null);
  const navigate = useNavigate();
  const [allInvoices, setAllInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [paymentAmount, setPaymentAmount] = useState();
  const [paymentDate, setPaymentDate] = useState('');
  const [paymentMode, setPaymentMode] = useState('Cash');
  const [paymentOutNumber, setPaymentOutNumber] = useState(1);
  const [notes, setNotes] = useState('');
  const [bankAccounts, setBankAccounts] = useState([]);
  const [selectedBankAccountId, setSelectedBankAccountId] = useState('');
  const [showAddAccountModal, setShowAddAccountModal] = useState(false);
  const [accountName, setAccountName] = useState('');
  const [openingBalance, setOpeningBalance] = useState('');
  const [asOfDate, setAsOfDate] = useState('');
  const [accountError, setAccountError] = useState(null);

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

        const response = await fetch(`${API_URL}/purchase/purchase`, {
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
    } else {
      setFilteredInvoices([]);
    }
  }, [selectedParty, allInvoices]);

  const handleBack = () => {
    navigate(-1);
  };

  const handlePaymentChange = (e) => {
    let enteredAmount = parseFloat(e.target.value) || 0;
    setPaymentAmount(enteredAmount); // Payment amount ko state me set karenge

    let remainingAmount = enteredAmount;

    const updatedInvoices = filteredInvoices.map((invoice) => {
      const originalBalanceAmount =
        invoice.original_balance_amount || invoice.balance_amount || 0;

      if (remainingAmount <= 0) {
        return {
          ...invoice,
          amountSettled: 0,
          balance_amount: originalBalanceAmount,
        };
      }

      const amountToSettle = Math.min(remainingAmount, originalBalanceAmount);
      remainingAmount -= amountToSettle;

      return {
        ...invoice,
        amountSettled: amountToSettle,
        balance_amount: originalBalanceAmount - amountToSettle,
        original_balance_amount: originalBalanceAmount, // Original ko safe rakhna
      };
    });

    setFilteredInvoices(updatedInvoices);
  };

  const totalInvoiceAmount = filteredInvoices.reduce(
    (sum, invoice) => sum + parseFloat(invoice.total_amount || 0),
    0,
  );

  const totalInvoiceBalanceAmount = filteredInvoices.reduce(
    (sum, invoice) => sum + parseFloat(invoice.balance_amount || 0),
    0,
  );
  const totalSettledAmount = filteredInvoices.reduce(
    (sum, invoice) => sum + parseFloat(invoice.amountSettled || 0),
    0,
  );

  const fetchNextInvoiceNumber = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(
        `${API_URL}/purchase/payment_out/next-number/`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.ok) {
        const data = await response.json();
        // Get the simple number directly
        const nextNumber = data.next_payment_out_number;
        setPaymentOutNumber(nextNumber);
        localStorage.setItem('paymentOutNo', nextNumber.toString());
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

    // Check for selected party and payment amount validation
    if (!selectedParty || paymentAmount <= 0 || !paymentDate) {
      alert(
        'Please select a valid party, enter a valid payment amount, and provide a payment date.',
      );
      return;
    }

    const invoiceSettlements = filteredInvoices
      .filter((invoice) => invoice.amountSettled && invoice.amountSettled > 0)
      .map((invoice) => {
        return {
          purchase: invoice.id,
          settled_amount: invoice.amountSettled,
        };
      });

    // Prepare the data to be sent
    const paymentData = {
      party: selectedParty.id,
      amount: paymentAmount,
      date: paymentDate,
      settled_purchase: invoiceSettlements,
      payment_mode: paymentMode,
      payment_out_number: paymentOutNumber,
      notes: notes || null,
      bank_account: paymentMode !== 'Cash' ? selectedBankAccountId : null,
    };

    console.log('Payment Data:', paymentData);

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) throw new Error('Token not found');

      const response = await fetch(`${API_URL}/purchase/paymentout/`, {
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
      navigate(-1); // Navigate to the payment listing page
    } catch (error) {
      console.error('Error creating payment:', error);
      alert(error.message);
    }
  };

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
      <Breadcrumb pageName="Create Payment Out" />

      <div className="w-full flex flex-col gap-9">
        <div className="w-full rounded-sm border border-stroke bg-white shadow-default dark:bg-gray-800 dark:bg-boxdark">
          <div className="border-b border-stroke py-4 px-6.5 dark:bg-gray-800">
            <h3 className="font-medium text-black dark:text-white">
              PaymentOut Details
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
                      onChange={(e) => setPaymentMode(e.target.value)}
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

                  <div>
                    <label className="block mb-2 text-gray-700 dark:text-gray-300 whitespace-nowrap">
                      Payment Out Number
                    </label>
                    <input
                      type="number"
                      value={paymentOutNumber}
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
            <table className="min-w-full border border-gray-300  mt-4">
              <thead>
                <tr className="bg-gray-200 text-left">
                  <th className="border px-4 py-2">Date</th>
                  <th className="border px-4 py-2">Due Date</th>
                  <th className="border px-4 py-2">Invoice Number</th>
                  <th className="border px-4 py-2">Invoice Amount</th>
                  <th className="border px-4 py-2">Invoice Balance Amount</th>
                  <th className="border px-4 py-2">Amount Settled</th>
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
                        {invoice.purchase_no || '-'}
                      </td>
                      <td className="border px-4 py-2">
                        ₹{invoice.total_amount || 0}
                      </td>
                      <td className="border px-4 py-2">
                        ₹{invoice.balance_amount || 0}
                      </td>
                      <td className="border px-4 py-2">
                        ₹{invoice.amountSettled || 0}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="border px-4 py-2 text-center" colSpan="6">
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
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
      </div>
    </>
  );
};

export default CreatePaymentOutForm;
