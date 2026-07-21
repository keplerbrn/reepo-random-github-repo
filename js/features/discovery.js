import { eventBus } from '../core/eventBus.js';
import { stateManager } from '../core/stateManager.js';
import { repositoryService } from '../services/repositoryService.js';
import { EVENTS } from '../core/constants.js';

export async function initializeDiscovery() {
  eventBus.on(EVENTS.APP_INITIALIZED, async () => {
    await loadAndDisplayRepository();
  });
}

export async function loadAndDisplayRepository() {
  stateManager.setState('repository.loading', true);
  stateManager.setState('repository.error', null);
  eventBus.emit(EVENTS.REPOSITORY_LOADING);
  
  const result = await repositoryService.loadRepositories();
  
  if (!result.success) {
    stateManager.setState('repository.loading', false);
    stateManager.setState('repository.error', result.error);
    eventBus.emit(EVENTS.REPOSITORY_LOAD_ERROR, { error: result.error });
    return;
  }
  
  const repoResult = repositoryService.getRandomRepository();
  
  if (!repoResult.success) {
    stateManager.setState('repository.loading', false);
    stateManager.setState('repository.error', repoResult.error);
    eventBus.emit(EVENTS.REPOSITORY_LOAD_ERROR, { error: repoResult.error });
    return;
  }
  
  stateManager.setState('repository.current', repoResult.repository);
  stateManager.setState('repository.loading', false);
  stateManager.updateState('discovery.history', history => {
    const newHistory = [repoResult.repository, ...history];
    return newHistory.slice(0, 10);
  });
  stateManager.updateState('discovery.count', count => count + 1);
  
  eventBus.emit(EVENTS.REPOSITORY_LOADED, { repository: repoResult.repository });
}