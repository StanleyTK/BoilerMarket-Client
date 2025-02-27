import React from "react";

interface WarningModalProps {
  message: string;
  onClose: () => void;
}

export const WarningModal: React.FC<WarningModalProps> = ({ message, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
      {/* Modal content */}
      <div className="bg-white dark:bg-gray-700 p-6 rounded shadow-lg z-10">
        <p className="text-black dark:text-white">{message}</p>
        <button
          onClick={onClose}
          className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
};

interface ConfirmationModalProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  message,
  onConfirm,
  onCancel,
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black opacity-50" onClick={onCancel}></div>
      {/* Modal content */}
      <div className="bg-white dark:bg-gray-700 p-6 rounded shadow-lg z-10">
        <p className="text-black dark:text-white">{message}</p>
        <div className="mt-4 flex space-x-4">
          <button
            onClick={onConfirm}
            className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded"
          >
            Delete
          </button>
          <button
            onClick={onCancel}
            className="bg-gray-500 hover:bg-gray-600 text-white py-1 px-3 rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
