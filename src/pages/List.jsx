// import TaskBoard from '../components/TaskBoard';
import { useTask } from '../context/TaskContext';
import { useNavigate } from 'react-router-dom';
import TaskList from '../components/TaskList';

const List = () => {
  const navigate = useNavigate();
  const { tasks, filters, setSelectedTask, setIsModalOpen } = useTask();
  const openModal = (task_id) => {
    if (task_id === 'new') {
      setSelectedTask({});
      setIsModalOpen(true);
    }
    else
      navigate(`/task/${task_id}`);
  };

  return (
    <div className="flex flex-col mt-4 border-gray-200">
      {tasks
        .filter((task) => filters.showCompletedTasks || task.status !== 'Completed')
        .filter((task) => filters.showExpiredTasks || task.status !== 'Expired')
        .map((task) => (
        <TaskList key={task.id} task={task} onClick={() => openModal(task.id)} />
      ))}
      <div
        onClick={() => openModal('new', status)}
        className="group mt-3 w-full p-2 flex gap-2 items-center cursor-pointer"
      >
        <p className="text-[20px] font-extralight w-4 h-4 flex items-center justify-center text-primary rounded-full group-hover:bg-primary group-hover:text-background transition">
          +
        </p>
        <p className="text-text-neutral group-hover:text-primary transition">Add task</p>
      </div>
    </div>
  );
};

export default List;
