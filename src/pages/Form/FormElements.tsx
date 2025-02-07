import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import CheckboxFive from '../../components/Checkboxes/CheckboxFive';
import CheckboxFour from '../../components/Checkboxes/CheckboxFour';
import CheckboxOne from '../../components/Checkboxes/CheckboxOne';
import CheckboxThree from '../../components/Checkboxes/CheckboxThree';
import CheckboxTwo from '../../components/Checkboxes/CheckboxTwo';
import SwitcherFour from '../../components/Switchers/SwitcherFour';
import SwitcherOne from '../../components/Switchers/SwitcherOne';
import SwitcherThree from '../../components/Switchers/SwitcherThree';
import SwitcherTwo from '../../components/Switchers/SwitcherTwo';
import DatePickerOne from '../../components/Forms/DatePicker/DatePickerOne';
import DatePickerTwo from '../../components/Forms/DatePicker/DatePickerTwo';
import SelectGroupTwo from '../../components/Forms/SelectGroup/SelectGroupTwo';
import MultiSelect from '../../components/Forms/MultiSelect';
import Transactiontable from './Transactiontable';
import CreateParty from './CreateParty';
import TotalTransactions from "./TotalTransactions";


const FormElements = () => {
  return (
    <>
      <h4 className="text-2xl font-bold mb-4">Parties</h4>
      <TotalTransactions />
      <CreateParty />
      <Transactiontable />
    </>
  );
};

export default FormElements;
