import { stateManager } from '../core/stateManager.js';
import { repositoryService } from './repositoryService.js';
import { filterService } from './filterService.js';
import { RECENT_REPOS_LIMIT, QUEUE_SIZE, DISCOVERY_MODES } from '../core/constants.js';

class DiscoveryQueueService {
  async refillQueue() {
    if (!repositoryService.loaded) {
      await repositoryService.loadRepositories();
    }

    let allRepos = [];
    for (let i = 0; i < repositoryService.getRepositoryCount(); i++) {
      const res = repositoryService.getRepository(i);
      if (res.success) allRepos.push(res.repository);
    }

    const filtered = filterService.filterRepositories(allRepos);
    const state = stateManager.getState();
    const history = state.discovery?.history || [];
    const excludeIds = history.slice(0, RECENT_REPOS_LIMIT).map(r => r.id);
    const available = filtered.filter(r => !excludeIds.includes(r.id));
    const chosen = this.selectByMode(available, state.discovery.mode, state.viewCounts || {});

    const queue = chosen.slice(0, QUEUE_SIZE);
    stateManager.setState('discovery.queue', queue);
    return queue;
  }

  selectByMode(repos, mode, viewCounts) {
    const shuffled = [...repos].sort(() => Math.random() - 0.5);
    switch (mode) {
      case DISCOVERY_MODES.LEAST_VIEWED:
        return [...repos].sort((a, b) => (viewCounts[a.id] || 0) - (viewCounts[b.id] || 0));
      case DISCOVERY_MODES.RECENTLY_UPDATED:
        return [...repos].sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated));
      case DISCOVERY_MODES.POPULAR:
        return [...repos].sort((a, b) => b.stars - a.stars);
      case DISCOVERY_MODES.RANDOM:
      default:
        return shuffled;
    }
  }

  getNextFromQueue() {
    const queue = stateManager.getState().discovery?.queue || [];
    if (queue.length === 0) return null;
    const next = queue.shift();
    stateManager.setState('discovery.queue', [...queue]);
    // trigger queue refill if low
    if (queue.length < 2) {
      this.refillQueue();
    }
    return next;
  }
}

export const discoveryQueueService = new DiscoveryQueueService();