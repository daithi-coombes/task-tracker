$(document).ready(function(){

  $('.parse-file').on('click', function(e){
    e.preventDefault();

    $.post(
      '/manicTime/parse',
      {
        file: 'ManicTimeData_2015-11-27.csv'
      },
      function(){
        console.log(arguments);
      }
    );
  })
})
