import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { twMerge } from 'tailwind-merge';
import { LiaTimesSolid } from 'react-icons/lia';

const DialogHeader = ({ title, onClose }) => {
  return (
    <div className="sticky top-0 left-0 bg-white w-full">
      <div className="flex items-center justify-between pl-6 pr-5 py-4 text-gray-700">
        <h2 className="text-lg font-semibold">{title}</h2>
        <button
          className="hover:text-black hover:bg-gray-200 p-1 rounded-lg"
          onClick={onClose}
        >
          <LiaTimesSolid />
        </button>
      </div>
      <hr className="border-t border-gray-200" />
    </div>
  );
};

const DialogBody = ({ children }) => {
  return (
    <div className="p-5">
      {children}
    </div>
  );
};

const DialogFooter = ({ children }) => {
  return (
    <div className="flex justify-end space-x-4 p-5 border-t border-gray-200">
      {children}
    </div>
  );
};

const Dialog = ({ isOpen, onClose, children, className }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[10000]">
      <div
        className={twMerge("bg-white rounded-lg shadow-lg w-[700px] max-h-[calc(100vh-2rem)] overflow-auto", className)}
        ref={modalRef}
      >
        {children}
      </div>
    </div>
  );
};

DialogHeader.propTypes = {
  title: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

DialogBody.propTypes = {
  children: PropTypes.node.isRequired,
};

DialogFooter.propTypes = {
  children: PropTypes.node.isRequired,
};

Dialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export { Dialog, DialogHeader, DialogBody, DialogFooter };