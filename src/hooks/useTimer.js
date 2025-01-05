import { useEffect, useState } from "react";

const formatNumber = (num) => {
  return num < 10 ? `0${num}` : `${num}`;
};

const DAYS_IN_MS = 1000 * 60 * 60 * 24;
const HOURS_IN_MS = 1000 * 60 * 60;
const MIN_IN_MS = 1000 * 60;
const SEC_IN_MS = 1000;

const getTimeDiff = (diffInMSec) => {
  let diff = diffInMSec;
  const days = Math.floor(diff / DAYS_IN_MS); // Give the remaining days
  diff -= days * DAYS_IN_MS; // Subtract passed days
  const hours = Math.floor(diff / HOURS_IN_MS); // Give remaining hours
  diff -= hours * HOURS_IN_MS; // Subtract hours
  const minutes = Math.floor(diff / MIN_IN_MS); // Give remaining minutes
  diff -= minutes * MIN_IN_MS; // Subtract minutes
  const seconds = Math.floor(diff / SEC_IN_MS); // Give remaining seconds
  return {
    days: formatNumber(days), // Format everything into the return type
    hours: formatNumber(hours),
    minutes: formatNumber(minutes),
    seconds: formatNumber(seconds),
  };
};

const useTimer = (onStart, onPause, onComplete, onRunning, onReset) => {
  const [targetTime, setTargetTime] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    setTimeLeft(targetTime);
    // setTimeLeft(2000);
  }, [targetTime]);

  useEffect(() => {
    if (isRunning && targetTime !== null) {
      if (targetTime === 0) {
        setIsRunning(false);
        if (onComplete) onComplete();
      }

      const countdownInterval = setInterval(() => {
        if (timeLeft - 1000 <= 0) {
          setIsRunning(false);
          if (onComplete) onComplete();
        }

        if (onRunning) onRunning();
        setTimeLeft((prev) => prev - 1000);
      }, 1000);

      return () => {
        clearInterval(countdownInterval)
      };
    }
  }, [isRunning, targetTime, timeLeft, onComplete]);

  // useEffect(() => {
  //   // One-time operation, no cleanup needed
  //   document.title = `Time left: ${timeLeft}`;
  // }, [timeLeft]);

  const start = () => {
    setIsRunning(true);
    if (onStart) onStart();
  };

  const pause = () => {
    setIsRunning(false);
    if (onPause) onPause();
  };

  const reset = () => {
    setIsRunning(false);
    setTimeLeft(targetTime);
    if (onReset) onReset();
  }

  return {
    timeLeft: getTimeDiff(timeLeft),
    isRunning,
    setTargetTime,
    timePassed: targetTime - timeLeft,
    start,
    pause,
    reset,
  };
};

export default useTimer;
