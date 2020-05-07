$(document).ready(function() {
  $('#login-form').submit(function(event) {
    event.preventDefault();
    console.log('prevented default on login form');
    $.post('/users/login', $(this).serialize())
      .then((data) => {
       location.reload();
      })
      .catch(error => {
        console.log('error on post login', error);
        console.log(error.responseJSON.message);
      })
  });

});
