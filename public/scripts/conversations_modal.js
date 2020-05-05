
const buildConversation = function({ title, sent_at, content, user_id, from_user, from_user_id, to_user, re_item , other_user}) {
  const $conversation = $(`
    <a href="#" class="list-group-item list-group-item-action" data-re_item="${re_item}" data-other_user="${other_user}">
      <div class="d-flex w-100 justify-content-between">
        <h5 class="mb-1">Re: ${escape(title)}</h5>
        <small>${displayDate(sent_at)}</small>
      </div>
      <p class="mb-1" style="font-weight: bold;">${escape(content)}</p>
      <small>${user_id === from_user_id ? `To: ${to_user}`: `From: ${from_user}`}</small>
    </a>
  `);
  return $conversation;
}

const buildModalBody = function() {
  return new Promise((resolve) => {
    $.get("/api/messages/summaries", data => {
      resolve(data.messages.map(buildConversation))
    })
  })
}

const buildModal = function() {
  const $modal = $(`
    <div class="modal fade" id="exampleModalScrollable" tabindex="-1" role="dialog" aria-labelledby="exampleModalScrollableTitle" aria-hidden="true">
      <div class="modal-dialog modal-dialog-scrollable modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalScrollableTitle">Conversations</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body list-group">

          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  `);
  $modal.modal('toggle');
  return $modal
}

const openConversationsModal = function(event) {
  event.preventDefault();
  $('#navbar__messages-button').css('color', '');
  buildModalBody()
    .then(conversations => {
      const $modal = buildModal();
      $modalBody = $modal.find('.modal-body');
      $modalBody.append(...conversations)
      $modalBody.find('a').click(function(event) {
        event.preventDefault();
        displayConversationModal(this.dataset.other_user,this.dataset.re_item);
        $modal.modal("toggle");
      })
      $('#conversations-modal-container').html($modal);
    })
}
