import {useEffect, useRef, useState} from "react";
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
import {notifyMe, requestPermission} from "../utils/notification.js";
import {IoInformationCircleSharp} from "react-icons/io5";
import PropTypes from "prop-types";
import {useNavigate} from "react-router-dom";
import useClickOutside from "../hooks/useClickOutside.js";

const InfoModal = ({ onClose }) => {
  const modalRef = useRef(null);
  useClickOutside(modalRef, onClose);

  return (
    <div
      ref={modalRef}
      className="absolute -top-4 right-0 w-64 bg-white shadow-md rounded-lg p-4 space-y-4 z-50"
    >
      <div className="w-full text-sm text-text-secondary space-y-2">
        <p>You can customize the duration of each timer in the <span className="font-semibold">Settings → Timer</span>.
        </p>
        <p>Number of Pomodoros completed will be displayed with dots below the &#39;Pomodoro&#39;.</p>
      </div>
    </div>
  )
}

InfoModal.propTypes = {
  onClose: PropTypes.func.isRequired,
}

const FocusTimer = () => {
  const {setHeading, setActions, setDisableSidebar, hasAnyChanges, setHasAnyChanges} = usePage();
  const [isOpenInfoModal, setIsOpenInfoModal] = useState(false);

  // const [hasAnyChanges, setHasAnyChanges] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setHeading("Focus Timer");
    setActions([
      <button
        key={1}
        className="text-text-secondary"
        onClick={() => {
          setIsOpenInfoModal(!isOpenInfoModal);
        }}
      >
        <IoInformationCircleSharp
          size={32}
        />
      </button>
    ]);
    setHasAnyChanges(false);
  }, []);

  const { showToast } = useToast();

  const [focusTask, setFocusTask] = useState(null);
  const [isOpenFocusTaskModal, setIsOpenFocusTaskModal] = useState(false);

  const [activeMode, setActiveMode] = useState(0);

  const [timerSettings, setTimerSettings] = useState(null);

  const [pomoCount, setPomoCount] = useState(0);

  const [timeSaved, setTimeSaved] = useState(0); // in minutes

  useEffect(() => {
    requestPermission();

    const savedTask = localStorage.getItem("focusTaskId");

    const fetchTaskById = async (id) => {
      try {
        const response = await getTaskById(id);
        if (response.data.status !== "InProgress") {
          localStorage.removeItem("focusTaskId");
          return;
        }
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

  // Prevent user from leaving the page with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (!hasAnyChanges) return;

      event.preventDefault();
      event.returnValue = 'Changes you made may not be saved.';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasAnyChanges]);

  // Prevent user from leaving the page with unsaved changes
  useEffect(() => {
    const handlePopState = (event) => {
      if (!hasAnyChanges) return;

      event.preventDefault();
      const confirm = window.confirm('Changes you made may not be saved.');
      if (!confirm) {
        navigate(event.state?.url);
      } else {
        pause();
      }
    };

    window.addEventListener("popstate", handlePopState, false);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [navigate, hasAnyChanges]);

  const onStartTimer = () => {
    setHasAnyChanges(true);
  }

  const onPauseTimer = async () => {
    if (activeMode === 0) {
      // Update task focus time
      const focusTime = Math.floor(timePassed / (60 * 1000)) - timeSaved;

      if (focusTime === 0) return;

      try {
        await updateTaskFocusTime(focusTask.id, focusTime);
        setTimeSaved(timeSaved + focusTime);
        setFocusTask({...focusTask, focus_time: focusTask.focus_time + focusTime});
      } catch (error) {
        showToast("error", error.response?.data?.message || "Failed to update focus time");
      }
    }
  }

  const onCompleteTimer = async () => {
    if (activeMode === 0) {
      // Update task focus time
      const focusTime = timerSettings.focus_time - timeSaved;

      if (focusTime === 0) return;

      try {
        await updateTaskFocusTime(focusTask.id, focusTime);
        setTimeSaved(0);
        setFocusTask({ ...focusTask, focus_time: focusTask.focus_time + focusTime });

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

        notifyMe("Time's up! Take a break!");
      } catch (error) {
        showToast("error", error.response?.data?.message || "Failed to update focus time");
      }
    } else {
      if ((activeMode === 1 && timerSettings.short_break_time !== 0) || (activeMode === 2 && timerSettings.long_break_time !== 0))
        notifyMe("Time's up! Get back to work!");

      setActiveMode(0);
      setTargetTime(timerSettings.focus_time * 60 * 1000);
    }
  }

  const onRunningTimer = () => {
    // Check if the task deadline is reached during the session
    if (focusTask.estimated_end_time) {
      const deadline = new Date(focusTask.estimated_end_time);
      const now = new Date();

      if (now > deadline) {
        setFocusTask({ ...focusTask, status: "Expired" });
        notifyMe("Task deadline reached! Complete the task now!");
        pause();
      }
    }
  }

  const onResetTimer = () => {
    setTimeSaved(0);
  }

  const {
    timeLeft,
    setTargetTime,
    isRunning,
    timePassed,
    start,
    pause,
    reset,
  } = useTimer(onStartTimer, onPauseTimer, onCompleteTimer, onRunningTimer, onResetTimer);

  useEffect(() => {
    setDisableSidebar(isRunning);
  }, [isRunning]);

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
    if (mode === 0)
      setHasAnyChanges(false);
    else
      setHasAnyChanges(true);

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
    reset();
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
        const focusTime = Math.floor(timePassed / (60 * 1000)) - timeSaved;
        if (focusTime !== 0) {
          await updateTaskFocusTime(focusTask.id, focusTime);
          setTimeSaved(timeSaved + focusTime);
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
      <div className="relative flex flex-col items-center gap-6">
        {isOpenInfoModal && <InfoModal onClose={() => setIsOpenInfoModal(false)}/>}

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
                disabled={!focusTask || focusTask.status !== "InProgress"}
                onClick={() => (isRunning ? pause() : start())}
                icon={isRunning ? FaPause : FaPlay}
                iconLeft={false}
              >
                {isRunning ? "Pause" : "Start"}
              </Button>

              <button
                onClick={handleResetClick}
                disabled={!focusTask || focusTask.status !== "InProgress"}
              >
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
          setHasAnyChanges(true);

          setFocusTask(task);
          localStorage.setItem("focusTaskId", task.id);
          setIsOpenFocusTaskModal(false);
        }}
      />
    </>
  );
}

export default FocusTimer;