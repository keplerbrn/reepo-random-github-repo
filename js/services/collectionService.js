import { stateManager } from '../core/stateManager.js';
import { storage } from '../core/storage.js';
import { STORAGE_KEYS } from '../core/constants.js';

class CollectionService {
  constructor() {
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;
    const savedData = storage.getItem(STORAGE_KEYS.SAVED_REPOSITORIES);
    if (savedData && Array.isArray(savedData)) {
      stateManager.setState('savedRepositories', savedData);
    }
    this.initialized = true;
  }

  saveRepository(repo) {
    const currentSaved = stateManager.getState().savedRepositories || [];
    const exists = currentSaved.some(r => r.id === repo.id);
    if (exists) return false; // Already saved

    const updated = [...currentSaved, repo];
    stateManager.setState('savedRepositories', updated);
    storage.setItem(STORAGE_KEYS.SAVED_REPOSITORIES, updated);
    return true;
  }

  removeRepository(repoId) {
    const currentSaved = stateManager.getState().savedRepositories || [];
    const updated = currentSaved.filter(r => r.id !== repoId);
    stateManager.setState('savedRepositories', updated);
    storage.setItem(STORAGE_KEYS.SAVED_REPOSITORIES, updated);
    return true;
  }

  isSaved(repoId) {
    const currentSaved = stateManager.getState().savedRepositories || [];
    return currentSaved.some(r => r.id === repoId);
  }

  getSavedRepositories() {
    return stateManager.getState().savedRepositories || [];
  }
}

export const collectionService = new CollectionService();