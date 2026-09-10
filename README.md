# JetBlue Lookbook

A GitHub Pages review site for JetBlue × Hike Medical crewmember benefit campaign assets. Every asset gets its own page, reviewers can leave feedback with no login, and it can be updated later without any local dev setup.

Live site: `https://<your-github-username>.github.io/jetblue-lookbook/`

## Adding a new asset page

1. Copy `benefit-portal.html` as a starting template, or build a new page using the shared chrome:
   ```html
   <div class="subpage-bar"><a href="index.html">← Back to Lookbook</a></div>
   <div class="subpage-title">
     <span class="num">02</span>
     <h2>Asset Name</h2>
     <span class="desc">One-line description</span>
   </div>
   <div class="subpage-content">
     ... asset-specific content ...
     <div id="comments-root" data-page="asset-slug"></div>
   </div>
   <script src="js/comments-config.js"></script>
   <script src="js/comments.js"></script>
   <script src="js/nav.js"></script>
   ```
2. Add a card for it in `index.html`'s `.card-grid`.
3. Add it to the `pages` array in `js/nav.js`, in hub display order.
4. `data-page` on `#comments-root` must be a unique slug — comments are scoped to it.

## Comment backend setup (one-time)

Comments are stored in a Google Sheet via a small Apps Script web app — no login required for reviewers. JetBlue needs its own separate Sheet + deployment; don't reuse another client's endpoint.

1. Go to `sheets.new` and name it "JetBlue Lookbook Comments".
2. **Extensions → Apps Script**, paste in the contents of `apps-script/Code.gs`.
3. **Deploy → New deployment → Web app.** Execute as **Me**, access **Anyone**. Deploy, then copy the `/exec` URL.
4. Paste that URL into `js/comments-config.js`:
   ```js
   window.COMMENTS_ENDPOINT = "https://script.google.com/macros/s/XXXXXXXX/exec";
   ```
5. Commit that change. Comments will start working on every page immediately — no other edits needed.

If you edit `Code.gs` later, redeploy as a **new version of the same deployment** so the URL doesn't change.

## Notes

- `--client-accent` in `css/style.css` is set to a basic blue (`#004BE0`) as a placeholder — swap it for JetBlue's real brand blue once you have exact hex values.
- The Flyer and PowerPoint pages embed the original PDFs (`JB Hike at a Glance Flyer.pdf`, `JB Launch Slides.pdf`) by their original filenames — drag those in from your JetBlue folder without renaming them.
- `insole-shoe-hero.png` referenced in the original Landing Page design wasn't provided; the Landing Page here uses `Product image.png` in its place.
