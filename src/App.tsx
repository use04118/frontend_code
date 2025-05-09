import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { useEffect, useState } from 'react';
import { Route, Routes, useLocation, Navigate } from 'react-router-dom';
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import SignIn from './pages/Authentication/SignIn';
// import SignUp from './pages/Authentication/SignUp';
import Calendar from './pages/Calendar';
import Chart from './pages/Chart';
import FormElements from './pages/Form/FormElements';
import Inventory from './pages/Items/Inventory/Inventory';
import CreateItemLayout from './pages/Items/CreateItemLayout';
import Godown from './pages/Items/Godown/Godown';
import CreateGodownLayout from './pages/Items/Godown/CreateGodownLayout';
import SalesInvoice from './pages/Sales/SalesInvoice';
import Quotation from './pages/Sales/Quotation';
import PaymentIn from './pages/Sales/PaymentIn';
import SalesReturn from './pages/Sales/SalesReturn';
import CreditNote from './pages/Sales/CreditNote';
import DeliveryChallan from './pages/Sales/DeliveryChallan';
import ProformaInvoice from './pages/Sales/ProformaInvoice';
import CreateSaleInvoiceForm from './pages/Sales/SalesInvoiceComponent/CreateSaleInvoiceForm';
import CreateQuotationForm from './pages/Sales/QuotationComponent/CreateQuotationForm';
import CreatePaymentInForm from './pages/Sales/PaymentInComponent/CreatePaymentInForm';
import CreateSalesReturnForm from './pages/Sales/SalesReturnComponent/CreateSalesReturnForm';
import CreateCreditNoteForm from './pages/Sales/CreditNoteComponent/CreateCreditNoteForm';
import CreateDeliveryChallanForm from './pages/Sales/DeliveryChallanComponent/CreateDeliveryChallanForm';
import CreateProformaInvoiceForm from './pages/Sales/ProformaInvoice/CreateProformaInvoiceForm';
import FormLayout from './pages/Form/FormLayout';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Tables from './pages/Tables';
import Alerts from './pages/UiElements/Alerts';
import Buttons from './pages/UiElements/Buttons';
import DefaultLayout from './layout/DefaultLayout';
import { AuthProvider } from './Context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Theme from './pages/Sales/SalesInvoiceComponent/Theme';
import Theme1 from './pages/Sales/QuotationComponent/Theme1';
import Theme2 from './pages/Sales/SalesReturnComponent/Theme2';
import Theme3 from './pages/Sales/CreditNoteComponent/Theme3';
import Theme4 from './pages/Sales/DeliveryChallanComponent/Theme4';
import Theme5 from './pages/Sales/ProformaInvoice/Theme5';
import EditInvoiceForm from './pages/Sales/SalesInvoiceComponent/EditInvoiceForm';
import EditQuotationForm from './pages/Sales/QuotationComponent/EditQuotationForm';
import EditSalesReturnForm from './pages/Sales/SalesReturnComponent/EditSalesReturn';
import EditCreditNoteForm from './pages/Sales/CreditNoteComponent/EditCreditNoteForm';
import EditDeliveryChallanForm from './pages/Sales/DeliveryChallanComponent/EditDeliveryChallanForm';
import EditProformaInvoiceForm from './pages/Sales/ProformaInvoice/EditProformaInvoiceForm';
import PurchaseInvoice from './pages/Purchase/PurchaseInvoice';
import PaymentOut from './pages/Purchase/PaymentOut';
import PurchaseReturn from './pages/Purchase/PurchaseReturn';
import DebitNote from './pages/Purchase/DebitNote';
import PurchaseOrders from './pages/Purchase/PurchaseOrders';
import CreatePurchaseInvoiceForm from './pages/Purchase/PurchaseInvoiceComponent/CreatePurchaseInvoiceForm';
import CreatePaymentOutForm from './pages/Purchase/PaymentOutComponent/CreatePaymentOutForm';
import CreatePurchaseReturnForm from './pages/Purchase/PurchaseReturnComponent/CreatePurchaseReturnForm';
import CreateDebitNoteForm from './pages/Purchase/DebitNoteComponent/CreateDebitNoteForm';
import CreatePurchaseOrderForm from './pages/Purchase/PurchaseOrderComponet/CreatePurchaseOrderForm';
import PurchaseTheme1 from './pages/Purchase/PurchaseInvoiceComponent/PuchaseTheme1';
import EditPurchaseInvoiceForm from './pages/Purchase/PurchaseInvoiceComponent/EditPurchaseInvoiceform';
import PurchaseTheme2 from './pages/Purchase/PurchaseReturnComponent/PurchaseTheme2';
import EditPurchaseReturnForm from './pages/Purchase/PurchaseReturnComponent/EditPurchaseReturnForm';
import EditDebitNoteForm from './pages/Purchase/DebitNoteComponent/EditDebitNoteForm';
import DebitTheme3 from './pages/Purchase/DebitNoteComponent/DebitTheme3';
import PurchaseTheme4 from './pages/Purchase/PurchaseOrderComponet/PurchaseTheme4';
import EditPurchaseOrderForm from './pages/Purchase/PurchaseOrderComponet/EditPurchaseOrderForm';
import PaymentInDetails from './pages/Sales/PaymentInComponent/PaymentInDetails';
import Dashboard from './pages/Dashboard1/Dashboard';
import PaymentOutDetails from './pages/Purchase/PaymentOutComponent/PaymentOutDetails';
import AllTransactions from './pages/Dashboard1/AllTransactions';
import Favourite from './pages/Reports/Favourite';
import GST from './pages/Reports/GST';
import Transaction from './pages/Reports/Transaction';
import Item from './pages/Reports/Item';
import Party from './pages/Reports/Party';
import ReceivableAgingReport from './pages/Reports/Party/ReceivableAgingReport';
import PartyStatement from './pages/Reports/Party/PartyStatement';
import PartyWiseOutstanding from './pages/Reports/Party/PartyWiseOutstanding';
import SalesSummaryCategoryWise from './pages/Reports/Party/SalesSummaryCategoryWise';
import PartyReportsByItem from './pages/Reports/Party/partyReportsByItem';
import ItemReportsByParty from './pages/Reports/Item/ItemReportsByParty';
import ItemSalesAndPurchaseSummary from './pages/Reports/Item/ItemSalesAndPurchaseSummary';
import LowStockSummary from './pages/Reports/Item/LowStockSummary';
import RateList from './pages/Reports/Item/RateList';
import StockDetailsReport from './pages/Reports/Item/StockDetailsReport';
import StockSummary from './pages/Reports/Item/StockSummary';
import AuditTrial from './pages/Reports/Transaction/AuditTrial';
import BillWiseProfit from './pages/Reports/Transaction/BillWiseProfit';
import CashAndBankReoprts from './pages/Reports/Transaction/CashAndBankReoprts';
import DayBook from './pages/Reports/Transaction/DayBook';
import ExpenseCategoryReport from './pages/Reports/Transaction/ExpenseCategoryReport';
import ExpenseTransactionReport from './pages/Reports/Transaction/ExpenseTransactionReport';
import PurchaseSummary from './pages/Reports/Transaction/PurchaseSummary';
import GSTR2 from './pages/Reports/GST/GSTR2';
import GSTR3b from './pages/Reports/GST/GSTR3b';
import GSTPurchase from './pages/Reports/GST/GSTPurchase';
import GSTSales from './pages/Reports/GST/GSTSales';
import HSNWiseSaleSummary from './pages/Reports/GST/HSNWiseSaleSummary';
import TDSPayable from './pages/Reports/GST/TDSPayable';
import TDSReceivable from './pages/Reports/GST/TDSReceivable';
import TCSPayable from './pages/Reports/GST/TCSPayable';
import TCSReceivable from './pages/Reports/GST/TCSReceivable';
import BalanceSheet from './pages/Reports/Favourite/BalanceSheet';
import GSTR1 from './pages/Reports/Favourite/GSTR1';
import ProfitAndLossReoprt from './pages/Reports/Favourite/ProfitAndLossReoprt';
import SalesSummary from './pages/Reports/Favourite/SalesSummary';
//import PartyDetails from './pages/Form/PartyDetails';
import PartyDetailsWrapper from './pages/Form/PartyDetailsWrapper';
import Account from './pages/Account';
import ManageBusiness from './pages/ManageBusiness';
import CreateBusiness from './pages/CreateBusiness';
import CreateNewUser from './pages/CreateNewUser';
import Expense from './pages/Expense/Expense';
import CreateExpenseForm from './pages/Expense/CreateExpenseForm';
import CreateExpenseItem from './pages/Expense/CreateExpenseItem';
//import CashAndBack from './pages/Cash&Bank/CashAndBank';
import CashAndBank from './pages/Cash&Bank/CashAndBank';
import AutomatedBills from './pages/Automated Bills/AutomatedBills';
import CreateAutomatedBills from './pages/Automated Bills/CreateAutomatedBills';
import { UserProvider } from './Context/TcsContext'; // adjust path accordingly
import Einvoicing from './pages/Einvoicing/Einvoicing';


function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return (
    <TooltipProvider>
      <Toaster />
      <Sonner />
    <AuthProvider>
      {loading ? (
        <Loader />
      ) : (
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Index />} />
          <Route
            path="/auth/signin"
            element={
              <>
                <PageTitle title="Signin | BillBook" />
                <SignIn />
              </>
            }
          />
          {/* Protected Routes - Remove the nested Routes */}
          <Route
            element={
              <UserProvider>
                <ProtectedRoute>
                  <DefaultLayout />
                </ProtectedRoute>
              </UserProvider>
            }
          >
            {/* Use nested routes with the parent layout */}
            <Route
              path="/admin"
              element={
                <>
                  <PageTitle title="Dashboard" />
                  <Dashboard />
                </>
              }
            />
            <Route
              path="/transactions"
              element={
                <>
                  <PageTitle title="Dashboard" />
                  <AllTransactions />
                </>
              }
            />
            <Route path="/calendar" element={

              <>
                <PageTitle title="Calendar | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <Calendar />
              </>

            } />
            <Route path="/profile" element={
              <>
                <PageTitle title="Profile | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <Profile />
              </>
            } />
            <Route path="/forms/form-elements/" element={
              <>
                <PageTitle title="Form Elements | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <FormElements />
              </>
            } />
            <Route path="/party/:partyId" element={
              <>

                <PageTitle title="Form Elements | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <PartyDetailsWrapper />

              </>
            } />
            <Route path="/forms/form-layout" element={

              <>
                <PageTitle title="Form Layout | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <FormLayout />
              </>

            } />
            <Route path="/Items/Inventory" element={

              <>
                <PageTitle title="Form Layout | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <Inventory />
              </>

            } />
            <Route path="/Items/Create-Items-layout" element={

              <>
                <PageTitle title="Form Layout | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <CreateItemLayout />
              </>

            } />
            <Route path="/Items/Godown" element={

              <>
                <PageTitle title="Form Layout | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <Godown />
              </>

            } />
            <Route path="/Items/Godown/Create-Godown-layout" element={

              <>
                <PageTitle title="Form Layout | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <CreateGodownLayout editingGodown={null} />
              </>

            } />
            <Route path="/Items/Godown/edit/:id" element={

              <>
                <PageTitle title="Form Layout | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <CreateGodownLayout editingGodown={null} />
              </>

            } />
            <Route path="/Sales/Sales-Invoice" element={

              <>
                <PageTitle title="Form Layout | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <SalesInvoice />
              </>

            } />
            <Route path="/Sales/Quotation" element={

              <>
                <PageTitle title="Form Layout | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <Quotation />
              </>

            } />
            <Route path="/Sales/Payment-In" element={

              <>
                <PageTitle title="Form Layout | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <PaymentIn />
              </>

            } />
            <Route path="/Sales/Sales-Return" element={

              <>
                <PageTitle title="Form Layout | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <SalesReturn />
              </>

            } />
            <Route path="/Sales/Credit-Note" element={

              <>
                <PageTitle title="Form Layout | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <CreditNote />
              </>

            } />
            <Route path="/Sales/Delivery-Challan" element={

              <>
                <PageTitle title="Form Layout | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <DeliveryChallan />
              </>

            } />
            <Route path="/Sales/Proforma-Invoice" element={

              <>
                <PageTitle title="Form Layout | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <ProformaInvoice />
              </>

            } />
            <Route path="/Sales/Create-Sales-Invoice-form" element={

              <>
                <PageTitle title="Form Layout | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <CreateSaleInvoiceForm />
              </>

            } />
            <Route path="/edit-invoice/:id" element={

              <>
                <PageTitle title="Form Layout | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <EditInvoiceForm />
              </>

            } />
            <Route path="/theme/:id" element={

              <>
                <PageTitle title="Form Layout | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <Theme />
              </>

            } />
            <Route path="/theme1/:id" element={

              <>
                <PageTitle title="Form Layout | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <Theme1 />
              </>

            } />
            <Route path="/theme2/:id" element={

              <>
                <PageTitle title="Form Layout | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <Theme2 />
              </>

            } />
            <Route path="/theme3/:id" element={

              <>
                <PageTitle title="Form Layout | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <Theme3 />
              </>

            } />
            <Route path="/theme4/:id" element={

              <>
                <PageTitle title="Form Layout | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <Theme4 />
              </>

            } />
            <Route path="/theme5/:id" element={

              <>
                <PageTitle title="Form Layout | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <Theme5 />
              </>

            } />
            <Route path="/Sales/Create-Quotation-form" element={

              <>
                <PageTitle title="Form Layout | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <CreateQuotationForm />
              </>

            } />
            <Route path="/edit-quotation/:id" element={

              <>
                <PageTitle title="Form Layout | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <EditQuotationForm />
              </>

            } />
            <Route path="/Sales/Create-PaymentIn-form" element={

              <>
                <PageTitle title="Form Layout | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <CreatePaymentInForm />
              </>

            } />
            <Route path="/Payment-In-Details/:id" element={

              <>
                <PageTitle title="Form Layout | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <PaymentInDetails />
              </>

            } />
            <Route path="/Sales/Create-SalesReturn-form" element={

              <>
                <PageTitle title="Form Layout | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <CreateSalesReturnForm />
              </>

            } />
            <Route path="/edit-salesReturn/:id" element={

              <>
                <PageTitle title="Form Layout | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <EditSalesReturnForm />
              </>

            } />
            <Route path="/Sales/Create-CreditNote-form" element={

              <>
                <PageTitle title="Form Layout | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <CreateCreditNoteForm />
              </>

            } />
            <Route path="/edit-creditnote/:id" element={

              <>
                <PageTitle title="Form Layout | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <EditCreditNoteForm />
              </>

            } />
            <Route path="/Sales/Create-DeliveryChallan-form" element={

              <>
                <PageTitle title="Form Layout | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <CreateDeliveryChallanForm />
              </>

            } />
            <Route path="/edit-deliverychallan/:id" element={

              <>
                <PageTitle title="Form Layout | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <EditDeliveryChallanForm />
              </>

            } />
            <Route path="/Sales/Create-ProformaInvoice-form" element={

              <>
                <PageTitle title="Form Layout | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <CreateProformaInvoiceForm />
              </>

            } />
            <Route path="/edit-proformainvoice/:id" element={

              <>
                <PageTitle title="Form Layout | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <EditProformaInvoiceForm />
              </>

            } />
            <Route path="/Purchase/Purchase-Invoice" element={

              <>
                <PageTitle title="Form Layout | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <PurchaseInvoice />
              </>

            } />
            <Route path="/Purchase/Create-Purchases-Invoice-form" element={

              <>
                <PageTitle title="Form Layout | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <CreatePurchaseInvoiceForm />
              </>

            } />
            <Route path="/edit-purchaseinvoice/:id" element={

              <>
                <PageTitle title="Form Layout | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <EditPurchaseInvoiceForm />
              </>

            } />
            <Route path="/purchasetheme1/:id" element={

              <>
                <PageTitle title="Form Layout | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <PurchaseTheme1 />
              </>

            } />
            <Route path="/Purchase/Payment-Out" element={

              <>
                <PageTitle title="Form Layout | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <PaymentOut />
              </>

            } />
            <Route path="/Purchase/Create-PaymentOut-form" element={

              <>
                <PageTitle title="Form Layout | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <CreatePaymentOutForm />
              </>

            } />
            <Route path="/Payment-Out-Details/:id" element={

              <>
                <PageTitle title="Form Layout | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <PaymentOutDetails />
              </>

            } />
            <Route path="/Purchase/Purchase-Return" element={

              <>
                <PageTitle title="Form Layout | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <PurchaseReturn />
              </>

            } />
            <Route path="/Purchase/Create-PurchasesReturn-form" element={

              <>
                <PageTitle title="Form Layout | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <CreatePurchaseReturnForm />
              </>

            } />
            <Route path="/edit-purchasereturn/:id" element={

              <>
                <PageTitle title="Form Layout | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <EditPurchaseReturnForm />
              </>

            } />
            <Route path="/purchasetheme2/:id" element={

              <>
                <PageTitle title="Form Layout | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <PurchaseTheme2 />
              </>

            } />
            <Route path="/Purchase/Debit-Note" element={

              <>
                <PageTitle title="Form Layout | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <DebitNote />
              </>

            } />
            <Route path="/Purchase/Create-DebitNote-form" element={

              <>
                <PageTitle title="Form Layout | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <CreateDebitNoteForm />
              </>

            } />
            <Route path="/edit-debitnote/:id" element={

              <>
                <PageTitle title="Form Layout | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <EditDebitNoteForm />
              </>

            } />
            <Route path="/debittheme3/:id" element={

              <>
                <PageTitle title="Form Layout | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <DebitTheme3 />
              </>

            } />
            <Route path="/Purchase/Purchase-Orders" element={

              <>
                <PageTitle title="Form Layout | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <PurchaseOrders />
              </>

            } />
            <Route path="/Purchase/Create-PurchasesOrder-form" element={

              <>
                <PageTitle title="Form Layout | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <CreatePurchaseOrderForm />
              </>

            } />
            <Route path="/edit-purchaseorder/:id" element={

              <>
                <PageTitle title="Form Layout | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <EditPurchaseOrderForm />
              </>

            } />
            <Route path="/purchasetheme4/:id" element={

              <>
                <PageTitle title="Form Layout | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <PurchaseTheme4 />
              </>

            } />
            <Route path="/Expenses" element={

              <>
                <PageTitle title="Calendar | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <Expense />
              </>

            } />
            <Route path="/Expenses/Create-Expense" element={

              <>
                <PageTitle title="Calendar | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <CreateExpenseForm />
              </>

            } />
            <Route path="/Expenses/Create-Expense-Item" element={

              <>
                <PageTitle title="Calendar | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <CreateExpenseItem />
              </>

            } />
            <Route path="/Cash-and-Bank" element={

              <>
                <PageTitle title="Calendar | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <CashAndBank />
              </>

            } />
            <Route path="/Automated-Bills" element={

              <>
                <PageTitle title="Calendar | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <AutomatedBills />
              </>

            } />
            <Route path="/E-Invoicing" element={

              <>
                <PageTitle title="Calendar | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <Einvoicing />
              </>

            } />
            <Route path="/Create-Automated-Bills" element={

              <>
                <PageTitle title="Calendar | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <CreateAutomatedBills />
              </>

            } />
            <Route path="/Reports/Favourite" element={

              <>
                <PageTitle title="Form Layout | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <Favourite />
              </>

            } />
            <Route path="/balance-sheet" element={

              <>
                <PageTitle title="Form Layout | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <BalanceSheet />
              </>

            } />
            <Route path="/gstr-1" element={

              <>
                <PageTitle title="Form Layout | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <GSTR1 />
              </>

            } />
            <Route path="/profit-loss-report" element={

              <>
                <PageTitle title="Form Layout | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <ProfitAndLossReoprt />
              </>

            } />
            <Route path="/sales-summary" element={

              <>
                <PageTitle title="Form Layout | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <SalesSummary />
              </>

            } />
            <Route path="/Reports/GST" element={

              <>
                <PageTitle title="Form Layout | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <GST />
              </>

            } />
            <Route path="/gstr-2" element={

              <>
                <PageTitle title="Form Layout | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <GSTR2 />
              </>

            } />
            <Route path="/gstr-3b" element={

              <>
                <PageTitle title="Form Layout | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <GSTR3b />
              </>

            } />
            <Route path="/gst-purchase-hsn" element={

              <>
                <PageTitle title="Form Layout | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <GSTPurchase />
              </>

            } />
            <Route path="/gst-sales-hsn" element={

              <>
                <PageTitle title="Form Layout | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <GSTSales />
              </>

            } />
            <Route path="/hsn-wise-sales-summary" element={

              <>
                <PageTitle title="Form Layout | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <HSNWiseSaleSummary />
              </>

            } />
            <Route path="/tds-payable" element={

              <>
                <PageTitle title="Form Layout | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <TDSPayable />
              </>

            } />
            <Route path="/tds-receivable" element={

              <>
                <PageTitle title="Form Layout | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <TDSReceivable />
              </>

            } />
            <Route path="/tcs-payable" element={

              <>
                <PageTitle title="Form Layout | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <TCSPayable />
              </>

            } />
            <Route path="/tcs-receivable" element={

              <>
                <PageTitle title="Form Layout | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <TCSReceivable />
              </>

            } />
            <Route path="/Reports/Transaction" element={

              <>
                <PageTitle title="Form Layout | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <Transaction />
              </>

            } />
            <Route path="/audit-trail" element={

              <>
                <PageTitle title="Form Layout | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <AuditTrial />
              </>

            } />
            <Route path="/bill-wise-profit" element={

              <>
                <PageTitle title="Form Layout | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <BillWiseProfit />
              </>

            } />
            <Route path="/cash-bank-report" element={

              <>
                <PageTitle title="Form Layout | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <CashAndBankReoprts />
              </>

            } />
            <Route path="/daybook" element={

              <>
                <PageTitle title="Form Layout | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <DayBook />
              </>

            } />
            <Route path="/expense-category-report" element={

              <>
                <PageTitle title="Form Layout | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <ExpenseCategoryReport />
              </>

            } />
            <Route path="/expense-transaction-report" element={

              <>
                <PageTitle title="Form Layout | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <ExpenseTransactionReport />
              </>

            } />
            <Route path="/purchase-summary" element={

              <>
                <PageTitle title="Form Layout | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <PurchaseSummary />
              </>

            } />
            <Route path="/Reports/Items" element={

              <>
                <PageTitle title="Form Layout | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <Item />
              </>

            } />
            <Route path="/item-report-by-party" element={

              <>
                <PageTitle title="Form Layout | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <ItemReportsByParty />
              </>

            } />
            <Route path="/item-sales-purchase-summary" element={

              <>
                <PageTitle title="Form Layout | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <ItemSalesAndPurchaseSummary />
              </>

            } />
            <Route path="/low-stock-summary" element={

              <>
                <PageTitle title="Form Layout | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <LowStockSummary />
              </>

            } />
            <Route path="/rate-list" element={

              <>
                <PageTitle title="Form Layout | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <RateList />
              </>

            } />
            <Route path="/stock-detail-report" element={

              <>
                <PageTitle title="Form Layout | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <StockDetailsReport />
              </>

            } />
            <Route path="/stock-summary" element={

              <>
                <PageTitle title="Form Layout | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <StockSummary />
              </>

            } />
            <Route path="/Reports/Party" element={

              <>
                <PageTitle title="Form Layout | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <Party />
              </>

            } />
            <Route path="/receivable-ageing-report" element={

              <>
                <PageTitle title="Form Layout | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <ReceivableAgingReport />
              </>

            } />
            <Route path="/party-report-by-item" element={

              <>
                <PageTitle title="Form Layout | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <PartyReportsByItem />
              </>

            } />
            <Route path="/party-statement" element={

              <>
                <PageTitle title="Form Layout | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <PartyStatement />
              </>

            } />
            <Route path="/party-wise-outstanding" element={

              <>
                <PageTitle title="Form Layout | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <PartyWiseOutstanding />
              </>

            } />
            <Route path="/sales-summary-category" element={

              <>
                <PageTitle title="Form Layout | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <SalesSummaryCategoryWise />
              </>

            } />
            <Route path="/tables" element={

              <>
                <PageTitle title="Tables | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <Tables />
              </>

            } />
            <Route path="/settings" element={

              <>
                <PageTitle title="Settings | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <Settings />
              </>

            } />
            <Route path="/Accounts" element={

              <>
                <PageTitle title="Settings | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <Account />
              </>

            } />
            <Route path="/Create-Business" element={

              <>
                <PageTitle title="Settings | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <CreateBusiness />
              </>

            } />
            <Route path="/Manage-Business" element={

              <>
                <PageTitle title="Settings | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <ManageBusiness />
              </>

            } />
            <Route path="/Create-New-User" element={

              <>
                <PageTitle title="Settings | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <CreateNewUser />
              </>

            } />
            <Route path="/Create-New-User/:userId" element={

              <>
                <PageTitle title="Settings | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <CreateNewUser />
              </>

            } />
            <Route path="/chart" element={

              <>
                <PageTitle title="Basic Chart | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <Chart />
              </>

            } />
            <Route path="/ui/alerts" element={

              <>
                <PageTitle title="Alerts | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <Alerts />
              </>

            } />
            <Route path="/ui/buttons" element={

              <>
                <PageTitle title="Buttons | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <Buttons />
              </>

            } />
          </Route>
          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      )}
    </AuthProvider>
    </TooltipProvider>
  );
}

export default App;
