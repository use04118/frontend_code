import React from 'react'
import CreatePurchaseReturn from './PurchaseReturnComponent/CreatePurchaseReturn'
import PurchaseReturnTable from './PurchaseReturnComponent/PurchaseReturnTable'


const PurchaseReturn: React.FC = () => {
  return (
    <>
    <h4 className="text-2xl font-bold mb-4">Purchase Return</h4>
    <CreatePurchaseReturn/>
    <PurchaseReturnTable/>
    </>
  )
}

export default PurchaseReturn
