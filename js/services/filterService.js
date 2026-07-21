import { stateManager } from '../core/stateManager.js';
import { storage } from '../core/storage.js';
import { STORAGE_KEYS, DEFAULT_FILTERS } from '../core/constants.js';

class FilterService {
  constructor() {
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;
    const saved = storage.getItem(STORAGE_KEYS.FILTERS);
    if (saved && typeof saved === 'object') {
      stateManager.setState('filters', { ...DEFAULT_FILTERS, ...saved });
    }
    this.initialized = true;
  }

  getFilters() {
    return stateManager.getState().filters || { ...DEFAULT_FILTERS };
  }

  setFilter(key, value) {
    const filters = { ...this.getFilters(), [key]: value };
    stateManager.setState('filters', filters);
    storage.setItem(STORAGE_KEYS.FILTERS, filters);
  }

  resetFilters() {
    stateManager.setState('filters', { ...DEFAULT_FILTERS });
    storage.setItem(STORAGE_KEYS.FILTERS, { ...DEFAULT_FILTERS });
  }

  /**
   * Applies filters to a list of repositories.
   */
  filterRepositories(repos) {
    const filters = this.getFilters();
    return repos.filter(repo => this.matchesFilters(repo, filters));
  }

  matchesFilters(repo, filters) {
    if (filters.language && repo.language !== filters.language) return false;
    if (filters.minStars > 0 && repo.stars < filters.minStars) return false;
    if (filters.updatedWithin !== 'any') {
      const updatedDate = new Date(repo.lastUpdated);
      const now = new Date();
      const diffMs = now - updatedDate;
      const diffDays = diffMs / (1000 * 60 * 60 * 24);
      switch (filters.updatedWithin) {
        case 'month': if (diffDays > 30) return false; break;
        case '6months': if (diffDays > 180) return false; break;
        case 'year': if (diffDays > 365) return false; break;
      }
    }
    if (!filters.includeForks && repo.fork) return false;
    if (!filters.includeArchived && repo.archived) return false;
    if (filters.license && repo.license !== filters.license) return false;
    if (filters.topics && filters.topics.length > 0) {
      const repoTopicSet = new Set(repo.topics || []);
      if (!filters.topics.some(t => repoTopicSet.has(t))) return false;
    }
    return true;
  }

  getActiveFilterCount() {
    const filters = this.getFilters();
    let count = 0;
    if (filters.language) count++;
    if (filters.minStars > 0) count++;
    if (filters.updatedWithin !== 'any') count++;
    if (!filters.includeForks) count++;
    if (!filters.includeArchived) count++;
    if (filters.license) count++;
    if (filters.topics.length > 0) count++;
    return count;
  }
}

export const filterService = new FilterService();