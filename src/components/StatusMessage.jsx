// src/components/StatusMessage.jsx
import PropTypes from 'prop-types';

function StatusMessage({ message, type }) {
  console.log(message)
  
  if (!message) return null; // Render nothing if no message

  const bgColor = type === 'success'
    ? 'bg-success'
    : type === 'error'
    ? 'bg-error'
    : type === 'warning'
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
