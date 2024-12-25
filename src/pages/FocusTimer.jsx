import { useEffect, useState } from "react";
import { usePage } from "../context/PageContext";
import {getTaskById, updateTaskFocusTime, updateTaskStatus} from "../service/taskApi";
import { useToast } from "../context/ToastContext";
import CheckableTaskCard from "../components/CheckableTaskCard";
import Button from "../components/Button";
import { getTimerSettings } from "../service/timerApi";
import useTimer from "../hooks/useTimer";
import { TbReload } from "react-icons/tb";
import { HiOutlineSelector } from "react-icons/hi";
import FocusTaskModal from "../components/FocusTaskModal";
import { FaPlay, FaPause } from "react-icons/fa6";

const FocusTimer = ()  => {
  const { setHeading, setActions } = usePage();
  useEffect(() => {
    setHeading("Focus Timer");
    setActions([]);
  }, []);

  const { showToast } = useToast();

  const [focusTask, setFocusTask] = useState(null);
  const [isOpenFocusTaskModal, setIsOpenFocusTaskModal] = useState(false);

  const [activeMode, setActiveMode] = useState(0);

  const [timerSettings, setTimerSettings] = useState(null);

  const [pomoCount, setPomoCount] = useState(0);

  useEffect(() => {
    const savedTask = localStorage.getItem("focusTaskId");

    const fetchTaskById = async (id) => {
      try {
        const response = await getTaskById(id);
        setFocusTask(response.data);
      } catch (error) {
        showToast("error", error.response?.data?.message || "Failed to fetch focus task");
        localStorage.removeItem("focusTaskId");
      }
    }

    if (savedTask) {
      fetchTaskById(savedTask);
    }
  }, []);

  const onPauseTimer = async () => {
    if (activeMode === 0) {
      // Update task focus time
      const focusTime = Math.floor(timePassed / (60 * 1000));

      if (focusTime === 0) return;

      try {
        await updateTaskFocusTime(focusTask.id, focusTime);
        setFocusTask({...focusTask, focus_time: focusTask.focus_time + focusTime});
      } catch (error) {
        showToast("error", error.response?.data?.message || "Failed to update focus time");
      }
    }
  }

  const onCompleteTimer = async () => {
    if (activeMode === 0) {
      // Update task focus time
      try {
        await updateTaskFocusTime(focusTask.id, timerSettings.focus_time);
        setFocusTask({ ...focusTask, focus_time: focusTask.focus_time + timerSettings.focus_time });

        const nextCount = pomoCount + 1;

        const nextPomoCount = nextCount === timerSettings.interval ? nextCount : nextCount % timerSettings.interval;
        setPomoCount(nextPomoCount);

        if (nextCount % timerSettings.interval === 0) {
          setActiveMode(2);
          setTargetTime(timerSettings.long_break_time * 60 * 1000);
        } else {
          setActiveMode(1);
          setTargetTime(timerSettings.short_break_time * 60 * 1000);
        }
      } catch (error) {
        showToast("error", error.response?.data?.message || "Failed to update focus time");
      }
    } else {
      setActiveMode(0);
      setTargetTime(timerSettings.focus_time * 60 * 1000);
    }
  }

  const {
    timeLeft,
    setTargetTime,
    isRunning,
    timePassed,
    start,
    pause,
    reset,
  } = useTimer(null, onPauseTimer, onCompleteTimer);

  const fetchTimerSettings = async () => {
      try {
        const response = await getTimerSettings();
        setTimerSettings(response.data);
        setTargetTime(response.data.focus_time * 60 * 1000);
      } catch (err) {
        showToast("error", err?.response?.data?.message || "Internal server error");
      }
    };

  useEffect(() => {
    fetchTimerSettings();
    
  }, []);

  const changeModeTimer = (mode) => {
    setActiveMode(mode);
    switch (mode) {
      case 0:
        setTargetTime(timerSettings.focus_time * 60 * 1000);
        break;
      case 1:
        setTargetTime(timerSettings.short_break_time * 60 * 1000);
        break;
      case 2:
        setTargetTime(timerSettings.long_break_time * 60 * 1000);
        break;
      default:
        break;
    }
  }

  const [isSpinning, setIsSpinning] = useState(false);
  const handleResetClick = () => {
    reset();
    setIsSpinning(true);
    setTimeout(() => setIsSpinning(false), 1000);
  }

  const handleCompleteTask = async () => {
    try {
      if (activeMode === 0 && isRunning) {
        // Update task focus time
        const focusTime = Math.floor(timePassed / (60 * 1000));
        console.log(focusTime);
        if (focusTime !== 0) {
          await updateTaskFocusTime(focusTask.id, focusTime);
          setFocusTask({...focusTask, focus_time: focusTask.focus_time + focusTime});
        }
      }

      // Update task status
      await updateTaskStatus({ ...focusTask, status: 'Completed' });
      showToast('success', 'Task completed');

      setFocusTask(null);
      localStorage.removeItem("focusTaskId");
      setActiveMode(0);
      setTargetTime(timerSettings.focus_time * 60 * 1000);
      reset();
    } catch (error) {
      showToast('error', error.response?.data?.message || 'Failed to update task status');
    }
  }

  return (
    <>
      <div className="flex flex-col items-center">
        <div className="w-[400px] space-y-5">
          {/* Task Section */}
          <div className="flex gap-3 items-center">
            {focusTask ? (
              <CheckableTaskCard
                className="w-full"
                customStyle={{ container: "bg-gray-100 border" }}
                task={focusTask}
                onClick={() => setIsOpenFocusTaskModal(true)}
                onComplete={handleCompleteTask}
                showFocusTime={true}
                showSubject={true}
              />
            ) : (
              <div 
                className="w-full text-text-neutral border-2 border-dashed flex items-center justify-center gap-2 px-4 py-4 rounded-xl cursor-pointer transition bg-gray-100" 
                onClick={() => setIsOpenFocusTaskModal(true)}
              >
                Choose a task to start the timer
                <HiOutlineSelector size={24} strokeWidth={1.5} />
              </div>
            )}
          </div>

          {/* Timer Section */}
          <div className="flex flex-col items-center gap-10 w-full">
            {/* Mode */}
            <div className="flex gap-5 w-full">
              <div className="relative w-[120px] space-y-2">
                <Button
                  variant={activeMode === 0 ? "primary" : "outline"}
                  className={`w-[120px] rounded-full ${
                    activeMode === 0 && "hover:bg-primary"
                  } disabled:hover:bg-transparent`}
                  onClick={() => changeModeTimer(0)}
                  disabled={activeMode !== 0 && isRunning}
                >
                  Pomodoro
                </Button>

                {/* Dot count */}
                <div className="w-fit max-w-[90px] h-[5px] mx-auto overflow-hidden flex gap-1">
                  {pomoCount > 0 &&
                    Array.from({ length: pomoCount }).map((_, index) => (
                      <div
                        key={index}
                        className="flex-none w-[5px] h-[5px] bg-primary rounded-full"
                      ></div>
                    ))}
                </div>
              </div>
              <Button
                variant={activeMode === 1 ? "primary" : "outline"}
                className={`w-[120px] rounded-full ${
                  activeMode === 1 && "hover:bg-primary"
                } disabled:hover:bg-transparent`}
                onClick={() => changeModeTimer(1)}
                disabled={activeMode !== 1 && isRunning}
              >
                Short Break
              </Button>
              <Button
                variant={activeMode === 2 ? "primary" : "outline"}
                className={`w-[120px] rounded-full ${
                  activeMode === 2 && "hover:bg-primary"
                } disabled:hover:bg-transparent`}
                onClick={() => changeModeTimer(2)}
                disabled={activeMode !== 2 && isRunning}
              >
                Long Break
              </Button>
            </div>

            {/* Timer */}
            <p className="text-[120px] font-semibold font-ds-digital tracking-[0.1em] leading-none">
              {timeLeft.minutes}:{timeLeft.seconds}
            </p>

            {/* Control */}
            <div className="flex gap-5">
              <Button
                variant="primary"
                className="w-[200px] uppercase text-base"
                disabled={!focusTask}
                onClick={() => (isRunning ? pause() : start())}
                icon={isRunning ? FaPause : FaPlay}
                iconLeft={false}
              >
                {isRunning ? "Pause" : "Start"}
              </Button>

              <button onClick={handleResetClick} disabled={!focusTask}>
                <TbReload
                  size={40}
                  className={isSpinning ? "animate-spin-once" : ""}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      <FocusTaskModal
        isOpen={isOpenFocusTaskModal}
        onClose={() => setIsOpenFocusTaskModal(false)}
        onSelect={(task) => {
          setFocusTask(task);
          localStorage.setItem("focusTaskId", task.id);
          setIsOpenFocusTaskModal(false);
        }}
      />
    </>
  );
}

export default FocusTimer;