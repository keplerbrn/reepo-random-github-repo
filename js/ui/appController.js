import { eventBus } from '../core/eventBus.js';
import { EVENTS } from '../core/constants.js';
import { stateManager } from '../core/stateManager.js';
import { createRepositoryCard } from './repositoryCard.js';
import { createCollectionsView } from './collectionsView.js';
import { createFilterPanel } from './filterPanel.js';
import { createSearchBar } from './searchBar.js';
import { createHistoryPanel } from './historyPanel.js';
import { createDiscoveryModeSelector } from './discoveryModeSelector.js';
import { createProfileView } from './profileView.js';
import { createProfileEditor } from './profileEditor.js';
import { createStatisticsDashboard } from './statisticsDashboard.js';
import { createSettingsPanel } from './settingsPanel.js';
import { createHomeView } from './homeView.js';

import { initializeCollectionsFeature } from '../features/collections/index.js';
import { initializeFiltersFeature } from '../features/filters/index.js';
import { initializeSearchFeature } from '../features/search/index.js';
import { initializeProfileFeature } from '../features/profiile/index.js';
import { initializeStatisticsFeature } from '../features/statistics/index.js';
import { initializeSettingsFeature } from '../features/settings/index.js';
import { openRepoFromHistory, clearHistory, removeFromHistory } from '../features/discovery.js';

import { localization } from '../core/localization.js';
import { reactionService } from '../services/reactionService.js';
import { collectionService } from '../services/collectionService.js';
import { filterService } from '../services/filterService.js';
import { profileService } from '../services/profileService.js';

let collectionsFeature, filtersFeature, searchFeature, profileFeature, statisticsFeature, settingsFeature;
let isInitialized = false;

export function initializeAppController() {
  if (isInitialized) return;
  isInitialized = true;

  const mainContent = document.getElementById('main-content');
  
  // Header buttons
  const collectionsBtn = document.getElementById('collections-btn');
  const dashboardBtn = document.getElementById('dashboard-btn');
  const profileBtn = document.getElementById('profile-btn');
  const settingsBtn = document.getElementById('settings-btn');
  
  // Footer buttons
  const filterToggleBtn = document.getElementById('filter-toggle-btn');
  const historyToggleBtn = document.getElementById('history-toggle-btn');
  const homeBtn = document.getElementById('home-btn');
  
  // Modal elements
  const profileModal = document.getElementById('profile-modal');
  const profileContent = document.getElementById('profile-content');
  const closeModal = document.getElementById('close-profile-modal');
  const settingsModal = document.getElementById('settings-modal');
  const settingsContent = document.getElementById('settings-content');
  const closeSettingsBtn = document.getElementById('close-settings-modal');

  // Initialize features
  collectionsFeature = initializeCollectionsFeature();
  filtersFeature = initializeFiltersFeature(() => {});
  searchFeature = initializeSearchFeature();
  profileFeature = initializeProfileFeature();
  statisticsFeature = initializeStatisticsFeature();
  settingsFeature = initializeSettingsFeature();

  // --- Profile Modal ---
  profileBtn?.addEventListener('click', () => openProfileModal());
  closeModal?.addEventListener('click', () => {
    if (profileModal) profileModal.style.display = 'none';
    eventBus.emit(EVENTS.PROFILE_CLOSED);
  });

  window.addEventListener('click', (e) => {
    if (e.target === profileModal) {
      profileModal.style.display = 'none';
      eventBus.emit(EVENTS.PROFILE_CLOSED);
    }
    if (e.target === settingsModal) {
      settingsModal.style.display = 'none';
    }
  });

  // --- Settings ---
  settingsBtn?.addEventListener('click', () => {
    renderSettingsPanel();
    if (settingsModal) settingsModal.style.display = 'block';
  });
  closeSettingsBtn?.addEventListener('click', () => {
    if (settingsModal) settingsModal.style.display = 'none';
  });

  function openProfileModal(editing = false) {
    if (!profileModal) return;
    if (!profileService.isProfileComplete()) {
      renderProfileEditor();
    } else if (editing) {
      renderProfileEditor();
    } else {
      renderProfileView();
    }
    profileModal.style.display = 'block';
    eventBus.emit(EVENTS.PROFILE_OPENED);
  }

  function renderProfileView() {
    if (!profileContent) return;
    profileContent.innerHTML = '';
    const profile = profileService.getProfile();
    const summary = profileService.getProfileSummary();
    const activity = profileService.getActivity();
    const view = createProfileView(
      profile, summary, activity,
      () => openProfileModal(true),
      profileFeature.onExport,
      profileFeature.onImport,
      profileFeature.onReset
    );
    profileContent.appendChild(view);
  }

  function renderProfileEditor() {
    if (!profileContent) return;
    profileContent.innerHTML = '';
    const profile = profileService.getProfile() || { username: '', avatar: 'default' };
    const editor = createProfileEditor(
      profile,
      (updates) => {
        if (!profileService.isProfileComplete()) {
          profileService.createProfile(updates.username);
          eventBus.emit(EVENTS.PROFILE_CREATED);
        } else {
          profileFeature.onSaveProfile(updates);
        }
        renderProfileView();
      },
      () => {
        if (!profileService.isProfileComplete()) {
          if (profileModal) profileModal.style.display = 'none';
        } else {
          renderProfileView();
        }
      }
    );
    profileContent.appendChild(editor);
  }

  function renderSettingsPanel() {
    if (!settingsContent) return;
    settingsContent.innerHTML = '';
    const settings = stateManager.getState().settings;
    const panel = createSettingsPanel(
      settings,
      settingsFeature.onUpdateSetting,
      settingsFeature.onExportAll,
      settingsFeature.onImportAll,
      settingsFeature.onClearCache,
      settingsFeature.onReset
    );
    settingsContent.appendChild(panel);
  }

  // --- Navigation ---
  homeBtn?.addEventListener('click', () => {
    stateManager.setState('currentView', 'home');
    eventBus.emit(EVENTS.VIEW_CHANGED, { view: 'home' });
  });

  collectionsBtn?.addEventListener('click', () => {
    const cv = stateManager.getState().currentView;
    const nextView = cv === 'collections' ? 'discovery' : 'collections';
    stateManager.setState('currentView', nextView);
    eventBus.emit(EVENTS.VIEW_CHANGED, { view: nextView });
  });

  dashboardBtn?.addEventListener('click', () => {
    stateManager.setState('currentView', 'dashboard');
    eventBus.emit(EVENTS.VIEW_CHANGED, { view: 'dashboard' });
  });

  filterToggleBtn?.addEventListener('click', () => {
    const cv = stateManager.getState().currentView;
    const nextView = cv === 'filters' ? 'discovery' : 'filters';
    stateManager.setState('currentView', nextView);
    eventBus.emit(EVENTS.VIEW_CHANGED, { view: nextView });
    filterToggleBtn.classList.toggle('active', nextView === 'filters');
  });

  historyToggleBtn?.addEventListener('click', () => {
    const cv = stateManager.getState().currentView;
    const nextView = cv === 'history' ? 'discovery' : 'history';
    stateManager.setState('currentView', nextView);
    eventBus.emit(EVENTS.VIEW_CHANGED, { view: nextView });
    historyToggleBtn.classList.toggle('active', nextView === 'history');
  });

  // --- Search Bar ---
  const searchContainer = document.getElementById('search-container');
  if (searchContainer) {
    const searchBar = createSearchBar(searchFeature.onSearch);
    searchContainer.appendChild(searchBar);
  }

  // --- Discovery Mode Bar (footer) ---
  renderDiscoveryModeBar();

  // --- Event Listeners ---
  eventBus.on(EVENTS.DISCOVERY_LOADING, () => {
    if (stateManager.getState().currentView === 'discovery') showLoading(mainContent);
  });

  eventBus.on(EVENTS.DISCOVERY_COMPLETED, (data) => {
    if (stateManager.getState().currentView === 'discovery') renderRepository(mainContent, data.repository);
  });

  eventBus.on(EVENTS.DISCOVERY_FAILED, (data) => {
    if (stateManager.getState().currentView === 'discovery') showError(mainContent, data.error);
  });

  eventBus.on(EVENTS.VIEW_CHANGED, ({ view }) => {
    // Reset active states
    filterToggleBtn?.classList.remove('active');
    historyToggleBtn?.classList.remove('active');
    homeBtn?.classList.remove('active');

    if (view === 'home') {
      renderHomeView(mainContent);
      homeBtn?.classList.add('active');
    } else if (view === 'collections') {
      renderCollectionsView(mainContent);
    } else if (view === 'dashboard') {
      renderDashboard(mainContent);
    } else if (view === 'filters') {
      renderFilterPage(mainContent);
      filterToggleBtn?.classList.add('active');
    } else if (view === 'history') {
      renderHistoryPage(mainContent);
      historyToggleBtn?.classList.add('active');
    } else {
      // discovery - sadece REQUEST_NEXT_REPOSITORY fırlat
      eventBus.emit(EVENTS.REQUEST_NEXT_REPOSITORY);
    }
  });

  // Collections events
  [EVENTS.COLLECTION_CREATED, EVENTS.COLLECTION_UPDATED, EVENTS.COLLECTION_DELETED,
   EVENTS.REPOSITORY_SAVED, EVENTS.REPOSITORY_REMOVED, EVENTS.IMPORT_COMPLETED].forEach(ev => {
    eventBus.on(ev, () => {
      if (stateManager.getState().currentView === 'collections') renderCollectionsView(mainContent);
    });
  });

  eventBus.on(EVENTS.FILTER_APPLIED, () => updateActiveFilterBadge());
  eventBus.on(EVENTS.FILTER_RESET, () => updateActiveFilterBadge());

  eventBus.on(EVENTS.HISTORY_CLEARED, () => {
    if (stateManager.getState().currentView === 'history') renderHistoryPage(mainContent);
  });

  eventBus.on(EVENTS.PROFILE_UPDATED, () => {
    if (profileModal && profileModal.style.display === 'block') renderProfileView();
  });

  eventBus.on(EVENTS.PROFILE_RESET, () => {
    if (profileModal) profileModal.style.display = 'none';
  });

  // --- Keyboard Shortcuts ---
  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) return;
    if (profileModal && profileModal.style.display === 'block') return;

    let s = null, a = null;
    switch (e.code) {
      case 'Space':
        e.preventDefault();
        s = 'Space';
        const cv = stateManager.getState().currentView;
        if (cv === 'home') {
          // Home'dan discovery'e geç
          stateManager.setState('currentView', 'discovery');
          eventBus.emit(EVENTS.VIEW_CHANGED, { view: 'discovery' });
        } else if (cv === 'discovery') {
          // Discovery'deyken direkt yeni repo iste
          eventBus.emit(EVENTS.REQUEST_NEXT_REPOSITORY);
        }
        break;
      case 'Escape':
        s = 'ESC';
        const cv2 = stateManager.getState().currentView;
        if (cv2 === 'filters' || cv2 === 'history') {
          stateManager.setState('currentView', 'discovery');
          eventBus.emit(EVENTS.VIEW_CHANGED, { view: 'discovery' });
        }
        break;
      case 'KeyS':
        if (!e.ctrlKey && !e.metaKey) { s = 'S'; a = 'save-repository'; }
        break;
      case 'KeyL':
        if (!e.ctrlKey && !e.metaKey) { s = 'L'; a = 'like-repository'; }
        break;
      case 'KeyD':
        if (!e.ctrlKey && !e.metaKey) { s = 'D'; a = 'dislike-repository'; }
        break;
      case 'KeyF':
        if (!e.ctrlKey && !e.metaKey) { s = 'F'; filterToggleBtn?.click(); }
        break;
      case 'KeyH':
        if (!e.ctrlKey && !e.metaKey) { s = 'H'; historyToggleBtn?.click(); }
        break;
      case 'KeyM':
        if (!e.ctrlKey && !e.metaKey) { s = 'M'; homeBtn?.click(); }
        break;
    }
    if (s) {
      eventBus.emit(EVENTS.KEYBOARD_SHORTCUT_TRIGGERED, { shortcut: s });
      if (a) triggerActionButton(a);
    }
  });
}

// --- Helpers ---
function triggerActionButton(action) {
  const btn = document.querySelector(`.repository-card .btn[data-action="${action}"]`);
  if (btn) {
    btn.click();
    btn.classList.add('keyboard-active');
    setTimeout(() => btn.classList.remove('keyboard-active'), 150);
    return true;
  }
  return false;
}

function showLoading(container) {
  if (!container) return;
  container.innerHTML = `<div class="card-skeleton"><div class="skeleton-header"></div><div class="skeleton-description"></div><div class="skeleton-stats"></div><div class="skeleton-actions"></div></div>`;
}

function renderRepository(container, repo) {
  if (!container || !repo) return;
  container.innerHTML = '';
  container.appendChild(createRepositoryCard(repo, reactionService.getReaction(repo.id), collectionService.isSaved(repo.id)));
  eventBus.emit(EVENTS.REPOSITORY_RENDERED, { repository: repo });
}

function renderHomeView(container) {
  if (!container) return;
  container.innerHTML = '';
  container.appendChild(createHomeView());
}

function renderCollectionsView(container) {
  if (!container) return;
  container.innerHTML = '';
  const collections = collectionService.getCollections();
  const savedRepos = collectionService.getSavedRepositories();
  // createCollectionsView expects: collections, savedRepos, statsMap, onSearch, onSort, onCreateCollection, onRenameCollection, onDeleteCollection, onSelectCollection, onRemoveRepo, onExport, onImport
  const view = createCollectionsView(
    collections,
    savedRepos,
    {}, // statsMap
    () => {}, // onSearch
    () => {}, // onSort
    () => eventBus.emit(EVENTS.COLLECTION_CREATED), // onCreateCollection
    () => {}, // onRenameCollection
    () => {}, // onDeleteCollection
    () => {}, // onSelectCollection
    () => {}, // onRemoveRepo
    () => {}, // onExport
    () => {}  // onImport
  );
  container.appendChild(view);
}

function renderDashboard(container) {
  if (!container) return;
  container.innerHTML = '';
  const stats = statisticsFeature?.getStatsData?.() || {};
  const dashboard = createStatisticsDashboard(stats, statisticsFeature?.exportStats);
  container.appendChild(dashboard);
  eventBus.emit(EVENTS.DASHBOARD_OPENED);
}

function renderFilterPage(container) {
  if (!container) return;
  container.innerHTML = '';
  const pageDiv = document.createElement('div');
  pageDiv.className = 'panel-page filter-panel-page';
  const filterContent = createFilterPanel(
    filterService.getFilters(),
    (key, val) => {
      filtersFeature.onFilterChange(key, val);
      updateActiveFilterBadge();
    },
    () => {
      filtersFeature.onReset();
      updateActiveFilterBadge();
    }
  );
  pageDiv.appendChild(filterContent);
  container.appendChild(pageDiv);
}

function renderHistoryPage(container) {
  if (!container) return;
  container.innerHTML = '';
  const state = stateManager.getState();
  const historyContainer = document.createElement('div');
  historyContainer.className = 'panel-page history-panel-page';

  const header = document.createElement('div');
  header.className = 'panel-header';
  const title = document.createElement('h2');
  title.textContent = localization.t('history.title') || 'History';
  const closeBtn = document.createElement('button');
  closeBtn.className = 'panel-close';
  closeBtn.textContent = '✕ Back';
  closeBtn.addEventListener('click', () => {
    stateManager.setState('currentView', 'discovery');
    eventBus.emit(EVENTS.VIEW_CHANGED, { view: 'discovery' });
  });
  header.appendChild(title);
  header.appendChild(closeBtn);
  historyContainer.appendChild(header);

  const historyContent = createHistoryPanel(
    state.discovery?.history || [],
    state.recentlyViewed || [],
    (repo) => {
      openRepoFromHistory(repo);
      stateManager.setState('currentView', 'discovery');
      eventBus.emit(EVENTS.VIEW_CHANGED, { view: 'discovery' });
    },
    removeFromHistory,
    clearHistory
  );
  historyContainer.appendChild(historyContent);
  container.appendChild(historyContainer);
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
  if (!container) return;
  container.innerHTML = `<div class="error-state" role="alert" tabindex="-1"><p>Something went wrong</p><p class="error-details">${error || 'Unknown error'}</p><button class="btn btn-primary" id="retry-btn">Try Again</button></div>`;
  document.getElementById('retry-btn')?.addEventListener('click', () => eventBus.emit(EVENTS.REQUEST_NEXT_REPOSITORY));
  container.querySelector('.error-state')?.focus();
}