import React from 'react';
import CreatePaymentOut from './PaymentOutComponent/CreatePaymentOut';
import PaymentOutTable from './PaymentOutComponent/PaymentOutTable';

const PaymentOut: React.FC = () => {
  return (
    <>
      <h4 className="text-2xl font-bold mb-4">Payment Out</h4>
      <CreatePaymentOut />
      <PaymentOutTable />
    </>
  );
};

export default PaymentOut;
