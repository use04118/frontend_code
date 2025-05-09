import { useState, useEffect, ChangeEvent } from "react";

interface ImageUploadFieldProps {
  value: File | null;
  onChange: (file: File | null) => void;
}

const ImageUploadField: React.FC<ImageUploadFieldProps> = ({ value, onChange }) => {
  const [previewURL, setPreviewURL] = useState<string | null>(null);

  useEffect(() => {
    if (value instanceof File) {
      const url = URL.createObjectURL(value);
      setPreviewURL(url);
      return () => URL.revokeObjectURL(url); // Cleanup memory leak
    } else {
      setPreviewURL(null);
    }
  }, [value]);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    onChange(file);
  };

  return (
    <div className="p-4 border border-gray-300 rounded-md">
      <label className="block text-black dark:text-white mb-2">Upload Item Image</label>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="w-full p-2 border border-gray-300  rounded"
      />

      {previewURL && (
        <div className="mt-4">
          <p className="text-sm text-gray-600">Image Preview:</p>
          <img src={previewURL} alt="Preview" className="mt-2 w-32 h-32 object-cover rounded" />
        </div>
      )}
    </div>
  );
};

export default ImageUploadField;
