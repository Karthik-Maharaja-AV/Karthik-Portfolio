import { renderIcons } from './icons.js';

const escape = (text) => String(text).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export function createWorkExplorer(root, cases, onFilter) {
  const q = (selector) => root.querySelector(selector);
  const gallery = q('.ap-gallery');
  const modal = q('.ap-modal');
  const site = q('.ap-site');
  const sheet = q('.ap-modal-sheet');
  const close = q('.ap-modal-close');
  let visibleCases = cases.map((_, index) => index);
  let opened = null;
  let returnFocus = null;

  gallery.innerHTML = cases.map((item, index) => `<button type="button" class="ap-feature ${index === 0 ? 'ap-feature-dark' : ''} cursor-interaction" data-case="${index}" aria-label="Read case study: ${escape(item.heading)}"><span class="ap-feature-kicker">${escape(item.category)}</span><span class="ap-feature-count" aria-hidden="true">${item.number}</span><strong>${item.title}</strong><span class="ap-feature-copy">${escape(item.summary)}</span><span class="ap-feature-tags">${item.tags.slice(0, 2).map((tag) => `<span>${escape(tag)}</span>`).join('')}</span><span class="ap-feature-read">Read the contribution <span aria-hidden="true">↗</span></span></button>`).join('');

  function updateArrows() {
    for (const button of root.querySelectorAll('[data-gallery]')) {
      button.disabled = Number(button.dataset.gallery) < 0
        ? gallery.scrollLeft < 4
        : gallery.scrollLeft + gallery.clientWidth >= gallery.scrollWidth - 4;
    }
  }
  for (const button of root.querySelectorAll('[data-gallery]')) {
    button.addEventListener('click', () => gallery.scrollBy({
      left: Number(button.dataset.gallery) * gallery.clientWidth * 0.75,
      behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
    }));
  }
  gallery.addEventListener('scroll', updateArrows, { passive: true });

  for (const button of root.querySelectorAll('[data-work-filter]')) {
    button.setAttribute('aria-controls', 'salesforce-gallery');
    button.addEventListener('click', () => {
      const filter = button.dataset.workFilter;
      visibleCases = cases.flatMap((item, index) => filter === 'all' || item.group === filter ? [index] : []);
      for (const control of root.querySelectorAll('[data-work-filter]')) {
        control.setAttribute('aria-pressed', String(control === button));
      }
      for (const card of gallery.querySelectorAll('[data-case]')) {
        card.hidden = !visibleCases.includes(Number(card.dataset.case));
        card.style.transform = '';
      }
      q('.ap-work-count').textContent = `${String(visibleCases.length).padStart(2, '0')} contributions`;
      gallery.scrollLeft = 0;
      onFilter();
      requestAnimationFrame(updateArrows);
    });
  }

  function showCase(index, move = null) {
    if (!cases[index]) return;
    if (opened === null) returnFocus = document.activeElement;
    opened = index;
    const item = cases[index];
    const position = visibleCases.indexOf(index);
    q('.ap-modal-content').innerHTML = `<div class="ap-case-modal-top"><span>${escape(item.category)}</span><span>CASE ${item.number}</span></div><h2 id="ap-modal-title">${escape(item.heading)}</h2><div class="ap-case-modal-tags">${item.tags.map((tag) => `<span>${escape(tag)}</span>`).join('')}</div><div class="ap-modal-outcome"><span class="ap-outcome-label">WHAT CHANGED</span><p>${escape(item.impact)}</p></div><div class="ap-case-modal-detail"><div><h3>My contribution</h3><p>${escape(item.description)}</p></div><div><h3>The approach</h3><ol>${item.steps.map((step) => `<li>${escape(step)}</li>`).join('')}</ol></div></div><p class="ap-modal-foot">Contributed within a collaborative project. Client-specific code and business rules are omitted.</p><div class="ap-case-modal-nav"><span>${String(position + 1).padStart(2, '0')} / ${String(visibleCases.length).padStart(2, '0')}</span><div><button type="button" class="cursor-interaction" data-case-move="-1" aria-label="Previous case study" ${position <= 0 ? 'disabled' : ''}>← <span>Previous</span></button><button type="button" class="cursor-interaction" data-case-move="1" aria-label="Next case study" ${position >= visibleCases.length - 1 ? 'disabled' : ''}><span>Next</span> →</button></div></div>`;
    for (const button of modal.querySelectorAll('[data-case-move]')) {
      button.addEventListener('click', () => {
        const direction = Number(button.dataset.caseMove);
        const next = visibleCases[position + direction];
        if (next !== undefined) showCase(next, direction);
      });
    }
    modal.hidden = false;
    site.inert = true;
    document.documentElement.style.overflow = 'hidden';
    sheet.scrollTop = 0;
    const nextFocus = move === null ? close : modal.querySelector(`[data-case-move="${move}"]:not(:disabled)`);
    (nextFocus || close).focus({ preventScroll: true });
  }
  function closeCase() {
    modal.hidden = true;
    site.inert = false;
    document.documentElement.style.overflow = '';
    opened = null;
    returnFocus?.focus({ preventScroll: true });
  }
  for (const card of gallery.querySelectorAll('[data-case]')) {
    card.addEventListener('click', () => showCase(Number(card.dataset.case)));
  }
  close.addEventListener('click', closeCase);
  q('.ap-modal-scrim').addEventListener('click', closeCase);
  modal.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      closeCase();
    } else if (event.key === 'Tab') {
      const controls = [...modal.querySelectorAll('button:not(:disabled), a[href]')].filter((element) => element.getClientRects().length);
      const first = controls[0], last = controls.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();first.focus();
      }
    }
  });
  renderIcons(root);
  requestAnimationFrame(updateArrows);
}
