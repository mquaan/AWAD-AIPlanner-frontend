// src/components/StatusMessage.jsx
import PropTypes from 'prop-types';
import { STATUS_MESSAGE } from '../constants';

function StatusMessage({ message, type }) {
  if (!message) return null; // Render nothing if no message

  const bgColor = type === STATUS_MESSAGE.SUCCESS
    ? 'bg-success'
    : type === STATUS_MESSAGE.ERROR
    ? 'bg-error'
    : type === STATUS_MESSAGE.WARNING
    ? 'bg-warning'
    : 'bg-background-neutral';

  return (
    <div 
      className={`w-[250px] text-center fixed top-[25px] right-[20px] p-[15px] rounded-lg
                text-slate-100 shadow-lg z-[100] transition-opacity duration-300
                ${bgColor}`}
    >
      {message}
    </div>
  );
}

StatusMessage.propTypes = {
    message: PropTypes.string,
    type: PropTypes.string,
};

export default StatusMessage;
