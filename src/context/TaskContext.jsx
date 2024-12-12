import { createContext, useContext, useEffect, useState } from "react";
import PropTypes from 'prop-types';

const VIEW_MODES = ['list', 'board', 'calendar'];

const TaskContext = createContext();

const TaskProvider = ({ children }) => {
  const [currentView, setCurrentView] = useState();

  useEffect(() => {
    const view = localStorage.getItem('currentView');
    if (VIEW_MODES.includes(view))
      setCurrentView(view);
    else {
      localStorage.setItem('currentView', 'list');
      setCurrentView('list');
    }
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