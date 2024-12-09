import { createContext, useContext, useState } from "react";
import PropTypes from 'prop-types';

const ToastContext = createContext();

const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState({ type: '', message: '' });

  const showToast = (type, message, duration = 3000) => {
    setToast({ type, message });

    setTimeout(() => {
      setToast({ type: '', message: '' });
    }, duration);
  };

  return (
    <ToastContext.Provider value={{
      toast,
      showToast
    }}>
      {children}
    </ToastContext.Provider>
  );
}

ToastProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ToastProvider;
export const useToast = () => useContext(ToastContext);
