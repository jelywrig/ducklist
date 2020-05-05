
$(document).ready(function() {
  renderListings();
  $('#create-listing-form').submit(createListingHandler);
  $('#navbar__messages-button').click(openConversationsModal);
})
