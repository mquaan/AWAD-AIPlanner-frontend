import React, { useState } from "react";
import { twMerge } from "tailwind-merge";
import PropTypes from "prop-types";

const Tabs = ({ children, className, onTabChange }) => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabClick = (index) => {
    setActiveTab(index);

    if (activeTab !== index)
      onTabChange?.(index);
  };

  return (
    <div className={className}>
      <div className="flex border-b">
        {React.Children.map(children, (child, index) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, {
              isActive: index === activeTab,
              onClick: () => handleTabClick(index),
            });
          }
          return child;
        })}
      </div>
      <div className="">
        {React.Children.map(children, (child, index) => {
          if (index === activeTab) {
            return child.props.children;
          }
          return null;
        })}
      </div>
    </div>
  );
};

const Tab = ({ label, isActive=false, onClick, className }) => {
  const defaultClassName = `px-4 py-2 cursor-pointer transition font-semibold
    ${isActive ? "border-b-2 border-primary text-primary" : "text-gray-600"}`;

  return (
    <div
      className={twMerge(defaultClassName, className)}
      onClick={onClick}
    >
      {label}
    </div>
  );
};

const TabPanel = ({ children, className }) => {
  return (
    <div className={twMerge("mt-5", className)}>
      {children}
    </div>
  );
};

Tabs.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  onTabChange: PropTypes.func,
};

Tab.propTypes = {
  label: PropTypes.string.isRequired,
  isActive: PropTypes.bool,
  onClick: PropTypes.func,
  className: PropTypes.string,
};

TabPanel.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export { Tabs, Tab, TabPanel };