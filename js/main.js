/* ============================================================
   Transporte Ecológico Compás — main.js
   Client-side: navigation, active-section tracking, search
   ============================================================ */
(function () {
  'use strict';

  /* ── Sidebar toggle (mobile) ─────────────────────────── */
  const sidebar   = document.getElementById('sidebar');
  const navToggle = document.getElementById('nav-toggle');
  const overlay   = document.getElementById('sidebar-overlay');

  function openSidebar() {
    sidebar.classList.add('open');
    sidebar.removeAttribute('aria-hidden');
    navToggle.setAttribute('aria-expanded', 'true');
    overlay && overlay.classList.add('active');
  }
  function closeSidebar() {
    sidebar.classList.remove('open');
    sidebar.setAttribute('aria-hidden', 'true');
    navToggle.setAttribute('aria-expanded', 'false');
    overlay && overlay.classList.remove('active');
  }

  navToggle && navToggle.addEventListener('click', () => {
    sidebar.classList.contains('open') ? closeSidebar() : openSidebar();
  });
  overlay && overlay.addEventListener('click', closeSidebar);

  /* Close sidebar on nav-link click (mobile) */
  sidebar && sidebar.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', () => {
      if (window.innerWidth < 769) closeSidebar();
    });
  });

  /* ── Collapsible sub-menus ──────────────────────────── */
  document.querySelectorAll('#sidebar .has-sub > a').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const li = a.closest('li');
      li.classList.toggle('open');
    });
  });

  /* ── Active section via IntersectionObserver ─────────── */
  const navLinks = Array.from(document.querySelectorAll('#sidebar nav a[href^="#"]'))
    .filter(a => !a.closest('.has-sub') || a.parentElement.tagName === 'LI');
  const allNavLinks = Array.from(document.querySelectorAll('#sidebar nav a[href^="#"]'));

  function setActive(id) {
    allNavLinks.forEach(l => l.classList.remove('active'));
    const target = document.querySelector(`#sidebar a[href="#${id}"]`);
    if (!target) return;
    target.classList.add('active');
    // Open parent sub-menu if collapsed
    const parentLi = target.closest('ul')?.closest('li.has-sub');
    if (parentLi) parentLi.classList.add('open');
  }

  const sections = Array.from(document.querySelectorAll('.doc-section[id]'));
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting) setActive(en.target.id);
      });
    }, { rootMargin: '-20% 0px -70% 0px' });
    sections.forEach(s => io.observe(s));
  }

  /* ── Build search index from DOM ────────────────────── */
  const searchIndex = [];
  sections.forEach(sec => {
    const title = sec.querySelector('h2')?.textContent.trim() || '';
    const id    = sec.id;
    // Index each paragraph / list item individually for snippet accuracy
    sec.querySelectorAll('p, li, h3, h4, td, th').forEach(el => {
      const text = el.textContent.trim();
      if (text.length > 10) {
        searchIndex.push({ id, title, text });
      }
    });
  });

  /* ── Search UI ───────────────────────────────────────── */
  const searchInput   = document.getElementById('search-input');
  const searchResults = document.getElementById('search-results');
  const searchClose   = document.getElementById('search-close');

  function escapeRE(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function highlight(text, query) {
    const re = new RegExp(`(${escapeRE(query)})`, 'gi');
    return text.replace(re, '<em>$1</em>');
  }

  function truncate(text, query, radius) {
    const idx = text.toLowerCase().indexOf(query.toLowerCase());
    if (idx === -1) return text.slice(0, 120) + '…';
    const start = Math.max(0, idx - radius);
    const end   = Math.min(text.length, idx + query.length + radius);
    return (start > 0 ? '…' : '') + text.slice(start, end) + (end < text.length ? '…' : '');
  }

  function doSearch(query) {
    query = query.trim();
    if (query.length < 2) {
      searchResults.classList.remove('visible');
      return;
    }

    const seen   = new Set();
    const hits   = [];

    searchIndex.forEach(item => {
      if (item.text.toLowerCase().includes(query.toLowerCase())) {
        const key = item.id + '|' + item.text.slice(0, 40);
        if (!seen.has(key) && hits.length < 8) {
          seen.add(key);
          hits.push(item);
        }
      }
    });

    if (hits.length === 0) {
      searchResults.innerHTML =
        '<button id="search-close" class="sr-close" aria-label="Cerrar búsqueda">✕ cerrar</button>' +
        '<p class="sr-empty">No se encontraron resultados para "<strong>' +
        escapeHTML(query) + '</strong>".</p>';
    } else {
      const items = hits.map(h => {
        const snippet = truncate(h.text, query, 60);
        return `<a class="sr-item" href="#${h.id}">
          <strong>${escapeHTML(h.title)}</strong>
          <span>${highlight(escapeHTML(snippet), query)}</span>
        </a>`;
      }).join('');
      searchResults.innerHTML =
        '<button id="search-close" class="sr-close" aria-label="Cerrar búsqueda">✕ cerrar</button>' +
        items;
    }

    searchResults.classList.add('visible');
    // Re-attach close handler (innerHTML replaced the button)
    const closeBtn = searchResults.querySelector('#search-close');
    closeBtn && closeBtn.addEventListener('click', clearSearch);

    // Close sidebar when result clicked (mobile)
    searchResults.querySelectorAll('.sr-item').forEach(a => {
      a.addEventListener('click', () => {
        clearSearch();
        if (window.innerWidth < 769) closeSidebar();
      });
    });
  }

  function clearSearch() {
    searchInput.value = '';
    searchResults.classList.remove('visible');
  }

  function escapeHTML(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  searchInput && searchInput.addEventListener('input', e => doSearch(e.target.value));
  searchInput && searchInput.addEventListener('keydown', e => {
    if (e.key === 'Escape') clearSearch();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') clearSearch();
    // Ctrl/Cmd+K: focus search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      searchInput && searchInput.focus();
    }
  });

  // Close on click outside
  document.addEventListener('click', e => {
    if (!searchResults.contains(e.target) && e.target !== searchInput) {
      searchResults.classList.remove('visible');
    }
  });

  /* ── Smooth-scroll polyfill for anchor links ─────────── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id  = a.getAttribute('href').slice(1);
      const el  = document.getElementById(id);
      if (!el) return;
      e.preventDefault();
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Update URL hash without jumping
      history.pushState(null, '', '#' + id);
    });
  });

  /* ── Survey interactivity (demo — prints to console) ─── */
  const surveyForm = document.getElementById('survey-form');
  surveyForm && surveyForm.addEventListener('submit', e => {
    e.preventDefault();
    const btn = surveyForm.querySelector('button[type=submit]');
    btn.textContent = '✓ Respuestas enviadas. ¡Gracias!';
    btn.disabled = true;
    btn.style.background = '#2472c8';
  });

  /* ── Claim form (demo) ─────────────────────────────── */
  const claimForm = document.getElementById('claim-form');
  claimForm && claimForm.addEventListener('submit', e => {
    e.preventDefault();
    const btn = claimForm.querySelector('button[type=submit]');
    btn.textContent = '✓ Reclamación registrada. Le responderemos en un plazo máximo de 10 días hábiles.';
    btn.disabled = true;
    btn.style.background = '#2472c8';
    btn.style.whiteSpace = 'normal';
  });

  /* ── Back-to-top button ──────────────────────────────── */
  const btt = document.getElementById('back-to-top');
  btt && window.addEventListener('scroll', () => {
    btt.style.display = window.scrollY > 400 ? 'flex' : 'none';
  });
  btt && btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

})();
