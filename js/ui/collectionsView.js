import { localization } from '../core/localization.js';
import { eventBus } from '../core/eventBus.js';
import { EVENTS } from '../core/constants.js';
import { createSearchSortBar } from './searchSortBar.js';
import { createSavedReposList } from './savedReposList.js';
import { createCollectionCard } from './collectionCard.js';
import { createImportExportButtons } from './importExport.js';

export function createCollectionsView(
  collections, savedRepos, statsMap,
  onSearch, onSort,
  onCreateCollection, onRenameCollection, onDeleteCollection, onSelectCollection,
  onRemoveRepo,
  onExport, onImport
) {
  const view = document.createElement('div');
  view.className = 'collections-view';

  // Header
  const header = document.createElement('div');
  header.className = 'collections-header';
  
  const title = document.createElement('h2');
  title.textContent = localization.t('collections.title');

  const createBtn = document.createElement('button');
  createBtn.className = 'btn btn-primary';
  createBtn.textContent = localization.t('collections.create');
  createBtn.addEventListener('click', onCreateCollection);

  header.appendChild(title);
  header.appendChild(createBtn);
  view.appendChild(header);

  // Import/Export
  const ieBar = createImportExportButtons(onExport, onImport);
  view.appendChild(ieBar);

  // Collections Grid
  const collectionsGrid = document.createElement('div');
  collectionsGrid.className = 'collections-grid';
  collectionsGrid.setAttribute('role', 'list');

  if (collections.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'empty-state';
    empty.setAttribute('role', 'status');
    empty.textContent = localization.t('collections.noCollections');
    collectionsGrid.appendChild(empty);
  } else {
    collections.forEach(col => {
      const stats = statsMap[col.id] || { repositoryCount: 0, lastUpdated: col.updatedAt, creationDate: col.createdAt };
      const card = createCollectionCard(col, stats, onRenameCollection, onDeleteCollection, onSelectCollection);
      collectionsGrid.appendChild(card);
    });
  }
  view.appendChild(collectionsGrid);

  // Search & Sort
  const searchSort = createSearchSortBar(onSearch, onSort);
  view.appendChild(searchSort);

  // Saved Repos
  const reposContainer = document.createElement('div');
  reposContainer.className = 'saved-repos-container';
  const reposTitle = document.createElement('h3');
  reposTitle.textContent = localization.t('collections.savedRepos');
  reposContainer.appendChild(reposTitle);
  
  const reposList = createSavedReposList(savedRepos, onRemoveRepo);
  reposContainer.appendChild(reposList);
  view.appendChild(reposContainer);

  return view;
}