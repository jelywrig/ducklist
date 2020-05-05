


const displayConversationModal = function (other_user_id, item_id) {

  $.get(`/api/messages/by_item_and_user/${escape(item_id)}/${escape(other_user_id)}`, data => {
    const $modal = createConversationModal(data);
    $('#conversation-modal-container').html($modal);
    $modal.modal('toggle');
  });
}

const createConversationModal = function (data) {
  const messages = data.messages;
  const item_title = messages[0].item_title;
  const other_user = messages[0].other_user_id;
  const item_id = messages[0].item_id;
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
        <button type="submit" class="btn btn-primary" id="reply-btn" form="reply-message-form">Send</button>
      </div>
    </div>
  </div>
</div>
  `);
  for(message of messages) {
    $modal.find('#messages-container').append($(`
    <div class="d-flex w-100 justify-content-between">
      <h5>${escape(message.from_user_id === message.user_id ? 'Me' :message.from_user)} </h5>
      <p class="ml-3" >${escape(message.content)}</p>
    </div>
    `));
  }

  $modal.find('#reply-btn').click(event => {
    event.preventDefault();
    const content = $("#reply-input").val();
    const formData = {to_user: other_user, content, item_id};
    const socket = io();
    socket.emit('message', JSON.stringify(formData));
    $.post('/api/messages', formData, () =>
      $modal.modal('toggle'));
  });


  return $modal;
}
