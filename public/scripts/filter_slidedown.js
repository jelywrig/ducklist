

const renderFilteredListings = function() {
  const container = $('#listings_container');
  $.ajax({
    url: '/api/listings',
    type: "get",
    data:{
      from_price: Math.round($('#from_price').val() * 100),
      to_price: Math.round($('#to_price').val() * 100),
      favourites: $( "#favourites" ).is(":checked"),
      my_listings: $("#my_listings").is(":checked")
    },
    success: function(data) {
      container.empty();
      const listings = data.listings.map(buildListing);
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
    renderFilteredListings();
  })


});




