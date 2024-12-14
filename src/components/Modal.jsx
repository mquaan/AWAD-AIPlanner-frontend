import PropTypes from 'prop-types';
import { useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { format, isAfter, isValid } from 'date-fns';

import { TfiMore } from "react-icons/tfi";
import { LiaTimesSolid } from "react-icons/lia";

import { SUBJECTS } from '../data/testData';

const Modal = ({ task, onClose, onSave }) => {
  
  // Use a single state to hold the task data
  const [taskData, setTaskData] = useState({
    name: task.name,
    description: task.description,
    priority: task.priority,
    startDate: new Date(task.startDate),
    endDate: new Date(task.endDate),
  });
  const [error, setError] = useState("");

  if (!task) return null;


  const validateDates = () => {
    // const now = new Date();

    // Kiểm tra startDate và endDate có hợp lệ không
    if (!isValid(taskData.startDate) || !isValid(taskData.endDate)) {
      setError("Please select valid dates.");
      return false;
    }

    // Kiểm tra startDate không được là quá khứ
    // if (isBefore(taskData.startDate, now)) {
    //   setError("Start date cannot be in the past.");
    //   return false;
    // }

    // Kiểm tra endDate phải sau startDate
    if (isAfter(taskData.endDate, taskData.startDate)) {
      setError(""); // Clear any previous error
      return true;
    }

    setError("End date must be after start date.");
    return false;
  };

  const handleSave = () => {
    if (validateDates()){
      const savedTask = {
        ...task,
        ...taskData,
        startDate: format(taskData.startDate, 'yyyy/MM/dd HH:mm'),
        endDate: format(taskData.endDate, 'yyyy/MM/dd HH:mm'),
      };
      onSave(savedTask);
      onClose();
    } else {
      return;
    }
  };


  // Handle input changes dynamically
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDateChange = (date, field) => {
    setTaskData((prevTask) => ({
      ...prevTask,
      [field]: date,
    }));
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl max-w-lg w-full relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className='flex items-center justify-between pl-6 pr-5 py-4 text-gray-500'>
          <h2 className="text-lg   font-semibold">Edit Task</h2>
          <div className='flex gap-2'>  
            <button className='hover:text-black hover:bg-gray-200 p-1 rounded-lg'>
              <TfiMore />
            </button>
            <button
              className="hover:text-black hover:bg-gray-200 p-1 rounded-lg"
              onClick={onClose}
              >
              <LiaTimesSolid />
            </button>
          </div>
        </div>
        <hr className='border-t border-gray-200'/>
        
        {/* bot */}
        <div className='flex'>
          {/* Left part */}
          <div className='p-5 flex flex-col gap-1'>
            <input
              type="text"
              className="w-full text-xl font-semibold rounded-md border-0
                        focus:border focus:border-gray-300 focus:outline-none focus:ring-0"
              name="name"
              value={taskData.name}
              onChange={handleChange}
              placeholder="Task name"
              />

              <textarea
                className="w-full text-sm rounded-md border-0 resize-none focus:resize
                          focus:border focus:border-gray-300 focus:outline-none focus:ring-0"
                name="description"
                value={taskData.description}
                onChange={handleChange}
                placeholder="Enter task description"
              />

              <div className="relative">
                <label className="block font-medium text-gray-700">Subject</label>
                <select
                  className="appearance-none w-full p-2 cursor-pointer
                            outline-none bg-white rounded-md border border-gray-300
                            focus:outline-none focus:ring-0"
                  name="subject"
                  value={taskData.subject}
                  onChange={handleChange}
                  >
                  {SUBJECTS.map((subject) => (
                    <option key={subject.id} value={subject.name}>
                      {subject.name}
                    </option>
                  ))}
                </select>
              </div>
          </div>
          
          <div className='border-r border-gray-500'/>

          {/* Right part */}
          <div className='flex flex-col p-6 gap-4'>
            <div className="mb-4">
              <label className="block font-medium text-gray-700">Priority</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md"
                name="priority"
                value={taskData.priority}
                onChange={handleChange}
                >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <label htmlFor="startDate" className="block text-sm font-semibold mb-2">Start Date:</label>
                <DatePicker
                  selected={taskData.startDate}
                  onChange={(date) => handleDateChange(date, 'startDate')}
                  dateFormat="yyyy/MM/dd HH:mm"
                  showTimeSelect
                  timeIntervals={15}
                  timeCaption='Time'
                  placeholderText="Select a start date"
                  className="border p-2 rounded"
                  />
              </div>

              <div className='mb-4'>
                <label htmlFor="endDate" className="block text-sm font-semibold mb-2">End Date:</label>
                <DatePicker
                  selected={taskData.endDate}
                  onChange={(date) => handleDateChange(date, 'endDate')}
                  dateFormat="yyyy/MM/dd HH:mm"
                  showTimeSelect
                  timeIntervals={15}
                  timeCaption='Time'
                  placeholderText="Select an end date"
                  className="border p-2 rounded"
                  minDate={taskData.startDate}
                  />
              </div>
            </div>
          </div>
        </div>
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <div className="flex justify-end gap-4">
          <button
            className="bg-gray-200 px-4 py-2 rounded-md hover:bg-gray-300"
            onClick={onClose}
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
  );
};

Modal.propTypes = {
  task: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default Modal;
