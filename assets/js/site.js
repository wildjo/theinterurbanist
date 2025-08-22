(function(){
  // Font size controls using CSS variable
  const root = document.documentElement;
  const getSize = () => parseInt(getComputedStyle(root).getPropertyValue('--size')) || 18;
  const setSize = (px) => { root.style.setProperty('--size', px + 'px'); localStorage.setItem('fontSize', px); };

  document.getElementById('fontSmall')?.addEventListener('click', () => setSize(Math.max(14, getSize()-2)));
  document.getElementById('fontLarge')?.addEventListener('click', () => setSize(Math.min(28, getSize()+2)));

  const savedSize = parseInt(localStorage.getItem('fontSize'));
  if(!isNaN(savedSize)) setSize(savedSize);

  // Mode controls
  const body = document.body;
  const setMode = (mode) => {
    body.classList.toggle('mode-timeline', mode === 'timeline');
    body.classList.toggle('mode-sections', mode === 'sections');
    localStorage.setItem('browseMode', mode);
  };
  document.getElementById('modeTimeline')?.addEventListener('click', () => setMode('timeline'));
  document.getElementById('modeSections')?.addEventListener('click', () => setMode('sections'));

  const savedMode = localStorage.getItem('browseMode');
  setMode(savedMode === 'timeline' ? 'timeline' : 'sections');

  // Horizontal strip nav arrows
  const strip = document.querySelector('.strip');
  document.querySelector('.nav-arrows .left')?.addEventListener('click', () => {
    if(strip) strip.scrollBy({left: -window.innerWidth, behavior: 'smooth'});
  });
  document.querySelector('.nav-arrows .right')?.addEventListener('click', () => {
    if(strip) strip.scrollBy({left: window.innerWidth, behavior: 'smooth'});
  });
})();