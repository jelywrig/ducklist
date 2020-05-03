const escape = function(string){
  var text = document.createTextNode(string);
  var p = document.createElement('p');
  p.appendChild(text);
  return p.innerHTML;
}

const build_listing = function(listing) {
  return $(`
    <div class="card mt-4" style="width: 20rem;">
      <img src="${escape(listing.thumbnail_image_url)}" class="card-img-top">
      <div class="card-body">
        <h5 class="card-title">${escape(listing.title)}</h5>  <span>$${escape((listing.price_in_cents / 100).toFixed(2))}</span>
        <p class="card-text">${escape(listing.description)}</p>
        <a href="#" class="btn btn-primary">Contact</a>
        <span class="align-middle float-right">

          <form data-listing_id="${listing.id}" data-is_favorite="${listing.favourite}">
            <input class="material-icons" type="submit" value="${listing.favourite ? 'favorite' : 'favorite_border'}" style="border: none;">
          </form>

        </span>
      </div>
    </div>
  `);
}

const render_listings = function() {
  const container = $("#listings_container");
  $.get("/api/listings", data => {
    container.empty();
    const listings = data.listings.map(listing => {
      const $listing = build_listing(listing);
      $listing.find('form').submit(favoriteHandler)
      return $listing;
    });
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
