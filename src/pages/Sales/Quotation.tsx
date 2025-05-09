import React from 'react';
import CreateQuotation from './QuotationComponent/CreateQuotation';
import QuotationTable from './QuotationComponent/QuotationTable';

const Quotation: React.FC = () => {
  return (
    <>
      <h4 className="text-2xl font-bold mb-4">Quotation/Estimate</h4>
      <CreateQuotation />
      <QuotationTable />
    </>
  );
};

export default Quotation;
