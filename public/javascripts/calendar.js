$(document).ready(function(){

  var events =  window.events || [];

  /**
   * Load fullcalendar.
   */
  $('#calendar').fullCalendar({
    /*events: [
      {
        _id: '567ff2ff78c9a9060d27f8cc',
        projectID: '567ff2ef78c9a9060d27f8cb',
        title: 'foobar',
        start: '2015-12-28T09:30:00',
        end: '2015-12-28T17:30:00'
      }
    ],*/
    events: window.events,
    eventRender: function(event, element){
    },
    customButtons: {
      crudProjects: {
        text: 'Projects',
        click: function(){
          $('#projectModal').modal();
        }
      }
    },
    header: {
      left: 'prev,next today crudProjects',
      center: 'title',
      right: 'month,agendaWeek,agendaDay'
    },
    selectable: true,
    select: function(start, end, allDay, ev){
      var s = moment(start._d),
        e = moment(end._d);

      //work out start/end times across days
      var days = end.diff(start, 'days')+1;

      //foreach day add inputs
      $('#dateTimeContainer').html('');
      $('input[name="days"]', '#taskModal').val(days);
      var now = s;
      for(var x=1; x<=days; x++){

        var container = $('#taskDateTime').clone(true)
          .find('.form-group');

        $(container).find('input[name=date]')
          .addClass('datepicker')
          .attr('name', 'date-'+x)
          .attr('value', now.format('DD/MM/YYYY'));
        $(container).find('input[name=start]')
          .addClass('timepicker')
          .attr('name', 'start-'+x)
          .attr('value', s.format('HH:mm'));
        $(container).find('input[name=end]')
          .addClass('timepicker')
          .attr('name', 'end-'+x)
          .attr('value', e.format('HH:mm'));

        $('#dateTimeContainer').append(container);

        var now = moment(start._d).add(x, 'days');
      }

      $('#taskModal').on('shown.bs.modal', function(){
        $('.timepicker').timepicker({
          showMeridian: false,
          maxHours: 24
        });
        $('.datepicker').datepicker();
      })
      $('#taskModal').on('hidden.bs.modal', function(){
        $('#dateTimeContainer').html('');
      })
      $('#taskModal').modal('show');
    },
    defaultView: 'agendaWeek'
  });
  //end Load fullcalendar


  var opts = {
    format: 'DD/MM/YYYY HH:mm'             //format for Irish users, internally it is YYYY-MM-DDTHH:MM:SS
  };
  //$('#startDateTime').datetimepicker(opts);
  //$('#endDateTime').datetimepicker(opts);

})


/**
 * Drag selection box.
 */
$(document)
  .drag("start",function( ev, dd ){
    return $('<div class="selection" />')
      .css('opacity', .65 )
      .appendTo( document.body );
  })
  .drag(function( ev, dd ){
    $( dd.proxy ).css({
      top: Math.min( ev.pageY, dd.startY ),
      left: Math.min( ev.pageX, dd.startX ),
      height: Math.abs( ev.pageY - dd.startY ),
      width: Math.abs( ev.pageX - dd.startX )
    });
  })
  .drag("end",function( ev, dd ){
    $( dd.proxy ).remove();
  });
  $('.drop')
  .drop("start",function(){
    $( this ).addClass("active");
  })
  .drop(function( ev, dd ){
    $( this ).toggleClass("dropped");
  })
  .drop("end",function(){
    $( this ).removeClass("active");
  });
  $.drop({ multi: true });
//end Drag selection box
