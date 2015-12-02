$(document).ready(function(){

  $('a#vizLoadData').on('click', function(e){
    e.preventDefault();
    $.post(
      '/manicTime/getSample',
      {

      },
      function(err, result){
        console.log(result);
      }
    )
  })

})
