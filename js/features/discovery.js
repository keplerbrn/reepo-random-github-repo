import { eventBus } from '../core/eventBus.js';
import { stateManager } from '../core/stateManager.js';
import { repositoryService } from '../services/repositoryService.js';
import { filterService } from '../services/filterService.js';
import { EVENTS, RECENT_REPOS_LIMIT, DISCOVERY_MODES } from '../core/constants.js';

let initialized = false;

export async function startDiscovery() {
  if (initialized) return;
  
  eventBus.on(EVENTS.APP_INITIALIZED, async () => {
    eventBus.emit(EVENTS.DISCOVERY_STARTED);
    await loadNextRepository();
  });
  
  eventBus.on(EVENTS.REQUEST_NEXT_REPOSITORY, async () => {
    await loadNextRepository();
  });
  
  // Reload when filters applied
  eventBus.on(EVENTS.FILTER_APPLIED, async () => {
    await loadNextRepository();
  });
  
  initialized = true;
}

export async function loadNextRepository() {
  eventBus.emit(EVENTS.DISCOVERY_LOADING);
  
  if (!repositoryService.loaded) {
    const result = await repositoryService.loadRepositories();
    if (!result.success) {
      eventBus.emit(EVENTS.DISCOVERY_FAILED, { error: result.error || 'Failed to load repositories' });
      return;
    }
  }
  
  // Get all repos, apply filters
  let allRepos = [];
  for (let i = 0; i < repositoryService.getRepositoryCount(); i++) {
    const res = repositoryService.getRepository(i);
    if (res.success) allRepos.push(res.repository);
  }

  const filteredRepos = filterService.filterRepositories(allRepos);
  
  if (filteredRepos.length === 0) {
    eventBus.emit(EVENTS.DISCOVERY_FAILED, { error: 'No repositories match the current filters.' });
    return;
  }
  
  const state = stateManager.getState();
  const history = state.discovery.history || [];
  const excludeIds = history.map(repo => repo.id).slice(0, RECENT_REPOS_LIMIT);
  const available = filteredRepos.filter(r => !excludeIds.includes(r.id));
  const chosen = available.length > 0 ? available : filteredRepos;
  const randomIndex = Math.floor(Math.random() * chosen.length);
  const repo = { ...chosen[randomIndex] };
  
  stateManager.setState('discovery.currentRepository', repo);
  stateManager.updateState('discovery.history', history => {
    return [repo, ...history].slice(0, RECENT_REPOS_LIMIT);
  });
  stateManager.updateState('discovery.count', count => count + 1);
  
  eventBus.emit(EVENTS.REPOSITORY_CHANGED, { repository: repo });
  eventBus.emit(EVENTS.DISCOVERY_COMPLETED, { repository: repo });
  eventBus.emit(EVENTS.DISCOVERY_HISTORY_UPDATED, { 
    history: stateManager.getState().discovery.history 
  });
}