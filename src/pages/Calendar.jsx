import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin, { Draggable } from '@fullcalendar/interaction'
import { useEffect, useRef } from 'react';
import '../styles/calendar.css';
import { useTask } from '../context/TaskContext';
import { useNavigate } from 'react-router-dom';
import { getPriorityColor } from '../utils/priority';
import UnassignedTaskCard from '../components/UnassignedTaskCard';
import { usePage } from '../context/PageContext';
import moment from 'moment';

const Calendar = () => {
  const calendarRef = useRef(null);

  const {
    tasks,
    cancelChangeEvent,
    setCancelChangeEvent,
    oldEvent,
    setOldEvent,
    currentViewCalendar,
    changeViewCalendar,
    setIsModalOpen,
    setSelectedTask,
  } = useTask();
  
  var [assignedTasks, unassignedTasks] = tasks.reduce((acc, task) => {
    if (task.estimated_start_time || task.estimated_end_time || task.status === 'Completed' || task.status === 'Expired') {
      acc[0].push(task);
    } else {
      acc[1].push(task);
    }
    return acc;
  }, [[], []]);
  
  const navigate = useNavigate();

  const handleViewChange = (info) => {
    if (info.view.type !== currentViewCalendar) {
      changeViewCalendar(info.view.type);
    }
  }

  const handleEventClick = (info) => {
    const task = tasks.find((task) => task.id === info.event.id);
    navigate(`/task/${task.id}`);
  }

  useEffect(() => {
    if (cancelChangeEvent && oldEvent) {
      const task = tasks.find((task) => task.id === oldEvent.id);
      task.estimated_start_time = oldEvent.start;
      task.estimated_end_time = oldEvent.end;
      setCancelChangeEvent(false);
      setOldEvent(null);
    }
  }, [cancelChangeEvent]);

  const handleEventResizeAndDrop = (info) => {
    setOldEvent(info.oldEvent);

    const task = tasks.find((task) => task.id === info.event.id);
    task.estimated_start_time = info.event.start;
    task.estimated_end_time = info.event.end;
    navigate(`/task/${task.id}`);
  }

  const handleDateSelect = (info) => {
    setIsModalOpen(true);
    setSelectedTask({
      estimated_start_time: info.start,
      estimated_end_time: info.end,
    });
  }

  const containerRef = useRef(null);

  useEffect(() => {
    new Draggable(containerRef.current, {
      itemSelector: '.event-item-unassigned',
      eventData: function(eventEl) {
        const eventObj = JSON.parse(eventEl.getAttribute('data-event'));
        return {
          id: eventObj.id,
          title: eventObj.name,
          color: getPriorityColor(eventObj.priority),
        };
      }
    });
  }, [])

  const handleExternalEventDrop = (info) => {
    setOldEvent({
      id: info.event.id,
      start: null,
      end: null,
    })

    const task = unassignedTasks.find((task) => task.id === info.event.id);
    task.estimated_start_time = info.event.start;

    // Calculate the estimated_end_time as 30 minutes after the start time
    const startTime = new Date(info.event.start);
    const endTime = new Date(startTime.getTime() + 30 * 60000); // 30 minutes in milliseconds
    task.estimated_end_time = endTime;
    navigate(`/task/${task.id}`);
  }
  
  const { showSidebar } = usePage();

  return (
    <div className="w-full h-[calc(100vh-125px)] flex justify-between overflow-hidden">
      {/* <div className={`${showSidebar ? 'w-[682px]' : 'w-[810px]'}`}> */}
      {/* <div className={`${showSidebar ? 'w-[56vw]' : 'w-[65.9vw]'}`}> */}
      <div className={`${showSidebar ? 'w-[calc(100vw-578px)]' : 'w-[calc(100vw-450px)]'}`}>
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView={currentViewCalendar}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          nowIndicator={true}
          height="100%"
          views={{
            dayGrid: {
              displayEventTime: false,
            },
            timeGridWeek: {
              dayHeaderContent: (args) => {
                return moment(args.date).format("ddd, DD/MM");
              },
              titleFormat: (args) => {
                if (args.start.month === args.end.month) {
                  return `${moment(args.start).format("DD")} - ${moment(
                    args.end
                  ).format("DD/MM/YYYY")}`;
                }
                return `${moment(args.start).format("DD/MM/YYYY")} - ${moment(
                  args.end
                ).format("DD/MM/YYYY")}`;
              },
            },
            timeGridDay: {
              eventMaxStack: 4,
              titleFormat: (args) => {
                return moment(args.date).format("DD/MM/YYYY");
              },
            },
          }}
          buttonText={{
            today: "Today",
            month: "Month",
            week: "Week",
            day: "Day",
            list: "List",
          }}
          allDaySlot={false}
          datesSet={handleViewChange}
          dayMaxEventRows={3}
          eventMaxStack={3}
          editable={true}
          selectable={true}
          droppable={true}
          eventResizableFromStart={true}
          snapDuration="00:15:00"
          events={assignedTasks?.map((task) => ({
            id: task.id,
            title: task.name,
            start: task.estimated_start_time,
            end: task.estimated_end_time,
            color: getPriorityColor(task.priority),
          }))}
          eventClick={handleEventClick}
          eventResize={handleEventResizeAndDrop}
          eventDrop={handleEventResizeAndDrop}
          select={handleDateSelect}
          eventReceive={handleExternalEventDrop}
        />
      </div>

      <div className="w-[240px] border-[1px] rounded-lg" ref={containerRef}>
        <div className="h-[42px] mb-[24px] flex flex-col justify-center border-b-[1px]">
          <h1 className="px-3 font-semibold text-center">
            Tasks unassigned time
          </h1>
        </div>
        <div className="px-3 h-full overflow-y-auto space-y-2">
          {unassignedTasks.length === 0 && (
            <p className="text-center text-sm">No task</p>
          )}
          {unassignedTasks.map((task) => (
            <UnassignedTaskCard key={task.id} task={task} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Calendar;