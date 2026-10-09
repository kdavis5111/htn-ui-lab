// Intro: the first screens a new reader sees, then the prototype notice, then the feed.
// Shown once per device (localStorage 'htn-intro-seen'). ?intro=1 forces it, ?skip=1 hides it.
// Lab component ported from the Assignment 1 mock-up; GSAP comes from cdnjs.
(function () {
  const intro = document.getElementById('intro');
  if (!intro) return;
  const stage = intro.querySelector('.intro-stage');
  const rest = intro.querySelector('.intro-rest');
  const top = intro.querySelector('.intro-top');
  const title = intro.querySelector('.intro-title');
  const start = intro.querySelector('.intro-start');
  const skipTitle = intro.querySelector('.intro-skip-title');
  const skip = intro.querySelector('.intro-skip');
  const go = intro.querySelector('.intro-go');
  const replay = intro.querySelector('.intro-replay');
  const q = new URLSearchParams(location.search);
  const reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  let seen = false;
  try { seen = localStorage.getItem('htn-intro-seen') === '1'; } catch (e) {}
  if ((seen && !q.has('intro')) || q.has('skip')) { intro.hidden = true; return; }

  intro.hidden = false;
  document.documentElement.style.overflow = 'hidden';

  function finish() {
    try { localStorage.setItem('htn-intro-seen', '1'); } catch (e) {}
    intro.hidden = true;
    document.documentElement.style.overflow = '';
    window.scrollTo(0, 0);
  }
  go.addEventListener('click', finish);

  // Title page first. Nothing moves until the reader presses a button.
  top.style.visibility = 'hidden'; stage.style.visibility = 'hidden'; rest.style.visibility = 'hidden';
  start.focus();

  // No GSAP (offline)? The button goes straight to the resting state.
  if (typeof gsap === 'undefined') {
    const end = () => { title.hidden = true; stage.style.display = 'none'; rest.style.visibility = 'visible'; rest.style.opacity = 1; go.focus(); };
    start.addEventListener('click', end); skipTitle.addEventListener('click', end); return;
  }

  const tl = gsap.timeline({ defaults: { ease: 'power2.out' }, paused: true, onComplete: done });
  tl.set(rest, { autoAlpha: 0 })
    .from('.phone', { y: 60, autoAlpha: 0, duration: 1.0 })
    .from('.notif', { y: -30, autoAlpha: 0, duration: 0.7, ease: 'back.out(1.4)' }, '+=0.6')
    .to('.notif', { scale: 0.97, duration: 0.12, yoyo: true, repeat: 1 }, '+=0.9')
    .to('.lock', { scale: 2.6, autoAlpha: 0, transformOrigin: '50% 32%', duration: 0.8, ease: 'power3.in' }, '+=0.1')
    .fromTo('.appview', { scale: 0.94, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.8 }, '-=0.3')
    .from('.pfacts li', { autoAlpha: 0, x: -12, stagger: 1.1, duration: 0.5 }, '+=1.2')
    .from('.psrc', { autoAlpha: 0, duration: 0.5 }, '+=0.9')
    .to(stage, { autoAlpha: 0, y: -16, duration: 0.9 }, '+=2.4')
    .to(top, { autoAlpha: 0, duration: 0.5 }, '<')
    .to(rest, { autoAlpha: 1, duration: 0.4 }, '<0.5')
    .from('.intro-motto .m1', { y: 12, autoAlpha: 0, duration: 0.5 }, '+=0.2')
    .from('.intro-motto .m2', { y: 12, autoAlpha: 0, duration: 0.5 }, '+=0.45')
    .from('.intro-motto .m3', { y: 12, autoAlpha: 0, duration: 0.5 }, '+=0.45')
    .to('.intro-motto', { autoAlpha: 0, y: -10, duration: 0.5 }, '+=1.1')
    .from('.intro-rest .brand-big', { y: 12, autoAlpha: 0, duration: 0.7 }, '-=0.15')
    .from(['.proto-card', '.intro-rest .intro-actions'], { y: 14, autoAlpha: 0, duration: 0.6, stagger: 0.2 }, '+=0.4');
  tl.timeScale(1.5);
  window.__introTimeline = tl;

  function leaveTitle() { title.hidden = true; top.style.visibility = ''; stage.style.visibility = ''; rest.style.visibility = ''; }
  function done() { stage.style.pointerEvents = 'none'; top.style.visibility = 'hidden'; go.focus(); }
  function play() { leaveTitle(); stage.style.pointerEvents = ''; top.style.visibility = ''; tl.restart(); skip.focus(); }
  function toEnd() { leaveTitle(); tl.progress(1); done(); }

  start.addEventListener('click', () => { if (reduce) toEnd(); else play(); });
  skipTitle.addEventListener('click', toEnd);
  skip.addEventListener('click', toEnd);
  replay.addEventListener('click', play);

  const at = parseFloat(q.get('at'));           // ?at=2.5 pauses the intro at that second, for screenshots
  if (!isNaN(at)) { leaveTitle(); tl.pause(at); }
})();
