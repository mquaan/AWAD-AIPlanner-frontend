import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { RxDashboard, RxLayout, RxTimer } from "react-icons/rx";
import { BiLogOut } from "react-icons/bi";
import { SlSettings } from "react-icons/sl";
import { LuUser } from "react-icons/lu";
import PropTypes from 'prop-types';
import { usePage } from '../context/PageContext';
import { Link, useLocation } from 'react-router-dom';
import '../styles/sidebar.css';
import { useState } from "react";

const MENU_ITEMS = [
  {
    icon: <RxDashboard size={24} />,
    title: 'Dashboard',
    path: '/dashboard',
  },
  {
    icon: <RxLayout size={24} />,
    title: 'Task',
    path: '/task',
  },
  {
    icon: <RxTimer size={24} />,
    title: 'Focus timer',
    path: '/timer',
  },
  {
    icon: <SlSettings size={24} />,
    title: 'Settings',
    path: '/settings',
  },
  {
    icon: <LuUser size={24} />,
    title: 'Account',
    path: '/account',
  },
];

const SidebarHeader = () => {
  const { showSidebar } = usePage();

  return (
    <div className="flex items-center px-4 py-5 bg-white sticky top-0">
      <Link to="/">
      {showSidebar ? 
        <img src="/logo-with-text.svg" alt="logo" className="h-10" />
        :
        <img src="/logo-icon.svg" alt="logo" className="h-10" />
      }
      </Link>
    </div>
  );
};

const SidebarFooter = () => {
  const { showSidebar } = usePage();

  return (
    <div className="px-4 pb-5 pt-2 bg-white flex flex-col items-center">
      <div className={`w-full flex items-center p-2 rounded-md hover:cursor-pointer hover:bg-primary-hover hover:text-primary ${!showSidebar && 'w-fit'}`}>
        <BiLogOut size={24} />
        {showSidebar && <span className="ml-2">Logout</span>}
      </div>
    </div>
  );
};

const SidebarItem = ({ icon, title, path }) => {
  const { showSidebar } = usePage();

  const pathName = useLocation().pathname;
  const isActive = pathName.includes(path);

  return (
    <Link to={path} className="w-full">
      <div className={`flex items-center p-2 rounded-md ${isActive ? 'bg-primary text-white shadow-md' : 'hover:bg-primary-hover hover:text-primary'} ${!showSidebar && 'w-fit'}`}>
        {icon}
        {showSidebar && <span className="ml-2">{title}</span>}
      </div>
    </Link>
  );
};

const Sidebar = () => {
  const { showSidebar, toggleSidebar } = usePage();

  const [showToggle, setShowToggle] = useState(false);

  return (
    <div className="sidebar">
      <div className={`fixed top-3 bottom-3 sidebar-nav overflow-y-hidden flex flex-col bg-white shadow-md ${showSidebar ? 'w-sidebar-expanded' : 'w-sidebar-collapsed'} rounded-lg transition-width duration-300`}>
        <SidebarHeader />
        <div className="h-full mt-2 px-4 py-5 flex flex-col items-center overflow-x-hidden overflow-y-auto">
          {MENU_ITEMS.map((item, index) => {
            return (
              <SidebarItem
                key={index}
                icon={item.icon}
                title={item.title}
                path={item.path}
              />
            );
          })}
        </div>
        <SidebarFooter />
      </div>
      <div
        className={`sidebar-toggle-area top-[3.5rem] flex items-center justify-center fixed ${showSidebar ? 'expanded' : 'collapsed'} transition-all duration-300`}
        onMouseEnter={() => setShowToggle(true)}
        onMouseLeave={() => setShowToggle(false)}
      >
        <button
          className={`sidebar-toggle flex items-center justify-center rounded-full bg-background-neutral text-text-neutral border-[1.5px] shadow-sm ${
            showToggle ? 'visible' : ''
          }`}
          onClick={toggleSidebar}
        >
          {showSidebar ? <FaAngleLeft /> : <FaAngleRight />}
        </button>
      </div>
    </div>
  );
};

SidebarItem.propTypes = {
  icon: PropTypes.element,
  title: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
};


export default Sidebar;