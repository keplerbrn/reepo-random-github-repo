import { stateManager } from '../core/stateManager.js';
import { storage } from '../core/storage.js';
import { STORAGE_KEYS } from '../core/constants.js';

class CollectionService {
  constructor() {
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;

    const savedRepos = storage.getItem(STORAGE_KEYS.SAVED_REPOSITORIES);
    if (savedRepos && Array.isArray(savedRepos)) {
      stateManager.setState('savedRepositories', savedRepos);
    }

    const collections = storage.getItem(STORAGE_KEYS.COLLECTIONS);
    if (collections && Array.isArray(collections)) {
      stateManager.setState('collections', collections);
    }

    this.initialized = true;
  }

  // --- Repository Operations ---

  saveRepository(repo) {
    const saved = stateManager.getState().savedRepositories || [];
    if (saved.some(r => r.id === repo.id)) return false;

    const updated = [...saved, repo];
    stateManager.setState('savedRepositories', updated);
    storage.setItem(STORAGE_KEYS.SAVED_REPOSITORIES, updated);
    return true;
  }

  removeRepository(repoId) {
    const saved = stateManager.getState().savedRepositories || [];
    const updated = saved.filter(r => r.id !== repoId);
    stateManager.setState('savedRepositories', updated);
    storage.setItem(STORAGE_KEYS.SAVED_REPOSITORIES, updated);

    // Also remove from all collections
    const collections = stateManager.getState().collections || [];
    collections.forEach(col => {
      if (col.repositoryIds.includes(repoId)) {
        this.removeRepoFromCollection(col.id, repoId);
      }
    });
    return true;
  }

  isSaved(repoId) {
    const saved = stateManager.getState().savedRepositories || [];
    return saved.some(r => r.id === repoId);
  }

  getSavedRepositories() {
    return stateManager.getState().savedRepositories || [];
  }

  // --- Collection CRUD ---

  createCollection(name, description = '') {
    const collections = stateManager.getState().collections || [];
    const collection = {
      id: Date.now().toString(36) + Math.random().toString(36).substring(2, 9),
      name,
      description,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      repositoryIds: []
    };
    const updated = [...collections, collection];
    stateManager.setState('collections', updated);
    storage.setItem(STORAGE_KEYS.COLLECTIONS, updated);
    return collection;
  }

  renameCollection(id, name) {
    const collections = stateManager.getState().collections || [];
    const updated = collections.map(col =>
      col.id === id ? { ...col, name, updatedAt: new Date().toISOString() } : col
    );
    stateManager.setState('collections', updated);
    storage.setItem(STORAGE_KEYS.COLLECTIONS, updated);
    return true;
  }

  deleteCollection(id) {
    const collections = stateManager.getState().collections || [];
    const updated = collections.filter(col => col.id !== id);
    stateManager.setState('collections', updated);
    storage.setItem(STORAGE_KEYS.COLLECTIONS, updated);
    return true;
  }

  getCollections() {
    return stateManager.getState().collections || [];
  }

  getCollection(id) {
    const collections = stateManager.getState().collections || [];
    return collections.find(col => col.id === id) || null;
  }

  // --- Repository Assignment ---

  addRepoToCollection(collectionId, repoId) {
    const collections = stateManager.getState().collections || [];
    const updated = collections.map(col => {
      if (col.id === collectionId && !col.repositoryIds.includes(repoId)) {
        return {
          ...col,
          repositoryIds: [...col.repositoryIds, repoId],
          updatedAt: new Date().toISOString()
        };
      }
      return col;
    });
    stateManager.setState('collections', updated);
    storage.setItem(STORAGE_KEYS.COLLECTIONS, updated);
    return true;
  }

  removeRepoFromCollection(collectionId, repoId) {
    const collections = stateManager.getState().collections || [];
    const updated = collections.map(col => {
      if (col.id === collectionId) {
        return {
          ...col,
          repositoryIds: col.repositoryIds.filter(id => id !== repoId),
          updatedAt: new Date().toISOString()
        };
      }
      return col;
    });
    stateManager.setState('collections', updated);
    storage.setItem(STORAGE_KEYS.COLLECTIONS, updated);
    return true;
  }

  moveRepo(fromCollectionId, toCollectionId, repoId) {
    this.removeRepoFromCollection(fromCollectionId, repoId);
    this.addRepoToCollection(toCollectionId, repoId);
    return true;
  }

  // --- Statistics ---

  getCollectionStats(collectionId) {
    const col = this.getCollection(collectionId);
    if (!col) return null;
    return {
      repositoryCount: col.repositoryIds.length,
      lastUpdated: col.updatedAt,
      creationDate: col.createdAt
    };
  }

  // --- Import / Export ---

  exportData() {
    const state = stateManager.getState();
    return {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      collections: state.collections || [],
      savedRepositories: state.savedRepositories || []
    };
  }

  importData(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      if (!data || typeof data !== 'object') {
        return { success: false, error: 'Invalid JSON structure' };
      }

      // Validate basic structure
      if (data.collections && !Array.isArray(data.collections)) {
        return { success: false, error: 'Invalid collections format' };
      }
      if (data.savedRepositories && !Array.isArray(data.savedRepositories)) {
        return { success: false, error: 'Invalid saved repositories format' };
      }

      // Merge collections: Add new ones, skip duplicates by ID
      const currentCollections = stateManager.getState().collections || [];
      const existingIds = new Set(currentCollections.map(c => c.id));
      const importedCollections = (data.collections || [])
        .filter(c => c && c.id)
        .map(c => ({
          ...c,
          id: existingIds.has(c.id) ? Date.now().toString(36) + Math.random().toString(36).substring(2, 9) : c.id,
          createdAt: c.createdAt || new Date().toISOString(),
          updatedAt: c.updatedAt || new Date().toISOString(),
          repositoryIds: c.repositoryIds || []
        }));
      
      const mergedCollections = [...currentCollections, ...importedCollections];

      // Merge saved repositories: add only new ones by ID
      const currentSaved = stateManager.getState().savedRepositories || [];
      const savedIds = new Set(currentSaved.map(r => r.id));
      const newRepos = (data.savedRepositories || []).filter(r => r && r.id && !savedIds.has(r.id));
      const mergedSaved = [...currentSaved, ...newRepos];

      stateManager.setState('collections', mergedCollections);
      stateManager.setState('savedRepositories', mergedSaved);
      storage.setItem(STORAGE_KEYS.COLLECTIONS, mergedCollections);
      storage.setItem(STORAGE_KEYS.SAVED_REPOSITORIES, mergedSaved);

      return {
        success: true,
        collectionsImported: importedCollections.length,
        repositoriesImported: newRepos.length
      };
    } catch (error) {
      return { success: false, error: 'Invalid JSON data' };
    }
  }
}

export const collectionService = new CollectionService();