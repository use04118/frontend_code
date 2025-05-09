import React from 'react';
import CreatePurchaseOrder from './PurchaseOrderComponet/CreatePurchaseOrder';
import PurchaseOrderTable from './PurchaseOrderComponet/PurchaseOrderTable';

const PurchaseOrders: React.FC = () => {
  return (
    <>
      <h4 className="text-2xl font-bold mb-4">Purchase Order</h4>
      <CreatePurchaseOrder />
      <PurchaseOrderTable />
    </>
  );
};

export default PurchaseOrders;
