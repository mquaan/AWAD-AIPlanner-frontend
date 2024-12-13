import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { useEffect, useRef } from 'react';
import '../styles/calendar.css';
import { useTask } from '../context/TaskContext';
import { useNavigate } from 'react-router-dom';

const Calendar = () => {
  const calendarRef = useRef(null);

  const { tasks, cancelChangeEvent, setCancelChangeEvent, oldEvent, setOldEvent } = useTask();
  const navigate = useNavigate();

  const handleEventClick = (info) => {
    console.log('click', info.event.id, info.event.start, info.event.end);

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
    console.log('old', info.oldEvent.id, info.oldEvent.start, info.oldEvent.end);
    console.log('resize', info.event.id, info.event.start, info.event.end);
    setOldEvent(info.oldEvent);

    const task = tasks.find((task) => task.id === info.event.id);
    task.estimated_start_time = info.event.start;
    task.estimated_end_time = info.event.end;
    navigate(`/task/${task.id}`);
  }

  const handleDateSelect = (info) => {
    console.log('select', info.start, info.end);
  }

  return (
    <div className="w-full h-[calc(100vh-125px)]">
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
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
          timeGridDay: {
            eventMaxStack: 4,
          },
        }}
        dayMaxEventRows={3}
        eventMaxStack={3}
        editable={true}
        selectable={true}
        eventResizableFromStart={true}
        snapDuration="00:15:00"
        events={tasks.map((task) => ({
          id: task.id,
          title: task.name,
          start: task.estimated_start_time,
          end: task.estimated_end_time,
          color:
            task.priority === 1
              ? "var(--priority-1)"
              : task.priority === 2
              ? "var(--priority-2)"
              : "var(--priority-3)",
        }))}
        eventClick={handleEventClick}
        eventResize={handleEventResizeAndDrop}
        eventDrop={handleEventResizeAndDrop}
        select={handleDateSelect}
      />
    </div>
  );
}

export default Calendar;