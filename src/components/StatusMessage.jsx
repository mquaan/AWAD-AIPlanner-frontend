// src/components/StatusMessage.jsx
import '../styles/StatusMessage.css';
import PropTypes from 'prop-types';

function StatusMessage({ message, type }) {
  if (!message) return null; // Render nothing if no message

  return (
    <div className={`status-message ${type}`}>
      {message}
    </div>
  );
}

StatusMessage.propTypes = {
    message: PropTypes.string,
    type: PropTypes.string,
};

export default StatusMessage;
