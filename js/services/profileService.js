import { stateManager } from '../core/stateManager.js';
import { storage } from '../core/storage.js';
import { STORAGE_KEYS, AVATARS } from '../core/constants.js';

class ProfileService {
  init() {
    const savedProfile = storage.getItem(STORAGE_KEYS.USER_PROFILE);
    if (savedProfile) {
      stateManager.setState('user', savedProfile);
    }
    const savedLog = storage.getItem(STORAGE_KEYS.ACTIVITY_LOG);
    if (savedLog) {
      stateManager.setState('activityLog', savedLog.slice(0, 20));
    }
  }

  createProfile(username) {
    const profile = {
      username: username.trim(),
      avatar: AVATARS[Math.floor(Math.random() * AVATARS.length)],
      joinDate: new Date().toISOString(),
      bio: ''
    };
    stateManager.setState('user', profile);
    storage.setItem(STORAGE_KEYS.USER_PROFILE, profile);
    this.addActivity('profile_created', { username });
  }

  updateProfile(updates) {
    const current = stateManager.getState().user;
    if (!current) return;
    const updated = { ...current, ...updates };
    stateManager.setState('user', updated);
    storage.setItem(STORAGE_KEYS.USER_PROFILE, updated);
    this.addActivity('profile_updated', { fields: Object.keys(updates) });
  }

  getProfile() {
    return stateManager.getState().user;
  }

  isProfileComplete() {
    const p = this.getProfile();
    return p && p.username && p.username.trim().length > 0;
  }

  resetProfile() {
    stateManager.setState('user', null);
    stateManager.setState('activityLog', []);
    storage.removeItem(STORAGE_KEYS.USER_PROFILE);
    storage.removeItem(STORAGE_KEYS.ACTIVITY_LOG);
  }

  // Activity log
  addActivity(type, details = {}) {
    const entry = { type, timestamp: new Date().toISOString(), details };
    stateManager.updateState('activityLog', log => [entry, ...(log || [])].slice(0, 20));
    storage.setItem(STORAGE_KEYS.ACTIVITY_LOG, stateManager.getState().activityLog);
  }

  getActivity() {
    return stateManager.getState().activityLog || [];
  }

  // Statistics aggregation (read-only)
  getProfileSummary() {
    const state = stateManager.getState();
    return {
      savedCount: (state.savedRepositories || []).length,
      collectionsCount: (state.collections || []).length,
      discoveries: state.discovery?.count || 0,
      likes: Object.values(state.reactions || {}).filter(r => r === 'like').length,
      dislikes: Object.values(state.reactions || {}).filter(r => r === 'dislike').length
    };
  }

  // Import/Export
  exportProfile() {
    return {
      profile: stateManager.getState().user,
      activityLog: stateManager.getState().activityLog
    };
  }

  importProfile(data) {
    try {
      if (!data || typeof data !== 'object') throw new Error('Invalid data');
      if (data.profile && data.profile.username) {
        stateManager.setState('user', data.profile);
        storage.setItem(STORAGE_KEYS.USER_PROFILE, data.profile);
      }
      if (Array.isArray(data.activityLog)) {
        stateManager.setState('activityLog', data.activityLog.slice(0, 20));
        storage.setItem(STORAGE_KEYS.ACTIVITY_LOG, data.activityLog.slice(0, 20));
      }
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }
}

export const profileService = new ProfileService();