import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePage } from "../context/PageContext";
import { useTask } from "../context/TaskContext";
import Loading from "../components/Loading";
import FeedbackModal from "../components/FeedbackModal";
import { useToast } from "../context/ToastContext";
import { FaPlay } from "react-icons/fa";
import { TbAnalyze } from "react-icons/tb";
import { MdManageHistory } from "react-icons/md";
import { getUserProfile } from '../service/userApi';
import { getAllNumTask } from "../service/subjectApi";
import { getFeedback } from "../service/feedbackApi";
import PropTypes from "prop-types";
import { Line, Doughnut } from "react-chartjs-2";
import { FcOk, FcTodoList, FcExpired, FcServices } from "react-icons/fc";
import { format, startOfMonth, endOfMonth, startOfWeek, addDays, subMonths, addMonths, isSameMonth, isSameDay } from 'date-fns';

import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import annotationPlugin from "chartjs-plugin-annotation";
ChartJS.register(ArcElement, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, annotationPlugin);

const Boxes = ({ title, value, Icon, text, bg }) => {
  return (
    <div className="w-[12vw] py-6 px-3 gap-3 flex flex-col items-center justify-center bg-white border shadow-md rounded-2xl">
      <div className={`flex items-center p-3 rounded-2xl ${bg}`}>
        <Icon className="w-6 h-6" />
      </div>
      <h1 className={`font-bold text-lg ${text}`}>{title}</h1>
      <p className="font-semibold text-md">{value}</p>
    </div>
  );
};

const UpNext = ({ task }) => {
  const priorityBgColor =
    task.priority === "High" ? "bg-priority-high" :
      task.priority === "Medium" ? "bg-priority-medium" :
        task.priority === "Low" ? "bg-priority-low" : "bg-gray-500";

  const priorityTextColor =
    task.priority === "High" ? "text-priority-high" :
      task.priority === "Medium" ? "text-priority-medium" :
        task.priority === "Low" ? "text-priority-low" : "text-gray-500";


  return (
    <div className="flex gap-2">
      <div className={`w-[5px] rounded-md ${priorityBgColor} ${priorityTextColor}`}> .</div>
      <div className="flex flex-col">
        <p className="text-[14px]">{task.name}</p>
        <p className="text-[13px] text-gray-500">Deadline: {formatUpNext(task.estimated_end_time)}</p>
      </div>
    </div>
  )
}

const LineChart = ({ lineData }) => {
  const { showSidebar } = usePage();
  const todayIndex = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;
  const todayTaskCount = lineData?.datasets[0]?.data[todayIndex] || 0;
  return (
    <div className={`flex p-4 justify-center ${showSidebar ? 'w-[24vw]' : 'w-[28vw]'}`} >
      <Line
        data={lineData}
        options={{
          responsive: true,
          plugins: {
            legend: {
              display: false,
            },
            title: {
              display: true,
              text: "Tasks This Week",
              color: "#1e293b",
              font: {
                size: 15,
              },
            },
            annotation: {
              annotations: {
                todayLine: {
                  type: "line",
                  xMin: todayIndex,
                  xMax: todayIndex,
                  yMin: 0,
                  yMax: todayTaskCount,
                  borderColor: "#14b8a6",
                  borderWidth: 2,
                  borderDash: [5, 5],
                  yScaleID: "y",
                },
              },
            },
          },
          scales: {
            x: {
              ticks: {
                color: (context) => context.tick.value === todayIndex ? "#14b8a6" : "black",
                font: (context) => ({ weight: context.tick.value === todayIndex ? "bold" : "normal" }),
              },
              grid: {
                display: false,
              },
            },
            y: {
              ticks: {
                color: "black",
              },
              beginAtZero: true,
            },
          },
        }}
      />
    </div>
  );
};

const formatDate = (date) => format(new Date(date), 'yyyy-MM-dd');

const formatUpNext = (date) => format(new Date(date), 'dd/MM HH:mm');

const SubjectDonutChart = ({ data }) => {
  const { showSidebar } = usePage();
  const labels = data?.map((subject) => subject.subject.name) || [];
  const values = data?.map((subject) => subject.tasks) || [];

  const COLORS = [
    "#A2D2FF", // Pastel light blue
    "#72C3DC", // Soft cyan blue
    "#A4D7E1", // Pale blue
    "#6BB9F0", // Soft cerulean blue
    "#7BC8F6", // Light sky blue
    "#B1D7FF", // Frosted blue
    "#80A9FF", // Pastel indigo
    "#6F94B5", // Slate blue
    "#96C8FF", // Light periwinkle
    "#C0D7FF", // Light ice blue
  ];

  const chartData = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: COLORS,
        borderColor: "#ffffff",
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "bottom",
        labels: {
          font: {
            size: 11,
          },
        },
      },
      title: {
        display: true,
        text: "Subject Task Distribution",
        color: "#111827",
        font: {
          size: 15,
        },
        padding: { top: 10, bottom: 20 },
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: function (tooltipItem) {
            const label = labels[tooltipItem.dataIndex];
            const value = values[tooltipItem.dataIndex];
            return `${label}: ${value} tasks`;
          },
        },
        backgroundColor: "#ffffff",
        borderColor: "#cccccc",
        borderWidth: 1,
        bodyColor: "#333333",
        titleColor: "#333333",
        titleFont: { size: 14, weight: "bold" },
        bodyFont: { size: 12 },
        cornerRadius: 6,
        padding: 10,
      },
    },
    cutout: "70%",
  };

  return (
    <div className={`flex justify-center p-4 bg-white border shadow-lg rounded-2xl ${showSidebar ? 'w-[24vw]' : 'w-[28vw]'}`} >
      <Doughnut data={chartData} options={options} />
    </div>
  );
};

const Dashboard = () => {
  const [tooltip, setTooltip] = useState({ visible: false, text: '', x: 0, y: 0 });

  const handleMouseEnter = (event, tasks) => {
    const rect = event.target.getBoundingClientRect();
    setTooltip({
      visible: true,
      text: tasks,
      x: rect.left + window.scrollX + rect.width / 2,
      y: rect.top + window.scrollY - 10,
    });
  };

  const handleMouseLeave = () => {
    setTooltip({ visible: false, text: '', x: 0, y: 0 });
  };
  const { tasks } = useTask();

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const currentDate = new Date();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const onDateClick = (day) => setSelectedDate(day);
  const removeSelectedDate = () => setSelectedDate(null);
  const isTaskDate = (day) =>
    tasks.some((task) => (
      formatDate(task.estimated_start_time) === formatDate(day) ||
      formatDate(task.estimated_end_time) === formatDate(day)
    ))

  const getTasksName = (day) => tasks.filter((task) => formatDate(task.estimated_start_time) === formatDate(day) &&
    formatDate(task.estimated_end_time) === formatDate(day)).map((task) => task.name);

  const getTasksNameStart = (day) => tasks.filter((task) => formatDate(task.estimated_start_time) === formatDate(day) &&
    formatDate(task.estimated_end_time) !== formatDate(day)).map((task) => task.name + ' (start)');
  const getTasksNameEnd = (day) => tasks.filter((task) => formatDate(task.estimated_end_time) === formatDate(day) &&
    formatDate(task.estimated_start_time) !== formatDate(day)).map((task) => task.name + ' (end)');

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
    <div className="flex justify-between items-center mb-2">
      <button
        onClick={prevMonth}
        className="text-gray-600 hover:text-black p-2 rounded-full transition"
      >
        &lt;
      </button>
      <h2 className="text-md font-semibold">{format(currentMonth, 'MMMM yyyy')}</h2>
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
    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;

        const taskName = isTaskDate(cloneDay) ? [...getTasksName(cloneDay), ...getTasksNameStart(cloneDay), ...getTasksNameEnd(cloneDay)] : null;

        days.push(
          <div
            key={day}
            onClick={() => onDateClick(cloneDay)}
            onMouseEnter={(e) => taskName && handleMouseEnter(e, taskName)}
            onMouseLeave={handleMouseLeave}
            className={`p-[6px] text-center text-sm cursor-pointer rounded-full ${!isSameMonth(day, monthStart)
                ? 'text-gray-400'
                : isSameDay(day, currentDate)
                  ? 'bg-blue-200'
                  : isTaskDate(day)
                    ? 'bg-green-100 hover:bg-green-200'
                    : isSameDay(day, selectedDate)
                      ? 'bg-sky-100'
                      : 'hover:bg-sky-100'
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
  const [progressTime, setProgressTime] = useState(new Date());
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [numTask, setNumTask] = useState(null);
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
    const fetchAllNumTask = async () => {
      try {
        const response = await getAllNumTask();
        setNumTask(response.data);
      } catch (e) {
        console.error(e);
      }
    };
    fetchAllNumTask();
  }, []);

  const { setHeading, setActions } = usePage();

  useEffect(() => {
    setHeading("");
    setActions("");
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setRealTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgressTime(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const getTaskDataForWeek = (tasks) => {
    const today = new Date(); // Lấy ngày hiện tại
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 1)); // Bắt đầu từ thứ 2
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Tới Chủ nhật

    const dayTaskCount = Array(7).fill(1);

    tasks.forEach((task) => {
      if (!task.estimated_start_time || !task.estimated_end_time) return;
      const startDate = new Date(task.estimated_start_time);
      const endDate = new Date(task.estimated_end_time);

      for (let i = 0; i < 7; i++) {
        const currentDay = new Date(startOfWeek);
        currentDay.setDate(startOfWeek.getDate() + i);

        if (
          startDate <= currentDay &&
          endDate >= currentDay &&
          currentDay <= endOfWeek
        ) {
          dayTaskCount[i]++;
        }
      }
    });

    return {
      labels: ["M", "T", "W", "T", "F", "Sa", "Su"],
      datasets: [
        {
          data: dayTaskCount,
          borderColor: "#2dd4bf",
          backgroundColor: "#d1fae5",
          tension: 0.3,
        },
      ],
    };
  };
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { showToast } = useToast();
  const handleGetFeedback = async () => {
    setIsLoading(true);
    setShowFeedback(true);
    try {
      const response = await getFeedback("analyze");
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
    <div>
      {isLoading && <Loading content="Generating..." />}
      {showFeedback && (
        <FeedbackModal isOpen={showFeedback} feedback={feedback} onClose={handleCloseFeedback} />
      )}
      <div className="w-full h-full flex flex-col items-center justify-center gap-4 mt-[-10px]">
        <div className="flex w-full items-center justify-between">
          <div
            className="max-w-[12vw] flex gap-2 items-center justify-between"
          >
            <div className="flex flex-col gap-1 w-full text-xl">
              <div className="font-semibold flex gap-1">
                <p>Hi, </p>
                <p className="text-primary truncate">{profile?.name}</p>
                <img
                  src={profile?.avatar}
                  alt="avatar"
                  className="w-6 h-6 rounded-full flex-none"
                />
                <p>!</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3 items-center justify-between">
            <div
              onClick={() => navigate("/task")}
              className="flex gap-3 items-center justify-between bg-white border cursor-pointer p-4 rounded-3xl shadow-sm
                        hover:shadow-lg"
            >
              <div className="flex items-center justify-center">
                <MdManageHistory className="w-5 h-5 text-primary" />
              </div>
              <div className="font-semibold text-[15px]">
                Manage Tasks
              </div>
            </div>
            <div
              onClick={() => navigate("/timer")}
              className="flex gap-3 items-center justify-between bg-white border cursor-pointer p-4 rounded-3xl shadow-sm
                        hover:shadow-lg"
            >
              <div className="flex items-center justify-center">
                <FaPlay className="w-4 h-4 text-primary" />
              </div>
              <div className="font-semibold text-[15px]">
                Focus Timer
              </div>
            </div>
            <div
              onClick={handleGetFeedback}
              className="flex gap-3 items-center justify-between bg-white border cursor-pointer p-4 rounded-3xl shadow-sm
                        hover:shadow-lg"
            >
              <div className="flex items-center justify-center">
                <TbAnalyze className="w-5 h-5 text-primary" />
              </div>
              <div className="font-semibold text-[15px]">
                AI Analyze
              </div>
            </div>
          </div>
          <div className="w-[25vw] h-full items-center justify-center flex flex-col gap-2 ">
            <div className="flex gap-4 text-lg">
              <p className="text-2xl font-orbitron">{realTime}</p>
            </div>
          </div>
        </div>

        <div className="w-full flex gap-12">
          <div className="w-full flex flex-col gap-4">
            <div className="flex w-full justify-between">
              <Boxes
                title="To Do"
                value={tasks.filter((task) => task.status === "ToDo").length + " tasks"}
                Icon={FcTodoList}
                text="text-blue-500"
                bg="bg-blue-100"
              />
              <Boxes
                title="In Progress"
                value={tasks.filter((task) => task.status === "InProgress").length + " tasks"}
                Icon={FcServices}
                text="text-orange-500"
                bg="bg-orange-100"
              />
              <Boxes
                title="Completed"
                value={tasks.filter((task) => task.status === "Completed").length + " tasks"}
                Icon={FcOk}
                text="text-green-500"
                bg="bg-green-100"
              />
              <Boxes
                title="Expired"
                value={tasks.filter((task) => task.status === "Expired").length + " tasks"}
                Icon={FcExpired}
                text="text-yellow-500"
                bg="bg-yellow-100"
              />
            </div>
            <div className="flex justify-between gap-6 mt-2">
              <SubjectDonutChart data={numTask} />
              <div className="flex flex-col gap-4">
                <div className="h-fit w-full bg-white border shadow-lg rounded-2xl">
                  <LineChart lineData={getTaskDataForWeek(tasks)} />
                </div>
                <div className="flex flex-col p-4 items-center justify-between h-full bg-white border shadow-lg rounded-2xl">
                  <p className="font-bold">Task Now In Progress</p>
                  {tasks.filter((task) => task.status === "InProgress").length === 0 ? (
                    <p className="text-gray-500">There are no tasks in progress</p>
                  ) : (
                    tasks.filter((task) => task.status === "InProgress")
                      .sort((a, b) => new Date(a.estimated_end_time) - new Date(b.estimated_end_time))
                      .slice(0, 1)
                      .map((task) => (
                        <div key={task.id} className="flex flex-col items-center">
                          <p className="text-[#50998f] font-semibold">{task.name}</p>
                          <div className="flex w-[20vw]">
                            <p className="text-[12px] text-gray-700">
                              {formatUpNext(task.actual_start_time)}
                            </p>
                            <div className="flex flex-col w-full gap-1 justify-center items-center mt-3">
                              <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div
                                  className="bg-[#79cec3] h-2.5 rounded-full"
                                  style={{
                                    width: `${Math.min(
                                      100,
                                      (progressTime - new Date(task.actual_start_time)) /
                                      (new Date(task.estimated_end_time) - new Date(task.actual_start_time)) *
                                      100
                                    )}%`,
                                  }}
                                ></div>
                              </div>
                              {task.actual_start_time && task.estimated_end_time ? 
                                (
                                  <div className="text-[13px] font-medium text-[#2c382e] bg-[#79cec3] rounded-full py-1 px-2">
                                    {((progressTime - new Date(task.actual_start_time)) /
                                    (new Date(task.estimated_end_time) - new Date(task.actual_start_time)) * 100).toFixed(0)}%
                                  </div>
                                ) : 
                                (
                                  null
                                )
                              }
                            </div>
                            {task.actual_start_time && task.estimated_end_time ? (
                              <p className="text-[12px] text-gray-700 ml-3">
                                {formatUpNext(task.estimated_end_time)}
                              </p>) : <p className="text-[12px] font-semibold text-gray-700 ml-3">
                              Keep doing
                            </p>}
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="w-[25vw] border p-5 shadow-lg rounded-2xl bg-white">
              {renderHeader()}
              {renderDays()}
              {renderCells()}

              {tooltip.visible && (
                <div
                  style={{
                    position: 'absolute',
                    width: '150px',
                    top: tooltip.y,
                    left: tooltip.x,
                    transform: 'translate(-50%, -100%)',
                    backgroundColor: '#FFEDE1',
                    color: 'black',
                    padding: '5px 10px',
                    borderRadius: '5px',
                    pointerEvents: 'none',
                    fontSize: '13px',
                  }}
                >
                  <ul className="list-disc pl-4">
                    {tooltip.text.map((task, index) => (
                      <li key={index}>
                        {task}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="w-full px-6 py-4 border shadow-lg rounded-2xl bg-white">
              <h1 className="font-bold text-xl mb-2">Up next</h1>
              <div className="flex flex-col gap-6">
                {tasks.filter((task) => task.estimated_end_time !== null && task.status !== "Completed" && task.status !== "Expired")
                  .sort((a, b) => new Date(a.estimated_end_time) - new Date(b.estimated_end_time)).slice(0, 3).map((task) => (
                    <UpNext key={task.id} task={task} />
                  ))}

              </div>
            </div>
          </div>
        </div>
        {/* <div style={{ display: "flex", justifyContent: "center" }}> */}

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

UpNext.propTypes = {
  task: PropTypes.object,
};

LineChart.propTypes = {
  lineData: PropTypes.object,
};

SubjectDonutChart.propTypes = {
  data: PropTypes.array,
};

export default Dashboard;