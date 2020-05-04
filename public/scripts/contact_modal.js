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
