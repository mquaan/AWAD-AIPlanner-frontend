import { useEffect, useState } from "react";
import { usePage } from "../context/PageContext";
import Button from "../components/Button";
import { IoMdOptions } from "react-icons/io";
import TaskViewModal from "../components/TaskViewModal";
import { useTask } from "../context/TaskContext";
import Board from "./Board";
import Calendar from "./Calendar";

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


  return (
    <div className="relative">
      {showViewModal && 
        <TaskViewModal 
          onClose={() => setShowViewModal(false)}
        />
      }
      {!currentView && <div>Loading</div>}
      {currentView === 'list' && <div>List</div>}
      {currentView === 'board' && <Board />}
      {currentView === 'calendar' && <Calendar />}
    </div>
  );
};

export default Task;