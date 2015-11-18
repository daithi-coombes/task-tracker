$(document).ready(function(){

  $('#calendar').fullCalendar({
    header: {
      left: 'prev,next today',
      center: 'title',
      right: 'month,agendaWeek,agendaDay'
    },
    dayClick: function(date, jsEvent, view){
      alert('Clicked on: '+date.format());
      console.log(arguments);
    },
    defaultView: 'agendaWeek'
  });
})
