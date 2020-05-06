

const socket = io();

$.get('/api/messages/summaries', data => {
  const { user_id } = data.messages[0];
  socket.emit('user_data', { user_id });
})

socket.on('private_message', data => {
  const $conversationModal = $('#conversation-modal-container').find('#conversationModal');
  if ($conversationModal.hasClass('show')) {
    const item_id = $conversationModal.data('item_id');
    const other_user = $conversationModal.data('other_user');
    const from_user = $conversationModal.data('from_user');

    const $messagesContainer = $conversationModal.find('#messages-container');
    const { to_item_id, from, content } = data;
    if (from === other_user && item_id === to_item_id ) {
      $messagesContainer.append(createMessage({
        content,
        from_user,
        from_user_id: from
      }))
    }
  }
})

// socket.on('private_message', data => {
//   const { from, content } = data;
//   if (from === other_user) {
//     $messagesContainer.append(createMessage({
//       content,
//       from_user_id: from,
//       from_user: messages[0].from_user
//     }))
//   }
// })

// setInterval(() => {
//   console.log($('#conversation-modal-container').find('#conversationModal').hasClass('show'))
// }, 500)


// socket.on('private_message', data => {
//   console.log(data);
// })

// setInterval(() => {
//   socket.emit('private_message', { content: 'hello from another place', toId: 1 })
// }, 2000);
