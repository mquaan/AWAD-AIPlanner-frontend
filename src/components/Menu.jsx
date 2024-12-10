import PropTypes from 'prop-types';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const MenuItem = ({ icon, label, isSelected, onClick }) => {
  return (
    <li
      className={`flex items-center px-4 py-3 cursor-pointer transition ${
        isSelected
          ? "bg-primary text-white"
          : "hover:bg-primary-light hover:text-primary"
      }`}
      onClick={onClick}
    >
      {icon && <span className="mr-3 text-lg text-current">{icon}</span>}
      <span className="flex-grow text-sm font-medium">{label}</span>
    </li>
  );
}

const Menu = ({ items, onItemClick, className }) => {
  const [selected, setSelected] = useState(null);

  const handleItemClick = (index, item) => {
    setSelected(index);
    if (onItemClick) onItemClick(index, item);
  };

  return (
    <div className="before:absolute before:top-5 before:right-0 before:w-10 before:h-10">
      <ul className={`w-64 bg-white border border-background-neutral rounded-lg shadow overflow-hidden ${className}`}>
        {items.map((item, index) => (
          <Link to={item.path} key={index}>
            <MenuItem
              key={index}
              icon={item.icon}
              label={item.label}
              isSelected={selected === index}
              onClick={() => handleItemClick(index, item)}
            />
          </Link>
        ))}
      </ul>
    </div>
  );
};

MenuItem.propTypes = {
  icon: PropTypes.node,
  label: PropTypes.string.isRequired,
  isSelected: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

Menu.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.node,
      label: PropTypes.string.isRequired,
      path: PropTypes.string,
    })
  ).isRequired,
  onItemClick: PropTypes.func,
  className: PropTypes.string,
};

export { MenuItem };
export default Menu;
