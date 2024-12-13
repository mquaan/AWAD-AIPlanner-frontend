import { createContext, useContext, useEffect, useState } from "react";
import PropTypes from 'prop-types';
import { TASKS1 } from "../data/testData";
import { addTask, getTasks } from "../service/taskApi";
import { useToast } from "./ToastContext";

const VIEW_MODES = ['list', 'board', 'calendar'];

const TaskContext = createContext();

const TaskProvider = ({ children }) => {
  const [currentView, setCurrentView] = useState();

  const [tasks, setTasks] = useState(TASKS1);
  const [selectedTask, setSelectedTask] = useState(null);

  // ------CALENDAR------
  const [cancelChangeEvent, setCancelChangeEvent] = useState(false);
  const [oldEvent, setOldEvent] = useState(null);
  //---------------------

    const { showToast } = useToast();

  useEffect(() => {
    // Get view
    const view = localStorage.getItem('currentView');
    if (VIEW_MODES.includes(view))
      setCurrentView(view);
    else {
      localStorage.setItem('currentView', 'list');
      setCurrentView('list');
    }

    // Get tasks
    // TODO: Fetch tasks from API
    const handleGetTasks = async () => {
      try {
        // await addTask();
        const response = await getTasks();
        setTasks(response.data);
      } catch (error) {
        showToast("error", error.response?.data?.message || 'Failed to fetch task data');
      }
    };

    handleGetTasks();
    // setTasks(TASKS1);
  }, []);

  const changeView = (view) => {
    if (!VIEW_MODES.includes(view)) return;
    setCurrentView(view);
    localStorage.setItem('currentView', view);
  }

  return (
    <TaskContext.Provider value={{
      currentView,
      changeView,
      tasks,
      setTasks,
      selectedTask,
      setSelectedTask,
      cancelChangeEvent,
      setCancelChangeEvent,
      oldEvent,
      setOldEvent
    }}>
      {children}
    </TaskContext.Provider>
  );
}

TaskProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default TaskProvider;
export const useTask = () => useContext(TaskContext);