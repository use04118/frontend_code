import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface UploadSignatureProps {
  setSignatureUrl: React.Dispatch<React.SetStateAction<string | null>>;
  setSignatureFile: React.Dispatch<React.SetStateAction<File | null>>;
}

const UploadSignature: React.FC<UploadSignatureProps> = ({ setSignatureUrl, setSignatureFile }) => {
  const [signature, setSignature] = useState<File | null>(null);
  const [previewURL, setPreviewURL] = useState<string | null>(null);
  const [isClicked, setIsClicked] = useState<boolean>(false);

  useEffect(() => {
    if (signature) {
      const url = URL.createObjectURL(signature);
      setPreviewURL(url);
      setSignatureUrl(url); // ✅ Send URL for preview
      setSignatureFile(signature); // ✅ Send file to parent
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewURL(null);
    }
  }, [signature, setSignatureUrl, setSignatureFile]);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (file) {
      setSignature(file);
      try {
        // Example of uploading the file to the server
        const formData = new FormData();
        formData.append('signature', file);

        const token = localStorage.getItem('accessToken'); // Assuming you have token in localStorage
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/upload-signature`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        });

        // Assuming response.data contains the URL of the uploaded signature
        console.log('Signature uploaded:', response.data.url);
        setSignatureUrl(response.data.url); // Set the uploaded URL
      } catch (error) {
        console.error('Error uploading signature:', error);
      }
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" className="hidden" id="signatureUpload" onChange={handleFileChange} />

      <label
        htmlFor="signatureUpload"
        className={`cursor-pointer rounded-lg px-6 py-3 transition-all duration-200 ease-in-out ${
          isClicked ? 'bg-blue-600 text-white scale-95' : 'hover:bg-blue-500 hover:text-white'
        }`}
        onMouseDown={() => setIsClicked(true)}
        onMouseUp={() => setIsClicked(false)}
      >
        {signature ? 'Change Signature' : '+ Add Signature'}
      </label>

      {previewURL && (
        <div className="mt-4 text-center">
          <p className="text-gray-700">Uploaded Signature:</p>
          <div className="flex justify-center">
            <img
              src={previewURL}
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
