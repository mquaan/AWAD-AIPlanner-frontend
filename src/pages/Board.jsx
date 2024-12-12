import { useState, useEffect } from 'react';
import { usePage } from "../context/PageContext";
import TaskBoard from '../components/TaskBoard';
import Modal from '../components/Modal';
import { TASKS } from '../data/testData';
import { useNavigate, useParams } from 'react-router-dom';

const Board = () => {
  const navigate = useNavigate();

  const { id } = useParams();
  const [tasks, setTasks] = useState(TASKS);

  const statuses = ['To-Do', 'In Progress', 'Completed', 'Expired'];

  const handleAddTask = (status) => {
    const taskName = prompt('Enter task name:');
    const taskDescription = prompt('Enter task description:');
    if (taskName && taskDescription) {
      setTasks([
        ...tasks,
        { id: Date.now(), name: taskName, description: taskDescription, status },
      ]);
    }
  };

  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
    navigate(`/board/${task.id}`);
  };

  const closeModal = () => {
    setSelectedTask(null);
    setIsModalOpen(false);
    navigate('/board');
  };

  useEffect(() => {
    if (id) {
      const task = tasks.find((task) => task.id === parseInt(id));
      if (!task) {
        navigate('/board');
      } else {
        setSelectedTask(task);
        setIsModalOpen(true); // Mở modal khi tìm thấy task
      }
    } else {
      setSelectedTask(null);
      setIsModalOpen(false);
    }
  }, [id, tasks, navigate]);

  const handleSave = (updatedTask) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === updatedTask.id ? updatedTask : task
      )
    );
  };

  return (
    <div className="grid grid-cols-4 mt-2 gap-8">
      {statuses.map((status) => (
        <div key={status} className="py-4 rounded-xl">
          <div className='flex mb-4 gap-2 items-end'>
            <h2 className="text-lg font-semibold">{status.toUpperCase()}</h2>
            <p className='text-sm text-text-neutral pb-[2.5px]'>
              {tasks.filter((task) => task.status === status).length}
            </p>

          </div>
          <div className="space-y-3">
            {tasks
              .filter((task) => task.status === status)
              .map((task) => (
                <TaskBoard key={task.id} task={task} onClick={() => openModal(task)}/>
              ))}
          </div>
          <div
            onClick={() => handleAddTask(status)}
            className="group mt-3 w-full p-2 flex gap-2 items-center cursor-pointer"
          >
            <p className='text-[20px] font-extralight w-4 h-4 flex items-center justify-center text-primary rounded-full group-hover:bg-primary group-hover:text-background transition'> + </p>
            <p className='text-text-neutral group-hover:text-primary transition'> Add task </p>
          </div>
        </div>
      ))}
      {isModalOpen && <Modal task={selectedTask} onClose={closeModal} onSave={handleSave} />}
    </div>
  );
};

export default Board;