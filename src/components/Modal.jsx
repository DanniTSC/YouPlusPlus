
import React from 'react';
import { FiX } from 'react-icons/fi';

const Modal = ({ children, onClose }) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
      >
        <FiX size={24} />
      </button>
      {children}
    </div>
  </div>
);

export default Modal;
