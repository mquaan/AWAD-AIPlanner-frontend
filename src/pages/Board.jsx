import TaskBoard from '../components/TaskBoard';

import { useTask } from '../context/TaskContext';
import { useNavigate } from 'react-router-dom';

const Board = () => {
  const navigate = useNavigate();
  
  const { tasks, filters, setSelectedTask, setIsModalOpen } = useTask();

  const statuses = ['ToDo', 'InProgress', 'Completed', 'Expired'];

  const openModal = (task_id, status) => {
    if (task_id === 'new') {
      setSelectedTask({status: status});
      setIsModalOpen(true);
    }
    else
      navigate(`/task/${task_id}`);
  };

  return (
    <div className="flex flex-wrap gap-12 mt-2">
      {statuses
        .filter((status) => filters.showExpiredTasks || status !== 'Expired')
        .map((status) => (
          <div key={status} className="flex-1 py-4 rounded-xl">
            <div className='flex mb-4 gap-2 items-end'>
              <h2 className="text-lg text-gray-600 font-semibold flex items-center gap-2">
                {status === 'ToDo' ? 'TO DO' : status === 'InProgress' ? 'IN PROGRESS' : status.toUpperCase()}
              </h2>
              <p className='text-sm text-text-neutral pb-[2.5px]'>
                {tasks.filter((task) => task.status === status).length}
              </p>
            </div>
            <div className="space-y-3">
              {tasks
                .filter((task) => task.status === status)
                .map((task) => (
                  <TaskBoard key={task.id} task={task} onClick={() => openModal(task.id, '')}/>
                ))}
            </div>
            {['ToDo', 'InProgress'].includes(status) && (
            <div
              onClick={() => openModal('new', status)}
              className="group mt-3 w-full p-2 flex gap-2 items-center cursor-pointer"
            >
              <p className="text-[20px] font-extralight w-4 h-4 flex items-center justify-center text-primary rounded-full group-hover:bg-primary group-hover:text-background transition">
                +
              </p>
              <p className="text-text-neutral group-hover:text-primary transition">Add task</p>
            </div>
          )}
          </div>
        ))}
    </div>
  );
};

export default Board;