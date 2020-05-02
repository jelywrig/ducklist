const escape = function(string){
  var text = document.createTextNode(string);
  var p = document.createElement('p');
  p.appendChild(text);
  return p.innerHTML;
}

const render_listing = function(listing) {
  return `
    <div class="card mt-4" style="width: 20rem;">
      <img src="${escape(listing.thumbnail_image_url)}" class="card-img-top">
      <div class="card-body">
        <h5 class="card-title">${escape(listing.title)}</h5>  <span>$${escape((listing.price_in_cents / 100).toFixed(2))}</span>
        <p class="card-text">${escape(listing.description)}</p>
        <a href="#" class="btn btn-primary">Contact</a> <span class="align-middle float-right"><i class="material-icons">favorite_border</i></span>
      </div>
    </div>
  `
}

const render_listings = function() {
  const container = $("#listings_container");
  $.get("/api/listings", data => {
    container.empty();
    const listings = data.listings.map(render_listing);
    container.append(...listings)
  })
}

$(document).ready(function() {
  render_listings()
})
