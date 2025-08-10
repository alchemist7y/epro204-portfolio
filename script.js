(function () {
  const html = document.documentElement;
  const yearEl = document.getElementById('year');
  const updatedEl = document.getElementById('updated');
  const backToTop = document.getElementById('backToTop');
  const themeToggle = document.getElementById('themeToggle');
  const fontToggle = document.getElementById('fontToggle');
  const printBtn = document.getElementById('printBtn');
  const searchInput = document.getElementById('q');

  // Footer dates
  const now = new Date();
  if (yearEl) yearEl.textContent = now.getFullYear();
  if (updatedEl) updatedEl.textContent = `Last updated ${now.toLocaleDateString('en-AU', { year: 'numeric', month: 'long', day: 'numeric' })}`;

  // Persisted theme
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) html.setAttribute('data-theme', savedTheme);

  // Toggle dark mode
  themeToggle?.addEventListener('click', () => {
    const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    themeToggle.setAttribute('aria-pressed', next === 'dark');
  });

  // Toggle big type
  fontToggle?.addEventListener('click', () => {
    const isBig = html.classList.toggle('bigtype');
    fontToggle.setAttribute('aria-pressed', isBig);
  });

  // Print
  printBtn?.addEventListener('click', () => window.print());

  // Back to top visibility
  const onScroll = () => {
    if (window.scrollY > 600) backToTop.style.display = 'inline-flex';
    else backToTop.style.display = 'none';
  };
  window.addEventListener('scroll', onScroll);
  backToTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // Smooth scroll for nav links
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href')?.slice(1);
      const el = id && document.getElementById(id);
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        history.pushState(null, '', `#${id}`);
        el.focus({ preventScroll: true });
      }
    });
  });

  // Simple highlight search
  const cards = [...document.querySelectorAll('.card')];
  function clearHighlights() {
    document.querySelectorAll('mark[data-hl]').forEach(m => {
      const parent = m.parentNode;
      parent.replaceChild(document.createTextNode(m.textContent), m);
      parent.normalize();
    });
  }
  function doSearch(q) {
    clearHighlights();
    if (!q || q.length < 2) return;

    const regex = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    cards.forEach(card => {
      card.childNodes.forEach(node => {
        if (node.nodeType === Node.TEXT_NODE) {
          const text = node.textContent;
          if (text && regex.test(text)) {
            const frag = document.createDocumentFragment();
            let lastIdx = 0;
            text.replace(regex, (match, offset) => {
              frag.appendChild(document.createTextNode(text.slice(lastIdx, offset)));
              const mark = document.createElement('mark');
              mark.dataset.hl = '1';
              mark.textContent = match;
              frag.appendChild(mark);
              lastIdx = offset + match.length;
              return match;
            });
            frag.appendChild(document.createTextNode(text.slice(lastIdx)));
            node.parentNode.replaceChild(frag, node);
          }
        }
      });
    });
  }
  let t;
  searchInput?.addEventListener('input', () => {
    clearTimeout(t);
    t = setTimeout(() => doSearch(searchInput.value.trim()), 200);
  });
})();
