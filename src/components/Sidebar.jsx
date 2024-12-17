import { RxDashboard, RxLayout, RxTimer } from "react-icons/rx";
import { BiLogOut } from "react-icons/bi";
import { SlSettings } from "react-icons/sl";
import { LuUser } from "react-icons/lu";
import PropTypes from 'prop-types';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../styles/sidebar.css';
import { useAuth } from "../context/AuthContext";
import { useToast } from '../context/ToastContext';
import { useState } from "react";
import DialogConfirm from "./DialogConfirm";
import { usePage } from '../context/PageContext';
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";

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

const SidebarHeader = ({ expanded }) => {
  return (
    <div className="flex items-center px-4 py-5 bg-white sticky top-0">
      <Link to="/">
      {expanded ? 
        <img src="/logo-with-text.svg" alt="logo" className="h-10" />
        :
        <img src="/logo-icon.svg" alt="logo" className="h-10" />
      }
      </Link>
    </div>
  );
};

const SidebarFooter = ({ expanded }) => {
  const { logout } = useAuth();
  const { showToast } = useToast();

  const [showDialogConfirm, setShowDialogConfirm] = useState(false);

  const handleLogout = async() => {
    try{
      await logout();

      showToast('success', 'Logged out successfully');
    } catch(err){
      showToast('error', err.response?.data?.message || 'Logout failed');
    }
  };

  return (
    <>
      <div className="px-4 pb-5 pt-2 bg-white flex flex-col items-center">
        <div
          className={`w-full flex items-center p-2 rounded-md hover:cursor-pointer hover:bg-primary-light hover:text-primary ${
            !expanded && "w-fit"
          }`}
          onClick={() => setShowDialogConfirm(true)}
        >
          <BiLogOut size={24} />
          {expanded && <span className="ml-2">Logout</span>}
        </div>
      </div>

      <DialogConfirm
        open={showDialogConfirm}
        onClose={() => setShowDialogConfirm(false)}
        onConfirm={handleLogout}
        title="Confirm"
        content="Are you sure you want to log out?"
      />
    </>
  );
};

const SidebarItem = ({ expanded, icon, title, path }) => {
  const pathName = useLocation().pathname;
  const isActive = pathName.includes(path);

  return (
    <Link to={path} className="w-full">
      <div className={`flex items-center p-2 rounded-md ${isActive ? 'bg-primary text-white shadow-md' : 'hover:bg-primary-light hover:text-primary'} ${!expanded && 'w-fit'}`}>
        {icon}
        {expanded && <span className="ml-2">{title}</span>}
      </div>
    </Link>
  );
};

const Sidebar = () => {
  // const [isHovered, setIsHovered] = useState(false);

  const { showSidebar, toggleSidebar } = usePage();
  const [showToggle, setShowToggle] = useState(false);

  // const handleMouseEnter = () => {
  //   setIsHovered(true);
  // };

  // const handleMouseLeave = () => {
  //   setIsHovered(false);
  // };

  return (
    <div
      className={`sidebar z-10`}
    >
      <div
        className={`fixed top-3 bottom-3 left-3 overflow-y-hidden flex flex-col bg-white shadow-md rounded-lg transition-width duration-300 ${
          showSidebar ? "w-sidebar-expanded" : "w-sidebar-collapsed"
        }`}
        // onMouseEnter={handleMouseEnter}
        // onMouseLeave={handleMouseLeave}
      >
        <SidebarHeader expanded={showSidebar} />
        <div className="h-full mt-2 px-4 py-5 flex flex-col items-center overflow-x-hidden overflow-y-auto">
          {MENU_ITEMS.map((item, index) => (
            <SidebarItem
              key={index}
              icon={item.icon}
              title={item.title}
              path={item.path}
              expanded={showSidebar}
            />
          ))}
        </div>
        <SidebarFooter expanded={showSidebar} />
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
  expanded: PropTypes.bool,
  icon: PropTypes.element,
  title: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
};

SidebarHeader.propTypes = {
  expanded: PropTypes.bool,
};

SidebarFooter.propTypes = {
  expanded: PropTypes.bool,
};


export default Sidebar;