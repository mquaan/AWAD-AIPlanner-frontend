import PropTypes from 'prop-types';
import { RiCalendarCheckLine } from 'react-icons/ri';

const TaskBoard = ({ task, onClick }) => {
  // Hàm format thời gian
  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const now = new Date();

    const isCurrentYear = date.getFullYear() === now.getFullYear();

    // Format chuỗi thời gian
    const options = {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      ...(isCurrentYear ? {} : { year: 'numeric' }), // Chỉ thêm năm nếu không phải năm hiện tại
    };

    return new Intl.DateTimeFormat('vi-VN', options).format(date);
  };

  return (
    <div
      key={task.id}
      className="p-3 border border-[#d8d8d8] rounded-xl shadow-sm flex gap-4
                hover:shadow-md transition duration-300 cursor-pointer"
      onClick={onClick}
    >
      {/* Priority circle */}
      <div
        className={`mt-4 w-3 h-3 rounded-full ${
          task.priority === 'High'
            ? 'bg-red-600'
            : task.priority === 'Medium'
            ? 'bg-yellow-500'
            : 'bg-blue-600'
        }`}
      ></div>
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <h3 className="font-semibold">{task.name}</h3>
          <p className="text-sm text-gray-600">{task.description}</p>
        </div>
        <div className="flex items-center gap-1 text-teal-600">
          <RiCalendarCheckLine size={14} />
          <span className="text-sm">{task.estimated_end_time ? formatDate(task.estimated_end_time) : 'No end date'}</span>
        </div>
      </div>
    </div>
  );
};

TaskBoard.propTypes = {
  task: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default TaskBoard;
