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

const Task = () => {
  const { setHeading, setActions } = usePage();
  const [showViewModal, setShowViewModal] = useState(false);
  const { currentView } = useTask();

  useEffect(() => {
    if (!currentView) return;
    setHeading(`Task - ${currentView.charAt(0).toUpperCase() + currentView.slice(1)}`);
  }, [currentView, setHeading]);


  useEffect(() => {
    setActions([
      <Button
        key={1}
        onClick={() => setShowViewModal(true)}
        variant="outline"
        className="w-fit border-none font-medium hover:text-primary"
        icon={IoMdOptions}
      >
        View
      </Button>
    ]);
  }, []);

  const navigate = useNavigate();
  const { id } = useParams();

  const { tasks, setTasks, selectedTask, setSelectedTask, oldEvent, setOldEvent, setCancelChangeEvent } = useTask();
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    if (oldEvent) {
      setCancelChangeEvent(true);
    }
    navigate('/task');
  };

  const handleSave = (updatedTask) => {
    console.log(updatedTask);
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === updatedTask.id ? updatedTask : task
      )
    );
    if (oldEvent) {
      setOldEvent(null);
    }
  };

  return (
    <div className="relative">
      {showViewModal && (
        <TaskViewModal onClose={() => setShowViewModal(false)} />
      )}
      {!currentView && <div>Loading</div>}
      {currentView === "list" && <div>List</div>}
      {currentView === "board" && <Board />}
      {currentView === "calendar" && <Calendar />}
      {isModalOpen && (
        <Modal
          task={selectedTask}
          onClose={() => navigate("/task")}
          onCancel={cancelModal}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default Task;