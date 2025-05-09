import React, { useState, ChangeEvent } from 'react';

// Define the type for the props
interface UploadSignatureProps {
  setSignatureUrl: (url: string | null) => void;
}

const UploadSignature: React.FC<UploadSignatureProps> = ({ setSignatureUrl }) => {
  const [signature, setSignature] = useState<string | null>(null);
  const [isClicked, setIsClicked] = useState<boolean>(false);

  // Function to handle file selection
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      const reader = new FileReader();
      
      reader.onloadend = () => {
        const imageUrl = reader.result as string; // Cast to string
        setSignature(imageUrl);
        setSignatureUrl(imageUrl); // ✅ Send to parent component
      };

      reader.readAsDataURL(file);
      setIsClicked(false); // Reset click effect
    }
  };

  return (
    <div>
      {/* Hidden file input */}
      <input
        type="file"
        accept="image/*"
        className="hidden"
        id="signatureUpload"
        onChange={handleFileChange}
      />

      {/* Upload Button */}
      <label
        htmlFor="signatureUpload"
        className={`cursor-pointer rounded-lg px-6 py-3 
          transition-all duration-200 ease-in-out
          ${isClicked ? 'bg-blue-600 text-white scale-95' : 'hover:bg-blue-500 hover:text-white'}`}
        onMouseDown={() => setIsClicked(true)}
        onMouseUp={() => setIsClicked(false)}
      >
        {signature ? 'Change Signature' : '+ Add Signature'}
      </label>

      {/* Display Uploaded Signature */}
      {signature && (
        <div className="mt-4 text-center">
          <p className="text-gray-700">Uploaded Signature:</p>
          <div className="flex justify-center">
            <img
              src={signature}
              alt="Signature"
              className="mt-2 w-32 h-16 border border-gray-300 rounded shadow-md object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadSignature;
