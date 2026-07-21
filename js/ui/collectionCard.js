import { localization } from '../core/localization.js';

export function createCollectionCard(collection, stats, onRename, onDelete, onSelect) {
  const card = document.createElement('div');
  card.className = 'collection-card';
  card.setAttribute('role', 'listitem');

  const nameEl = document.createElement('h3');
  nameEl.className = 'collection-name';
  nameEl.textContent = collection.name;
  nameEl.setAttribute('title', collection.name);

  const statsEl = document.createElement('div');
  statsEl.className = 'collection-stats';
  statsEl.innerHTML = `
    <span>${localization.t('collections.repoCount', { count: stats.repositoryCount })}</span>
    <span>${localization.t('collections.created')} ${new Date(stats.creationDate).toLocaleDateString()}</span>
  `;

  const actions = document.createElement('div');
  actions.className = 'collection-actions';

  const renameBtn = document.createElement('button');
  renameBtn.className = 'btn btn-ghost btn-small';
  renameBtn.textContent = localization.t('collections.rename');
  renameBtn.addEventListener('click', (e) => { e.stopPropagation(); onRename(collection.id); });

  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'btn btn-ghost btn-small btn-danger';
  deleteBtn.textContent = localization.t('collections.delete');
  deleteBtn.addEventListener('click', (e) => { e.stopPropagation(); onDelete(collection.id); });

  actions.appendChild(renameBtn);
  actions.appendChild(deleteBtn);
  
  card.appendChild(nameEl);
  card.appendChild(statsEl);
  card.appendChild(actions);

  card.addEventListener('click', () => onSelect(collection.id));
  return card;
}