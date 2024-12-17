import PropTypes from 'prop-types';
import React, { forwardRef, useState } from 'react';
// import { Link } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';

const MenuItem = ({ icon, label, isSelected=false, onClick, className }) => {
  return (
    <li
      className={twMerge(`flex items-center gap-2 px-4 py-3 cursor-pointer transition ${
        isSelected
          ? "bg-primary text-white"
          : "hover:bg-primary-light hover:text-primary"
      }`, className)}
      onClick={onClick}
    >
      {icon}
      <span className="flex-grow text-sm font-medium">{label}</span>
    </li>
  );
};

// const Menu = ({ items, onItemClick, className }) => {
//   const [selected, setSelected] = useState(null);

//   const handleItemClick = (index, item) => {
//     setSelected(index);
//     if (onItemClick) onItemClick(index, item);
//   };

//   return (
//     <div className="before:absolute before:top-5 before:right-0 before:w-10 before:h-10">
//       <ul className={`w-64 bg-white border border-background-neutral rounded-lg shadow overflow-hidden ${className}`}>
//         {items.map((item, index) => (
//           <Link to={item.path} key={index}>
//             <MenuItem
//               key={index}
//               icon={item.icon}
//               label={item.label}
//               isSelected={selected === index}
//               onClick={() => handleItemClick(index, item)}
//             />
//           </Link>
//         ))}
//       </ul>
//     </div>
//   );
// };

const Menu = forwardRef(({ children, onItemClick, className }, ref) => {
  const [selected, setSelected] = useState(null);

  const handleItemClick = (index, item) => {
    setSelected(index);
    if (onItemClick) onItemClick(index, item);
  };

  return (
    <div className="before:absolute before:top-5 before:right-0 before:w-10 before:h-10">
      <ul className={twMerge('w-64 bg-white border border-background-neutral rounded-lg shadow overflow-hidden', className)} ref={ref}>
        {React.Children.map(children, (child, index) => {
          if (React.isValidElement(child) && child.type === MenuItem) {
            return React.cloneElement(child, {
              isSelected: selected ? selected === index : false,
              onClick: () => handleItemClick(index, child.props.label),
            });
          }
          return child;
        })}
      </ul>
    </div>
  )
})

MenuItem.propTypes = {
  icon: PropTypes.element,
  label: PropTypes.string.isRequired,
  isSelected: PropTypes.bool,
  onClick: PropTypes.func,
  className: PropTypes.string,
};

// Menu.propTypes = {
//   items: PropTypes.arrayOf(
//     PropTypes.shape({
//       icon: PropTypes.node,
//       label: PropTypes.string.isRequired,
//       path: PropTypes.string,
//     })
//   ).isRequired,
//   onItemClick: PropTypes.func,
//   className: PropTypes.string,
// };

Menu.displayName = 'Menu';

Menu.propTypes = {
  children: PropTypes.node,
  onItemClick: PropTypes.func,
  className: PropTypes.string,
};

export { MenuItem };
export default Menu;
