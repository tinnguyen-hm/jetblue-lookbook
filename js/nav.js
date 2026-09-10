(function () {
  var pages = [
    { file: 'benefit-portal.html', label: 'Benefit Portal' },
    { file: 'newsletter.html', label: 'Newsletter' },
    { file: 'website-listing.html', label: 'Website Listing' },
    { file: 'flyer.html', label: 'Flyer' },
    { file: 'powerpoint.html', label: 'PowerPoint' },
    { file: 'landing-page.html', label: 'Landing Page' }
    // add one entry per new asset page, in hub display order
  ];

  var current = location.pathname.split('/').pop();
  var idx = pages.findIndex(function (p) { return p.file === current; });
  if (idx === -1) return;
  if (pages.length < 2) return; // no arrows needed with only one page

  var prev = pages[(idx - 1 + pages.length) % pages.length];
  var next = pages[(idx + 1) % pages.length];

  var style = document.createElement('style');
  style.textContent =
    '.asset-nav-arrow { position: fixed; top: 50%; transform: translateY(-50%); z-index: 500; ' +
    'width: 48px; height: 48px; border-radius: 50%; background: rgba(16,24,40,0.72); color: #fff; ' +
    'display: flex; align-items: center; justify-content: center; text-decoration: none; font-size: 22px; ' +
    'box-shadow: 0 2px 10px rgba(16,24,40,0.25); transition: background .15s, transform .15s; }' +
    '.asset-nav-arrow:hover { background: rgba(16,24,40,0.92); transform: translateY(-50%) scale(1.06); }' +
    '.asset-nav-arrow.prev { left: 16px; } .asset-nav-arrow.next { right: 16px; }' +
    '@media (max-width: 760px) { .asset-nav-arrow { width: 38px; height: 38px; font-size: 17px; } }';
  document.head.appendChild(style);

  function makeArrow(cls, href, label, glyph) {
    var a = document.createElement('a');
    a.className = 'asset-nav-arrow ' + cls;
    a.href = href;
    a.setAttribute('aria-label', label);
    a.title = label;
    a.innerHTML = glyph;
    document.body.appendChild(a);
  }
  makeArrow('prev', prev.file, 'Previous: ' + prev.label, '&larr;');
  makeArrow('next', next.file, 'Next: ' + next.label, '&rarr;');

  document.addEventListener('keydown', function (e) {
    var tag = (e.target && e.target.tagName) || '';
    if (tag === 'INPUT' || tag === 'TEXTAREA') return;
    if (e.key === 'ArrowLeft') location.href = prev.file;
    if (e.key === 'ArrowRight') location.href = next.file;
  });
})();
