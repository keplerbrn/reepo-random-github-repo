import { eventBus } from '../core/eventBus.js';
import { EVENTS } from '../core/constants.js';
import { stateManager } from '../core/stateManager.js';
import { createRepositoryCard } from './repositoryCard.js';
import { createCollectionsView } from './collectionsView.js';
import { createFilterPanel } from './filterPanel.js';
import { initializeCollectionsFeature } from '../features/collections/index.js';
import { initializeFiltersFeature } from '../features/filters/index.js';
import { localization } from '../core/localization.js';
import { reactionService } from '../services/reactionService.js';
import { collectionService } from '../services/collectionService.js';
import { filterService } from '../services/filterService.js';

let collectionsFeature;
let filtersFeature;
let currentFilterPanel = null;

export function initializeAppController() {
  const mainContent = document.getElementById('main-content');
  const collectionsBtn = document.getElementById('collections-btn');
  const filterToggleBtn = document.getElementById('filter-toggle-btn');

  collectionsFeature = initializeCollectionsFeature();
  filtersFeature = initializeFiltersFeature(() => {
    // Refresh UI after filter changes (will be handled by FILTER_APPLIED event)
  });

  // View switching
  if (collectionsBtn) {
    collectionsBtn.addEventListener('click', () => {
      const currentView = stateManager.getState().currentView;
      const newView = currentView === 'collections' ? 'discovery' : 'collections';
      stateManager.setState('currentView', newView);
      eventBus.emit(EVENTS.VIEW_CHANGED, { view: newView });
    });
  }

  // Filter panel toggle
  if (filterToggleBtn) {
    filterToggleBtn.addEventListener('click', () => {
      const panel = document.getElementById('filter-panel-container');
      if (panel.style.display === 'none' || !panel.style.display) {
        panel.style.display = 'block';
        filterToggleBtn.classList.add('active');
        eventBus.emit(EVENTS.FILTER_PANEL_OPENED);
      } else {
        panel.style.display = 'none';
        filterToggleBtn.classList.remove('active');
        eventBus.emit(EVENTS.FILTER_PANEL_CLOSED);
      }
    });
  }

  // Initial filter panel render
  renderFilterPanel();

  eventBus.on(EVENTS.DISCOVERY_LOADING, () => {
    if (stateManager.getState().currentView === 'discovery') {
      showLoading(mainContent);
    }
  });

  eventBus.on(EVENTS.DISCOVERY_COMPLETED, (data) => {
    if (stateManager.getState().currentView === 'discovery') {
      renderRepository(mainContent, data.repository);
    }
  });

  eventBus.on(EVENTS.DISCOVERY_FAILED, (data) => {
    if (stateManager.getState().currentView === 'discovery') {
      showError(mainContent, data.error);
    }
  });

  eventBus.on(EVENTS.VIEW_CHANGED, ({ view }) => {
    if (view === 'collections') {
      renderCollectionsView(mainContent);
      if (collectionsBtn) collectionsBtn.textContent = localization.t('nav.discovery');
    } else {
      collectionsBtn.textContent = localization.t('nav.collections');
      eventBus.emit(EVENTS.REQUEST_NEXT_REPOSITORY);
    }
  });

  [EVENTS.COLLECTION_CREATED, EVENTS.COLLECTION_UPDATED, EVENTS.COLLECTION_DELETED,
   EVENTS.REPOSITORY_SAVED, EVENTS.REPOSITORY_REMOVED, EVENTS.IMPORT_COMPLETED].forEach(ev => {
    eventBus.on(ev, () => {
      if (stateManager.getState().currentView === 'collections') {
        renderCollectionsView(mainContent);
      }
    });
  });

  eventBus.on(EVENTS.FILTER_APPLIED, () => {
    renderFilterPanel();
    updateActiveFilterBadge();
  });

  eventBus.on(EVENTS.FILTER_RESET, () => {
    renderFilterPanel();
    updateActiveFilterBadge();
  });

  // Keyboard shortcuts
  document.addEventListener('keydown', (event) => {
    if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA' || event.target.isContentEditable) return;
    
    let shortcut = null, targetAction = null;
    switch (event.code) {
      case 'Space':
        event.preventDefault();
        shortcut = 'Space';
        eventBus.emit(EVENTS.REQUEST_NEXT_REPOSITORY);
        break;
      case 'Escape':
        shortcut = 'ESC';
        break;
      case 'KeyS':
        if (!event.ctrlKey && !event.metaKey) { shortcut = 'S'; targetAction = 'save-repository'; }
        break;
      case 'KeyL':
        if (!event.ctrlKey && !event.metaKey) { shortcut = 'L'; targetAction = 'like-repository'; }
        break;
      case 'KeyD':
        if (!event.ctrlKey && !event.metaKey) { shortcut = 'D'; targetAction = 'dislike-repository'; }
        break;
    }
    if (shortcut) {
      eventBus.emit(EVENTS.KEYBOARD_SHORTCUT_TRIGGERED, { shortcut });
      if (targetAction) {
        const triggered = triggerActionButton(targetAction);
        if (!triggered) console.warn(`Shortcut "${shortcut}" but no "${targetAction}" button found.`);
      }
    }
  });
}

function triggerActionButton(action) {
  const button = document.querySelector(`.repository-card .btn[data-action="${action}"]`);
  if (button) {
    button.click();
    button.classList.add('keyboard-active');
    setTimeout(() => button.classList.remove('keyboard-active'), 150);
    return true;
  }
  return false;
}

function showLoading(container) {
  container.innerHTML = '';
  const skeleton = document.createElement('div');
  skeleton.className = 'card-skeleton';
  skeleton.setAttribute('role', 'status');
  skeleton.setAttribute('aria-label', localization.t('discovery.loading'));
  skeleton.innerHTML = `<div class="skeleton-header"></div><div class="skeleton-description"></div><div class="skeleton-stats"></div><div class="skeleton-actions"></div>`;
  container.appendChild(skeleton);
}

function renderRepository(container, repository) {
  container.innerHTML = '';
  const reaction = reactionService.getReaction(repository.id);
  const isSaved = collectionService.isSaved(repository.id);
  const card = createRepositoryCard(repository, reaction, isSaved);
  container.appendChild(card);
  eventBus.emit(EVENTS.REPOSITORY_RENDERED, { repository });
}

function renderCollectionsView(container) {
  container.innerHTML = '';
  const state = stateManager.getState();
  let collections = state.collections || [];
  let savedRepos = state.savedRepositories || [];

  const statsMap = {};
  collections.forEach(col => {
    statsMap[col.id] = collectionService.getCollectionStats(col.id);
  });

  let searchTerm = '';
  let sortType = 'name';

  const filterAndSort = () => {
    let filtered = [...savedRepos];
    if (searchTerm) {
      filtered = filtered.filter(r => r.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    switch (sortType) {
      case 'stars': filtered.sort((a, b) => b.stars - a.stars); break;
      case 'date': filtered.sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated)); break;
      case 'name':
      default: filtered.sort((a, b) => a.name.localeCompare(b.name)); break;
    }
    return filtered;
  };

  const view = createCollectionsView(
    collections, filterAndSort(), statsMap,
    (term) => { searchTerm = term; renderCollectionsView(container); },
    (type) => { sortType = type; renderCollectionsView(container); },
    collectionsFeature.onCreateCollection,
    collectionsFeature.onRenameCollection,
    collectionsFeature.onDeleteCollection,
    collectionsFeature.onSelectCollection,
    collectionsFeature.onRemoveRepo,
    collectionsFeature.onExport,
    collectionsFeature.onImport
  );
  container.appendChild(view);
}

function renderFilterPanel() {
  const container = document.getElementById('filter-panel-container');
  if (!container) return;
  container.innerHTML = '';
  const filters = filterService.getFilters();
  const panel = createFilterPanel(filters, filtersFeature.onFilterChange, filtersFeature.onReset);
  container.appendChild(panel);
}

function updateActiveFilterBadge() {
  const badge = document.getElementById('filter-active-count');
  if (badge) {
    const count = filterService.getActiveFilterCount();
    badge.textContent = count > 0 ? count : '';
    badge.style.display = count > 0 ? 'inline' : 'none';
  }
}

function showError(container, error) {
  container.innerHTML = '';
  const errorDiv = document.createElement('div');
  errorDiv.className = 'error-state';
  errorDiv.setAttribute('role', 'alert');
  errorDiv.setAttribute('tabindex', '-1');
  errorDiv.innerHTML = `
    <p>${localization.t('discovery.error')}</p>
    <p class="error-details">${error || localization.t('discovery.error')}</p>
    <button class="btn btn-primary">${localization.t('discovery.retry')}</button>
  `;
  errorDiv.querySelector('button').addEventListener('click', () => eventBus.emit(EVENTS.REQUEST_NEXT_REPOSITORY));
  container.appendChild(errorDiv);
  errorDiv.focus();
}