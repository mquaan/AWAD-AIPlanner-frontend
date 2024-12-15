import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { isAfter, isBefore, isValid } from 'date-fns';

import { TfiMore } from "react-icons/tfi";
import { LiaTimesSolid } from "react-icons/lia";
import { FcBookmark, FcMediumPriority, FcHighPriority, FcLowPriority } from "react-icons/fc";
import { PiTagChevronFill  } from "react-icons/pi";

import { getSubjects } from '../service/subjectApi'
import { Select, SelectItem } from './Select_modal';
import { getStatusColor } from '../utils/status';
import { useToast } from '../context/ToastContext';

const TaskModal = ({ task, onCancel, onSave }) => {
  // Use a single state to hold the task data
  const [taskData, setTaskData] = useState({
    name: task.name || "",
    description: task.description || "",
    subject_id: task.subject?.id || "",
    status: task.id ? task.status : "ToDo",
    priority: task.id ? task.priority : "Medium",
    estimated_start_time: task.estimated_start_time ? new Date(task.estimated_start_time) : null,
    estimated_end_time: task.estimated_end_time ? new Date(task.estimated_end_time) : null,
  });

  const [subjects, setSubjects] = useState([])

  const [error, setError] = useState("");

  const { showToast } = useToast();

  const validateDates = () => {
    if (!taskData.estimated_start_time || !taskData.estimated_end_time) {
      return true;
    }
    // Kiểm tra estimated_start_time và estimated_end_time có hợp lệ không
    if (!isValid(taskData.estimated_start_time) || !isValid(taskData.estimated_end_time)) {
      setError("Please select valid dates.");
      return false;
    }

    // Kiểm tra estimated_end_time phải sau estimated_start_time
    if (!isAfter(taskData.estimated_end_time, taskData.estimated_start_time)) {
      setError("End date must be after start date.");
      return false;
    }

    return true;
  };

  const handleSave = () => {
    if (validateDates()){
      const savedTask = {
        ...task,
        ...taskData,
      };
      onSave(savedTask);
    } else {
      return;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target || e;
    console.log(name, value);
    setTaskData((prevTask) => ({
      ...prevTask,
      [name]: value,
    }));
  };

  const handleDateChange = (date, field) => {
    setTaskData((prevTask) => ({
      ...prevTask,
      [field]: date,
    }));
  };

  const checkIfWillBeExpired = (date) => {
    if (isBefore(date, new Date())) {
      setError("This task will be expired.");
    } else {
      setError("");
    }
  };

  useEffect(() => {
    if (task.status !== "Expired" && task.estimated_end_time) {
      checkIfWillBeExpired(task.estimated_end_time);
    }

    const callGetSubjects = async () => {
      try {
        const response = await getSubjects();
        setSubjects(response.data);
      } catch (err) {
        showToast("error", err.response?.data?.message || "Failed to get subjects");
      }
    };
    callGetSubjects();
  }, []);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center z-[10000]"
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-[700px] max-h-screen overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pl-6 pr-5 py-4 text-gray-700">
          <h2 className="text-lg font-semibold">{task.id ? 'Edit Task' : 'New Task'}</h2>
          <div className="flex gap-2">
            <button className="hover:text-black hover:bg-gray-200 p-1 rounded-lg">
              <TfiMore />
            </button>
            <button
              className="hover:text-black hover:bg-gray-200 p-1 rounded-lg"
              onClick={onCancel}
            >
              <LiaTimesSolid />
            </button>
          </div>
        </div>
        <hr className="border-t border-gray-200" />

        {/* bot */}
        <div className="flex">
          {/* Left part */}
          <div className="p-5 flex flex-col gap-1 basis-2/3">
            <input
              type="text"
              className="w-full text-xl font-semibold rounded-md border-0 px-2
                        focus:border focus:border-gray-300 focus:outline-none focus:ring-0"
              name="name"
              value={taskData.name}
              onChange={handleChange}
              placeholder="Task name"
            />

            <textarea
              className="w-full text-sm resize-both max-w-[400px] max-h-[150px] rounded-md border-0 resize-none focus:resize px-2
                          focus:border focus:border-gray-300 focus:outline-none focus:ring-0"
              name="description"
              value={taskData.description}
              onChange={handleChange}
              placeholder="Enter task description"
            />

            <div className="relative">
              <label className="flex mt-4 px-2 font-semibold text-sm text-gray-700">
                Subject
              </label>
              <Select
                name="subject_id"
                className="w-[80%]"
                onChange={handleChange}
                defaultValue={taskData.subject_id}
                icon={<FcBookmark className="mb-[2px]" />}
              >
                <SelectItem
                  value={""}
                  label={"No subject"}
                />
                {subjects?.map((subject) => (
                  <SelectItem
                    key={subject.id}
                    value={subject.id}
                    label={subject.name}
                  />
                ))}
              </Select>
            </div>
          </div>

          {/* Right part */}
          <div className="flex flex-col p-6 gap-4 bg-[#faf5f3] shadow-sm rounded-ee-xl basis-1/3">
            <div className="">
              <label className="block font-semibold px-2 text-sm text-gray-700">
                Status
              </label>
              <Select
                name="status"
                className="w-full"
                onChange={handleChange}
                defaultValue={taskData.status}
                disabled={taskData.status === "Expired"}
                icon={
                  <PiTagChevronFill
                    className="mb-[2px]"
                    style={{ color: getStatusColor(taskData.status) }}
                  />
                }
              >
                <SelectItem value="ToDo" label="To-Do" />
                <SelectItem value="InProgress" label="In Progress" />
                <SelectItem value="Completed" label="Completed" />
              </Select>
            </div>

            <div className="">
              <label className="block font-semibold px-2 text-sm text-gray-700">
                Priority
              </label>
              <Select
                name="priority"
                className="w-full"
                onChange={handleChange}
                defaultValue={taskData.priority}
                icon={
                  taskData.priority === "High" ?
                    <FcHighPriority className="mb-[2px]" />
                    : taskData.priority === "Medium" ?
                      <FcMediumPriority className="mb-[2px]" />
                    : <FcLowPriority className="mb-[2px]" />
                }
              >
                <SelectItem value="High" label="High" />
                <SelectItem value="Medium" label="Medium" />
                <SelectItem value="Low" label="Low" />
              </Select>
            </div>

            <div className="flex flex-col gap-4 px-2">
              <div>
                <label
                  htmlFor="date-picker-start-time"
                  className="block font-semibold text-sm text-gray-700"
                >
                  Start Date
                </label>
                <DatePicker
                  id="date-picker-start-time"
                  selected={
                    taskData.estimated_start_time
                      ? taskData.estimated_start_time
                      : false
                  }
                  onChange={(date) =>
                    handleDateChange(date, "estimated_start_time")
                  }
                  dateFormat="dd/MM/yyyy HH:mm"
                  showTimeSelect
                  timeIntervals={15}
                  timeCaption="Time"
                  placeholderText="Select a start date"
                  className="border py-2 rounded-md focus:outline-none text-center"
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="date-picker-end-time"
                  className="block font-semibold text-sm text-gray-700"
                >
                  End Date
                </label>
                <DatePicker
                  id="date-picker-end-time"
                  selected={
                    !taskData.estimated_end_time
                      ? false
                      : taskData.estimated_end_time
                  }
                  onChange={(date) => {
                    handleDateChange(date, "estimated_end_time");
                    checkIfWillBeExpired(date);
                  }}
                  dateFormat="dd/MM/yyyy HH:mm"
                  showTimeSelect
                  timeIntervals={15}
                  timeCaption="Time"
                  placeholderText="Select an end date"
                  className="border py-2 rounded-md focus:outline-none text-center"
                  minDate={taskData.estimated_start_time}
                />
                {error && <p className="text-error text-sm mt-2">{error}</p>}
              </div>
            </div>
            <div className="flex justify-end gap-4">
              <button
                className="bg-gray-200 px-4 py-2 rounded-md hover:bg-gray-300"
                onClick={onCancel}
              >
                Cancel
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                onClick={handleSave}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

TaskModal.propTypes = {
  task: PropTypes.object.isRequired,
  onCancel: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default TaskModal;
