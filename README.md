# Shivam Sharma — Portfolio

The complete editable portfolio is in `dist/`. It includes the artwork, project walkthrough videos, local fonts and resume. No installation or build step is required.

## Open on another computer

1. Extract the entire `PORTFOLIO` folder from the ZIP.
2. On Windows, double-click `START-WINDOWS.bat`. It uses an existing Python installation and opens the portfolio at http://localhost:4173.
3. On macOS/Linux, open a terminal in this folder and run:

   `python3 -m http.server 4173 --directory dist --bind 127.0.0.1`

   Then open http://localhost:4173.

You can also open `dist/index.html` directly for a quick preview. A local server provides the most reliable font and video playback across browsers. If Python is unavailable, any static web server can serve the `dist` folder.

## Phone or tablet

The published portfolio adapts automatically to phone, tablet and desktop screens. To preview this extracted copy on a phone, serve `dist` from a computer on the same Wi-Fi using `python -m http.server 4173 --directory dist`, then open `http://YOUR-COMPUTER-LAN-IP:4173` on the phone. The computer's firewall must permit that connection.

## Edit or host

- `dist/index.html`: content, project links, videos and sections.
- `dist/mobile.css`: phone/tablet layouts below 900 px.
- `dist/motion.css` and `dist/scroll.js`: scroll choreography and desktop layout.
- `dist/app.js`: video visibility, progress indicator and motion preferences.
- `dist/hero-ink.js`: ambient particles.
- `dist/assets/`: all artwork, videos and fonts. Mobile videos are separate lighter files; desktop retains the full-resolution versions.
- `dist/resume.pdf`: downloadable resume.

Upload the contents of `dist` to a static website host. The site does not require API keys or a backend. External project and social links need an internet connection. Motion automatically respects the device's Reduce Motion preference; video autoplay also depends on browser/device settings.

Font license notices are included in `dist/assets/fonts/`. Historical artwork and earlier unused scene files are retained as editable project assets.
