import { products } from './data.js';
import { renderIcons } from './icons.js';

export const productModules = {
  crm: {
    source: 0, number: '01', title: 'From conversation to conversion.',
    features: ['Lead conversion', 'Linked sales documents', 'CSV imports & tests'],
    steps: [
      ['Enquiry', 'message-square', 'Every sale starts somewhere.', 'Capture an enquiry and give the conversation a clear next step.'],
      ['Lead', 'user-round', 'Turn interest into opportunity.', 'Connect lead conversion with a pipeline that keeps the next action in view.'],
      ['Deal', 'handshake', 'Keep the details together.', 'Move from the opportunity to quotes and linked sales documents.'],
      ['Invoice', 'file-text', 'Carry the sale through.', 'Keep billing connected to the documents and conversation that came before it.'],
    ],
  },
  manufacturing: {
    source: 3, number: '02', title: 'From components to finished goods.',
    features: ['Bills of materials', 'Assembly & costing', 'Inventory & reports'],
    steps: [
      ['BOM', 'layers', 'Start with a clear recipe.', 'Versioned bills of materials define the components needed for an assembly.'],
      ['Components', 'boxes', 'Know what goes in.', 'Connect component requirements with inventory consumption.'],
      ['Assembly', 'settings', 'Bring the pieces together.', 'Assembly-order workflows connect the build with costing and manufacturing reports.'],
      ['Output lot', 'package-check', 'Keep the output connected.', 'Inventory writers record the finished output. Production-stage/WIP orders remain partly built.'],
    ],
  },
  reports: {
    source: 6, number: '03', title: 'Bring the whole picture into view.',
    features: ['Joined report types', 'Saved views', 'Report configuration'],
    steps: [
      ['Data', 'database', 'Start with the right information.', 'Choose the business data that the report needs to bring into view.'],
      ['Join', 'git-merge', 'Connect related records.', 'Joined report types bring related information into a working report model.'],
      ['Saved view', 'panels-top-left', 'Make a useful view reusable.', 'Saved views keep report configuration available for the next visit.'],
      ['Report', 'chart-no-axes-combined', 'Make the information useful.', 'Configurable reports and supporting tests help turn business data into working views.'],
    ],
  },
};

export function renderProduct(root, id) {
  const module = productModules[id];
  if (!module) return;
  const item = products[module.source];
  const q = (selector) => root.querySelector(selector);
  const model = q('.ap-product-model');
  model.dataset.module = id;
  q('.ap-module-number').textContent = `${module.number} / ${item.label.toUpperCase()}`;
  q('.ap-module-title').textContent = module.title;
  q('.ap-module-summary').textContent = item.description;
  q('.ap-product-contribution p').textContent = item.contribution;
  q('.ap-model-status').textContent = item.label;
  const features = q('.ap-module-features');
  features.replaceChildren(...module.features.map((text) => {
    const li = document.createElement('li');
    li.textContent = text;
    return li;
  }));
  for (const button of root.querySelectorAll('[data-product]')) {
    button.setAttribute('aria-pressed', String(button.dataset.product === id));
  }
  const journey = q('.ap-product-journey');
  journey.innerHTML = module.steps.map(([name, icon], index) => `<button type="button" class="ap-journey-step cursor-interaction" data-product-step="${index}" aria-pressed="${index === 0}" aria-controls="selected-workflow-step"><span class="ap-step-symbol"><i data-lucide="${icon}" aria-hidden="true"></i></span><span>${name}</span></button>`).join('');
  q('.ap-selected-step').id = 'selected-workflow-step';
  function selectStep(index) {
    const [, icon, title, description] = module.steps[index];
    model.dataset.step = index;
    journey.style.setProperty('--journey-fill', `${index / 3 * 100}%`);
    q('.ap-workspace-symbol').innerHTML = `<i data-lucide="${icon}" aria-hidden="true"></i>`;
    q('.ap-workspace-step').textContent = `STEP ${String(index + 1).padStart(2, '0')} / 04`;
    q('.ap-selected-step h4').textContent = title;
    q('.ap-selected-step p').textContent = description;
    for (const button of journey.querySelectorAll('button')) {
      button.setAttribute('aria-pressed', String(Number(button.dataset.productStep) === index));
    }
    renderIcons(root);
  }
  for (const button of journey.querySelectorAll('button')) {
    button.addEventListener('click', () => selectStep(Number(button.dataset.productStep)));
  }
  selectStep(0);
}
