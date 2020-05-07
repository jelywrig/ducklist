$(document).ready(function() {
  $('#registration-form').submit(function(event) {
    event.preventDefault();
    $('#registrationError').slideUp(80);
    console.log($(this).serialize);
    $.post('/users/register', $(this).serialize())
      .then((data) => {
        location.reload();
      })
      .catch(error => {
        $('#registrationError').html(error.responseJSON.message).slideDown(300);

      })
  });

});
