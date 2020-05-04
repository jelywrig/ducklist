const escape = function(string){
  var text = document.createTextNode(string);
  var p = document.createElement('p');
  p.appendChild(text);
  return p.innerHTML;
}


const displayContactModal = function(owner_id, item_id, item_title) {

  const $modal = $(`
  <div class="modal fade" id="createMessageModal" tabindex="-1" role="dialog" aria-labelledby="createMessageModalTitle" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="createMessageModalTitle">Send Message Re: ${escape(item_title)}</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">

        <!-- Modal Form Content -->
        <form id="create-message-form">

          <div class="form-group">
            <label for="message-input">Message</label>
            <textarea name="message" class="form-control" id="message-input" placeholder="Enter message" rows="3"></textarea required>
          </div>
        </form>

      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
        <button type="submit" class="btn btn-primary" form="create-listing-form">Send</button>
      </div>
    </div>
  </div>
</div>
  `);

  $('#message-modal-container').append($modal);
  $modal.modal('toggle');
  $modal.find('.btn-primary').click(function(event) {
    event.preventDefault();
    const formData = {owner_id, item_id, content: $('#message-input').val()};
    $.post('/api/messages', formData, () => $modal.modal('toggle'));
  });

};



const getPrice = function({ price_in_cents, sold_at }) {
  if (sold_at) {
    return '<span class="sold">SOLD</span>'
  }
  return `<span>$${escape((price_in_cents / 100).toFixed(2))}</span>`
}

const build_listing_buttons = function({ owner_id, user_id, sold_at }) {
  if (owner_id === user_id) {
    return `
      <a href="#" class="btn btn-success ${!sold_at || 'disabled'}">Sold</a>
      <a href="#" class="btn btn-danger">Delete</a>
    `
  } else {
    return `<a href="#" class="btn btn-primary">Contact</a>`
  }
}

const build_listing = function(listing) {
  const $listing = $(`
    <div class="card mt-4" style="width: 20rem;">
      <img src="${escape(listing.thumbnail_image_url)}" class="card-img-top">
      <div class="card-body">
        <h5 class="card-title">${escape(listing.title)}</h5> ${getPrice(listing)}
        <p class="card-text">${escape(listing.description)}</p>
        ${build_listing_buttons(listing)}
        <span class="align-middle float-right">

          <form data-listing_id="${listing.id}" data-is_favorite="${listing.favourite}">
            <input class="material-icons" type="submit" value="${listing.favourite ? 'favorite' : 'favorite_border'}" style="border: none;">
          </form>

        </span>
      </div>
    </div>
  `);

  $listing.find('.btn-primary').click(function(event) {
    event.preventDefault();
    displayContactModal(listing.owner_id, listing.id, listing.title);
  });

  $listing.find('form').submit(favoriteHandler)
  if (listing.owner_id === listing.user_id) {
    // Sold and Delete button event listeners
    $listing.find('.btn-success').click(function(event) {
      event.preventDefault();
      if (confirm("Are you sure this item is sold?")) {
        const formData = { sold: true };
        $.post(`/api/listings/${listing.id}`, formData, render_listings)
      }
    })
    $listing.find('.btn-danger').click(function(event) {
      event.preventDefault()
      if (confirm("Are you sure this item should be deleted?")) {
        const formData = { inactive: true };
        $.post(`/api/listings/${listing.id}`, formData, render_listings)
      }
    })
  }
  return $listing
}

const render_listings = function() {
  const container = $("#listings_container");
  $.get("/api/listings", data => {
    container.empty();
    const listings = data.listings.map(build_listing)
    container.append(...listings);
  })
}

const create_listing_handler = function(event) {
  event.preventDefault();
  const formData = {}

  $(this).serializeArray().forEach(obj => {
    formData[obj.name] = obj.value;
  });

  $.post("/api/listings", formData, () => {
    $('#createListingModal').modal('toggle');
    render_listings();

  })
}

const favoriteHandler = function(event) {
  event.preventDefault()
  const $form = $(this);
  const isFavorite = $form.data('is_favorite');

  const formData = {};
  if (isFavorite) {
    formData.unfavourite = true;
  } else {
    formData.favourite = true;
  }

  $.post(`/api/listings/${$form.data('listing_id')}`, formData, () => {
    const $input = $form.find('input');
    $input.val(isFavorite ? 'favorite_border' : 'favorite');
    $form.data('is_favorite', !isFavorite);
  })
}

$(document).ready(function() {
  render_listings();
  $('#create-listing-form').submit(create_listing_handler);
})
