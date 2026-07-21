import { eventBus } from '../core/eventBus.js';
import { stateManager } from '../core/stateManager.js';
import { repositoryService } from '../services/repositoryService.js';
import { filterService } from '../services/filterService.js';
import { discoveryQueueService } from '../services/discoveryQueueService.js';
import { storage } from '../core/storage.js';
import { EVENTS, RECENT_REPOS_LIMIT, DISCOVERY_MODES, STORAGE_KEYS } from '../core/constants.js';

let initialized = false;

export async function startDiscovery() {
  if (initialized) return;

  // Load persisted history/mode
  const savedMode = storage.getItem(STORAGE_KEYS.DISCOVERY_MODE);
  if (savedMode && Object.values(DISCOVERY_MODES).includes(savedMode)) {
    stateManager.setState('discovery.mode', savedMode);
  }
  const savedHistory = storage.getItem(STORAGE_KEYS.DISCOVERY_HISTORY);
  if (savedHistory) stateManager.setState('discovery.history', savedHistory);
  const savedRecent = storage.getItem(STORAGE_KEYS.RECENTLY_VIEWED);
  if (savedRecent) stateManager.setState('recentlyViewed', savedRecent);
  const savedCounts = storage.getItem(STORAGE_KEYS.VIEW_COUNTS);
  if (savedCounts) stateManager.setState('viewCounts', savedCounts);

  eventBus.on(EVENTS.APP_INITIALIZED, async () => {
    eventBus.emit(EVENTS.DISCOVERY_STARTED);
    await discoveryQueueService.refillQueue();
    await loadNextFromQueue();
  });

  eventBus.on(EVENTS.REQUEST_NEXT_REPOSITORY, async () => {
    await loadNextFromQueue();
  });

  eventBus.on(EVENTS.FILTER_APPLIED, async () => {
    await discoveryQueueService.refillQueue();
    await loadNextFromQueue();
  });

  eventBus.on(EVENTS.DISCOVERY_MODE_CHANGED, async ({ mode }) => {
    stateManager.setState('discovery.mode', mode);
    storage.setItem(STORAGE_KEYS.DISCOVERY_MODE, mode);
    await discoveryQueueService.refillQueue();
    await loadNextFromQueue();
  });

  initialized = true;
}

async function loadNextFromQueue() {
  eventBus.emit(EVENTS.DISCOVERY_LOADING);
  if (!repositoryService.loaded) {
    const result = await repositoryService.loadRepositories();
    if (!result.success) {
      eventBus.emit(EVENTS.DISCOVERY_FAILED, { error: 'Failed to load repositories' });
      return;
    }
  }

  let repo = discoveryQueueService.getNextFromQueue();
  if (!repo) {
    await discoveryQueueService.refillQueue();
    repo = discoveryQueueService.getNextFromQueue();
  }
  if (!repo) {
    eventBus.emit(EVENTS.DISCOVERY_FAILED, { error: 'No repositories match filters' });
    return;
  }

  // Update view count
  stateManager.updateState('viewCounts', counts => ({ ...counts, [repo.id]: (counts?.[repo.id] || 0) + 1 }));
  storage.setItem(STORAGE_KEYS.VIEW_COUNTS, stateManager.getState().viewCounts);

  // History
  stateManager.updateState('discovery.history', h => [repo, ...(h||[])].slice(0, RECENT_REPOS_LIMIT));
  storage.setItem(STORAGE_KEYS.DISCOVERY_HISTORY, stateManager.getState().discovery.history);

  // Recently viewed
  stateManager.updateState('recentlyViewed', rv => {
    const filtered = (rv||[]).filter(r => r.id !== repo.id);
    return [repo, ...filtered].slice(0, 5);
  });
  storage.setItem(STORAGE_KEYS.RECENTLY_VIEWED, stateManager.getState().recentlyViewed);

  stateManager.setState('discovery.currentRepository', repo);
  stateManager.updateState('discovery.count', c => c + 1);

  eventBus.emit(EVENTS.REPOSITORY_CHANGED, { repository: repo });
  eventBus.emit(EVENTS.DISCOVERY_COMPLETED, { repository: repo });
  eventBus.emit(EVENTS.DISCOVERY_HISTORY_UPDATED, { history: stateManager.getState().discovery.history });
  eventBus.emit(EVENTS.RECENT_VIEW_UPDATED, { recentlyViewed: stateManager.getState().recentlyViewed });
}

export function openRepoFromHistory(repo) {
  stateManager.setState('discovery.currentRepository', repo);
  stateManager.updateState('discovery.history', h => [repo, ...(h||[])].slice(0, RECENT_REPOS_LIMIT));
  eventBus.emit(EVENTS.DISCOVERY_COMPLETED, { repository: repo });
}

export function clearHistory() {
  stateManager.setState('discovery.history', []);
  stateManager.setState('recentlyViewed', []);
  storage.setItem(STORAGE_KEYS.DISCOVERY_HISTORY, []);
  storage.setItem(STORAGE_KEYS.RECENTLY_VIEWED, []);
  eventBus.emit(EVENTS.HISTORY_CLEARED);
}

export function removeFromHistory(repoId) {
  stateManager.updateState('discovery.history', h => (h||[]).filter(r => r.id !== repoId));
  stateManager.updateState('recentlyViewed', rv => (rv||[]).filter(r => r.id !== repoId));
  storage.setItem(STORAGE_KEYS.DISCOVERY_HISTORY, stateManager.getState().discovery.history);
  storage.setItem(STORAGE_KEYS.RECENTLY_VIEWED, stateManager.getState().recentlyViewed);
}