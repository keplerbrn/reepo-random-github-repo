import { eventBus } from '../../core/eventBus.js';
import { settingsService } from '../../services/settingsService.js';
import { localization } from '../../core/localization.js';
import { EVENTS } from '../../core/constants.js';

export function initializeSettingsFeature() {
  return {
    onUpdateSetting: (key, value) => settingsService.updateSetting(key, value),
    onExportAll: () => {
      const data = settingsService.exportAllData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = 'reepo-all-data.json'; a.click();
      URL.revokeObjectURL(url);
    },
    onImportAll: () => {
      const input = document.createElement('input');
      input.type = 'file'; input.accept = '.json';
      input.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
          try {
            const data = JSON.parse(ev.target.result);
            const result = settingsService.importAllData(data);
            if (result.success) alert(localization.t('settings.importSuccess'));
            else alert(localization.t('settings.importError', { error: result.error }));
          } catch (err) {
            alert(localization.t('settings.importError', { error: err.message }));
          }
        };
        reader.readAsText(file);
      });
      input.click();
    },
    onClearCache: () => {
      if (confirm(localization.t('settings.confirmClearCache'))) {
        settingsService.clearCache();
        alert(localization.t('settings.cacheCleared'));
      }
    },
    onReset: () => {
      if (confirm(localization.t('settings.confirmReset'))) {
        settingsService.resetSettings();
        alert(localization.t('settings.resetComplete'));
      }
    }
  };
}