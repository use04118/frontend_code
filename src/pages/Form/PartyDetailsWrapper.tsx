// PartyDetailsWrapper.jsx
import { useNavigate, useParams } from 'react-router-dom';
import PartyDetails from './PartyDetails';


const PartyDetailsWrapper = () => {
  const { partyId } = useParams();
  const navigate = useNavigate()

  const handleBack = () => {
    navigate(-1)
  }
   

  return (
    <>
    <PartyDetails
      partyId={partyId}
      isEditing={false}
      onBack={() => window.history.back()}
      onUpdateParty={() => {}}
    />
    <div className="flex justify-start gap-4 mt-2">
        <button
          type="button"
          onClick={handleBack}
          className="rounded border border-blue-400 px-4 py-2 text-white bg-blue-500 dark:border-gray-600 dark:text-white dark:hover:bg-gray-700"
        >
          Back
        </button>
      </div>
    </>
    
  );
};

export default PartyDetailsWrapper;
