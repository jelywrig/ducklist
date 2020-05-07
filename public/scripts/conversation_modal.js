


const displayConversationModal = function (other_user_id, item_id) {

  $.get(`/api/messages/by_item_and_user/${escape(item_id)}/${escape(other_user_id)}`, data => {
    const $modal = createConversationModal(data);
    $('#conversation-modal-container').html($modal);
    $modal.modal('toggle');
    setTimeout(() => {
      $modal.find("#reply-input").focus();
    }, 500)
  });
}

const createMessage = function(message, socket = false) {
  if (message.from_user_id == message.user_id) {
    return `
      <div class="msg-container right ${socket ? 'new-msg' : ''}">
        <div class="alert alert-primary" role="alert">
          ${escape(message.content)}
        </div>
      </div>
      `;
  } else {
    return `
      <div class="msg-container ${socket ? 'new-msg' : ''}">
        <div class="alert alert-secondary" role="alert">
          <h6 class="alert-heading">${escape(message.from_user)}:</h6>
          ${escape(message.content)}
        </div>
      </div>
    `;
  }
  // return `
  //   <div class="d-flex w-100 justify-content-between ${socket ? 'new-msg' : ''}">
  //     <h5>${escape(message.from_user_id == message.user_id ? 'Me' : message.from_user)} </h5>
  //     <p class="ml-3" >${escape(message.content)}</p>
  //   </div>
  // `
}

const createConversationModal = function (data) {
  const messages = data.messages;
  const item_title = messages[0].item_title;
  const other_user = messages[0].other_user_id;
  const item_id = messages[0].item_id;
  const other_user_name = messages[0].other_user_name;

  const $modal = $(`
<div class="modal fade" id="conversationModal" tabindex="-1" role="dialog" aria-labelledby="conversationModalTitle" aria-hidden="true"
  data-item_id="${item_id}" data-other_user="${other_user}" data-other_user_name="${other_user_name}"
>
  <div class="modal-dialog modal-dialog-scrollable modal-dialog-centered" role="document">
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
        <button type="button" class="btn btn-secondary" id="back-btn">Back</button>
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
        <button type="submit" class="btn btn-primary" id="reply-btn" form="reply-message-form">Send</button>
      </div>
    </div>
  </div>
</div>
  `);
  const $messagesContainer = $modal.find('#messages-container');

  $modal.find('#back-btn').click(function(event) {
    event.preventDefault();
    const currentIds = []
    $('#conversationsModal').find('.modal-body .list-group-item').each((_, elem) => {
      currentIds.push($(elem).data('id'))
    })
    openConversationsModal(event)
      .then($modal => {
        if ($(this).hasClass('msg-alert-btn')) {
          $modal.find('.modal-body .list-group-item').each((_, elem) => {
            $elem = $(elem);
            if (!currentIds.includes($elem.data('id'))) {
              $elem.addClass('new-msg')
            }
          })
        }
      });
    $modal.modal('toggle');
  });

  for(message of messages) {
    $messagesContainer.append(createMessage(message, false));
  }
  $modal.find('#reply-btn').click(event => {
    event.preventDefault();
    const content = $("#reply-input").val();
    const formData = {to_user: other_user, content, item_id};
    $.post('/api/messages', formData, () => {
      $("#reply-input").val('');
    });
    formData.from_user = messages[0].user_id;
    socket.emit('private_message', formData)
    $messagesContainer.append(createMessage({
      content: formData.content,
      from_user: 'Me',
      from_user_id: formData.from_user,
      user_id: formData.from_user
    }, true))
  });

  return $modal;
}
