import { createContext, useContext, useState } from "react";
import PropTypes from 'prop-types';

const PageContext = createContext();

const PageProvider = ({ children }) => {
  const [showSidebar, setShowSidebar] = useState(localStorage.getItem('showSidebar') === 'true');

  const [heading, setHeading] = useState();

  const toggleSidebar = () => {
    setShowSidebar((prevState) => !prevState);
    localStorage.setItem('showSidebar', !showSidebar);
  }

  return (
    <PageContext.Provider value={{
      showSidebar,
      toggleSidebar,
      heading,
      setHeading
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