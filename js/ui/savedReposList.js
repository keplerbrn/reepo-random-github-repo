import { formatNumber } from '../utils/formatting.js';
import { localization } from '../core/localization.js';

export function createSavedReposList(repositories, onRemove) {
  const container = document.createElement('div');
  container.className = 'saved-repos-list';

  if (!repositories || repositories.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'empty-state';
    empty.setAttribute('role', 'status');
    empty.innerHTML = `
      <p>${localization.t('collections.noSavedRepos')}</p>
    `;
    container.appendChild(empty);
    return container;
  }

  repositories.forEach(repo => {
    const item = document.createElement('div');
    item.className = 'saved-repo-item';

    const info = document.createElement('div');
    info.className = 'repo-item-info';
    info.innerHTML = `
      <strong>${repo.name}</strong>
      <span class="repo-owner">${repo.owner}</span>
      <span class="stat stars">★ ${formatNumber(repo.stars)}</span>
    `;

    const removeBtn = document.createElement('button');
    removeBtn.className = 'btn btn-ghost btn-small btn-danger';
    removeBtn.textContent = localization.t('collections.remove');
    removeBtn.addEventListener('click', () => onRemove(repo.id));

    item.appendChild(info);
    item.appendChild(removeBtn);
    container.appendChild(item);
  });

  return container;
}