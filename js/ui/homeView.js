import { localization } from '../core/localization.js';
import { eventBus } from '../core/eventBus.js';
import { EVENTS, SUPPORTED_LANGUAGES, UPDATE_RANGES, DISCOVERY_MODES, DISCOVERY_MODE_LABELS } from '../core/constants.js';
import { filterService } from '../services/filterService.js';
import { collectionService } from '../services/collectionService.js';
import { stateManager } from '../core/stateManager.js';

export function createHomeView() {
  const view = document.createElement('div');
  view.className = 'home-view';

  // Hero Section
  const hero = document.createElement('div');
  hero.className = 'home-hero';

  const logo = document.createElement('div');
  logo.className = 'home-logo';
  logo.textContent = 'Reepo';

  const tagline = document.createElement('p');
  tagline.className = 'home-tagline';
  tagline.textContent = localization.t('app.tagline') || 'Discover GitHub Repositories';

  const description = document.createElement('p');
  description.className = 'home-description';
  description.textContent = 'Explore thousands of open-source projects. Click the button to discover a random repository, or use advanced filters to narrow down your search.';

  hero.appendChild(logo);
  hero.appendChild(tagline);
  hero.appendChild(description);

  // Main CTA Button
  const ctaButton = document.createElement('button');
  ctaButton.className = 'btn btn-primary home-cta';
  ctaButton.innerHTML = '<span class="cta-icon">🎲</span> Discover Random Repository';
  ctaButton.addEventListener('click', () => {
    stateManager.setState('currentView', 'discovery');
    eventBus.emit(EVENTS.VIEW_CHANGED, { view: 'discovery' });
    eventBus.emit(EVENTS.REQUEST_NEXT_REPOSITORY);
  });

  hero.appendChild(ctaButton);
  view.appendChild(hero);

  // Quick Stats
  const statsSection = document.createElement('div');
  statsSection.className = 'home-stats';

  const savedCount = collectionService.getSavedRepositories().length;
  const historyCount = (stateManager.getState().discovery?.history || []).length;
  const collectionsCount = collectionService.getCollections().length;

  const stats = [
    { icon: '📁', label: 'Saved Repos', value: savedCount },
    { icon: '🕒', label: 'Viewed', value: historyCount },
    { icon: '📚', label: 'Collections', value: collectionsCount },
    { icon: '🏆', label: 'XP', value: stateManager.getState().gamification?.xp || 0 }
  ];

  stats.forEach(stat => {
    const card = document.createElement('div');
    card.className = 'home-stat-card';
    card.innerHTML = `
      <span class="stat-icon">${stat.icon}</span>
      <span class="stat-value">${stat.value}</span>
      <span class="stat-label">${stat.label}</span>
    `;
    statsSection.appendChild(card);
  });

  view.appendChild(statsSection);

  // Advanced Filters Section (collapsible)
  const filtersSection = document.createElement('div');
  filtersSection.className = 'home-filters';

  const filtersToggle = document.createElement('button');
  filtersToggle.className = 'btn btn-ghost home-filters-toggle';
  filtersToggle.innerHTML = '<span>⚙️ Advanced Filters</span> <span class="toggle-arrow">▾</span>';
  filtersToggle.addEventListener('click', () => {
    const body = filtersSection.querySelector('.home-filters-body');
    const isOpen = body.classList.toggle('open');
    filtersToggle.querySelector('.toggle-arrow').textContent = isOpen ? '▴' : '▾';
  });

  filtersSection.appendChild(filtersToggle);

  const filtersBody = document.createElement('div');
  filtersBody.className = 'home-filters-body';

  // Language
  const langGroup = document.createElement('div');
  langGroup.className = 'filter-group';
  const langLabel = document.createElement('label');
  langLabel.className = 'filter-label';
  langLabel.textContent = 'Language';
  const langSelect = document.createElement('select');
  langSelect.className = 'filter-select';
  const langAll = document.createElement('option');
  langAll.value = '';
  langAll.textContent = 'All Languages';
  langSelect.appendChild(langAll);
  SUPPORTED_LANGUAGES.forEach(l => {
    const opt = document.createElement('option');
    opt.value = l;
    opt.textContent = l;
    langSelect.appendChild(opt);
  });
  langSelect.addEventListener('change', (e) => {
    filterService.setFilter('language', e.target.value);
    eventBus.emit(EVENTS.FILTER_APPLIED);
  });
  langGroup.appendChild(langLabel);
  langGroup.appendChild(langSelect);
  filtersBody.appendChild(langGroup);

  // Min Stars
  const starsGroup = document.createElement('div');
  starsGroup.className = 'filter-group';
  const starsLabel = document.createElement('label');
  starsLabel.className = 'filter-label';
  starsLabel.textContent = 'Min Stars';
  const starsInput = document.createElement('input');
  starsInput.type = 'number';
  starsInput.className = 'filter-input';
  starsInput.min = 0;
  starsInput.placeholder = '0';
  starsInput.addEventListener('change', (e) => {
    filterService.setFilter('minStars', parseInt(e.target.value) || 0);
    eventBus.emit(EVENTS.FILTER_APPLIED);
  });
  starsGroup.appendChild(starsLabel);
  starsGroup.appendChild(starsInput);
  filtersBody.appendChild(starsGroup);

  // Updated Within
  const updateGroup = document.createElement('div');
  updateGroup.className = 'filter-group';
  const updateLabel = document.createElement('label');
  updateLabel.className = 'filter-label';
  updateLabel.textContent = 'Updated Within';
  const updateSelect = document.createElement('select');
  updateSelect.className = 'filter-select';
  UPDATE_RANGES.forEach(r => {
    const opt = document.createElement('option');
    opt.value = r.value;
    opt.textContent = r.label;
    updateSelect.appendChild(opt);
  });
  updateSelect.addEventListener('change', (e) => {
    filterService.setFilter('updatedWithin', e.target.value);
    eventBus.emit(EVENTS.FILTER_APPLIED);
  });
  updateGroup.appendChild(updateLabel);
  updateGroup.appendChild(updateSelect);
  filtersBody.appendChild(updateGroup);

  // Discovery Mode
  const modeGroup = document.createElement('div');
  modeGroup.className = 'filter-group';
  const modeLabel = document.createElement('label');
  modeLabel.className = 'filter-label';
  modeLabel.textContent = 'Discovery Mode';
  const modeSelect = document.createElement('select');
  modeSelect.className = 'filter-select';
  Object.entries(DISCOVERY_MODE_LABELS).forEach(([key, label]) => {
    const opt = document.createElement('option');
    opt.value = key;
    opt.textContent = label;
    modeSelect.appendChild(opt);
  });
  modeSelect.value = stateManager.getState().discovery.mode;
  modeSelect.addEventListener('change', (e) => {
    eventBus.emit(EVENTS.DISCOVERY_MODE_CHANGED, { mode: e.target.value });
  });
  modeGroup.appendChild(modeLabel);
  modeGroup.appendChild(modeSelect);
  filtersBody.appendChild(modeGroup);

  // Toggles
  const togglesGroup = document.createElement('div');
  togglesGroup.className = 'filter-toggles';

  const forkToggle = document.createElement('label');
  forkToggle.className = 'filter-toggle';
  const forkCheck = document.createElement('input');
  forkCheck.type = 'checkbox';
  forkCheck.checked = true;
  forkCheck.addEventListener('change', (e) => {
    filterService.setFilter('includeForks', e.target.checked);
    eventBus.emit(EVENTS.FILTER_APPLIED);
  });
  forkToggle.appendChild(forkCheck);
  forkToggle.appendChild(document.createTextNode(' Include Forks'));
  togglesGroup.appendChild(forkToggle);

  const archToggle = document.createElement('label');
  archToggle.className = 'filter-toggle';
  const archCheck = document.createElement('input');
  archCheck.type = 'checkbox';
  archCheck.checked = true;
  archCheck.addEventListener('change', (e) => {
    filterService.setFilter('includeArchived', e.target.checked);
    eventBus.emit(EVENTS.FILTER_APPLIED);
  });
  archToggle.appendChild(archCheck);
  archToggle.appendChild(document.createTextNode(' Include Archived'));
  togglesGroup.appendChild(archToggle);

  filtersBody.appendChild(togglesGroup);

  // Apply & Reset buttons
  const filterActions = document.createElement('div');
  filterActions.className = 'filter-actions';

  const applyBtn = document.createElement('button');
  applyBtn.className = 'btn btn-primary btn-small';
  applyBtn.textContent = 'Apply Filters & Discover';
  applyBtn.addEventListener('click', () => {
    stateManager.setState('currentView', 'discovery');
    eventBus.emit(EVENTS.VIEW_CHANGED, { view: 'discovery' });
    eventBus.emit(EVENTS.REQUEST_NEXT_REPOSITORY);
  });
  filterActions.appendChild(applyBtn);

  const resetBtn = document.createElement('button');
  resetBtn.className = 'btn btn-ghost btn-small';
  resetBtn.textContent = 'Reset';
  resetBtn.addEventListener('click', () => {
    filterService.resetFilters();
    langSelect.value = '';
    starsInput.value = '';
    updateSelect.value = 'any';
    forkCheck.checked = true;
    archCheck.checked = true;
    eventBus.emit(EVENTS.FILTER_RESET);
  });
  filterActions.appendChild(resetBtn);

  filtersBody.appendChild(filterActions);
  filtersSection.appendChild(filtersBody);
  view.appendChild(filtersSection);

  return view;
}