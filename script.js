const targets = document.querySelectorAll('.section-main, .case-copy, .case-visual, .case-gallery');
for (const el of targets) el.classList.add('reveal');
const observer = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){ entry.target.classList.add('in'); observer.unobserve(entry.target); }
  });
},{threshold:.08});
targets.forEach(el=>observer.observe(el));

// ---------- Image framing ----------
const managedImages = [...document.querySelectorAll('img[data-image-id]')];

function applyImageSetting(img, setting) {
  const x = Number(setting?.x ?? 50);
  const y = Number(setting?.y ?? 50);
  const zoom = Number(setting?.zoom ?? 1);
  img.style.setProperty('--img-x', `${x}%`);
  img.style.setProperty('--img-y', `${y}%`);
  img.style.setProperty('--img-zoom', zoom);
}

managedImages.forEach(img => {
  const id = img.dataset.imageId;
  applyImageSetting(img, IMAGE_SETTINGS?.[id]);
});

// Optional visual image editor. It appears only when the URL ends in ?edit=images.
const params = new URLSearchParams(window.location.search);
if (params.get('edit') === 'images' && managedImages.length) {
  document.body.classList.add('image-edit-mode');

  const draft = JSON.parse(JSON.stringify(IMAGE_SETTINGS || {}));
  managedImages.forEach(img => {
    const id = img.dataset.imageId;
    if (!draft[id]) draft[id] = {x:50, y:50, zoom:1};
  });

  const editor = document.createElement('aside');
  editor.className = 'image-editor';
  editor.innerHTML = `
    <div class="image-editor__head">
      <strong>Image framing</strong>
      <a href="${window.location.pathname}">Close</a>
    </div>
    <label>Image
      <select data-control="image"></select>
    </label>
    <label>X <output data-output="x"></output>
      <input data-control="x" type="range" min="0" max="100" step="1">
    </label>
    <label>Y <output data-output="y"></output>
      <input data-control="y" type="range" min="0" max="100" step="1">
    </label>
    <label>Zoom <output data-output="zoom"></output>
      <input data-control="zoom" type="range" min="1" max="2" step="0.01">
    </label>
    <div class="image-editor__actions">
      <button type="button" data-action="reset">Reset current</button>
      <button type="button" data-action="copy">Copy settings</button>
    </div>
    <p class="image-editor__note">Copy settings, then replace the IMAGE_SETTINGS block in <code>image-settings.js</code> on GitHub.</p>
    <div class="image-editor__status" aria-live="polite"></div>
  `;
  document.body.appendChild(editor);

  const select = editor.querySelector('[data-control="image"]');
  const xInput = editor.querySelector('[data-control="x"]');
  const yInput = editor.querySelector('[data-control="y"]');
  const zInput = editor.querySelector('[data-control="zoom"]');
  const xOut = editor.querySelector('[data-output="x"]');
  const yOut = editor.querySelector('[data-output="y"]');
  const zOut = editor.querySelector('[data-output="zoom"]');
  const status = editor.querySelector('.image-editor__status');

  managedImages.forEach(img => {
    const option = document.createElement('option');
    option.value = img.dataset.imageId;
    option.textContent = img.dataset.imageId;
    select.appendChild(option);
    img.title = `Edit ${img.dataset.imageId}`;
    img.addEventListener('click', () => {
      select.value = img.dataset.imageId;
      loadControls();
      editor.scrollIntoView({block:'nearest'});
    });
  });

  function currentId(){ return select.value; }
  function currentImg(){ return managedImages.find(i => i.dataset.imageId === currentId()); }

  function loadControls(){
    const s = draft[currentId()] || {x:50,y:50,zoom:1};
    xInput.value = s.x; yInput.value = s.y; zInput.value = s.zoom;
    xOut.textContent = `${s.x}%`; yOut.textContent = `${s.y}%`; zOut.textContent = Number(s.zoom).toFixed(2)+'×';
    applyImageSetting(currentImg(), s);
  }

  function update(){
    draft[currentId()] = {
      x: Number(xInput.value),
      y: Number(yInput.value),
      zoom: Number(zInput.value)
    };
    xOut.textContent = `${xInput.value}%`;
    yOut.textContent = `${yInput.value}%`;
    zOut.textContent = Number(zInput.value).toFixed(2)+'×';
    applyImageSetting(currentImg(), draft[currentId()]);
  }

  select.addEventListener('change', loadControls);
  xInput.addEventListener('input', update);
  yInput.addEventListener('input', update);
  zInput.addEventListener('input', update);

  editor.querySelector('[data-action="reset"]').addEventListener('click', () => {
    draft[currentId()] = {x:50,y:50,zoom:1};
    loadControls();
  });

  editor.querySelector('[data-action="copy"]').addEventListener('click', async () => {
    const code = `const IMAGE_SETTINGS = ${JSON.stringify(draft, null, 2)};`;
    try {
      await navigator.clipboard.writeText(code);
      status.textContent = 'Copied. Paste this into image-settings.js.';
    } catch {
      status.textContent = 'Clipboard blocked. Select and copy from the browser console instead.';
      console.log(code);
    }
  });

  loadControls();
}
