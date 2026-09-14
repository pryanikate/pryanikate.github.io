# Ekaterina Prianichnikova — portfolio site

## Replacing images

Images used on the site are stored in `assets/`.

Current structure:

- `assets/rodchenko/01.jpg`
- `assets/curatorial/01.jpg`
- `assets/curatorial/02.jpg`

To replace an image without touching the HTML, upload a new JPG with the same filename and replace the existing file on GitHub.

## Moving / cropping / zooming images visually

Open the published site with:

`https://pryanikate.github.io/?edit=images`

A private editing panel will appear only because the URL contains `?edit=images`.

Choose an image and adjust:

- **X** — move the crop left/right
- **Y** — move the crop up/down
- **Zoom** — zoom into the image

When it looks right, click **Copy settings**.

Then on GitHub:

1. Open `image-settings.js`.
2. Click the pencil icon to edit.
3. Replace the existing `const IMAGE_SETTINGS = {...};` block with the copied block.
4. Commit changes directly to `main`.
5. GitHub Pages will update automatically.

Visitors opening the normal address `https://pryanikate.github.io/` will never see the editing panel.

## Manual image settings

You can also edit `image-settings.js` directly.

Example:

```js
"curatorial-1": { x: 65, y: 30, zoom: 1.18 }
```

- `x: 0` = left, `x: 100` = right
- `y: 0` = top, `y: 100` = bottom
- `zoom: 1` = original framing
- `zoom: 1.2` = 20% closer
