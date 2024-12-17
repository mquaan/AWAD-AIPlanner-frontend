import TaskBoard from '../components/TaskBoard';

// import { useEffect, useState } from 'react';
import { useTask } from '../context/TaskContext';
import { useNavigate } from 'react-router-dom';

import { closestCenter, DndContext } from '@dnd-kit/core';
import DroppableColumn from '../components/Droppable';
import { updateTaskStatus } from '../service/taskApi';
import { useToast } from '../context/ToastContext';

const Board = () => {
  const navigate = useNavigate();
  
  const { tasks, setTasks, filters, setSelectedTask, setIsModalOpen } = useTask();
  // const [tasksData, setTasksData] = useState([]);
  const { showToast } = useToast();

  // const sortedTasks = tasks.sort((a, b) => {
  //   if (!a.estimated_end_time) return 1;
  //   if (!b.estimated_end_time) return -1;
  //   return new Date(a.estimated_end_time) - new Date(b.estimated_end_time);
  // });

  // const filteredTasks = sortedTasks.filter(task => task.status !== 'Completed' && task.status !== 'Expired');
  // const completedTasks = sortedTasks.filter(task => task.status === 'Completed');
  // const expiredTasks = sortedTasks.filter(task => task.status === 'Expired');

  // useEffect(() => {
  //   setTasksData([...filteredTasks, ...completedTasks, ...expiredTasks]);
  // }, [tasks, filters]);

  const statuses = ['ToDo', 'InProgress', 'Completed', 'Expired'];

  const openModal = (task_id, status) => {
    if (task_id === 'new') {
      setSelectedTask({status: status});
      setIsModalOpen(true);
    }
    else
      navigate(`/task/${task_id}`);
  };

  const handleUpdateStatus = async (task) => {
    const updatedTask = { ...task, status: task.status };
    try {
      await updateTaskStatus(updatedTask);
      setTasks((tasks) => tasks.map((task) => task.id === updatedTask.id ? updatedTask : task));
    } catch (error) {
      showToast('error', error.response?.data?.message);
    }
  }

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;
    const draggedTask = tasks.find((task) => task.id === active.id);
    if (!draggedTask) return;
    const updatedTask = { ...draggedTask, status: over.id };
    handleUpdateStatus(updatedTask);
  };

  return (
    <div className="flex flex-wrap gap-12 mt-2">
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        {statuses
          .filter((status) => filters.showExpiredTasks || status !== 'Expired')
          .map((status) => (
            <DroppableColumn status={status} key={status} className="flex-1 py-4 rounded-xl">
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
                    <TaskBoard key={task.id} task={task} onClick={() => {
                      openModal(task.id, '');
                    }}/>
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
            </DroppableColumn>
          ))}
        </DndContext>
    </div>
  );
};

export default Board;