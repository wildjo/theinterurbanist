(function(){
  const overlay = document.createElement('div');
  overlay.className = 'lb-overlay';
  overlay.innerHTML = '<img class="lb-img" alt=""><div class="lb-ui"><button class="lb-btn prev" aria-label="Previous">◀</button><button class="lb-btn next" aria-label="Next">▶</button><button class="lb-btn close" aria-label="Close">✕</button></div>';
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => document.body.appendChild(overlay), { once: true });
  } else {
    document.body.appendChild(overlay);
  }
  let group = [], index = 0;
  const imgEl = () => overlay.querySelector('.lb-img');
  function openAt(i, arr){ group = arr || group; index = (i + group.length) % group.length; imgEl().src = group[index]; overlay.classList.add('active'); }
  function close(){ overlay.classList.remove('active'); imgEl().src = ''; }
  overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
  document.addEventListener('keydown', (e) => { if (!overlay.classList.contains('active')) return; if (e.key === 'Escape') close(); if (e.key === 'ArrowRight') openAt(index + 1); if (e.key === 'ArrowLeft')  openAt(index - 1); });
  overlay.querySelector('.close').addEventListener('click', (e) => { e.stopPropagation(); close(); });
  overlay.querySelector('.next').addEventListener('click',  (e) => { e.stopPropagation(); openAt(index + 1); });
  overlay.querySelector('.prev').addEventListener('click',  (e) => { e.stopPropagation(); openAt(index - 1); });
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a.lb'); if (!a) return;
    e.preventDefault();
    const g = a.dataset.group || ('solo-' + Math.random());
    const groupEls = [...document.querySelectorAll('a.lb[data-group="' + g + '"]')];
    const arr = groupEls.length ? groupEls.map(el => el.getAttribute('href')) : [a.getAttribute('href')];
    openAt(arr.indexOf(a.getAttribute('href')), arr);
  });
  document.addEventListener('click', (e) => {
    const img = e.target.closest('.entry-body img'); if (!img || img.closest('a')) return;
    e.preventDefault();
    openAt(0, [img.currentSrc || img.src]);
  });
})();
