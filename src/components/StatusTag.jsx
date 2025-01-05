import PropTypes from 'prop-types'
import { getStatusBgColor, statusToStringDisplay } from '../utils/status';

/**
 * 
 * @param {status}  status ['ToDo', 'InProgress', 'Completed', 'Expired']
 * @returns Tag with status text and background color
 */
const StatusTag = ({ status }) => {
  const text = statusToStringDisplay(status);
  const color = getStatusBgColor(status);
  return (
    <div className={`px-2 py-1 w-fit rounded-sm text-[10px] uppercase font-bold text-text-secondary text-center`} style={{ backgroundColor: color }}>
      {text}
    </div>
  )
};

StatusTag.propTypes = {
  status: PropTypes.string.isRequired,
};

export default StatusTag;