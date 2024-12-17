import { RiCalendarCheckLine } from 'react-icons/ri'
import PropTypes from 'prop-types'

function TaskList({ task, onClick }) {
  return (
    <div key={task.id} className="relative">
      <div
        className="flex items-start gap-4 py-4 cursor-pointer hover:bg-gray-50 transition"
        onClick={onClick}
      >
        <div className="flex items-center justify-center w-5 h-5 rounded-full border-2 border-gray-400 hover:border-red-500 transition">
          {task.status === 'Completed' && (
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          )}
        </div>
        <div className="flex-1">
          <h3 className="text-base font-medium text-gray-800 hover:text-red-500">
            {task.name}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            {task.description || 'No description available'}
          </p>
          <div className="flex items-center gap-1 text-gray-400 text-xs mt-1">
            <RiCalendarCheckLine size={14} />
            <span>{task.estimated_end_time || 'No end date'}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

TaskList.propTypes = {
  task: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default TaskList