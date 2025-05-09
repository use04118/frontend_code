import React, { FC } from 'react'
import CreateExpense from './CreateExpense'
import ExpenseTable from './ExpenseTable'

const Expense: FC = () => {
  return (
    <>
      <h4 className="text-2xl font-bold mb-4">Expense</h4>
      <CreateExpense />
      <ExpenseTable />
    </>
  )
}

export default Expense
