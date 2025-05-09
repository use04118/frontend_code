import React from 'react';
import CreateDebitNote from './DebitNoteComponent/CreateDebitNote';
import DebitNoteTable from './DebitNoteComponent/DebitNoteTable';

const DebitNote: React.FC = () => {
  return (
    <>
      <h4 className="text-2xl font-bold mb-4">Debit Note</h4>
      <CreateDebitNote />
      <DebitNoteTable />
    </>
  );
};

export default DebitNote;
