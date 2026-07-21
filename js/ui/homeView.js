import { localization } from '../core/localization.js';
import { eventBus } from '../core/eventBus.js';
import { EVENTS, SUPPORTED_LANGUAGES, UPDATE_RANGES, DISCOVERY_MODE_LABELS } from '../core/constants.js';
import { filterService } from '../services/filterService.js';
import { collectionService } from '../services/collectionService.js';
import { stateManager } from '../core/stateManager.js';

export function createHomeView() {
  const view = document.createElement('div');
  view.className = 'home-view';

  // === Game Title ===
  const gameHeader = document.createElement('div');
  gameHeader.className = 'home-game-header';
  const title = document.createElement('h1');
  title.className = 'home-game-title';
  title.textContent = 'Reepo';
  const subtitle = document.createElement('p');
  subtitle.className = 'home-game-subtitle';
  subtitle.textContent = 'Random GitHub Repo Discovery';
  gameHeader.appendChild(title);
  gameHeader.appendChild(subtitle);
  view.appendChild(gameHeader);

  // === Player Stats Bar ===
  const playerBar = document.createElement('div');
  playerBar.className = 'home-player-bar';

  const state = stateManager.getState();
  const gamification = state.gamification || { xp: 0, level: 1, currentStreak: 0 };
  const xpInLevel = gamification.xp % 100;
  const xpMax = 100;

  // Level
  const levelDiv = document.createElement('div');
  levelDiv.className = 'player-level';
  const levelBadge = document.createElement('div');
  levelBadge.className = 'level-badge';
  levelBadge.textContent = gamification.level;
  const levelInfo = document.createElement('div');
  levelInfo.className = 'level-info';
  const levelLabel = document.createElement('span');
  levelLabel.className = 'level-label';
  levelLabel.textContent = 'LEVEL';
  const levelNum = document.createElement('span');
  levelNum.className = 'level-number';
  levelNum.textContent = gamification.level;
  levelInfo.appendChild(levelLabel);
  levelInfo.appendChild(levelNum);
  levelDiv.appendChild(levelBadge);
  levelDiv.appendChild(levelInfo);
  playerBar.appendChild(levelDiv);

  // XP Bar
  const xpDiv = document.createElement('div');
  xpDiv.className = 'player-xp';
  const xpTop = document.createElement('div');
  xpTop.className = 'xp-top';
  const xpLabel = document.createElement('span');
  xpLabel.className = 'xp-label';
  xpLabel.textContent = 'XP';
  const xpValue = document.createElement('span');
  xpValue.className = 'xp-value';
  xpValue.textContent = `${gamification.xp} XP`;
  xpTop.appendChild(xpLabel);
  xpTop.appendChild(xpValue);
  const xpBar = document.createElement('div');
  xpBar.className = 'xp-bar';
  const xpFill = document.createElement('div');
  xpFill.className = 'xp-fill';
  xpFill.style.width = `${Math.min((xpInLevel / xpMax) * 100, 100)}%`;
  xpBar.appendChild(xpFill);
  xpDiv.appendChild(xpTop);
  xpDiv.appendChild(xpBar);
  playerBar.appendChild(xpDiv);

  // Streak
  const streakDiv = document.createElement('div');
  streakDiv.className = 'player-streak';
  streakDiv.innerHTML = `🔥 ${gamification.currentStreak || 0} day streak`;
  playerBar.appendChild(streakDiv);

  view.appendChild(playerBar);

  // === SPIN Button ===
  const spinArea = document.createElement('div');
  spinArea.className = 'home-spin-area';

  const spinBtn = document.createElement('button');
  spinBtn.className = 'home-spin-btn';
  spinBtn.innerHTML = '<span class="spin-icon">🎲</span><span class="spin-label">SPIN</span>';
  spinBtn.addEventListener('click', startDiscovery);

  const spinHint = document.createElement('p');
  spinHint.className = 'spin-hint';
  spinHint.innerHTML = 'or press <kbd>Space</kbd> to spin';

  spinArea.appendChild(spinBtn);
  spinArea.appendChild(spinHint);
  view.appendChild(spinArea);

  // === Quick Stats ===
  const statsGrid = document.createElement('div');
  statsGrid.className = 'home-stats-grid';

  const savedCount = collectionService.getSavedRepositories().length;
  const historyCount = (state.discovery?.history || []).length;
  const collectionsCount = collectionService.getCollections().length;
  const viewCount = Object.values(state.viewCounts || {}).reduce((a, b) => a + b, 0);

  const stats = [
    { icon: '📁', label: 'SAVED', value: savedCount },
    { icon: '🕒', label: 'VIEWED', value: historyCount },
    { icon: '📚', label: 'COLLECTIONS', value: collectionsCount },
    { icon: '👁️', label: 'TOTAL VIEWS', value: viewCount }
  ];

  stats.forEach(stat => {
    const item = document.createElement('div');
    item.className = 'home-stat-item';
    item.innerHTML = `
      <span class="stat-item-icon">${stat.icon}</span>
      <span class="stat-item-value">${stat.value}</span>
      <span class="stat-item-label">${stat.label}</span>
    `;
    statsGrid.appendChild(item);
  });

  view.appendChild(statsGrid);

  // === Advanced Filters Toggle ===
  const filtersToggle = document.createElement('button');
  filtersToggle.className = 'home-filters-toggle';
  filtersToggle.innerHTML = '⚙️ Advanced Filters';
  filtersToggle.addEventListener('click', () => {
    const body = view.querySelector('.home-filters-body');
    body.classList.toggle('open');
    filtersToggle.textContent = body.classList.contains('open') ? '⚙️ Hide Filters' : '⚙️ Advanced Filters';
  });
  view.appendChild(filtersToggle);

  // === Filters Body ===
  const filtersBody = document.createElement('div');
  filtersBody.className = 'home-filters-body';

  // Row 1: Language + Min Stars
  const row1 = document.createElement('div');
  row1.className = 'filter-row';

  const langGroup = createFilterGroup('Language', 'select', '', SUPPORTED_LANGUAGES, (val) => {
    filterService.setFilter('language', val);
    eventBus.emit(EVENTS.FILTER_APPLIED);
  });
  row1.appendChild(langGroup);

  const starsGroup = createFilterGroup('Min Stars', 'number', '0', null, (val) => {
    filterService.setFilter('minStars', parseInt(val) || 0);
    eventBus.emit(EVENTS.FILTER_APPLIED);
  });
  row1.appendChild(starsGroup);
  filtersBody.appendChild(row1);

  // Row 2: Updated Within + Discovery Mode
  const row2 = document.createElement('div');
  row2.className = 'filter-row';

  const updateGroup = createFilterGroup('Updated', 'select', 'any', UPDATE_RANGES.map(r => ({ value: r.value, label: r.label })), (val) => {
    filterService.setFilter('updatedWithin', val);
    eventBus.emit(EVENTS.FILTER_APPLIED);
  });
  row2.appendChild(updateGroup);

  const modeGroup = createFilterGroup('Mode', 'select', state.discovery.mode, Object.entries(DISCOVERY_MODE_LABELS).map(([k, v]) => ({ value: k, label: v })), (val) => {
    eventBus.emit(EVENTS.DISCOVERY_MODE_CHANGED, { mode: val });
  });
  row2.appendChild(modeGroup);
  filtersBody.appendChild(row2);

  // Toggles
  const toggles = document.createElement('div');
  toggles.className = 'filter-toggles';

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
  toggles.appendChild(forkToggle);

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
  toggles.appendChild(archToggle);

  filtersBody.appendChild(toggles);

  // Actions
  const actions = document.createElement('div');
  actions.className = 'filter-actions';

  const applyBtn = document.createElement('button');
  applyBtn.className = 'btn btn-primary btn-small';
  applyBtn.textContent = '🎲 Spin with Filters';
  applyBtn.addEventListener('click', startDiscovery);
  actions.appendChild(applyBtn);

  const resetBtn = document.createElement('button');
  resetBtn.className = 'btn btn-ghost btn-small';
  resetBtn.textContent = 'Reset';
  resetBtn.addEventListener('click', () => {
    filterService.resetFilters();
    const selects = filtersBody.querySelectorAll('select');
    selects.forEach(s => s.value = '');
    const inputs = filtersBody.querySelectorAll('input[type="number"]');
    inputs.forEach(i => i.value = '');
    forkCheck.checked = true;
    archCheck.checked = true;
    eventBus.emit(EVENTS.FILTER_RESET);
  });
  actions.appendChild(resetBtn);

  filtersBody.appendChild(actions);
  view.appendChild(filtersBody);

  return view;
}

function createFilterGroup(label, type, defaultValue, options, onChange) {
  const group = document.createElement('div');
  group.className = 'filter-group';

  const lbl = document.createElement('label');
  lbl.className = 'filter-label';
  lbl.textContent = label;
  group.appendChild(lbl);

  if (type === 'select') {
    const select = document.createElement('select');
    select.className = 'filter-select';
    const allOpt = document.createElement('option');
    allOpt.value = '';
    allOpt.textContent = `All ${label}`;
    select.appendChild(allOpt);
    (options || []).forEach(opt => {
      const el = document.createElement('option');
      if (typeof opt === 'string') {
        el.value = opt;
        el.textContent = opt;
      } else {
        el.value = opt.value;
        el.textContent = opt.label;
      }
      if (el.value === defaultValue) el.selected = true;
      select.appendChild(el);
    });
    select.addEventListener('change', (e) => onChange(e.target.value));
    group.appendChild(select);
  } else {
    const input = document.createElement('input');
    input.type = type;
    input.className = 'filter-input';
    input.value = defaultValue;
    input.placeholder = '0';
    input.addEventListener('change', (e) => onChange(e.target.value));
    group.appendChild(input);
  }

  return group;
}

function startDiscovery() {
  stateManager.setState('currentView', 'discovery');
  eventBus.emit(EVENTS.VIEW_CHANGED, { view: 'discovery' });
  eventBus.emit(EVENTS.REQUEST_NEXT_REPOSITORY);
}