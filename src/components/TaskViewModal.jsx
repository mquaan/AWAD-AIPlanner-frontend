import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { IoClose } from "react-icons/io5";
import { RxListBullet, RxLayout, RxCalendar } from "react-icons/rx";
import { useTask } from "../context/TaskContext";
import Switch from "./Switch";
import { SelectItem, Select } from "./Select";
import { getSubjects } from "../service/subjectApi";
import useClickOutside from "../hooks/useClickOutside.js";

const TaskViewModal = ({ onClose }) => {
  const { currentView, changeView, filters, updateFilters } = useTask();

  const modalRef = useRef(null);

  const [subjects, setSubjects] = useState([]);

  useClickOutside(modalRef, onClose);

  useEffect(() => {
    const callGetSubjects = async () => {
      try {
        const response = await getSubjects();
        setSubjects(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    callGetSubjects();
  }, []);

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
          {currentView === "list" &&
            <Switch
              label="Completed tasks"
              checked={filters.showCompletedTasks}
              onChange={() => updateFilters({ showCompletedTasks : !filters.showCompletedTasks })}
              styles={{
                container: "w-full justify-between",
                label: "text-text-secondary",
              }}
              width={40}
              height={20}
              handleDiameter={18}
            />
          }
          <Switch
            label="Expired tasks"
            checked={filters.showExpiredTasks}
            onChange={() => updateFilters({ showExpiredTasks : !filters.showExpiredTasks })}
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
      {currentView === "board" &&
      <div className="space-y-2">
        <h4 className="font-semibold">Sort by</h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-text-secondary text-sm">
              Sorting
            </label>
            <Select
              className="w-40"
              onChange={(value) => updateFilters({ sort_by: value }) }
              defaultValue=""
            >
              <SelectItem value={""} label={"None"} />
              <SelectItem value={"estimated_end_time"} label={"Due Date"} />
              <SelectItem value={"priority"} label={"Priority"} />
            </Select>
          </div>
          <div className="flex items-center justify-between">
            <label className="text-text-secondary text-sm">
              Direction
            </label>
            <Select
              className="w-40"
              onChange={(value) => updateFilters({ direction: value })}
              defaultValue="desc"
            >
              <SelectItem value={"asc"} label={"Ascending"} />
              <SelectItem value={"desc"} label={"Descending"} />
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
              onChange={(value) => updateFilters({ subject : value })}
              defaultValue=""
            >
              <SelectItem value={""} label={"All"} />
              {subjects?.map((subject) => (
                <SelectItem
                  key={subject.id}
                  value={subject.id}
                  label={subject.name}
                />
              ))}
            </Select>
          </div>
          <div className="flex items-center justify-between">
            <label className="text-text-secondary text-sm">
              Priority
            </label>
            <Select
              className="w-40"
              onChange={(value) => updateFilters({ priority: value })}
              defaultValue={filters.priority}
            >
              <SelectItem value="" label={"All"} />
              <SelectItem value="High" label={"High"} />
              <SelectItem value="Medium" label={"Medium"} />
              <SelectItem value="Low" label={"Low"} />
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
