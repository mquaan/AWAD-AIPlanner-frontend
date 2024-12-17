import { createContext, useContext, useEffect, useState } from "react";
import PropTypes from 'prop-types';
import { getTasks } from "../service/taskApi";
import { useToast } from "./ToastContext";

const VIEW_MODES = ['list', 'board', 'calendar'];
const VIEW_CAL_MODES = ['dayGridMonth', 'timeGridWeek', 'timeGridDay'];
const DEFAULT_FILTERS = {
  limit: 100,
  page: 1,
  showCompletedTasks: false,
  showExpiredTasks: false,
  subject: '',
  priority: '',
};

const TaskContext = createContext();

const TaskProvider = ({ children }) => {
  const [currentView, setCurrentView] = useState();

  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [filters, setFilters] = useState();
  const [searchName, setSearchName] = useState('');

  // ------CALENDAR------
  const [currentViewCalendar, setCurrentViewCalendar] = useState();
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

    // Get view calendar
    const viewCalendar = localStorage.getItem('currentViewCalendar');
    if (VIEW_CAL_MODES.includes(viewCalendar))
      setCurrentViewCalendar(viewCalendar);
    else {
      localStorage.setItem('currentViewCalendar', 'dayGridMonth');
      setCurrentViewCalendar('dayGridMonth');
    }

    // Get filters
    const filter = localStorage.getItem('filters');
    if (filter) {
      setFilters(JSON.parse(filter));
    }
    else {
      localStorage.setItem('filters', JSON.stringify(DEFAULT_FILTERS));
      setFilters(DEFAULT_FILTERS);
    }
  }, []);

  useEffect(() => {
    if (!filters) return;
    
    const query = new URLSearchParams(filters);
    if (searchName) query.append('name', searchName);
    const queryString = query.toString();

    // Get tasks
    const handleGetTasks = async () => {
      console.log('fetching tasks');
      try {
        const response = await getTasks(queryString);
        setTasks(response.data.data);
      } catch (error) {
        showToast("error", error.response?.data?.message || 'Failed to fetch task data');
      }
    };

    handleGetTasks();
  }, [filters, searchName]);

  const changeView = (view) => {
    if (!VIEW_MODES.includes(view)) return;
    setCurrentView(view);
    localStorage.setItem('currentView', view);
  }

  const changeViewCalendar = (view) => {
    if (!VIEW_CAL_MODES.includes(view)) return;
    setCurrentViewCalendar(view);
    localStorage.setItem('currentViewCalendar', view);
  }

  const updateFilters = (newFilter) => {
    const newFilters = {
      ...filters,
      ...newFilter
    };
    setFilters(newFilters);
    localStorage.setItem('filters', JSON.stringify(newFilters));
  }

  return (
    <TaskContext.Provider value={{
      currentView,
      changeView,
      currentViewCalendar,
      changeViewCalendar,
      tasks,
      setTasks,
      selectedTask,
      setSelectedTask,
      filters,
      updateFilters,
      // searchName,
      setSearchName,
      cancelChangeEvent,
      setCancelChangeEvent,
      oldEvent,
      setOldEvent,
      isModalOpen,
      setIsModalOpen,
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