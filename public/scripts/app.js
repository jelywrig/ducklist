
$(document).ready(function() {
  render_listings();
  $('#create-listing-form').submit(create_listing_handler);
  $('#navbar__messages-button').click(openConversationsModal);
})
