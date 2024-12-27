import { createContext, useContext, useState } from "react";
import PropTypes from 'prop-types';

const PageContext = createContext();

const PageProvider = ({ children }) => {
  const [showSidebar, setShowSidebar] = useState(localStorage.getItem('showSidebar') === 'true');
  const [disableSidebar, setDisableSidebar] = useState(false);
  const [hasAnyChanges, setHasAnyChanges] = useState(false);

  const [heading, setHeading] = useState();
  const [actions, setActions] = useState([]);

  const toggleSidebar = () => {
    setShowSidebar((prevState) => !prevState);
    localStorage.setItem('showSidebar', !showSidebar);
  }

  return (
    <PageContext.Provider value={{
      showSidebar,
      disableSidebar,
      hasAnyChanges,
      setHasAnyChanges,
      setDisableSidebar,
      toggleSidebar,
      heading,
      setHeading,
      actions,
      setActions,
    }}>
      {children}
    </PageContext.Provider>
  );
};

PageProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PageProvider;
export const usePage = () => useContext(PageContext);