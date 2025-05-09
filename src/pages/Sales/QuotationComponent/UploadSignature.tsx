import React, { useState, ChangeEvent, MouseEvent } from 'react';
import axios from 'axios';

interface UploadSignatureProps {
  setSignatureUrl: (url: string | null) => void;
}

const UploadSignature: React.FC<UploadSignatureProps> = ({ setSignatureUrl }) => {
  const [signature, setSignature] = useState<string | null>(null);
  const [isClicked, setIsClicked] = useState<boolean>(false);

  // Handles file selection and conversion to Base64
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const imageUrl = reader.result as string;
      setSignature(imageUrl);
      setSignatureUrl(imageUrl);

      // Optional: Upload to backend using axios
      try {
        // Example upload logic (uncomment if needed)
        /*
        const formData = new FormData();
        formData.append('signature', file);

        const response = await axios.post('/api/upload-signature', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        // If backend responds with URL
        const uploadedUrl = response.data.url;
        setSignatureUrl(uploadedUrl);
        */
      } catch (error) {
        console.error('Error uploading signature:', error);
      }
    };

    reader.readAsDataURL(file);
    setIsClicked(false);
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
          ${
            isClicked
              ? 'bg-blue-600 text-white scale-95'
              : 'hover:bg-blue-500 hover:text-white'
          }`}
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
