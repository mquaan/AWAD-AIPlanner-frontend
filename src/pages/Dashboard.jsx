import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePage } from "../context/PageContext";
import { useTask } from "../context/TaskContext";
import { FaPlay } from "react-icons/fa";
import { getUserProfile } from '../service/userApi';
import PropTypes from "prop-types";
import { Line } from "react-chartjs-2";
import { FcOk, FcTodoList, FcExpired, FcServices } from "react-icons/fc";
import { format, startOfMonth, endOfMonth, startOfWeek, addDays, subMonths, addMonths, isSameMonth, isSameDay } from 'date-fns';

import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

// Register required components for Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Boxes = ({ title, value, Icon, text, bg }) => {
  return (
    <div className="w-[170px] h-[150px] p-6 gap-3 flex flex-col items-center justify-center bg-white border shadow-md rounded-2xl">
      <div className={`flex items-center p-3 rounded-2xl ${bg}`}>
        <Icon className="w-7 h-7"/>
      </div>
      <h1 className={`font-bold text-xl ${text}`}>{title}</h1>
      <p className="font-semibold text-md">{value}</p>
    </div>
  );
};

const LineChart = ({ taskData }) => {
  return (
    <div className="w-[50vw] bg-white border shadow-md rounded-2xl p-4">
      <Line
        data={taskData}
        options={{
          responsive: true,
          plugins: {
            legend: {
              display: true,
              position: "top",
              labels: {
                color: "black", // Màu chữ của legend
              },
            },
            title: {
              display: true,
              text: "Tasks Completed This Week",
              color: "black", // Màu chữ của tiêu đề
            },
          },
          scales: {
            x: {
              title: {
                display: true,
                text: "Days of the Week",
                color: "black", // Màu chữ của trục X
              },
              ticks: {
                color: "black", // Màu chữ của các nhãn trên trục X
              },
            },
            y: {
              title: {
                display: true,
                text: "Number of Tasks",
                color: "black", // Màu chữ của trục Y
              },
              ticks: {
                color: "black", // Màu chữ của các nhãn trên trục Y
              },
              beginAtZero: true,
            },
          },
        }}
      />
    </div>
  );
};

const Dashboard = () => {
  const { tasks } = useTask();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const currentDate = new Date();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const onDateClick = (day) => setSelectedDate(day);
  const removeSelectedDate = () => setSelectedDate(null);
  const isTaskDate = (day) => tasks.some((task) => format(new Date(task.estimated_start_time), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd'));
  const getTaskName = (day) => tasks.find((task) => format(new Date(task.estimated_start_time), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd'))?.name;
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".calendar")) {
        removeSelectedDate();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const renderHeader = () => (
    <div className="flex justify-between items-center mb-4">
      <button
        onClick={prevMonth}
        className="text-gray-600 hover:text-black p-2 rounded-full transition"
      >
        &lt;
      </button>
      <h2 className="text-lg font-semibold">{format(currentMonth, 'MMMM yyyy')}</h2>
      <button
        onClick={nextMonth}
        className="text-gray-600 hover:text-black p-2 rounded-full transition"
      >
        &gt;
      </button>
    </div>
  );

  const renderDays = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return (
      <div className="grid grid-cols-7 text-sm text-gray-600 font-semibold mb-2">
        {days.map((day, index) => (
          <div key={index} className="text-center">
            {day}
          </div>
        ))}
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = startOfWeek(addDays(monthEnd, 7));

    const rows = [];
    let days = [];
    let day = startDate;
    const taskName = getTaskName(day);
    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
        days.push(
          <div
            key={day}
            onClick={() => onDateClick(cloneDay)}
            className={`p-2 text-center cursor-pointer rounded-lg ${
              !isSameMonth(day, monthStart)
                ? 'text-gray-400'
                : isTaskDate(day)
                ? 'bg-green-100 hover:bg-green-200' // Nền xanh cho ngày có task
                : isSameDay(day, selectedDate)
                ? 'bg-blue-200'
                : 'hover:bg-gray-200'
            }`}
          >
            {format(day, 'd')}
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div key={day} className="grid grid-cols-7">
          {days}
        </div>
      );
      days = [];
    }

    return <div className="space-y-1">{rows}</div>;
  };

  const [realTime, setRealTime] = useState(new Date().toLocaleTimeString());
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getUserProfile();
        setProfile(response.data);
      } catch (e) {
        console.error(e);
      }
    };
    fetchUserData();
  }, []);

  const { setHeading, setActions } = usePage();
  const [taskData] = useState({
    labels: ["M", "T", "W", "T", "F", "Sa", "Su"],
    datasets: [
      {
        label: "Tasks Completed",
        data: [3, 5, 2, 8, 6, 1, 4],
        borderColor: "#ff6542",
        backgroundColor: "#FFEDE1",
        tension: 0.4,
      },
    ],
  });

  useEffect(() => {
    setHeading("Dashboard");
    setActions(["Create Task", "Create Project"]);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setRealTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleAddTask = () => {
    navigate("/task");
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-8">
      {/* Header Section */}
      <div className="flex w-full items-center justify-between">
        <div
          className="w-auto flex gap-2 items-center justify-between bg-white border px-7 py-6 rounded-2xl shadow-md"
        >
          <div className="flex flex-col gap-1 w-full">
            <div className="font-semibold flex gap-1">
              <p>Hello</p>
              <p className="text-primary">{profile?.name}</p>
              <img
                src={profile?.avatar}
                alt="avatar"
                className="w-6 h-6 rounded-full"
                />
              <p>,</p>
            </div>
            <div className="font-semibold w-full">
              Welcome to AI Study Planner
            </div>
          </div>

          <button 
            onClick={handleAddTask}
            className="bg-primary text-white font-semibold py-2 px-4 rounded-2xl shadow-md"
          >
            Manage Task
          </button>
        </div>

        <div className="w-auto flex flex-col gap-2 bg-white border shadow-md rounded-2xl p-4">
          <h1 className="font-bold text-xl">Today</h1>
          <div className="flex gap-4 text-md">
            <p>{new Date().toDateString()}</p>
            <p>{realTime}</p>
          </div>
        </div>
        <div 
          onClick={() => navigate("/timer")}
          className="w-[25vw] flex gap-2 items-center justify-between bg-white border cursor-pointer px-7 py-6 rounded-2xl shadow-md"
        >
          <div className="font-semibold">
              START FOCUS TIMER
          </div>
          <div className="flex bg-primary border p-4 items-center justify-center rounded-2xl shadow-md">
            <FaPlay className="text-black text-xl" />
          </div>
        </div>
      </div>

      <div className="w-full flex justify-between">
        <div className="flex flex-col gap-4">
          <div className="flex w-full justify-between">
            <Boxes 
              title="To Do" 
              value="10 tasks"
              Icon={FcTodoList}
              text="text-blue-500"
              bg="bg-blue-100"
            />
            <Boxes 
              title="In Progress"
              value="10 tasks"
              Icon={FcServices}
              text="text-orange-500"
              bg="bg-orange-100"
            />
            <Boxes 
              title="Completed"
              value="10 tasks"
              Icon={FcOk}
              text="text-green-500"
              bg="bg-green-100"
            />
            <Boxes 
              title="Expired"
              value="10 tasks"
              Icon={FcExpired}
              text="text-yellow-500"
              bg="bg-yellow-100"
            />
          </div>
          <LineChart taskData={taskData} />
        </div>
        <div className="flex flex-col gap-4">
          <div className="w-[25vw] p-4 shadow-lg rounded-2xl bg-white">
            {renderHeader()}
            {renderDays()}
            {renderCells()}
          </div>
          {/* Incoming tasks */}
          <div className="w-[25vw] p-4 shadow-lg rounded-2xl bg-white">
            <h1 className="font-bold text-xl">Incoming Tasks</h1>
            <div className="flex flex-col gap-2">
              <div className="flex gap-2 items-center">
                <FcTodoList className="text-xl" />
                <p>Task 1</p>
              </div>
              <div className="flex gap-2 items-center">
                <FcTodoList className="text-xl" />
                <p>Task 2</p>
              </div>
              <div className="flex gap-2 items-center">
                <FcTodoList className="text-xl" />
                <p>Task 3</p>
              </div>
              <div className="flex gap-2 items-center">
                <FcTodoList className="text-xl" />
                <p>Task 4</p>
              </div>
              <div className="flex gap-2 items-center">
                <FcTodoList className="text-xl" />
                <p>Task 5</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

Boxes.propTypes = {
  title: PropTypes.string,
  value: PropTypes.string,
  Icon: PropTypes.elementType,
  text: PropTypes.string,
  bg: PropTypes.string,
};

LineChart.propTypes = {
  taskData: PropTypes.object,
};

export default Dashboard;
