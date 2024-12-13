import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { IoClose } from "react-icons/io5";
import { RxListBullet, RxLayout, RxCalendar } from "react-icons/rx";
import { useTask } from "../context/TaskContext";
import Switch from "./Switch";
import { SelectItem, Select } from "./Select";

const TaskViewModal = ({ onClose }) => {
  const { currentView, changeView } = useTask();

  const [showCompletedTasks, setShowCompletedTasks] = useState(false);
  const [showExpiredTasks, setShowExpiredTasks] = useState(false);

  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div
      ref={modalRef}
      className="absolute -top-2 -right-6 w-72 bg-white shadow-lg rounded-lg p-4 space-y-4 z-50"
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">View</h3>
        <button
          aria-label="Close"
          className="text-gray-500 hover:text-gray-700 focus:outline-none"
          onClick={onClose}
        >
          <IoClose size={24} />
        </button>
      </div>

      {/* View Options */}
      <div className="space-y-4">
        <div className="flex justify-around gap-1">
          <button
            className={`w-full flex flex-col items-center gap-1 p-2 border rounded-md text-sm focus:outline-none 
              ${
                currentView === "list"
                  ? "bg-primary text-white"
                  : "hover:bg-primary-light hover:text-primary"
              }`}
              onClick={() => changeView("list")}
          >
            <RxListBullet size={20} />
            List
          </button>
          <button
            className={`w-full flex flex-col items-center gap-1 p-2 border rounded-md text-sm focus:outline-none 
              ${
                currentView === "board"
                  ? "bg-primary text-white"
                  : "hover:bg-primary-light hover:text-primary"
              }`}
              onClick={() => changeView("board")}
          >
            <RxLayout size={20} />
            Board
          </button>
          <button
            className={`w-full flex flex-col items-center gap-1 p-2 border rounded-md text-sm focus:outline-none 
              ${
                currentView === "calendar"
                  ? "bg-primary text-white"
                  : "hover:bg-primary-light hover:text-primary"
              }`}
              onClick={() => changeView("calendar")}
          >
            <RxCalendar size={20} />
            Calendar
          </button>
        </div>
        {currentView !== "calendar" &&
        <div className="space-y-2">
          <Switch
            label="Completed tasks"
            checked={showCompletedTasks}
            onChange={() => setShowCompletedTasks(!showCompletedTasks)}
            styles={{
              container: "w-full justify-between",
              label: "text-text-secondary",
            }}
            width={40}
            height={20}
            handleDiameter={18}
          />
          <Switch
            label="Expired tasks"
            checked={showExpiredTasks}
            onChange={() => setShowExpiredTasks(!showExpiredTasks)}
            styles={{
              container: "w-full justify-between",
              label: "text-text-secondary",
            }}
            width={40}
            height={20}
            handleDiameter={18}
          />
        </div>
        }
      </div>

      {/* Sort By Section */}
      {currentView !== "calendar" &&
      <div className="space-y-2">
        <h4 className="font-semibold">Sort by</h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-text-secondary text-sm">
              Sorting
            </label>
            <Select
              className="w-40"
              onChange={(value) => console.log(value)}
              defaultValue=""
            >
              <SelectItem value={""} label={"None"} />
              <SelectItem value={"due-date"} label={"Due Date"} />
              <SelectItem value={"priority"} label={"Priority"} />
            </Select>
          </div>
          <div className="flex items-center justify-between">
            <label className="text-text-secondary text-sm">
              Direction
            </label>
            <Select
              className="w-40"
              onChange={(value) => console.log(value)}
              defaultValue="ascending"
            >
              <SelectItem value={"ascending"} label={"Ascending"} />
              <SelectItem value={"descending"} label={"Descending"} />
            </Select>
          </div>
        </div>
      </div>
      }

      {/* Filter By Section */}
      <div>
        <h4 className="font-semibold">Filter by</h4>
        <div className="space-y-2 mt-2">
          <div className="flex items-center justify-between">
            <label className="text-text-secondary text-sm">
              Subject
            </label>
            <Select
              className="w-40 capitalize"
              onChange={(value) => console.log(value)}
              defaultValue=""
            >
              <SelectItem value={""} label={"All"} />
              <SelectItem value={"math"} label={"math"} className="capitalize" />
              <SelectItem value={"english"} label={"english"} className="capitalize" />
            </Select>
          </div>
          <div className="flex items-center justify-between">
            <label className="text-text-secondary text-sm">
              Priority
            </label>
            <Select
              className="w-40"
              onChange={(value) => console.log(value)}
              defaultValue=""
            >
              <SelectItem value={""} label={"All"} />
              <SelectItem value={1} label={"High"} />
              <SelectItem value={2} label={"Medium"} />
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
};

TaskViewModal.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default TaskViewModal;
