import { useDraggable } from '@dnd-kit/core';
import PropTypes from 'prop-types';
import { RiCalendarCheckLine } from 'react-icons/ri';
import { useState } from 'react';

const TaskBoard = ({ task, onClick }) => {
  const [clickTimeout, setClickTimeout] = useState(null);
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
    data: { task },
  });

  const style = transform
    ? {
      transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      transition: isDragging ? 'none' : 'transform 400ms ease',
      zIndex: isDragging ? 1000 : 1,
      boxShadow: isDragging ? '0 4px 12px rgba(0, 0, 0, 0.2)' : 'none',
    }
    : undefined;

  // Hàm format thời gian
  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const now = new Date();

    const isCurrentYear = date.getFullYear() === now.getFullYear();

    const options = {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      ...(isCurrentYear ? {} : { year: 'numeric' }),
    };

    return new Intl.DateTimeFormat('vi-VN', options).format(date);
  };

  const handleMouseDown = () => {
    const timeout = setTimeout(() => setClickTimeout(null), 150); // Set thời gian để phân biệt drag và click
    setClickTimeout(timeout);
  };

  const handleMouseUp = () => {
    if (clickTimeout) {
      clearTimeout(clickTimeout);
      setClickTimeout(null);
      onClick();
    }
  };

  return (
    <div
      ref={setNodeRef}
      key={task.id}
      style={style}
      {...listeners}
      {...attributes}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      className="py-[12px] px-5 border w-[95%] border-[#d8d6d6] rounded-xl shadow-sm flex gap-4
                hover:shadow-md transition duration-300 cursor-pointer"
    >
      {/* Priority circle */}
      <div
        className={`mt-4 w-3 h-3 rounded-full ${task.priority === 'High'
            ? 'bg-priority-high'
            : task.priority === 'Medium'
              ? 'bg-priority-medium'
              : 'bg-priority-low'
          }`}
      ></div>
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <h3 className="font-medium">{task.name}</h3>
          <p className="text-sm text-gray-600">{task.description}</p>
        </div>
        <div className="flex items-center gap-1 text-gray-500">
          <RiCalendarCheckLine size={15} className="mb-[2px]" />
          <span className="text-sm">
            {task.estimated_end_time ? formatDate(task.estimated_end_time) : 'No end date'}
          </span>
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
