import { experience } from './data.js';

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const escape = (text) => String(text).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const monthIndex = (value) => {
  const [year, month] = value.split('-').map(Number);
  return year * 12 + month - 1;
};
function currentMonth(date) {
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit' }).formatToParts(date);
  return Number(parts.find((part) => part.type === 'year').value) * 12 + Number(parts.find((part) => part.type === 'month').value) - 1;
}
export function durationMonths(start, end, asOf = new Date()) {
  return Math.max(0, (end ? monthIndex(end) : currentMonth(asOf)) - monthIndex(start) + 1);
}
export function companyMonths(roles, asOf = new Date()) {
  const intervals = roles.map((role) => [monthIndex(role.start), role.end ? monthIndex(role.end) : currentMonth(asOf)]).sort((a, b) => a[0] - b[0]);
  let total = 0, previousEnd = -Infinity;
  // August 2024 is present in both Red Hat roles. Count that month once.
  for (const [start, end] of intervals) {
    total += Math.max(0, end - Math.max(start, previousEnd + 1) + 1);
    previousEnd = Math.max(previousEnd, end);
  }
  return total;
}
export function formatDuration(months, compact = false) {
  const years = Math.floor(months / 12), remainder = months % 12;
  const parts = [];
  if (years) parts.push(`${years} ${compact ? (years === 1 ? 'yr' : 'yrs') : (years === 1 ? 'year' : 'years')}`);
  if (remainder || !years) parts.push(`${remainder} ${compact ? (remainder === 1 ? 'mo' : 'mos') : (remainder === 1 ? 'month' : 'months')}`);
  return parts.join(' ');
}
function formatMonth(value) {
  const [year, month] = value.split('-').map(Number);
  return `${monthNames[month - 1]} ${year}`;
}
function period(start, end) {
  return `<time datetime="${start}">${formatMonth(start)}</time><span aria-hidden="true">—</span>${end ? `<time datetime="${end}">${formatMonth(end)}</time>` : '<span>Present</span>'}`;
}
export function renderExperience(asOf = new Date()) {
  return experience.map((company) => {
    const current = company.roles.some((role) => !role.end);
    const start = company.roles.map((role) => role.start).sort()[0];
    const end = current ? null : company.roles.map((role) => role.end).sort().at(-1);
    return `<article class="ap-career-company ${current ? 'ap-career-current' : ''}" aria-labelledby="career-${company.id}"><div class="ap-career-header"><span class="ap-company-mark ap-company-${company.id}" aria-hidden="true">${escape(company.mark)}</span><div class="ap-company-info"><div class="ap-company-name"><h3 id="career-${company.id}">${escape(company.company)}</h3>${current ? '<span class="ap-current-role"><span aria-hidden="true"></span>Current</span>' : ''}</div><div class="ap-company-period">${period(start, end)}</div></div><div class="ap-company-tenure"><strong data-company-tenure="${company.id}">${formatDuration(companyMonths(company.roles, asOf))}</strong><span>Company tenure</span></div></div><div class="ap-career-location"><i data-lucide="map-pin" aria-hidden="true"></i><span>${escape(company.location)}</span><span class="ap-work-mode">${escape(company.workMode)}</span></div><ol class="ap-career-roles">${company.roles.map((role) => `<li><div class="ap-role-heading"><h4>${escape(role.title)}</h4><span>${escape(role.type)}</span></div><div class="ap-role-period">${period(role.start, role.end)}<span class="ap-tenure-separator" aria-hidden="true">·</span><span data-role-tenure="${role.id}">${formatDuration(durationMonths(role.start, role.end, asOf), true)}</span></div></li>`).join('')}</ol></article>`;
  }).join('');
}
export function refreshExperience(root, asOf = new Date()) {
  for (const company of experience) {
    const tenure = root.querySelector(`[data-company-tenure="${company.id}"]`);
    if (tenure) tenure.textContent = formatDuration(companyMonths(company.roles, asOf));
    for (const role of company.roles) {
      const duration = root.querySelector(`[data-role-tenure="${role.id}"]`);
      if (duration) duration.textContent = formatDuration(durationMonths(role.start, role.end, asOf), true);
    }
  }
}

export function initExperience(root) {
  refreshExperience(root);
  const section = root.querySelector('#experience');
  const list = section.querySelector('.ap-experience-list');
  const cards = [...list.querySelectorAll('.ap-career-company')];
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const chapter = document.createElement('div');
  chapter.className = 'ap-career-chapter';
  chapter.setAttribute('aria-hidden', 'true');
  chapter.innerHTML = '<span class="ap-career-chapter-label">CURRENT CHAPTER</span><strong>IBM</strong><div><span class="ap-career-chapter-period">Oct 2026 — Present</span><span class="ap-career-chapter-count">01 / 02</span></div>';
  section.querySelector('.ap-experience-heading').append(chapter);
  let bounds = null, active = -1;
  const clamp = (value) => Math.max(0, Math.min(1, value));
  const smooth = (value) => { const p = clamp(value); return p * p * (3 - 2 * p); };

  function measure() {
    // Measure the natural positions, without the previous frame's transforms.
    section.classList.remove('ap-career-motion');
    active = -1;
    if (preference.matches) {
      bounds = null;
      chapter.hidden = true;
      for (const card of cards) card.classList.remove('ap-career-active');
      return;
    }
    chapter.hidden = false;
    const pageTop = (element) => element.getBoundingClientRect().top + window.scrollY;
    bounds = {
      top: pageTop(list), height: list.offsetHeight,
      cards: cards.map((card) => ({
        card, top: pageTop(card), height: card.offsetHeight,
        roles: [...card.querySelectorAll('.ap-career-roles>li')].map((role) => ({ role, top: pageTop(role) })),
      })),
    };
    section.classList.add('ap-career-motion');
  }

  function render(scrollTop, viewportHeight) {
    if (!bounds || preference.matches) return;
    if (scrollTop + viewportHeight < bounds.top - 100 || scrollTop > bounds.top + bounds.height + 100) return;
    const focus = scrollTop + viewportHeight * 0.36;
    const progress = clamp((focus - bounds.top - 43) / Math.max(1, bounds.height - 86));
    list.style.setProperty('--career-progress', String(progress));
    let current = 0;
    bounds.cards.forEach(({ card, top, height, roles }, index) => {
      const entrance = smooth((scrollTop + viewportHeight * 0.88 - top) / Math.min(viewportHeight * 0.6, height));
      card.style.setProperty('--career-entry', String(entrance));
      if (top + 43 <= focus) current = index;
      for (const { role, top: roleTop } of roles) {
        const reveal = smooth((scrollTop + viewportHeight * 0.55 - roleTop) / (viewportHeight * 0.25));
        role.style.setProperty('--role-reveal', String(reveal));
      }
    });
    if (current === active) return;
    active = current;
    cards.forEach((card, index) => card.classList.toggle('ap-career-active', index === current));
    const company = experience[current];
    const start = company.roles.map((role) => role.start).sort()[0];
    const end = company.roles.some((role) => !role.end) ? null : company.roles.map((role) => role.end).sort().at(-1);
    chapter.querySelector('.ap-career-chapter-label').textContent = company.roles.some((role) => !role.end) ? 'CURRENT CHAPTER' : 'EARLIER CHAPTER';
    chapter.querySelector('strong').textContent = company.company;
    chapter.querySelector('.ap-career-chapter-period').textContent = `${formatMonth(start)} — ${end ? formatMonth(end) : 'Present'}`;
    chapter.querySelector('.ap-career-chapter-count').textContent = `${String(current + 1).padStart(2, '0')} / ${String(cards.length).padStart(2, '0')}`;
  }
  return { measure, render };
}
