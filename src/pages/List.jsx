
import { useEffect, useState } from 'react';
import { useTask } from '../context/TaskContext';
import { useNavigate } from 'react-router-dom';
import TaskList from '../components/TaskList';

const List = () => {
  const navigate = useNavigate();
  const { tasks, filters, setSelectedTask, setIsModalOpen } = useTask();
  const [tasksData, setTasksData] = useState([]);

  const sortedTasks = tasks.sort((a, b) => {
    if (!a.estimated_end_time) return 1;
    if (!b.estimated_end_time) return -1;
    const timeComparison = new Date(a.estimated_end_time) - new Date(b.estimated_end_time);
    if (timeComparison !== 0) return timeComparison;
    return a.priority - b.priority;
  });

  const filteredTasks = sortedTasks.filter(task => task.status !== 'Completed' && task.status !== 'Expired');
  const completedTasks = sortedTasks.filter(task => task.status === 'Completed');
  const expiredTasks = sortedTasks.filter(task => task.status === 'Expired');

  useEffect(() => {
    setTasksData([...filteredTasks, ...completedTasks, ...expiredTasks]);
  }, [tasks, filters]);

  const openModal = (task_id) => {
    if (task_id === 'new') {
      setSelectedTask({});
      setIsModalOpen(true);
    }
    else
      navigate(`/task/${task_id}`);
  };

  return (
    <div className="flex flex-col border-gray-200">
      <div
        onClick={() => openModal('new')}
        className="group mb-2 w-full p-[18px] flex gap-2 items-center cursor-pointer"
      >
        <p className="text-[20px] mt-[1px] ml-[1px] font-extralight w-4 h-4 flex items-center justify-center text-primary rounded-full group-hover:bg-primary group-hover:text-background transition">
          +
        </p>
        <p className="text-text-neutral group-hover:text-primary transition">Add task</p>
      </div>
      {tasksData
        .filter((task) => filters.showCompletedTasks || task.status !== 'Completed')
        .filter((task) => filters.showExpiredTasks || task.status !== 'Expired')
        .map((task) => (
        <TaskList key={task.id} task={task} onClick={() => openModal(task.id)} />
      ))}
    </div>
  );
};

export default List;
