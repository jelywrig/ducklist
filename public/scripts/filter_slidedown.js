

const render_filtered_listings = function() {
  const container = $('#listings_container');
  $.ajax({
    url: '/api/listings',
    type: "get",
    data:{
      from_price: $('#from_price').val() * 100,
      to_price: $('#to_price').val() * 100,
      favourites: $( "#favourites" ).is(":checked")
    },
    success: function(data) {
      container.empty();
      const listings = data.listings.map(build_listing);
      container.append(...listings);
    }
  })
};


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

  $('#filter_slidedown button').click(function(event){
    event.preventDefault();
    render_filtered_listings();
  })


});




