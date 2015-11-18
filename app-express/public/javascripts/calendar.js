$(document).ready(function(){


  /**
   * Load fullcalendar.
   */
  $('#calendar').fullCalendar({
    header: {
      left: 'prev,next today',
      center: 'title',
      right: 'month,agendaWeek,agendaDay'
    },
    selectable: true,
    select: function(start, end, allDay, ev){

      var s = start._d,
        e = end._d;

      var startStr = s.getDate()+'/'+(s.getMonth()+1)+'/'+s.getFullYear()+' '+s.getHours()+':'+('0'+s.getMinutes()).slice(-2);
      var endStr = e.getDate()+'/'+(e.getMonth()+1)+'/'+e.getFullYear()+' '+e.getHours()+':'+('0'+e.getMinutes()).slice(-2);
      $('input[name=startDateTime]').val(startStr);
      $('input[name=endDateTime]').val(endStr);
      $('#taskModal').modal();
    },
    defaultView: 'agendaWeek'
  });
  //end Load fullcalendar


  var opts = {
    format: 'DD/MM/YYYY h:mm'
  };
  $('#startDateTime').datetimepicker(opts);
  $('#endDateTime').datetimepicker(opts);

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
