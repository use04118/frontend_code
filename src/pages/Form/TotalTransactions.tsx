import React from 'react'

const TotalTransactions = () => {
  return (
    <>
      <div className="flex justify-between items-center gap-4 mt-4">
      <div className="w-[30%] p-4 bg-blue-100 border border-blue-300 text-blue-800 rounded-lg text-center font-semibold">
        <h3>All Parties</h3>
        <h2>1</h2>
      </div>
      <div className="w-[30%] p-4 bg-green-100 border border-green-300 text-green-800 rounded-lg text-center font-semibold">
        <h3>To Collect</h3>
        <h2>5000</h2>
      </div>
      <div className="w-[30%] p-4 bg-red-100 border border-red-300 text-red-800 rounded-lg text-center font-semibold">
        <h3>To Pay</h3>
        <h2>0</h2>
      </div>
    </div>
    </>
   
    

  );
}

export default TotalTransactions
