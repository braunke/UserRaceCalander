//documentation on full calendar
//https://fullcalendar.io/docs/event_data/Event_Object/

$(document).ready(function() {

    var calendarEl = $('#calendar');
    if (calendarEl.length) {

        $.ajax({
            method: 'get',
            url: "/races"
        }).done(function(races) {
            console.log('received data');
            console.log(races);
            initRaceCalendar(calendarEl, races);
        });
    }
});

function initRaceCalendar(element, races) {
    var events = racesToEvents(races);
    initCalendar(element, events);
}

function racesToEvents(races) {
    var events = races.map(function(race) {
        return {
            title: race.racename,
            description: race.racelocation,
            start: race.racedate, // 2017-12-11
            url: 'http://localhost:3000/racePage/' + race.raceid
        };
    });
    console.log(events);
    return events;
}

function initCalendar(element, events) {

    element.fullCalendar({
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month,basicWeek,basicDay'
        },
        defaultDate: new Date(),
        navLinks: true, // can click day/week names to navigate views
        editable: true,
        eventLimit: true, // allow "more" link when too many events
        events: events,

        eventRender: function(event, element) {
            element.find('.fc-title').append("<br/>" + event.description);
        }

    });
}
