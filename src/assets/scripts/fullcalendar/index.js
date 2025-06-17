import { Calendar } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import DateUtils from '../utils/date';

document.addEventListener('DOMContentLoaded', function () {
  const calendarEl = document.getElementById('calendar');

  // element found in dom ?
  if (calendarEl == null) {
    return;
  }

  const calendar = new Calendar(calendarEl, {
    plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
    },
    initialDate: DateUtils.format(DateUtils.now(), 'YYYY-MM-DD'),
    navLinks: true, // can click day/week names to navigate views
    editable: true,
    dayMaxEvents: true, // allow "more" link when too many events
    events: [
      {
        title: 'All Day Event',
        start: DateUtils.format(DateUtils.now(), 'YYYY-MM-DD'),
      },
      {
        title: 'Long Event',
        start: DateUtils.format(DateUtils.add(DateUtils.now(), 1, 'day'), 'YYYY-MM-DD'),
        end: DateUtils.format(DateUtils.add(DateUtils.now(), 4, 'day'), 'YYYY-MM-DD'),
      },
      {
        groupId: 999,
        title: 'Repeating Event',
        start: DateUtils.format(DateUtils.add(DateUtils.now(), 2, 'day'), 'YYYY-MM-DDTHH:mm:ss').replace(/:\d{2}$/, ':00:00').replace(/T\d{2}:\d{2}/, 'T16:00'),
      },
      {
        groupId: 999,
        title: 'Repeating Event',
        start: DateUtils.format(DateUtils.add(DateUtils.now(), 9, 'day'), 'YYYY-MM-DDTHH:mm:ss').replace(/:\d{2}$/, ':00:00').replace(/T\d{2}:\d{2}/, 'T16:00'),
      },
      {
        title: 'Conference',
        start: DateUtils.format(DateUtils.add(DateUtils.now(), 5, 'day'), 'YYYY-MM-DD'),
        end: DateUtils.format(DateUtils.add(DateUtils.now(), 7, 'day'), 'YYYY-MM-DD'),
      },
      {
        title: 'Meeting',
        start: DateUtils.format(DateUtils.add(DateUtils.now(), 3, 'day'), 'YYYY-MM-DDTHH:mm:ss').replace(/:\d{2}$/, ':00:00').replace(/T\d{2}:\d{2}/, 'T10:30'),
        end: DateUtils.format(DateUtils.add(DateUtils.now(), 3, 'day'), 'YYYY-MM-DDTHH:mm:ss').replace(/:\d{2}$/, ':00:00').replace(/T\d{2}:\d{2}/, 'T12:30'),
      },
      {
        title: 'Lunch',
        start: DateUtils.format(DateUtils.add(DateUtils.now(), 3, 'day'), 'YYYY-MM-DDTHH:mm:ss').replace(/:\d{2}$/, ':00:00').replace(/T\d{2}:\d{2}/, 'T12:00'),
      },
      {
        title: 'Meeting',
        start: DateUtils.format(DateUtils.add(DateUtils.now(), 3, 'day'), 'YYYY-MM-DDTHH:mm:ss').replace(/:\d{2}$/, ':00:00').replace(/T\d{2}:\d{2}/, 'T14:30'),
      },
      {
        title: 'Happy Hour',
        start: DateUtils.format(DateUtils.add(DateUtils.now(), 3, 'day'), 'YYYY-MM-DDTHH:mm:ss').replace(/:\d{2}$/, ':00:00').replace(/T\d{2}:\d{2}/, 'T17:30'),
      },
      {
        title: 'Dinner',
        start: DateUtils.format(DateUtils.add(DateUtils.now(), 3, 'day'), 'YYYY-MM-DDTHH:mm:ss').replace(/:\d{2}$/, ':00:00').replace(/T\d{2}:\d{2}/, 'T20:00'),
      },
      {
        title: 'Birthday Party',
        start: DateUtils.format(DateUtils.add(DateUtils.now(), 4, 'day'), 'YYYY-MM-DDTHH:mm:ss').replace(/:\d{2}$/, ':00:00').replace(/T\d{2}:\d{2}/, 'T07:00'),
      },
      {
        title: 'Click for Google',
        url: 'http://google.com/',
        start: DateUtils.format(DateUtils.add(DateUtils.now(), 14, 'day'), 'YYYY-MM-DD'),
      },
    ],
  });

  calendar.render();
});
