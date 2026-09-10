(function () {
  var root = document.getElementById('comments-root');
  if (!root) return;

  var page = root.getAttribute('data-page') || location.pathname.split('/').pop();
  var endpoint = window.COMMENTS_ENDPOINT || '';

  root.innerHTML =
    '<div class="comments-heading">Feedback</div>' +
    '<div class="comments-list" id="commentsList"></div>' +
    '<form class="comment-form" id="commentForm">' +
      '<input type="text" id="commentName" placeholder="Your name (optional)" maxlength="100">' +
      '<textarea id="commentText" placeholder="Leave feedback on this asset…" maxlength="2000" required></textarea>' +
      '<button type="submit" id="commentSubmit">Post comment</button>' +
      '<div class="comments-status" id="commentsStatus"></div>' +
    '</form>';

  var list = document.getElementById('commentsList');
  var form = document.getElementById('commentForm');
  var status = document.getElementById('commentsStatus');
  var submitBtn = document.getElementById('commentSubmit');

  if (!endpoint) {
    list.innerHTML = '<div class="comments-disabled-note">Comments aren\'t connected yet — deploy the comment backend (README) and add the endpoint to js/comments-config.js.</div>';
    form.querySelectorAll('input, textarea, button').forEach(function (el) { el.disabled = true; });
    return;
  }

  function timeAgo(iso) {
    var d = new Date(iso);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleString();
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function renderComments(comments) {
    if (!comments.length) {
      list.innerHTML = '<div class="comments-empty">No feedback yet — be the first to comment.</div>';
      return;
    }
    comments.sort(function (a, b) { return new Date(b.timestamp) - new Date(a.timestamp); });
    list.innerHTML = comments.map(function (c) {
      return '<div class="comment-item">' +
        '<div class="meta"><span class="name">' + escapeHtml(c.name || 'Anonymous') + '</span>' +
        '<span class="time">' + escapeHtml(timeAgo(c.timestamp)) + '</span></div>' +
        '<div class="text">' + escapeHtml(c.text) + '</div>' +
      '</div>';
    }).join('');
  }

  function loadComments() {
    fetch(endpoint + '?page=' + encodeURIComponent(page))
      .then(function (r) { return r.json(); })
      .then(function (data) { renderComments(data.comments || []); })
      .catch(function () { list.innerHTML = '<div class="comments-empty">Couldn\'t load comments right now.</div>'; });
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = document.getElementById('commentName').value.trim();
    var text = document.getElementById('commentText').value.trim();
    if (!text) return;

    submitBtn.disabled = true;
    status.textContent = 'Posting…';
    status.className = 'comments-status';

    // Sent as text/plain on purpose — avoids a CORS preflight Apps Script Web Apps
    // don't handle well.
    fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({ page: page, name: name, text: text })
    })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        submitBtn.disabled = false;
        if (data.ok) {
          document.getElementById('commentText').value = '';
          status.textContent = 'Posted.';
          loadComments();
        } else {
          status.textContent = data.error || 'Something went wrong.';
          status.className = 'comments-status error';
        }
      })
      .catch(function () {
        submitBtn.disabled = false;
        status.textContent = 'Network error — try again.';
        status.className = 'comments-status error';
      });
  });

  loadComments();
})();
