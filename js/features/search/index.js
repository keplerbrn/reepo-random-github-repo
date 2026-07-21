import { eventBus } from '../../core/eventBus.js';
import { EVENTS } from '../../core/constants.js';
import { stateManager } from '../../core/stateManager.js';
import { searchService } from '../../services/searchService.js';
import { repositoryService } from '../../services/repositoryService.js';
import { filterService } from '../../services/filterService.js';

export function initializeSearchFeature() {
  let currentQuery = '';

  const performSearch = (query) => {
    currentQuery = query.trim();
    if (!currentQuery) {
      eventBus.emit(EVENTS.SEARCH_CLEARED);
      stateManager.setState('search', { query: '', results: [] });
      return;
    }
    eventBus.emit(EVENTS.SEARCH_STARTED, { query: currentQuery });

    let repos = [];
    for (let i = 0; i < repositoryService.getRepositoryCount(); i++) {
      const res = repositoryService.getRepository(i);
      if (res.success) repos.push(res.repository);
    }
    repos = filterService.filterRepositories(repos);
    const results = searchService.search(currentQuery, repos);

    stateManager.setState('search', { query: currentQuery, results });
    eventBus.emit(EVENTS.SEARCH_COMPLETED, { query: currentQuery, results });
  };

  return { onSearch: performSearch };
}