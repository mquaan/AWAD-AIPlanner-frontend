// src/components/StatusMessage.jsx
import PropTypes from 'prop-types';

function StatusMessage({ message, type }) {
  if (!message) return null; // Render nothing if no message

  return (
    <div 
      className={`w-[250px] text-center fixed top-[25px] right-[20px] p-[15px] rounded-lg
                text-slate-100 shadow-lg z-auto transition-opacity duration-300
                ${type === 'success' ? 'bg-[#25813b] opacity-1' : 'bg-[#972934] opacity-1'}`}
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
