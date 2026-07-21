import { stateManager } from '../core/stateManager.js';
import { storage } from '../core/storage.js';
import { eventBus } from '../core/eventBus.js';
import { STORAGE_KEYS, EVENTS, DEFAULT_STATE } from '../core/constants.js';

class SettingsService {
  init() {
    const saved = storage.getItem(STORAGE_KEYS.SETTINGS);
    if (saved) {
      stateManager.setState('settings', { ...DEFAULT_STATE.settings, ...saved });
    }
    this.applyTheme(stateManager.getState().settings.theme);
    this.applyAccessibility(stateManager.getState().settings.accessibility);
  }

  getSettings() {
    return stateManager.getState().settings;
  }

  updateSetting(key, value) {
    stateManager.setState(`settings.${key}`, value);
    storage.setItem(STORAGE_KEYS.SETTINGS, stateManager.getState().settings);
    eventBus.emit(EVENTS.SETTINGS_UPDATED, { key, value });

    if (key === 'theme') {
      this.applyTheme(value);
      eventBus.emit(EVENTS.THEME_CHANGED, { theme: value });
    }
    if (key === 'language') {
      eventBus.emit(EVENTS.LANGUAGE_CHANGED, { language: value });
    }
    if (key === 'accessibility') {
      this.applyAccessibility(value);
      eventBus.emit(EVENTS.ACCESSIBILITY_CHANGED, value);
    }
    if (key === 'shortcutsEnabled') {
      eventBus.emit(EVENTS.SHORTCUTS_UPDATED, { enabled: value });
    }
  }

  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
  }

  applyAccessibility(acc) {
    document.body.classList.toggle('reduced-motion', acc.reducedMotion);
    document.body.classList.toggle('large-font', acc.largeFont);
    document.body.classList.toggle('high-contrast', acc.highContrast);
  }

  resetSettings() {
    stateManager.setState('settings', { ...DEFAULT_STATE.settings });
    storage.setItem(STORAGE_KEYS.SETTINGS, DEFAULT_STATE.settings);
    this.applyTheme('dark');
    this.applyAccessibility(DEFAULT_STATE.settings.accessibility);
    eventBus.emit(EVENTS.SETTINGS_UPDATED, {});
    eventBus.emit(EVENTS.APPLICATION_RESET);
  }

  exportAllData() {
    return {
      settings: stateManager.getState().settings,
      user: stateManager.getState().user,
      collections: stateManager.getState().collections,
      savedRepositories: stateManager.getState().savedRepositories,
      reactions: stateManager.getState().reactions,
      gamification: stateManager.getState().gamification,
      exportedAt: new Date().toISOString()
    };
  }

  importAllData(data) {
    try {
      if (data.settings) stateManager.setState('settings', data.settings);
      if (data.user) stateManager.setState('user', data.user);
      if (data.collections) stateManager.setState('collections', data.collections);
      if (data.savedRepositories) stateManager.setState('savedRepositories', data.savedRepositories);
      if (data.reactions) stateManager.setState('reactions', data.reactions);
      if (data.gamification) stateManager.setState('gamification', data.gamification);
      storage.setItem(STORAGE_KEYS.SETTINGS, stateManager.getState().settings);
      storage.setItem('userProfile', stateManager.getState().user);
      storage.setItem('collections', stateManager.getState().collections);
      storage.setItem('savedRepositories', stateManager.getState().savedRepositories);
      storage.setItem('reactions', stateManager.getState().reactions);
      storage.setItem('gamification', stateManager.getState().gamification);
      this.applyTheme(stateManager.getState().settings.theme);
      this.applyAccessibility(stateManager.getState().settings.accessibility);
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }

  clearCache() {
    storage.clear();
    return { success: true };
  }
}

export const settingsService = new SettingsService();