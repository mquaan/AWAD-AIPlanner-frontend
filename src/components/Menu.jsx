import PropTypes from 'prop-types';
import {createContext, forwardRef, useContext, useState} from 'react';
import { twMerge } from 'tailwind-merge';

const MenuContext = createContext(undefined);

const useMenuContext = () => useContext(MenuContext);

const MenuItem = ({ icon, value, label, className }) => {
  const { selected, handleItemClick } = useMenuContext();

  return (
    <li
      className={twMerge(`flex items-center gap-2 px-4 py-3 cursor-pointer transition ${
        selected === value
          ? "bg-primary text-white"
          : "hover:bg-primary-light hover:text-primary"
      }`, className)}
      onClick={() => handleItemClick(value)}
    >
      {icon}
      <span className="flex-grow text-sm font-medium">{label}</span>
    </li>
  );
};

const Menu = forwardRef(({ children, onItemClick, className }, ref) => {
  const [selected, setSelected] = useState(null);

  const handleItemClick = (value) => {
    setSelected(value);
    if (onItemClick) onItemClick(value);
  };

  return (
    <MenuContext.Provider value={{ selected, handleItemClick }}>
      <div className="before:absolute before:top-5 before:right-0 before:w-10 before:h-10">
        <ul className={twMerge('w-64 bg-white border border-background-neutral rounded-lg shadow overflow-hidden', className)} ref={ref}>
          {children}
        </ul>
      </div>
    </MenuContext.Provider>
  )
})

MenuItem.propTypes = {
  icon: PropTypes.element,
  value: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  className: PropTypes.string,
};

Menu.displayName = 'Menu';

Menu.propTypes = {
  children: PropTypes.node,
  onItemClick: PropTypes.func,
  className: PropTypes.string,
};

export { MenuItem };
export default Menu;
