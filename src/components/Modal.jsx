import PropTypes from 'prop-types';
import { useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { isBefore, isAfter, isValid } from 'date-fns';

const TaskModal = ({ task, onClose, onSave }) => {
  // Use a single state to hold the task data
  const [taskData, setTaskData] = useState({
    name: task.name,
    description: task.description,
    priority: task.priority,
    estimated_start_time: new Date(task.estimated_start_time),
    estimated_end_time: new Date(task.estimated_end_time)
  });
  const [error, setError] = useState("");

  const validateDates = () => {
    const now = new Date();

    // Kiểm tra estimated_start_time và estimated_end_time có hợp lệ không
    if (!isValid(taskData.estimated_start_time) || !isValid(taskData.estimated_end_time)) {
      setError("Please select valid dates.");
      return false;
    }

    // Kiểm tra estimated_start_time không được là quá khứ
    if (isBefore(taskData.estimated_start_time, now)) {
      setError("Start date cannot be in the past.");
      return false;
    }

    // Kiểm tra estimated_end_time phải sau estimated_start_time
    if (isAfter(taskData.estimated_end_time, taskData.estimated_start_time)) {
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
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[10000]"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-lg shadow-xl max-w-lg w-full relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute text-[30px] top-2 right-4 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-2xl font-semibold mb-4">Edit Task</h2>
        
        <div className="mb-4">
          <label className="block font-medium text-gray-700">Task Name</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded-md"
            name="name"
            value={taskData.name}
            onChange={handleChange}
            placeholder="Enter task name"
          />
        </div>
        
        <div className="mb-4">
          <label className="block font-medium text-gray-700">Description</label>
          <textarea
            className="w-full p-2 border border-gray-300 rounded-md"
            name="description"
            value={taskData.description}
            onChange={handleChange}
            placeholder="Enter task description"
          />
        </div>
        
        <div className="mb-4">
          <label className="block font-medium text-gray-700">Priority</label>
          <select
            className="w-full p-2 border border-gray-300 rounded-md"
            name="priority"
            value={taskData.priority}
            onChange={handleChange}
          >
            <option value={1}>High</option>
            <option value={2}>Medium</option>
            <option value={3}>Low</option>
          </select>
        </div>

        <div className="flex gap-4">
          <div>
            <label htmlFor="estimated_start_time" className="block text-sm font-semibold mb-2">Start Date:</label>
            <DatePicker
              selected={taskData.estimated_start_time}
              onChange={(date) => handleDateChange(date, 'estimated_start_time')}
              dateFormat="yyyy/MM/dd HH:mm"
              showTimeSelect
              timeIntervals={15}
              timeCaption='Time'
              placeholderText="Select a start date"
              className="border p-2 rounded"
            />
          </div>

          <div className='mb-4'>
            <label htmlFor="estimated_end_time" className="block text-sm font-semibold mb-2">End Date:</label>
            <DatePicker
              selected={taskData.estimated_end_time}
              onChange={(date) => handleDateChange(date, 'estimated_end_time')}
              dateFormat="yyyy/MM/dd HH:mm"
              showTimeSelect
              timeIntervals={15}
              timeCaption='Time'
              placeholderText="Select an end date"
              className="border p-2 rounded"
              minDate={taskData.estimated_start_time}
            />
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

TaskModal.propTypes = {
  task: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default TaskModal;
