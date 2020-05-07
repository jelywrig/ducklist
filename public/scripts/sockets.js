

const socket = io();

$.get('/api/messages/summaries', data => {
  const { user_id } = data.messages[0];
  socket.emit('user_data', { user_id });
})

const conversationNotification = function(data, $conversationModal) {
  const conv_item_id = $conversationModal.data('item_id');
  const other_user = $conversationModal.data('other_user');
  const other_user_name = $conversationModal.data('other_user_name');

  const $messagesContainer = $conversationModal.find('#messages-container');
  const {to_user, content, item_id, from_user} = data;

  if (from_user == other_user && conv_item_id == item_id ) {
    $messagesContainer.append(createMessage({
      content,
      from_user: other_user_name,
      from_user_id: from_user,
      user_id: to_user
    }, true));
  } else {
    console.log('other convo showing');
    $("#back-btn").html('New Message').addClass('msg-alert-btn');  // do something to back btn-
    // and highlight messages?
  }
}

const conversationsNotification = function(data, $conversationsModal) {
  const $modalBody = $conversationsModal.find('.modal-body');
  buildModalBody()
    .then(conversations => {
      $modalBody.empty()

      for (const $convo of conversations) {
        const item_id = $convo.data('re_item')
        const other_user = $convo.data('other_user')
        if (data.item_id === item_id && data.from_user === other_user) {
          $convo.addClass('new-msg')
        }
        $modalBody.append($convo)
      }

      $modalBody.find('a').click(function(event) {
        event.preventDefault();
        displayConversationModal(this.dataset.other_user, this.dataset.re_item);
        $conversationsModal.modal("toggle");
      })
  })
}

const generalNotification = function(data) {
  const $messagesButton = $('#navbar__messages-button')
  $messagesButton.find('.badge').html('NEW')
}

socket.on('private_message', data => {
  const $conversationModal = $('#conversation-modal-container').find('#conversationModal');
  const $conversationsModal = $('#conversations-modal-container').find('#conversationsModal');
  if ($conversationModal.hasClass('show')) {
    conversationNotification(data, $conversationModal)
  } else if ($conversationsModal.hasClass('show')) {
    conversationsNotification(data, $conversationsModal)
  } else {
    generalNotification(data)
  }
})
