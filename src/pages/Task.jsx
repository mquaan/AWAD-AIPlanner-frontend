import { useEffect, useState } from "react";
import { usePage } from "../context/PageContext";
import Button from "../components/Button";
import { IoMdOptions } from "react-icons/io";
import TaskViewModal from "../components/TaskViewModal";
import { useTask } from "../context/TaskContext";
import Board from "./Board";
import Calendar from "./Calendar";
import { useNavigate, useParams } from "react-router-dom";
import Modal from "../components/Modal";
import { addTask, deleteTask, updateTask } from "../service/taskApi";
import { useToast } from "../context/ToastContext";
import { VscFeedback } from "react-icons/vsc";
import FeedbackModal from "../components/FeedbackModal";
import { getFeedback } from "../service/feedbackApi";
import { set } from "react-hook-form";

const Task = () => {
  const { setHeading, setActions } = usePage();
  const [showViewModal, setShowViewModal] = useState(false);
  const { currentView } = useTask();
  const [showFeedback, setShowFeedback] = useState(false);

  const [feedback, setFeedback] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!currentView) return;
    setHeading(`Task - ${currentView.charAt(0).toUpperCase() + currentView.slice(1)}`);
  }, [currentView, setHeading]);


  useEffect(() => {
    setActions([
      <Button
        key={1}
        onClick={handleGetFeedback}
        variant="outline"
        className="w-fit font-medium border-none hover:text-primary"
        icon={VscFeedback}
      >
        AI feedback
      </Button>,
      <Button
        key={2}
        onClick={() => setShowViewModal(true)}
        variant="outline"
        className="w-fit font-medium border-none hover:text-primary"
        icon={IoMdOptions}
      >
        View
      </Button>
    ]);
  }, []);

  const navigate = useNavigate();
  const { id } = useParams();

  const {
    tasks,
    setTasks,
    selectedTask,
    setSelectedTask,
    oldEvent,
    setOldEvent,
    setCancelChangeEvent,
    filters,
    isModalOpen,
    setIsModalOpen,
  } = useTask();

  useEffect(() => {
    if (id) {
      const task = tasks.find((task) => task.id === id);
      if (!task) {
        navigate('/task');
      } else {
        setSelectedTask(task);
        setIsModalOpen(true); // Mở modal khi tìm thấy task
      }
    } else {
      setSelectedTask(null);
      setIsModalOpen(false);
    }
  }, [id, tasks, navigate]);

  const cancelModal = () => {
    if (selectedTask.id) {
      if (oldEvent) {
        setCancelChangeEvent(true);
      }
      navigate('/task');
    } else {
      setSelectedTask(null);
      setIsModalOpen(false);
    }
  };

  const { showToast } = useToast();

  const checkIfNewTaskSatisfyFilters = (task) => {
    if (filters.subject && task.subject.id !== filters.subject) {
      console.log('subject', task.subject.id)
      return false;
    }
    if (filters.priority && task.priority !== filters.priority) {
      console.log('priority', task.priority, filters.priority)
      return false
    }

    return true;
  }

  const handleUpdateTask = async (updatedTask) => {
    try {
      const response = await updateTask(updatedTask);
      for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].id === response.data.id) {
          if (!checkIfNewTaskSatisfyFilters(response.data)) {
            tasks.splice(i, 1);
          } else {
            tasks[i] = response.data;
          }
          break;
        }
      }
      setTasks([...tasks]);
      showToast("success", "Task updated successfully");

      navigate('/task');

      if (oldEvent) {
        setOldEvent(null);
      }
    } catch (error) {
      showToast("error", error.response?.data?.message || 'Failed to update task');
    }
  }

  const handleAddTask = async (newTask) => {
    try {
      const response = await addTask(newTask);
      if (checkIfNewTaskSatisfyFilters(response.data)) {
        setTasks([...tasks, response.data]);
      }
      showToast("success", "Task added successfully");

      setSelectedTask(null);
      setIsModalOpen(false);
    } catch (error) {
      showToast("error", error.response?.data?.message || 'Failed to add task');
    }
  }

  const handleDeleteTask = async (deletedTask) => {
    try {
      const response = await deleteTask(deletedTask.id);
      setTasks(tasks.filter((task) => task.id !== response.data.id));
      showToast("success", "Task deleted successfully");

      setSelectedTask(null);
      setIsModalOpen(false);

      navigate('/task');
    } catch (error) {
      showToast("error", error.response?.data?.message || 'Failed to delete task');
    }
  }

  const handleSave = (task) => {
    if (task.id) {
      if (!task.isDeleted) {
        handleUpdateTask(task);
      } else {
        handleDeleteTask(task);
      }
    } else {
      handleAddTask(task);
    }
  };

  const handleGetFeedback = async () => {
    setIsLoading(true);
    setShowFeedback(true);
    try {
      const response = await getFeedback();
      setFeedback(response.data.Candidates[0].Content.Parts[0]);
    } catch (error) {
      showToast('error', error.response?.data?.message || 'Failed to get feedback');
    } finally {
      setIsLoading(false);
    }
  }

  const handleCloseFeedback = () => {
    setShowFeedback(false);
    setFeedback("");
  }

  return (
    <div className="relative">
      {isLoading && <div>Loading...</div>}
      {showViewModal && (
        <TaskViewModal onClose={() => setShowViewModal(false)} />
      )}
      {showFeedback && (
        <FeedbackModal isOpen={showFeedback} feedback={feedback} onClose={handleCloseFeedback} />
      )}
      {!currentView && <div>Loading</div>}
      {currentView === "list" && <div>AIList</div>}
      {currentView === "board" && <Board />}
      {currentView === "calendar" && <Calendar />}
      {isModalOpen && (
        <Modal
          task={selectedTask}
          onCancel={cancelModal}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default Task;