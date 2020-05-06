

const socket = io();

$.get('/api/messages/summaries', data => {
  const { user_id } = data.messages[0];
  socket.emit('user_data', { user_id });
})

socket.on('private_message', data => {
  const $conversationModal = $('#conversation-modal-container').find('#conversationModal');
  if ($conversationModal.hasClass('show')) {
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
      }))
    } else {
      console.log('other convo showing');
      $("#back-btn").html('New Message').addClass('msg-alert-btn');  // do something to back btn-
      // and highlight messages?
      }, true))
    }
  }
})
