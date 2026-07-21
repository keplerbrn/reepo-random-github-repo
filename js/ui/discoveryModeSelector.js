import { DISCOVERY_MODES, DISCOVERY_MODE_LABELS } from '../core/constants.js';
import { localization } from '../core/localization.js';

export function createDiscoveryModeSelector(currentMode, onModeChange) {
  const wrapper = document.createElement('div');
  wrapper.className = 'discovery-mode-selector';

  Object.values(DISCOVERY_MODES).forEach(mode => {
    const btn = document.createElement('button');
    btn.className = `btn btn-ghost btn-small mode-btn${currentMode === mode ? ' active' : ''}`;
    btn.textContent = DISCOVERY_MODE_LABELS[mode] || mode;
    btn.addEventListener('click', () => onModeChange(mode));
    wrapper.appendChild(btn);
  });

  return wrapper;
}