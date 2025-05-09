import React, { useState, useEffect } from 'react';

interface UploadSignatureProps {
  setSignatureUrl: (url: string | null) => void;
  setSignatureFile: (file: File | null) => void;
}

const UploadSignature: React.FC<UploadSignatureProps> = ({
  setSignatureUrl,
  setSignatureFile,
}) => {
  const [signature, setSignature] = useState<File | null>(null);
  const [previewURL, setPreviewURL] = useState<string | null>(null);
  const [isClicked, setIsClicked] = useState<boolean>(false);

  useEffect(() => {
    if (signature) {
      const url = URL.createObjectURL(signature);
      setPreviewURL(url);
      setSignatureUrl(url); // Pass preview URL to parent
      setSignatureFile(signature); // Pass file to parent
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewURL(null);
    }
  }, [signature, setSignatureUrl, setSignatureFile]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSignature(file);
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        className="hidden"
        id="signatureUpload"
        onChange={handleFileChange}
      />

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
