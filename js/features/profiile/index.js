import { eventBus } from '../../core/eventBus.js';
import { EVENTS } from '../../core/constants.js';
import { stateManager } from '../../core/stateManager.js';
import { profileService } from '../../services/profileService.js';
import { localization } from '../../core/localization.js';

export function initializeProfileFeature() {
  return {
    onSaveProfile: (updates) => {
      profileService.updateProfile(updates);
      eventBus.emit(EVENTS.PROFILE_UPDATED, updates);
    },
    onExport: () => {
      const data = profileService.exportProfile();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'reepo-profile.json';
      a.click();
      URL.revokeObjectURL(url);
      eventBus.emit(EVENTS.PROFILE_EXPORTED);
    },
    onImport: () => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json';
      input.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
          try {
            const data = JSON.parse(ev.target.result);
            const result = profileService.importProfile(data);
            if (result.success) {
              eventBus.emit(EVENTS.PROFILE_IMPORTED);
              alert(localization.t('profile.importSuccess'));
            } else {
              alert(localization.t('profile.importError', { error: result.error }));
            }
          } catch (err) {
            alert(localization.t('profile.importError', { error: err.message }));
          }
        };
        reader.readAsText(file);
      });
      input.click();
    },
    onReset: () => {
      if (confirm(localization.t('profile.confirmReset'))) {
        profileService.resetProfile();
        eventBus.emit(EVENTS.PROFILE_RESET);
      }
    }
  };
}