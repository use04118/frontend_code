import React from 'react';
import CreateDeliveryChallan from './DeliveryChallanComponent/CreateDeliveryChallan';
import DeliveryChallanTable from './DeliveryChallanComponent/DeliveryChallanTable';

const DeliveryChallan: React.FC = () => {
  return (
    <>
      <h4 className="text-2xl font-bold mb-4">Delivery Challan</h4>
      <CreateDeliveryChallan />
      <DeliveryChallanTable />
    </>
  );
};

export default DeliveryChallan;
