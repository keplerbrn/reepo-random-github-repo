import { eventBus } from '../core/eventBus.js';
import { EVENTS, DISCOVERY_MODES } from '../core/constants.js';
import { stateManager } from '../core/stateManager.js';
import { createRepositoryCard } from './repositoryCard.js';
import { createCollectionsView } from './collectionsView.js';
import { createFilterPanel } from './filterPanel.js';
import { createSearchBar } from './searchBar.js';
import { createHistoryPanel } from './historyPanel.js';
import { createDiscoveryModeSelector } from './discoveryModeSelector.js';
import { initializeCollectionsFeature } from '../features/collections/index.js';
import { initializeFiltersFeature } from '../features/filters/index.js';
import { initializeSearchFeature } from '../features/search/index.js';
import { openRepoFromHistory, clearHistory, removeFromHistory } from '../features/discovery.js';
import { localization } from '../core/localization.js';
import { reactionService } from '../services/reactionService.js';
import { collectionService } from '../services/collectionService.js';
import { filterService } from '../services/filterService.js';

let collectionsFeature, filtersFeature, searchFeature;
let historyVisible = false;

export function initializeAppController() {
  const mainContent = document.getElementById('main-content');
  const collectionsBtn = document.getElementById('collections-btn');
  const filterToggleBtn = document.getElementById('filter-toggle-btn');
  const historyToggleBtn = document.getElementById('history-toggle-btn');

  collectionsFeature = initializeCollectionsFeature();
  filtersFeature = initializeFiltersFeature(() => {});
  searchFeature = initializeSearchFeature();

  // View switching
  collectionsBtn?.addEventListener('click', () => {
    const cv = stateManager.getState().currentView;
    stateManager.setState('currentView', cv === 'collections' ? 'discovery' : 'collections');
    eventBus.emit(EVENTS.VIEW_CHANGED, { view: cv === 'collections' ? 'discovery' : 'collections' });
  });

  // Filter toggle
  filterToggleBtn?.addEventListener('click', () => {
    const panel = document.getElementById('filter-panel-container');
    panel.style.display = panel.style.display === 'block' ? 'none' : 'block';
    filterToggleBtn.classList.toggle('active', panel.style.display === 'block');
    eventBus.emit(panel.style.display === 'block' ? EVENTS.FILTER_PANEL_OPENED : EVENTS.FILTER_PANEL_CLOSED);
  });

  // History toggle
  historyToggleBtn?.addEventListener('click', () => {
    historyVisible = !historyVisible;
    const container = document.getElementById('history-panel-container');
    container.style.display = historyVisible ? 'block' : 'none';
    historyToggleBtn.classList.toggle('active', historyVisible);
    eventBus.emit(historyVisible ? EVENTS.HISTORY_OPENED : EVENTS.HISTORY_OPENED); // using existing event
    if (historyVisible) renderHistoryPanel();
  });

  renderFilterPanel();
  renderDiscoveryModeBar();

  // Search bar
  const searchContainer = document.getElementById('search-container');
  if (searchContainer) {
    const searchBar = createSearchBar(searchFeature.onSearch);
    searchContainer.appendChild(searchBar);
  }

  eventBus.on(EVENTS.DISCOVERY_LOADING, () => {
    if (stateManager.getState().currentView === 'discovery') showLoading(mainContent);
  });
  eventBus.on(EVENTS.DISCOVERY_COMPLETED, (data) => {
    if (stateManager.getState().currentView === 'discovery') renderRepository(mainContent, data.repository);
    renderDiscoveryModeBar();
    if (historyVisible) renderHistoryPanel();
  });
  eventBus.on(EVENTS.DISCOVERY_FAILED, (data) => {
    if (stateManager.getState().currentView === 'discovery') showError(mainContent, data.error);
  });
  eventBus.on(EVENTS.VIEW_CHANGED, ({ view }) => {
    if (view === 'collections') {
      renderCollectionsView(mainContent);
      collectionsBtn.textContent = localization.t('nav.discovery');
    } else {
      collectionsBtn.textContent = localization.t('nav.collections');
      eventBus.emit(EVENTS.REQUEST_NEXT_REPOSITORY);
    }
  });
  [EVENTS.COLLECTION_CREATED, EVENTS.COLLECTION_UPDATED, EVENTS.COLLECTION_DELETED,
   EVENTS.REPOSITORY_SAVED, EVENTS.REPOSITORY_REMOVED, EVENTS.IMPORT_COMPLETED].forEach(ev => {
    eventBus.on(ev, () => {
      if (stateManager.getState().currentView === 'collections') renderCollectionsView(mainContent);
    });
  });
  eventBus.on(EVENTS.FILTER_APPLIED, () => { renderFilterPanel(); updateActiveFilterBadge(); });
  eventBus.on(EVENTS.FILTER_RESET, () => { renderFilterPanel(); updateActiveFilterBadge(); });
  eventBus.on(EVENTS.HISTORY_CLEARED, () => { if (historyVisible) renderHistoryPanel(); });
  eventBus.on(EVENTS.SEARCH_CLEARED, () => { if (stateManager.getState().currentView === 'discovery') eventBus.emit(EVENTS.REQUEST_NEXT_REPOSITORY); });

  // Keyboard
  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) return;
    let s = null, a = null;
    switch (e.code) {
      case 'Space': e.preventDefault(); s = 'Space'; eventBus.emit(EVENTS.REQUEST_NEXT_REPOSITORY); break;
      case 'Enter': s = 'Enter'; triggerActionButton('open-github'); break;
      case 'Escape': s = 'ESC'; if (historyVisible) { historyToggleBtn?.click(); } break;
      case 'KeyS': if (!e.ctrlKey && !e.metaKey) { s = 'S'; a = 'save-repository'; } break;
      case 'KeyL': if (!e.ctrlKey && !e.metaKey) { s = 'L'; a = 'like-repository'; } break;
      case 'KeyD': if (!e.ctrlKey && !e.metaKey) { s = 'D'; a = 'dislike-repository'; } break;
      case 'KeyF': if (!e.ctrlKey && !e.metaKey) { s = 'F'; filterToggleBtn?.click(); } break;
      case 'KeyH': if (!e.ctrlKey && !e.metaKey) { s = 'H'; historyToggleBtn?.click(); } break;
    }
    if (s) {
      eventBus.emit(EVENTS.KEYBOARD_SHORTCUT_TRIGGERED, { shortcut: s });
      if (a) triggerActionButton(a);
    }
  });
}

function triggerActionButton(action) {
  const btn = document.querySelector(`.repository-card .btn[data-action="${action}"]`);
  if (btn) { btn.click(); btn.classList.add('keyboard-active'); setTimeout(() => btn.classList.remove('keyboard-active'), 150); return true; }
  return false;
}

function showLoading(container) {
  container.innerHTML = `<div class="card-skeleton" role="status" aria-label="${localization.t('discovery.loading')}"><div class="skeleton-header"></div><div class="skeleton-description"></div><div class="skeleton-stats"></div><div class="skeleton-actions"></div></div>`;
}

function renderRepository(container, repo) {
  container.innerHTML = '';
  container.appendChild(createRepositoryCard(repo, reactionService.getReaction(repo.id), collectionService.isSaved(repo.id)));
  eventBus.emit(EVENTS.REPOSITORY_RENDERED, { repository: repo });
}

function renderCollectionsView(container) { /* ... önceki sprint'teki aynı kod ... */ }

function renderFilterPanel() {
  const container = document.getElementById('filter-panel-container');
  if (!container) return;
  container.innerHTML = '';
  container.appendChild(createFilterPanel(filterService.getFilters(), filtersFeature.onFilterChange, filtersFeature.onReset));
}

function renderHistoryPanel() {
  const container = document.getElementById('history-panel-container');
  if (!container) return;
  container.innerHTML = '';
  const state = stateManager.getState();
  container.appendChild(createHistoryPanel(
    state.discovery?.history || [],
    state.recentlyViewed || [],
    openRepoFromHistory,
    removeFromHistory,
    clearHistory
  ));
}

function renderDiscoveryModeBar() {
  const container = document.getElementById('discovery-mode-container');
  if (!container) return;
  container.innerHTML = '';
  container.appendChild(createDiscoveryModeSelector(
    stateManager.getState().discovery.mode,
    (mode) => eventBus.emit(EVENTS.DISCOVERY_MODE_CHANGED, { mode })
  ));
}

function updateActiveFilterBadge() {
  const badge = document.getElementById('filter-active-count');
  if (badge) {
    const c = filterService.getActiveFilterCount();
    badge.textContent = c || '';
    badge.style.display = c ? 'inline' : 'none';
  }
}

function showError(container, error) {
  container.innerHTML = `<div class="error-state" role="alert" tabindex="-1"><p>${localization.t('discovery.error')}</p><p class="error-details">${error||localization.t('discovery.error')}</p><button class="btn btn-primary" id="retry-btn">${localization.t('discovery.retry')}</button></div>`;
  document.getElementById('retry-btn')?.addEventListener('click', () => eventBus.emit(EVENTS.REQUEST_NEXT_REPOSITORY));
  container.querySelector('.error-state')?.focus();
}