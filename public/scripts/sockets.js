

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
    // const from_user = $conversationModal.data('from_user'); // i think this line is part of our problem
    // const user_id = $conversationModal.data('user_id');


    const $messagesContainer = $conversationModal.find('#messages-container');

    // const { to_item_id, from, content, user_id } = data;
    const {to_user, content, item_id, from_user} = data;

    console.log(data)
    if (from_user == other_user && conv_item_id == item_id ) {
      $messagesContainer.append(createMessage({
        content,
        from_user: other_user_name,
        from_user_id: from_user,
        user_id: to_user
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
