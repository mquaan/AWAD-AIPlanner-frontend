import PropTypes from 'prop-types'
import { getPriorityColor } from '../utils/priority';
import StatusTag from './StatusTag';

const UnassignedTaskCard = ({ task, ...props }) => {
  const color = getPriorityColor(task.priority);
  const dataString = JSON.stringify(task);
  return (
    <div
      className={`event-item-unassigned p-2 rounded-lg shadow flex gap-2 bg-white hover:cursor-pointer`}
      data-event={dataString}
      {...props}
    >
      <div
        className={`mt-[6px] w-3 h-3 rounded-full`}
        style={{ backgroundColor: color }}
      ></div>
      <div className="flex flex-col gap-1">
        <h3 className="font-medium">{task.name}</h3>
        <StatusTag status={task.status} />
      </div>
    </div>
  );
};

UnassignedTaskCard.propTypes = {
  task: PropTypes.object.isRequired,
}

export default UnassignedTaskCard;