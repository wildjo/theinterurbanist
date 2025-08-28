(function(){
  // Font size controls
  const root=document.documentElement;
  const getSize=()=>parseInt(getComputedStyle(root).getPropertyValue('--size'))||18;
  const setSize=(px)=>{root.style.setProperty('--size',px+'px');localStorage.setItem('fontSize',px);};
  document.getElementById('fontSmall')?.addEventListener('click',()=>setSize(Math.max(14,getSize()-2)));
  document.getElementById('fontLarge')?.addEventListener('click',()=>setSize(Math.min(28,getSize()+2)));
  const savedSize=parseInt(localStorage.getItem('fontSize')); if(!isNaN(savedSize)) setSize(savedSize);

  // Mode (Timeline vs Sections)
  const body=document.body;
  const setMode=(m)=>{
    body.classList.toggle('mode-timeline',m==='timeline');
    body.classList.toggle('mode-sections',m!=='timeline');
    localStorage.setItem('browseMode',m);
    requestAnimationFrame(updateArrows);
  };
  document.getElementById('modeTimeline')?.addEventListener('click',()=>setMode('timeline'));
  document.getElementById('modeSections')?.addEventListener('click',()=>setMode('sections'));
  setMode(localStorage.getItem('browseMode')==='timeline'?'timeline':'sections');

  // Section navigation + arrows logic
  const container=document.querySelector('.grid');
  const nav=document.querySelector('.nav-arrows');
  const leftBtn=nav?.querySelector('.left');
  const rightBtn=nav?.querySelector('.right');

  function isHorizontal(){
    if(!container) return false;
    const style=getComputedStyle(container);
    return style.display==='flex' && style.overflowX!=='visible';
  }

  function pageWidth(){
    const r=getComputedStyle(document.documentElement).getPropertyValue('--page');
    const num=parseFloat(r);
    if(!isNaN(num)) return container?.clientWidth ? Math.min(container.clientWidth*0.96, window.innerWidth*0.96) : window.innerWidth*0.96;
    return container.clientWidth*0.9;
  }

  function scrollHorizontal(dir){
    const page = container.clientWidth || window.innerWidth;
    container.scrollBy({left: dir * page * 0.9, behavior:'smooth'});
  }

  function scrollVerticalToCol(dir){
    const cols=[...document.querySelectorAll('.grid .col')];
    if(!cols.length) return;
    const tops=cols.map(el=>Math.abs(el.getBoundingClientRect().top));
    let i=tops.indexOf(Math.min(...tops));
    i=Math.max(0,Math.min(cols.length-1,i+dir));
    cols[i].scrollIntoView({behavior:'smooth',block:'start'});
  }

  function updateArrows(){
    if(!nav || !container){ return; }
    // Only manage arrows in sections mode + horizontal layout
    if(!isHorizontal() || body.classList.contains('mode-timeline')){
      nav.hidden = true;
      return;
    }
    const max = container.scrollWidth - container.clientWidth - 1;
    const x = container.scrollLeft;
    const canL = x > 2;
    const canR = x < max - 2;

    // If both directions are available, hide the whole arrow bar.
    if (canL && canR) {
      nav.hidden = true;
    } else {
      nav.hidden = !(canL || canR);
      if (!nav.hidden) {
        leftBtn.hidden = !canL;
        rightBtn.hidden = !canR;
      }
    }
  }

  leftBtn?.addEventListener('click',()=>isHorizontal()?scrollHorizontal(-1):scrollVerticalToCol(-1));
  rightBtn?.addEventListener('click',()=>isHorizontal()?scrollHorizontal(1):scrollVerticalToCol(1));

  container?.addEventListener('scroll', updateArrows, {passive:true});
  window.addEventListener('resize', ()=>requestAnimationFrame(updateArrows));
  window.addEventListener('load', updateArrows);
  updateArrows();
})();
