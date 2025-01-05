// src/components/StatusMessage.jsx
import PropTypes from 'prop-types';
import { twMerge } from 'tailwind-merge';

function StatusMessage({ message, type='' }) {  
  if (!message) return null; // Render nothing if no message

  const styles = type === 'success'
    ? 'bg-success'
    : type === 'error'
    ? 'bg-error'
    : type === 'warning'
    ? 'bg-warning'
    : type === 'info'
    ? 'bg-info'
    : 'bg-white text-text-primary';

  return (
    <div 
      className={twMerge(`w-[250px] text-center fixed top-[25px] right-[20px] p-[15px] rounded-md
                text-slate-100 shadow-lg z-[10100] transition-opacity duration-300`, styles)}
    >
      {message}
    </div>
  );
}

StatusMessage.propTypes = {
  message: PropTypes.string,
  type: PropTypes.oneOf([ 'success', 'error', 'warning', 'info', '' ]),
};

export default StatusMessage;
