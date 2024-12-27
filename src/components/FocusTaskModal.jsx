import { useEffect, useState } from "react";
import { getTasks } from "../service/taskApi";
import { Dialog, DialogBody, DialogHeader } from "./Dialog";
import PropTypes from 'prop-types';
import { useToast } from "../context/ToastContext";
import { RiCalendarCheckLine } from "react-icons/ri";
import { formatDate } from '../utils/datetime';
import { AiFillFile } from "react-icons/ai";
import { RxTimer } from "react-icons/rx";

const TaskCard = ({ task, onClick }) => {
  return (
    <div
      key={task.id}
      className="py-[12px] px-5 border w-full border-[#d8d6d6] rounded-xl shadow-sm flex gap-4
                hover:shadow-md transition duration-300 cursor-pointer"
      onClick={onClick}
    >
      {/* Priority circle */}
      <div
        className={`flex-none mt-4 w-3 h-3 rounded-full ${task.priority === 'High'
            ? 'bg-priority-high'
            : task.priority === 'Medium'
              ? 'bg-priority-medium'
              : 'bg-priority-low'
          }`}
      ></div>

      <div className="w-full flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <h3 className="font-medium">{task.name}</h3>
          <p className="text-sm text-gray-600">{task.description}</p>
        </div>
        <div className="flex items-center gap-1 text-gray-500">
          <RiCalendarCheckLine size={15} className="mb-[2px]" />
          <span className="text-sm">
            {task.estimated_end_time ? formatDate(task.estimated_end_time) : 'No end date'}
          </span>
        </div>
      </div>

      <div className="flex-none flex flex-col items-end gap-3 max-w-[200px]">
        <div className="h-fit flex items-center gap-2 text-gray-500">
          <AiFillFile size={18} strokeWidth={0.5} />
          <p className="text-sm font-semibold">
            {task.subject?.name || <span className='font-medium whitespace-nowrap'>(No subject)</span>}
          </p>
        </div>
        <div className="h-fit flex items-center gap-2 text-gray-500">
          <RxTimer size={18} strokeWidth={0.5} />
          <span className="text-sm font-semibold">
            {task.focus_time} mins
          </span>
        </div>
      </div>
    </div>
  );
}

const FocusTaskModal = ({ isOpen, onClose, onSelect }) => {
  const [tasks, setTasks] = useState([]);

  const { showToast } = useToast();

  const fetchInprogressTasks = async () => {
    try {
      const response = await getTasks("limit=100&page=1&status=InProgress");
      // sort tasks by priority
      response.data.data.sort((a, b) => {
        if (a.priority === "High") return -1;
        if (a.priority === "Medium" && b.priority !== "High") return -1;
        if (a.priority === "Low" && b.priority === "Low") return -1;
        return 1;
      });

      setTasks(response.data.data);
    } catch (error) {
      showToast("error", error.response?.data?.message || "Failed to fetch tasks");
    }
  }

  useEffect(() => {
    if (isOpen)
      fetchInprogressTasks();
  }, [isOpen]);

  return (
    <Dialog isOpen={isOpen} onClose={onClose} onSelect={onSelect}>
      <DialogHeader
        title="Choose an in-progress task to focus on"
        onClose={onClose}
      />
      <DialogBody>
        <div className="space-y-3">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onClick={() => onSelect(task)} />
          ))}
        </div>
      </DialogBody>
    </Dialog>
  );
}

TaskCard.propTypes = {
  task: PropTypes.object,
  onClick: PropTypes.func,
};

FocusTaskModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  onSelect: PropTypes.func,
};

export default FocusTaskModal;