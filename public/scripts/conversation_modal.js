


const displayConversationModal = function (other_user_id, item_id) {

  $.get(`/api/messages/by_item_and_user/${escape(item_id)}/${escape(other_user_id)}`, data => {

    alert(JSON.stringify(data));
    const $modal = createConversationModal(data);
    $('#conversation-modal-container').append($modal);
    $modal.modal('toggle');
  });
}

const createConversationModal = function (data) {
  const item_title = data.messages[0].item_title;
  const messages = data.messages;
  const $modal = $(`
<div class="modal fade" id="conversationModal" tabindex="-1" role="dialog" aria-labelledby="conversationModalTitle" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="conversationModalTitle">Conversation Re: ${escape(item_title)}</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">

      <div id="messages-container"></div>
        <!-- Modal Form Content -->
        <form id="reply-message-form">

          <div class="form-group">
            <label for="message-input">Reply</label>
            <textarea name="message" class="form-control" id="reply-input" placeholder="Enter message" rows="3"></textarea required>
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
  for(message of messages) {
    $modal.find('#messages-container').append($(`
    <div class="d-flex w-100 justify-content-between">
      <h5>${escape(message.from_user_id === message.user_id ? 'Me' :message.from_user)} </h5>
      <p>${escape(message.content)}</p>
    </div>
    `));
  }


  return $modal;
}
