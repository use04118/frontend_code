import React from 'react';
import CreateSalesReturn from './SalesReturnComponent/CreateSalesReturn';
import SalesReturnTable from './SalesReturnComponent/SalesReturnTable';

interface SalesReturnProps {}

const SalesReturn: React.FC<SalesReturnProps> = () => {
  return (
    <>
      <h4 className="text-2xl font-bold mb-4">Sales Return</h4>
      <CreateSalesReturn />
      <SalesReturnTable />
    </>
  );
};

export default SalesReturn;
