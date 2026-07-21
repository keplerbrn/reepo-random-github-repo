import { localization } from '../core/localization.js';
import { SUPPORTED_LANGUAGES, UPDATE_RANGES } from '../core/constants.js';

export function createFilterPanel(filters, onFilterChange, onReset) {
  const panel = document.createElement('aside');
  panel.className = 'filter-panel';
  panel.setAttribute('role', 'complementary');
  panel.setAttribute('aria-label', localization.t('filters.title'));

  const header = document.createElement('div');
  header.className = 'filter-header';
  const title = document.createElement('h3');
  title.textContent = localization.t('filters.title');
  const resetBtn = document.createElement('button');
  resetBtn.className = 'btn btn-ghost btn-small';
  resetBtn.textContent = localization.t('filters.reset');
  resetBtn.addEventListener('click', onReset);
  header.appendChild(title);
  header.appendChild(resetBtn);
  panel.appendChild(header);

  // Language
  panel.appendChild(createSelectFilter(
    localization.t('filters.language'),
    filters.language,
    SUPPORTED_LANGUAGES,
    (val) => onFilterChange('language', val)
  ));

  // Min Stars
  panel.appendChild(createNumberFilter(
    localization.t('filters.minStars'),
    filters.minStars,
    0,
    (val) => onFilterChange('minStars', parseInt(val) || 0)
  ));

  // Updated Within
  panel.appendChild(createSelectFilter(
    localization.t('filters.updatedWithin'),
    filters.updatedWithin,
    UPDATE_RANGES,
    (val) => onFilterChange('updatedWithin', val)
  ));

  // Include Forks
  panel.appendChild(createToggleFilter(
    localization.t('filters.includeForks'),
    filters.includeForks,
    (val) => onFilterChange('includeForks', val)
  ));

  // Include Archived
  panel.appendChild(createToggleFilter(
    localization.t('filters.includeArchived'),
    filters.includeArchived,
    (val) => onFilterChange('includeArchived', val)
  ));

  // License
  panel.appendChild(createTextFilter(
    localization.t('filters.license'),
    filters.license,
    (val) => onFilterChange('license', val)
  ));

  // Topics (comma separated)
  panel.appendChild(createTextFilter(
    localization.t('filters.topics'),
    filters.topics.join(', '),
    (val) => onFilterChange('topics', val.split(',').map(t => t.trim()).filter(Boolean))
  ));

  return panel;
}

function createSelectFilter(label, value, options, onChange) {
  const wrapper = document.createElement('div');
  wrapper.className = 'filter-group';

  const lbl = document.createElement('label');
  lbl.textContent = label;
  lbl.className = 'filter-label';

  const select = document.createElement('select');
  select.className = 'filter-select';

  const emptyOption = document.createElement('option');
  emptyOption.value = '';
  emptyOption.textContent = 'All';
  select.appendChild(emptyOption);

  options.forEach(opt => {
    const optionEl = document.createElement('option');
    if (typeof opt === 'string') {
      optionEl.value = opt;
      optionEl.textContent = opt;
    } else {
      optionEl.value = opt.value;
      optionEl.textContent = opt.label;
    }
    if (optionEl.value === value) optionEl.selected = true;
    select.appendChild(optionEl);
  });

  select.addEventListener('change', (e) => onChange(e.target.value));
  wrapper.appendChild(lbl);
  wrapper.appendChild(select);
  return wrapper;
}

function createNumberFilter(label, value, min, onChange) {
  const wrapper = document.createElement('div');
  wrapper.className = 'filter-group';

  const lbl = document.createElement('label');
  lbl.textContent = label;
  lbl.className = 'filter-label';

  const input = document.createElement('input');
  input.type = 'number';
  input.min = min;
  input.value = value || 0;
  input.className = 'filter-input';
  input.addEventListener('input', (e) => onChange(e.target.value));

  wrapper.appendChild(lbl);
  wrapper.appendChild(input);
  return wrapper;
}

function createToggleFilter(label, checked, onChange) {
  const wrapper = document.createElement('div');
  wrapper.className = 'filter-group filter-toggle';

  const lbl = document.createElement('label');
  lbl.className = 'filter-label';

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = checked;
  checkbox.addEventListener('change', (e) => onChange(e.target.checked));

  lbl.appendChild(checkbox);
  lbl.appendChild(document.createTextNode(' ' + label));
  wrapper.appendChild(lbl);
  return wrapper;
}

function createTextFilter(label, value, onChange) {
  const wrapper = document.createElement('div');
  wrapper.className = 'filter-group';

  const lbl = document.createElement('label');
  lbl.textContent = label;
  lbl.className = 'filter-label';

  const input = document.createElement('input');
  input.type = 'text';
  input.value = value || '';
  input.className = 'filter-input';
  input.addEventListener('input', (e) => onChange(e.target.value));

  wrapper.appendChild(lbl);
  wrapper.appendChild(input);
  return wrapper;
}