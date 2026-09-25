# Muhammad Tayyab Paracha — portfolio

A single-page portfolio in the style of a Tufte/LaTeX handout. Plain HTML and CSS: no framework, no build step, no JavaScript.

```
index.html                              the page
style.css                               all styling (desktop, mobile, print)
assets/profile.jpg                      portrait (480×600)
assets/Muhammad-Tayyab-Paracha-CV.pdf   the downloadable résumé
assets/favicon.svg                      tab icon
```

## Preview locally

Open `index.html` in a browser, or run `python3 -m http.server` in this folder and visit http://localhost:8000.

## Publish on GitHub Pages

1. Create an empty repository on GitHub (e.g. `tayyab-portfolio`, or `<username>.github.io` for a root URL).
2. From this folder:
   ```
   git remote add origin https://github.com/<username>/<repo>.git
   git push -u origin main
   ```
3. On GitHub: **Settings → Pages → Build and deployment → Deploy from a branch → `main` / `(root)`** → Save.

The site will be live at `https://<username>.github.io/<repo>/` within a minute or two.

## Updating

- New CV: replace `assets/Muhammad-Tayyab-Paracha-CV.pdf` (keep the file name).
- Text: edit `index.html` directly. Each entry is a `.row` with the main text on the left and an `<aside class="margin">` for dates and stack.
