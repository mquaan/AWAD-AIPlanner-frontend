import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { isAfter, isBefore, isValid } from 'date-fns';

import { TfiMore } from "react-icons/tfi";
import { LiaTimesSolid } from "react-icons/lia";
import { FcMediumPriority, FcHighPriority, FcLowPriority } from "react-icons/fc";
import { PiTagChevronFill  } from "react-icons/pi";
import { AiFillFileAdd } from "react-icons/ai";
import { useTask } from '../context/TaskContext';
import { IoIosAddCircle } from "react-icons/io";
import { GoTrash } from "react-icons/go";

import { addSubject, getSubjects } from '../service/subjectApi'
import { Select, SelectItem } from './Select_modal';
import { getStatusColor } from '../utils/status';
import { useToast } from '../context/ToastContext';
import Menu, { MenuItem } from './Menu';
import DialogConfirm from './DialogConfirm';
import {RxTimer} from "react-icons/rx";
import {useNavigate} from "react-router-dom";

const Modal = ({ onCancel, onSave }) => {
  const { selectedTask } = useTask();
  const [taskData, setTaskData] = useState({
    name: selectedTask.name || "",
    description: selectedTask.description || "",
    subject_id: selectedTask.subject?.id || "",
    status: selectedTask.id ? selectedTask.status : "ToDo",
    priority: selectedTask.id ? selectedTask.priority : "Medium",
    estimated_start_time: selectedTask.estimated_start_time ? new Date(selectedTask.estimated_start_time) : null,
    estimated_end_time: selectedTask.estimated_end_time ? new Date(selectedTask.estimated_end_time) : null,
  });

  const navigate = useNavigate();

  const [subjects, setSubjects] = useState([])

  const [isAddingSubject, setIsAddingSubject] = useState(false);
  const [newSubject, setNewSubject] = useState("");

  const [error, setError] = useState("");

  const { showToast } = useToast();

  const [showMenu, setShowMenu] = useState(false);
  const [showDialogConfirm, setShowDialogConfirm] = useState(false);

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
        ...selectedTask,
        ...taskData,
      };
      onSave(savedTask);
    } else {
      return;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target || e;
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

  const modalRef = useRef(null);
  
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (showDialogConfirm) return;

        if (modalRef.current && !modalRef.current.contains(event.target)) {
          onCancel();
        }
      };
  
      document.addEventListener("mousedown", handleClickOutside);
  
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [onCancel, showDialogConfirm]);

  useEffect(() => {
    if (selectedTask.status !== "Expired" && selectedTask.estimated_end_time) {
      checkIfWillBeExpired(selectedTask.estimated_end_time);
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
  

  const handleInputChange = (e) => {
    setNewSubject(e.target.value);
  };

  const handleAddSubject = async () => {
    if (newSubject.trim() === '') {
      return;
    }
    
    try {
      const response = await addSubject(newSubject);
      setSubjects((prevSubjects) => [...prevSubjects, response.data]);
      setIsAddingSubject(false); // Close the input field
      setNewSubject(''); // Reset the input value if needed
    } catch (error) {
      showToast("error", error.response?.data?.message || 'Failed to add subject');
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleAddSubject();
    }
  };

  const handleMenuClick = (value) => {
    if (value === "delete") {
      setShowDialogConfirm(true);
    } else if (value === "focusTimer") {
      // Start focus timer
      localStorage.setItem("focusTaskId", selectedTask.id);
      navigate("/timer");
    }
    setShowMenu(false);
  }

  const handleDeleteTask = () => {
    setShowDialogConfirm(false);
    console.log({ ...selectedTask, isDeleted: true });
    onSave({ ...selectedTask, isDeleted: true });
  }

  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDialogConfirm) return;

      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setShowMenu, showDialogConfirm]);

  return (
    <>
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center z-[10000]"
      
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-[700px] max-h-screen overflow-auto"
        ref={modalRef}
      >
        <div className="flex items-center justify-between pl-6 pr-5 py-4 text-gray-700">
          <h2 className="text-lg font-semibold">
            {selectedTask.id ? "Edit Task" : "New Task"}
          </h2>
          <div className="flex gap-2">
            <div className="relative">
              <button
                className="hover:text-black hover:bg-gray-200 p-1 rounded-lg"
                onClick={() => setShowMenu(!showMenu)}
              >
                <TfiMore />
              </button>
              {showMenu && (
                <Menu
                  className={"w-52 absolute top-5 -right-8 z-[999]"}
                  onItemClick={handleMenuClick}
                  ref={menuRef}
                >
                  {selectedTask.id && selectedTask.status === "InProgress" && (
                    <MenuItem
                      value="focusTimer"
                      label="Start Focus Timer"
                      className="hover:bg-transparent"
                      icon={<RxTimer size={16} />}
                    />
                  )}
                  <MenuItem
                    value="delete"
                    label="Delete"
                    className="hover:bg-transparent text-error"
                    icon={<GoTrash size={16} />}
                  />
                </Menu>
              )}
            </div>

            <button
              className="hover:text-black hover:bg-gray-200 p-1 rounded-lg ml-2"
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
              className="w-full text-sm resize-both min-w-[160px] min-h-[30px] max-w-[400px] max-h-[150px] rounded-md border-0 resize-none focus:resize px-2
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

                icon={taskData.subject_id ? <AiFillFileAdd className='text-[#f65454e9]'/> : <AiFillFileAdd className='text-[#bdd1da]'/>}
                // icon={<FcBookmark className="mb-[2px]" />}
                onCollapse={() => {
                  setIsAddingSubject(false);
                  setNewSubject("");
                }}
              >
                <SelectItem value={""} label={"No subject"} />
                {subjects?.map((subject) => (
                  <SelectItem
                    key={subject.id}
                    value={subject.id}
                    label={subject.name}
                  />
                ))}
                <li className="h-[50px] w-full text-sm transition flex items-center sticky bottom-0 bg-white">
                  {!isAddingSubject ? 
                  <div className='flex justify-center items-center w-full'>
                    <div className='flex gap-2 cursor-pointer items-center hover:text-primary' onClick={() => setIsAddingSubject(true)}>
                      <IoIosAddCircle size={20} className="mb-[2px]" />
                      Add New Subject
                    </div>
                  </div>
                  :
                  <div className='text-primary flex mx-8 gap-2 items-center w-full'>
                    <input
                      type="text"
                      value={newSubject}
                      onChange={handleInputChange}
                      onKeyDown={handleKeyDown}
                      className="w-full rounded focus:outline-none text-text-primary text-sm"
                      placeholder='Enter new subject name'
                      autoFocus
                    />
                    {newSubject && <IoIosAddCircle size={24} className="cursor-pointer" onClick={handleAddSubject} />}
                  </div>
                  }
                </li>
              </Select>
            </div>
          </div>

          {/* Right part */}
          <div className="flex flex-col p-6 gap-4 bg-[#faf5f3] shadow-sm basis-1/3">
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
                    style={{ color: getStatusColor(taskData.status) }}
                  />
                }
              >
                <SelectItem value="ToDo" label="To Do" />
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
                    <FcHighPriority />
                    : taskData.priority === "Medium" ?
                      <FcMediumPriority />
                    : <FcLowPriority />
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
                  className="border py-2 rounded-lg focus:outline-none text-center"
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
                  className="border py-2 rounded-lg focus:outline-none text-center"
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

      <DialogConfirm
        open={showDialogConfirm}
        onClose={() => setShowDialogConfirm(false)}
        onConfirm={handleDeleteTask}
        title="Confirm"
        content="Are you sure you want to delete this task?"
      />
    </div>
    </>
  );
};

Modal.propTypes = {
  onCancel: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default Modal;
