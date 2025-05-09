import React from 'react';
import CreatePaymentIn from './PaymentInComponent/CreatePaymentIn';
import PaymentInTable from './PaymentInComponent/PaymentInTable';

const PaymentIn: React.FC = () => {
  return (
    <>
      <h4 className="text-2xl font-bold mb-4">Payment In</h4>
      <CreatePaymentIn />
      <PaymentInTable />
    </>
  );
};

export default PaymentIn;
