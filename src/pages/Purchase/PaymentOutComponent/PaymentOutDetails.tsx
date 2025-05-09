import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

interface PaymentDetails {
  date: string;
  amount: number;
  payment_mode: string;
  notes: string | null;
  party: string | null;
  payment_out_number: string | null;
}

interface PartyData {
  id: string;
  name: string;
}

interface PurchaseData {
  date: string;
  purchase_number: string;
  purchase_amount: number;
  purchase_amount_settled: number;
  tdsAmount: number;
}

const PaymentOutDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);
  const [purchaseData, setPurchaseData] = useState<PurchaseData[]>([]);
  const [partyData, setPartyData] = useState<PartyData>({ id: '', name: '' });
  
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (!id) return;

    const fetchPaymentDetails = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get(`${API_URL}/purchase/paymentout/${id}/`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        
        setPaymentDetails(response.data);
        
        if (response.data.party) {
          fetchPartyById(response.data.party);
        }

        if (response.data.payment_out_number) {
          fetchPurchasesByPaymentNumber(response.data.payment_out_number);
        }
      } catch (error) {
        console.error('Error fetching payment details:', error);
      }
    };

    const fetchPartyById = async (partyId: string) => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get(`${API_URL}/parties/parties/${partyId}/`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        
        setPartyData({
          id: response.data.id,
          name: response.data.party_name,
        });
      } catch (error) {
        console.error('Error fetching party details:', error);
      }
    };

    const fetchPurchasesByPaymentNumber = async (paymentNumber: string) => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get(`${API_URL}/purchase/settled-purchases/${paymentNumber}/`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        
        setPurchaseData(response.data.settled_purchases);
      } catch (error) {
        console.error('Error fetching purchases:', error);
      }
    };

    fetchPaymentDetails();
  }, [id]);

  if (!paymentDetails) {
    return <div>Loading...</div>;
  }

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4">Payment Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p>PARTY NAME</p>
            <p>{partyData.name || 'Unknown Party'}</p>
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
        <h2 className="text-lg font-semibold mb-4">Purchases settled with this payment</h2>
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700">
                <th className="p-3 border">Date</th>
                <th className="p-3 border">Purchase Number</th>
                <th className="p-3 border">PURCHASE AMOUNT</th>
                <th className="p-3 border">PURCHASE AMOUNT SETTLED</th>
                <th className="p-3 border">TDS Amount</th>
              </tr>
            </thead>
            <tbody>
              {purchaseData.length > 0 ? (
                purchaseData.map((purchase, index) => (
                  <tr key={index}>
                    <td className="p-3 border">{purchase.date}</td>
                    <td className="p-3 border">{purchase.purchase_number}</td>
                    <td className="p-3 border">₹{purchase.purchase_amount}</td>
                    <td className="p-3 border">₹{purchase.purchase_amount_settled}</td>
                    <td className="p-3 border">₹{purchase.tdsAmount}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="p-3 border text-center" colSpan={5}>
                    No purchases have been settled with this payment
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

export default PaymentOutDetails;
