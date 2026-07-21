import { localization } from '../core/localization.js';

export function createSearchSortBar(onSearch, onSort) {
  const bar = document.createElement('div');
  bar.className = 'search-sort-bar';

  const searchInput = document.createElement('input');
  searchInput.type = 'search';
  searchInput.placeholder = localization.t('collections.searchPlaceholder');
  searchInput.className = 'search-input';
  searchInput.addEventListener('input', (e) => onSearch(e.target.value));

  const sortSelect = document.createElement('select');
  sortSelect.className = 'sort-select';
  sortSelect.innerHTML = `
    <option value="name">${localization.t('collections.sortByName')}</option>
    <option value="stars">${localization.t('collections.sortByStars')}</option>
    <option value="date">${localization.t('collections.sortByDate')}</option>
  `;
  sortSelect.addEventListener('change', (e) => onSort(e.target.value));

  bar.appendChild(searchInput);
  bar.appendChild(sortSelect);
  return bar;
}