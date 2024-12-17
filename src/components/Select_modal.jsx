import React, { useState, useRef, useEffect } from "react";
import PropTypes from 'prop-types';
import { LuChevronDown } from "react-icons/lu";
import { twMerge } from "tailwind-merge";

const SelectItem = ({ label, isSelected, onClick, className }) => {
  const defaultClassName = `px-8 py-2 cursor-pointer text-sm hover:bg-primary-light transition
    ${isSelected ? "text-primary" : ""}`

  return (
    <li
      role="option"
      className={twMerge(defaultClassName, className)}
      onClick={onClick}
    >
      {label}
    </li>
  );
};

const Select = ({ name, children, placeholder, onChange, defaultValue, className, icon, disabled, onCollapse }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(defaultValue !== null ? defaultValue : null);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        {onCollapse && onCollapse()}
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (value) => {
    setSelectedOption(value);
    setIsOpen(false);
    onChange({ name, value }); // Gửi cả `name` và `value` khi gọi `onChange`
    if (onCollapse)
      onCollapse();
  };

  // Get the label of the selected option
  const selectedLabel = disabled ? defaultValue : React.Children.toArray(children).find(
    (child) => React.isValidElement(child) && child.props.value === selectedOption
  )?.props.label;

  return (
    <div className={twMerge('w-64 relative', className)} ref={dropdownRef}>
      <div
        tabIndex={0}
        className={twMerge(
          "flex items-center justify-between px-2 py-2 rounded-md cursor-pointer transition group",
          !disabled && (isOpen ? "bg-primary-light" : "hover:bg-primary-light"),
          disabled && "bg-disabled cursor-not-allowed",
        )}
        onClick={() => {
          if (!disabled)
            setIsOpen(!isOpen)
          if (isOpen && onCollapse)
            onCollapse();
        }}
      >
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-md">
            {selectedLabel || placeholder || "Select..."}
          </span>
        </div>
        
        {!disabled &&
        <LuChevronDown 
          className={twMerge(
            "w-4 h-4 transition-opacity",
            isOpen ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          )}
        />}
      </div>

      {!disabled && isOpen && (
        <ul
          className="absolute mt-1 w-full bg-white border border-border rounded-md shadow-lg max-h-52 overflow-auto z-10"
          role="listbox"
        >
          {React.Children.map(children, (child) => {
            if (React.isValidElement(child) && child.type === SelectItem) {
              return React.cloneElement(child, {
                isSelected: selectedOption === child.props.value,
                onClick: () => handleSelect(child.props.value),
              });
            }
            return child;
          })}
        </ul>
      )}
    </div>
  );
};

SelectItem.propTypes = {
  label: PropTypes.node,
  isSelected: PropTypes.bool,
  onClick: PropTypes.func,
  className: PropTypes.string,
};

Select.propTypes = {
  name: PropTypes.string.isRequired,
  children: PropTypes.node,
  placeholder: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  className: PropTypes.string,
  icon: PropTypes.node,
  disabled: PropTypes.bool,
  onCollapse: PropTypes.func,
};

export { SelectItem, Select };
