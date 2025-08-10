
const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('#site-nav');
if (navToggle){
  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true' || false;
    navToggle.setAttribute('aria-expanded', String(!expanded));
    nav.classList.toggle('open');
  });
}

const toTop = document.getElementById('toTop');
window.addEventListener('scroll', () => {
  if (window.scrollY > 500){ toTop.classList.add('show'); } else { toTop.classList.remove('show'); }
});
toTop?.addEventListener('click', () => window.scrollTo({top:0, behavior:'smooth'}));
