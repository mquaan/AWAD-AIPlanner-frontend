import { RiCalendarCheckLine } from 'react-icons/ri'
import PropTypes from 'prop-types'
import { updateTaskStatus } from '../service/taskApi';
import { useTask } from '../context/TaskContext';
import { useToast } from '../context/ToastContext';
import { FaCheck } from "react-icons/fa6";

function TaskList({ task, onClick }) {

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

  const { showToast } = useToast();
  const { setTasks } = useTask();
  const handleCompletedTask = async (task) => {
    const updatedTask = { ...task, status: task.status === 'Completed' ? 'ToDo' : 'Completed' };
    try {
      await updateTaskStatus(updatedTask);
      setTasks((tasks) => tasks.map((task) => task.id === updatedTask.id ? updatedTask : task));
    } catch (error) {
      showToast('error', error.response?.data?.message);
    }
  }
  
  const priorityColor = task.priority === 'High' ? 'priority-high' : 
                        task.priority === 'Medium' ? 'priority-medium' : 'priority-low';
  const priorityColorText = task.priority === 'High' ? 'text-priority-high' :
                            task.priority === 'Medium' ? 'text-priority-medium' : 'text-priority-low';

  return (
    <div key={task.id} className={`relative ${['Completed', 'Expired'].includes(task.status) ? 'opacity-50' : ''}`}>
      <div
        className="flex items-start gap-4 px-4 pt-4 py-2 rounded-xl cursor-pointer transition hover:bg-gray-100"
        onClick={onClick}
      >
        {task.status !== 'Expired' &&
          <div 
            onClick={
              async (e) => {
                e.stopPropagation();
                await handleCompletedTask(task);
              }
            }
            className={`mt-2 flex items-center justify-center w-5 h-5 rounded-full border-[2px] transition 
                        group border-${priorityColor}`}
          >
              {task.status === 'Completed' && <div className={`w-3 h-3 bg-${priorityColor} rounded-full group-hover:opacity-70`}></div>}
              {task.status !== 'Completed' && <div className={`w-4 h-4 bg-${priorityColor} opacity-10 rounded-full`}></div>}
              {task.status !== 'Completed' && <FaCheck className={`opacity-0 ${priorityColorText} absolute w-3 group-hover:opacity-100`}/>}
          </div>
        }
        {task.status === 'Expired' &&
          <div className="w-5 h-5"></div>
        }
        <div className="flex-1">
          <h3 className={`text-base font-medium text-gray-800 transition 
              ${['Completed', 'Expired'].includes(task.status) ? 'line-through' : ''}`}>
            {task.name}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {task.description}
          </p>
          <div className="flex items-center gap-1 text-gray-500 mt-2">
            <RiCalendarCheckLine size={15} className='mb-[2px]' />
            <span className="text-sm">{task.estimated_end_time ? formatDate(task.estimated_end_time) : 'No end date'}</span>
          </div>
        </div>
      </div>
      <div className='flex justify-center'>
        <div className='w-[98%] border-b'></div>
      </div>
    </div>
  )
}

TaskList.propTypes = {
  task: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default TaskList