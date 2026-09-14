const targets = document.querySelectorAll('.section-main, .case-copy, .case-visual, .case-gallery');
for (const el of targets) el.classList.add('reveal');
const observer = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){ entry.target.classList.add('in'); observer.unobserve(entry.target); }
  });
},{threshold:.08});
targets.forEach(el=>observer.observe(el));
