import { eventBus } from '../core/eventBus.js';
import { stateManager } from '../core/stateManager.js';
import { repositoryService } from '../services/repositoryService.js';
import { EVENTS, RECENT_REPOS_LIMIT, DISCOVERY_MODES } from '../core/constants.js';

let initialized = false;

export async function startDiscovery() {
  if (initialized) return;
  
  eventBus.on(EVENTS.APP_INITIALIZED, async () => {
    eventBus.emit(EVENTS.DISCOVERY_STARTED);
    await loadNextRepository();
  });
  
  // Listen for UI requests to load next repository (decoupled from UI layer)
  eventBus.on(EVENTS.REQUEST_NEXT_REPOSITORY, async () => {
    await loadNextRepository();
  });
  
  initialized = true;
}

export async function loadNextRepository() {
  eventBus.emit(EVENTS.DISCOVERY_LOADING);
  
  // Load repos if not loaded yet
  if (!repositoryService.loaded) {
    const result = await repositoryService.loadRepositories();
    if (!result.success) {
      eventBus.emit(EVENTS.DISCOVERY_FAILED, { error: result.error || 'Failed to load repositories' });
      return;
    }
  }
  
  // Build exclude list from state history (single source of truth)
  const state = stateManager.getState();
  const history = state.discovery.history || [];
  const excludeIds = history.map(repo => repo.id).slice(0, RECENT_REPOS_LIMIT);
  
  // Get random repo excluding recent ones
  const repoResult = repositoryService.getRandomRepository(excludeIds);
  if (!repoResult.success) {
    eventBus.emit(EVENTS.DISCOVERY_FAILED, { error: repoResult.error || 'Could not find a repository' });
    return;
  }
  
  const repo = repoResult.repository;
  
  // Update state
  stateManager.setState('discovery.currentRepository', repo);
  stateManager.updateState('discovery.history', history => {
    const newHistory = [repo, ...history].slice(0, RECENT_REPOS_LIMIT);
    return newHistory;
  });
  stateManager.updateState('discovery.count', count => count + 1);
  
  // Emit events
  eventBus.emit(EVENTS.REPOSITORY_CHANGED, { repository: repo });
  eventBus.emit(EVENTS.DISCOVERY_COMPLETED, { repository: repo });
  eventBus.emit(EVENTS.DISCOVERY_HISTORY_UPDATED, { 
    history: stateManager.getState().discovery.history 
  });
}