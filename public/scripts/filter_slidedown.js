$(document).ready(function() {
  $('#filter').click(function(event){
    event.preventDefault();
    if($('#filter_slidedown').is(':hidden')) {
      $('#filter_slidedown').slideDown();
      $('#from_price').focus();
    } else {
      $('#filter_slidedown').slideUp();
    }

  });
});
