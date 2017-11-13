//documentation on full calendar
//https://fullcalendar.io/docs/event_data/Event_Object/

$(document).ready(function() {

    $('#calendar').fullCalendar({
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month,basicWeek,basicDay'
        },
        defaultDate: '2017-10-12',
        navLinks: true, // can click day/week names to navigate views
        editable: true,
        eventLimit: true, // allow "more" link when too many events
        events: [
            {
                title: 'Reindeer Run',
                description: 'This is a cool event',
                start: '2017-12-11',
                url: 'https://www.reindeerrun.com/'
            },
            {
                title: 'Long Event',
                start: '2017-10-07',
                end: '2017-10-10'
            },
            {
                id: 999,
                title: 'Repeating Event',
                start: '2017-10-09T16:00:00'
            },
            {
                id: 999,
                title: 'Repeating Event',
                start: '2017-10-16T16:00:00'
            }
        ],
        eventClick: function(event){
            if (event.url){
                window.open(event.url);
                return false;
            }
        },
        eventRender: function(event, element) {
            element.find('.fc-title').append("<br/>" + event.description);
        }

    });

});

