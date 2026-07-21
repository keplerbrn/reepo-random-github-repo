import { localization } from '../core/localization.js';
import { DISCOVERY_MODES } from '../core/constants.js';

export function createSettingsPanel(settings, onUpdateSetting, onExportAll, onImportAll, onClearCache, onReset) {
  const panel = document.createElement('div');
  panel.className = 'settings-panel';

  const title = document.createElement('h2');
  title.textContent = localization.t('settings.title');
  panel.appendChild(title);

  // Theme
  panel.appendChild(createSection(localization.t('settings.appearance'), [
    createSelect(localization.t('settings.theme'), settings.theme, [
      { value: 'dark', label: localization.t('settings.dark') },
      { value: 'light', label: localization.t('settings.light') },
      { value: 'system', label: localization.t('settings.system') }
    ], (val) => onUpdateSetting('theme', val))
  ]));

  // Language
  panel.appendChild(createSection(localization.t('settings.language'), [
    createSelect(localization.t('settings.languageLabel'), settings.language, [
      { value: 'en', label: 'English' },
      { value: 'tr', label: 'Türkçe' }
    ], (val) => onUpdateSetting('language', val))
  ]));

  // Discovery Preferences
  panel.appendChild(createSection(localization.t('settings.discovery'), [
    createSelect(localization.t('settings.defaultMode'), settings.discovery.defaultMode,
      Object.values(DISCOVERY_MODES).map(m => ({ value: m, label: m })), 
      (val) => onUpdateSetting('discovery', { ...settings.discovery, defaultMode: val })),
    createToggle(localization.t('settings.autoOpenFilters'), settings.discovery.autoOpenFilters,
      (val) => onUpdateSetting('discovery', { ...settings.discovery, autoOpenFilters: val })),
    createToggle(localization.t('settings.enableQueue'), settings.discovery.enableQueue,
      (val) => onUpdateSetting('discovery', { ...settings.discovery, enableQueue: val }))
  ]));

  // Notifications
  panel.appendChild(createSection(localization.t('settings.notifications'), [
    createToggle('XP', settings.notifications.xp, (val) => onUpdateSetting('notifications', { ...settings.notifications, xp: val })),
    createToggle(localization.t('settings.badges'), settings.notifications.badge, (val) => onUpdateSetting('notifications', { ...settings.notifications, badge: val })),
    createToggle(localization.t('settings.achievements'), settings.notifications.achievement, (val) => onUpdateSetting('notifications', { ...settings.notifications, achievement: val })),
    createToggle(localization.t('settings.quests'), settings.notifications.quest, (val) => onUpdateSetting('notifications', { ...settings.notifications, quest: val }))
  ]));

  // Accessibility
  panel.appendChild(createSection(localization.t('settings.accessibility'), [
    createToggle(localization.t('settings.reducedMotion'), settings.accessibility.reducedMotion, 
      (val) => onUpdateSetting('accessibility', { ...settings.accessibility, reducedMotion: val })),
    createToggle(localization.t('settings.largeFont'), settings.accessibility.largeFont,
      (val) => onUpdateSetting('accessibility', { ...settings.accessibility, largeFont: val })),
    createToggle(localization.t('settings.highContrast'), settings.accessibility.highContrast,
      (val) => onUpdateSetting('accessibility', { ...settings.accessibility, highContrast: val }))
  ]));

  // Keyboard
  panel.appendChild(createSection(localization.t('settings.keyboard'), [
    createToggle(localization.t('settings.enableShortcuts'), settings.shortcutsEnabled,
      (val) => onUpdateSetting('shortcutsEnabled', val)),
    createShortcutsList()
  ]));

  // Data Management
  panel.appendChild(createSection(localization.t('settings.dataManagement'), [
    createButton(localization.t('settings.exportAll'), onExportAll),
    createButton(localization.t('settings.importAll'), onImportAll),
    createButton(localization.t('settings.clearCache'), onClearCache, 'btn-danger'),
    createButton(localization.t('settings.resetSettings'), onReset, 'btn-danger')
  ]));

  // About
  panel.appendChild(createSection(localization.t('settings.about'), [
    createAboutContent()
  ]));

  return panel;
}

function createSection(title, elements) {
  const sec = document.createElement('section');
  sec.className = 'settings-section';
  const h3 = document.createElement('h3');
  h3.textContent = title;
  sec.appendChild(h3);
  elements.forEach(el => sec.appendChild(el));
  return sec;
}

function createSelect(label, value, options, onChange) {
  const wrapper = document.createElement('div');
  wrapper.className = 'settings-row';
  const lbl = document.createElement('label');
  lbl.textContent = label;
  const select = document.createElement('select');
  options.forEach(opt => {
    const o = document.createElement('option');
    o.value = opt.value; o.textContent = opt.label;
    if (opt.value === value) o.selected = true;
    select.appendChild(o);
  });
  select.addEventListener('change', e => onChange(e.target.value));
  wrapper.appendChild(lbl); wrapper.appendChild(select);
  return wrapper;
}

function createToggle(label, checked, onChange) {
  const wrapper = document.createElement('div');
  wrapper.className = 'settings-row';
  const cb = document.createElement('input');
  cb.type = 'checkbox'; cb.checked = checked;
  cb.addEventListener('change', e => onChange(e.target.checked));
  const lbl = document.createElement('label');
  lbl.appendChild(cb); lbl.appendChild(document.createTextNode(' ' + label));
  wrapper.appendChild(lbl);
  return wrapper;
}

function createButton(text, onClick, className = '') {
  const btn = document.createElement('button');
  btn.className = `btn btn-secondary ${className}`;
  btn.textContent = text;
  btn.addEventListener('click', onClick);
  const wrapper = document.createElement('div');
  wrapper.className = 'settings-row';
  wrapper.appendChild(btn);
  return wrapper;
}

function createShortcutsList() {
  const list = document.createElement('div');
  list.className = 'shortcuts-list';
  [
    ['Space', 'Next Repository'],
    ['Enter', 'Open GitHub'],
    ['S', 'Save'],
    ['L', 'Like'],
    ['D', 'Dislike'],
    ['F', 'Open Filters'],
    ['H', 'Open History'],
    ['Esc', 'Close Panel']
  ].forEach(([key, action]) => {
    const item = document.createElement('div');
    item.className = 'shortcut-item';
    item.innerHTML = `<kbd>${key}</kbd> <span>${action}</span>`;
    list.appendChild(item);
  });
  return list;
}

function createAboutContent() {
  const div = document.createElement('div');
  div.innerHTML = `
    <p><strong>Reepo v1.0</strong></p>
    <p>Discover GitHub repositories effortlessly.</p>
    <p>License: MIT</p>
    <p><a href="https://github.com/reepo" target="_blank">GitHub Repository</a></p>
  `;
  return div;
}