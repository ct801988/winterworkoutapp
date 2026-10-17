# Winter Strong v3 — Illustrated Exercise Library

This update preserves the existing workout and logging system and adds **84 locally stored SVG movement diagrams** (starting and finishing positions for all 42 library entries). It retains concise three-step instructions, form checkpoints, substitutions, and video-search links. The illustrations are **simplified schematics**, not photo-realistic or medically validated form demonstrations; consult detailed video/qualified coaching for uncertain movements.

## Install on existing GitHub Pages site

1. **Back up your workout data** from Settings → Export backup before making changes.
2. Extract the ZIP on your computer.
3. Open your GitHub repository `ct801988/winterworkoutapp` → Code → Add file → Upload files.
4. Upload the updated root files: `index.html`, `app.js`, `library.js`, `styles.css`, `sw.js` (plus the other root files if desired). Replace existing files when prompted.
5. Upload the entire `exercise-images` folder, preserving its name and the 84 `.svg` files. In the browser, you can drag the folder into the upload screen in Chrome/Edge, or create `exercise-images/placeholder.txt` in GitHub, then open that folder and upload all 84 images.
6. If missing, upload the `icons` folder with the three PNG files in the same manner.
7. Commit to `main`. GitHub Pages republishes automatically.
8. Open the website in a **private browser window** to verify that Visuals → 90/90 hip switches shows two actual pose diagrams. Also check `https://ct801988.github.io/winterworkoutapp/exercise-images/ex-01-start.svg`.
9. Reopen the Home Screen app online. If it stays stale, first export a backup, then refresh/update the PWA cache. Avoid clearing site data before exporting.

No new repository, new URL, or new iPhone Home Screen icon is required. The app's existing local workout data storage format is unchanged.
