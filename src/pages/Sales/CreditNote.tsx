import React from 'react';
import CreateCreditNote from './CreditNoteComponent/CreateCreditNote';
import CreditNoteTable from './CreditNoteComponent/CreditNoteTable';

const CreditNote: React.FC = () => {
  return (
    <>
      <h4 className="text-2xl font-bold mb-4">Credit Note</h4>
      <CreateCreditNote />
      <CreditNoteTable />
    </>
  );
};

export default CreditNote;
