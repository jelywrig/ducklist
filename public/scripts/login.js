$(document).ready(function() {
  $('#login-form').submit(function(event) {
    event.preventDefault();
    $('#loginError').slideUp(80);
    $.post('/users/login', $(this).serialize())
      .then((data) => {
        location.reload();
      })
      .catch(error => {
        $('#loginError').html(error.responseJSON.message).slideDown(300);

      })
  });

});
