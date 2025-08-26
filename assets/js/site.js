(function(){
  // Font size controls
  const root = document.documentElement;
  const getSize = () => parseInt(getComputedStyle(root).getPropertyValue('--size')) || 18;
  const setSize = (px) => { root.style.setProperty('--size', px + 'px'); localStorage.setItem('fontSize', px); };
  document.getElementById('fontSmall')?.addEventListener('click', () => setSize(Math.max(14, getSize()-2)));
  document.getElementById('fontLarge')?.addEventListener('click', () => setSize(Math.min(28, getSize()+2)));
  const savedSize = parseInt(localStorage.getItem('fontSize')); if(!isNaN(savedSize)) setSize(savedSize);

  // Mode (Timeline vs By Section)
  const body = document.body;
  const setMode = (m) => { body.classList.toggle('mode-timeline', m === 'timeline'); body.classList.toggle('mode-sections', m !== 'timeline'); localStorage.setItem('browseMode', m); };
  document.getElementById('modeTimeline')?.addEventListener('click', () => setMode('timeline'));
  document.getElementById('modeSections')?.addEventListener('click', () => setMode('sections'));
  setMode(localStorage.getItem('browseMode') === 'timeline' ? 'timeline' : 'sections');

  // Section navigation
  const container = document.querySelector('.grid');
  const leftBtn  = document.querySelector('.nav-arrows .left');
  const rightBtn = document.querySelector('.nav-arrows .right');

  function isHorizontal(){
    if(!container) return false;
    const style = getComputedStyle(container);
    return style.overflowX !== 'visible' && (style.display === 'flex');
  }

  function scrollHorizontal(dir){
    const page = container.clientWidth * 0.9;
    container.scrollBy({ left: dir * page, behavior: 'smooth' });
  }

  function scrollVerticalToCol(dir){
    const cols = Array.from(document.querySelectorAll('.grid .col'));
    if(cols.length === 0) return;
    // Find the column closest to the top
    const tops = cols.map(el => Math.abs(el.getBoundingClientRect().top));
    let i = tops.indexOf(Math.min(...tops));
    i = Math.max(0, Math.min(cols.length - 1, i + dir));
    cols[i].scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  leftBtn?.addEventListener('click', () => isHorizontal() ? scrollHorizontal(-1) : scrollVerticalToCol(-1));
  rightBtn?.addEventListener('click', () => isHorizontal() ? scrollHorizontal(1)  : scrollVerticalToCol(1));
})();
