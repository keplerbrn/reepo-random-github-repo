import { stateManager } from '../core/stateManager.js';
import { storage } from '../core/storage.js';
import { STORAGE_KEYS } from '../core/constants.js';

class ReactionService {
  constructor() {
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;
    const savedReactions = storage.getItem(STORAGE_KEYS.REACTIONS);
    if (savedReactions && typeof savedReactions === 'object') {
      stateManager.setState('reactions', savedReactions);
    }
    this.initialized = true;
  }

  setReaction(repoId, type) {
    const reactions = { ...(stateManager.getState().reactions || {}) };
    if (type === null) {
      delete reactions[repoId];
    } else {
      reactions[repoId] = type;
    }
    stateManager.setState('reactions', reactions);
    storage.setItem(STORAGE_KEYS.REACTIONS, reactions);
  }

  getReaction(repoId) {
    const reactions = stateManager.getState().reactions || {};
    return reactions[repoId] || null;
  }
}

export const reactionService = new ReactionService();