// components/Modal.tsx
import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-[90%] max-w-3xl mx-auto p-6 bg-white rounded-lg dark:bg-boxdark">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-black dark:text-white"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
