import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

interface PaymentDetails {
  id: number;
  date: string;
  amount: number;
  payment_mode: string;
  notes?: string;
  party?: number;
  payment_in_number?: string;
}

interface PartyData {
  id: number;
  name: string;
}

interface Invoice {
  date: string;
  invoice_number: string;
  invoice_amount: number;
  invoice_amount_settled: number;
  invoice_tds_amount: number;
}

const PaymentInDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);
  const [invoiceData, setInvoiceData] = useState<Invoice[]>([]);
  const [partyData, setPartyData] = useState<PartyData | null>(null);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (!id) return;

    const token = localStorage.getItem('accessToken');

    const fetchPaymentDetails = async () => {
      try {
        const { data } = await axios.get<PaymentDetails>(`${API_URL}/sales/paymentin/${id}/`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        setPaymentDetails(data);

        if (data.party) {
          fetchPartyById(data.party);
        }

        if (data.payment_in_number) {
          fetchInvoicesByPaymentNumber(data.payment_in_number);
        }
      } catch (error) {
        console.error('Error fetching payment details:', error);
      }
    };

    const fetchPartyById = async (partyId: number) => {
      try {
        const { data } = await axios.get(`${API_URL}/parties/parties/${partyId}/`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        setPartyData({
          id: data.id,
          name: data.party_name,
        });
      } catch (error) {
        console.error('Error fetching party details:', error);
      }
    };

    const fetchInvoicesByPaymentNumber = async (paymentNumber: string) => {
      try {
        const { data } = await axios.get(`${API_URL}/sales/payments/settled/${paymentNumber}/`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        setInvoiceData(data.settled_invoices || []);
      } catch (error) {
        console.error('Error fetching invoices:', error);
      }
    };

    fetchPaymentDetails();
  }, [id, API_URL]);

  const handleBack = () => {
    navigate(-1);
  };

  if (!paymentDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4">Payment Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p>PARTY NAME</p>
            <p>{partyData?.name || 'Unknown Party'}</p>
          </div>
          <div>
            <p>PAYMENT DATE</p>
            <p>{paymentDetails.date}</p>
          </div>
          <div>
            <p>PAYMENT AMOUNT</p>
            <p>₹{paymentDetails.amount}</p>
          </div>
          <div>
            <p>PAYMENT TYPE</p>
            <p>{paymentDetails.payment_mode}</p>
          </div>
          <div className="col-span-1 md:col-span-3">
            <p>NOTES</p>
            <p>{paymentDetails.notes || '_'}</p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 mt-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4">Invoices settled with this payment</h2>
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700">
                <th className="p-3 border">Date</th>
                <th className="p-3 border">Invoice Number</th>
                <th className="p-3 border">INVOICE AMOUNT</th>
                <th className="p-3 border">INVOICE AMOUNT SETTLED</th>
                <th className="p-3 border">TDS Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoiceData.length > 0 ? (
                invoiceData.map((invoice, index) => (
                  <tr key={index}>
                    <td className="p-3 border">{invoice.date}</td>
                    <td className="p-3 border">{invoice.invoice_number}</td>
                    <td className="p-3 border">₹{invoice.invoice_amount}</td>
                    <td className="p-3 border">₹{invoice.invoice_amount_settled}</td>
                    <td className="p-3 border">₹{invoice.invoice_tds_amount}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="p-3 border text-center" colSpan={5}>
                    No invoices have been settled with this payment
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-end gap-4 mb-2 mr-2 mt-2">
        <button onClick={handleBack} className="rounded border px-4 py-2 bg-blue-500 text-white">
          Close
        </button>
      </div>
    </div>
  );
};

export default PaymentInDetails;
