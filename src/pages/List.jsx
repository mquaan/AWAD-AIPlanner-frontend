
import { useEffect, useState } from 'react';
import { useTask } from '../context/TaskContext';
import { useNavigate } from 'react-router-dom';
import CheckableTaskCard from '../components/CheckableTaskCard';
import { useToast } from '../context/ToastContext';
import { updateTaskStatus } from '../service/taskApi';

const List = () => {
  const navigate = useNavigate();
  const { tasks, filters, setSelectedTask, setIsModalOpen, setTasks } = useTask();
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

  const { showToast } = useToast();
  const handleCompletedTask = async (task) => {
    const updatedTask = { ...task, status: task.status === 'Completed' ? 'ToDo' : 'Completed' };
    try {
      await updateTaskStatus(updatedTask);
      setTasks((tasks) => tasks.map((task) => task.id === updatedTask.id ? updatedTask : task));
    } catch (error) {
      showToast('error', error.response?.data?.message);
    }
  }

  return (
    <div className="flex flex-col">
      <div
        onClick={() => openModal("new")}
        className="group mb-2 w-full p-[18px] flex gap-2 items-center cursor-pointer"
      >
        <p className="text-[20px] mt-[1px] ml-[1px] font-extralight w-4 h-4 flex items-center justify-center text-primary rounded-full group-hover:bg-primary group-hover:text-background transition">
          +
        </p>
        <p className="text-text-neutral group-hover:text-primary transition">
          Add task
        </p>
      </div>
      {tasksData
        .filter(
          (task) => filters.showCompletedTasks || task.status !== "Completed"
        )
        .filter((task) => filters.showExpiredTasks || task.status !== "Expired")
        .map((task) => (
          <CheckableTaskCard
            key={task.id}
            task={task}
            onClick={() => openModal(task.id)}
            onComplete={handleCompletedTask}
          />
        ))}
    </div>
  );
};

export default List;
