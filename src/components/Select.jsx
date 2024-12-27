import React, { useState, useRef, useEffect } from "react";
import PropTypes from 'prop-types';
import { LuChevronDown } from "react-icons/lu";
import { twMerge } from "tailwind-merge";
import useClickOutside from "../hooks/useClickOutside.js";

const SelectItem = ({ label, isSelected, onClick, className }) => {
  const defaultClassName = `px-4 py-2 cursor-pointer text-sm hover:bg-primary-light hover:text-primary transition
    ${isSelected ? "bg-primary-light" : ""}`

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

const Select = ({ children, placeholder, onChange, defaultValue, className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(defaultValue !== null ? defaultValue : null);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useClickOutside(dropdownRef, () => setIsOpen(false));

  const handleSelect = (value) => {
    setSelectedOption(value);
    setIsOpen(false);
    onChange(value);
  };

  // Get the label of the selected option
  const selectedLabel = React.Children.toArray(children).find(
    (child) => React.isValidElement(child) && child.props.value === selectedOption
  )?.props.label;

  return (
    <div className={twMerge('w-64 relative', className)} ref={dropdownRef}>
      <div
        tabIndex={0}
        className="flex items-center justify-between px-4 py-2 bg-white border border-border rounded-md shadow-sm cursor-pointer focus:ring-2 focus:ring-border-focus focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-sm">
          {selectedLabel || placeholder || "Select..."}
        </span>
        <LuChevronDown className="w-4 h-4" />
      </div>

      {isOpen && (
        <ul
          className="absolute mt-2 w-full bg-white border border-border rounded-md shadow-lg max-h-60 overflow-auto z-10"
          role="listbox"
        >
          {React.Children.map(children, (child) => {
            if (React.isValidElement(child)) {
              return React.cloneElement(child, {
                onClick: () => handleSelect(child.props.value),
                isSelected: selectedOption === child.props.value,
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
  children: PropTypes.node.isRequired,
  placeholder: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  className: PropTypes.string,
};

export { SelectItem, Select };
