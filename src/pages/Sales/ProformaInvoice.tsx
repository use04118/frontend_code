import React from 'react';
import CreateProformaInvoice from './ProformaInvoice/CreateProformaInvoice';
import ProformaInvoiceTable from './ProformaInvoice/ProformaInvoiceTable';

const ProformaInvoice: React.FC = () => {
  return (
    <>
      <h4 className="text-2xl font-bold mb-4">Proforma Invoice</h4>
      <CreateProformaInvoice />
      <ProformaInvoiceTable />
    </>
  );
};

export default ProformaInvoice;
