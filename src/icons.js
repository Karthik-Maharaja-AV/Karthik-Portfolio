// Small, local SVG symbols. No icon CDN or runtime dependency.
const paths = {
  'map-pin': '<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',
  cloud: '<path d="M7 18a5 5 0 1 1 1-10 7 7 0 0 1 13 3 4 4 0 0 1-1 7Z"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 6 9 7 9-7"/>',
  'chevron-left': '<path d="m15 6-6 6 6 6"/>',
  'chevron-right': '<path d="m9 6 6 6-6 6"/>',
  x: '<path d="m6 6 12 12M18 6 6 18"/>',
  'message-square': '<path d="M21 14a3 3 0 0 1-3 3H8l-5 4V6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3Z"/>',
  'user-round': '<circle cx="12" cy="8" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/>',
  handshake: '<path d="m2 12 4-7 5 2 3-2 8 6-4 8-3 1-9-5-4-3Z"/><path d="m8 10 3-3 5 4-3 3-3-2m1 4 4 3"/>',
  'file-text': '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6M8 13h8M8 17h6"/>',
  layers: '<path d="m12 3 10 5-10 5L2 8Zm-10 9 10 5 10-5M2 16l10 5 10-5"/>',
  boxes: '<path d="m12 2 8 4v8l-8 4-8-4V6Zm0 8 8-4M4 6l8 4v8M2 16l5 3m15-3-5 3"/>',
  settings: '<circle cx="12" cy="12" r="4"/><path d="M12 2v3m0 14v3M2 12h3m14 0h3M5 5l2 2m10 10 2 2M5 19l2-2M17 7l2-2"/>',
  'package-check': '<path d="m12 2 9 5v10l-9 5-9-5V7Zm0 10 9-5M3 7l9 5v10m-4-8 3 3 5-5"/>',
  database: '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 4 16 4 16 0V5M4 12c0 4 16 4 16 0"/>',
  'git-merge': '<circle cx="6" cy="4" r="2"/><circle cx="6" cy="20" r="2"/><circle cx="18" cy="7" r="2"/><path d="M6 6v12M16 7c-5 0-3 7-10 7"/>',
  'panels-top-left': '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 9v12"/>',
  'chart-no-axes-combined': '<path d="M4 20V10m5 10v-5m5 5V8m5 12V4M3 7l5-3 6 1 6-4"/>',
};

export function renderIcons(root = document) {
  for (const node of root.querySelectorAll('[data-lucide]')) {
    const content = paths[node.dataset.lucide];
    if (!content) continue;
    node.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${content}</svg>`;
    node.removeAttribute('data-lucide');
  }
}
