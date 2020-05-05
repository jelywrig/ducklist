const getPrice = function({ price_in_cents, sold_at }) {
  if (sold_at) {
    return '<span class="sold">SOLD</span>'
  }
  return `<span>$${escape((price_in_cents / 100).toFixed(2))}</span>`
}

const buildListingButtons = function({ owner_id, user_id, sold_at }) {
  if (owner_id === user_id) {
    return `
      <a href="#" class="btn btn-success ${!sold_at || 'disabled'}">Sold</a>
      <a href="#" class="btn btn-danger">Delete</a>
    `
  } else {
    return `<a href="#" class="btn btn-primary">Contact</a>`
  }
}

const buildListing = function(listing) {
  const $listing = $(`
    <div class="card mt-4" style="width: 20rem;">
      <div style="flex-grow: 1;">
        <img src="${escape(listing.thumbnail_image_url)}" class="card-img-top">
      </div>
      <div class="card-body" style="flex-grow: 0;">
        <h5 class="card-title">${escape(listing.title)}</h5> ${getPrice(listing)}
        <p class="card-text">${escape(listing.description)}</p>
        ${buildListingButtons(listing)}
        <span class="align-middle float-right">

          <form data-listing_id="${listing.id}" data-is_favorite="${listing.favourite}">
            <input class="material-icons" type="submit" value="${listing.favourite ? 'favorite' : 'favorite_border'}" style="border: none; background-color: transparent;">
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
        $.post(`/api/listings/${listing.id}`, formData, renderListings)
      }
    })
    $listing.find('.btn-danger').click(function(event) {
      event.preventDefault()
      if (confirm("Are you sure this item should be deleted?")) {
        const formData = { inactive: true };
        $.post(`/api/listings/${listing.id}`, formData, renderListings)
      }
    })
  }
  return $listing
}

const renderListings = function() {
  const container = $("#listings_container");
  $.get("/api/listings", data => {
    container.empty();
    const listings = data.listings.map(buildListing)
    container.append(...listings);
  })
}

const createListingHandler = function(event) {
  event.preventDefault();
  const formData = {}

  $(this).serializeArray().forEach(obj => {
    formData[obj.name] = obj.value;
  });

  $.post("/api/listings", formData, () => {
    $('#createListingModal').modal('toggle');
    renderListings();

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
