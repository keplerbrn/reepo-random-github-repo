import { localization } from '../core/localization.js';
import { formatNumber } from '../utils/formatting.js';

export function createHistoryPanel(history, recentlyViewed, onSelect, onRemove, onClear) {
  const panel = document.createElement('div');
  panel.className = 'history-panel';

  const header = document.createElement('div');
  header.className = 'panel-header';
  const title = document.createElement('h3');
  title.textContent = localization.t('history.title');
  const clearBtn = document.createElement('button');
  clearBtn.className = 'btn btn-ghost btn-small';
  clearBtn.textContent = localization.t('history.clear');
  clearBtn.addEventListener('click', onClear);
  header.appendChild(title);
  header.appendChild(clearBtn);
  panel.appendChild(header);

  const list = document.createElement('div');
  list.className = 'history-list';

  const renderRepoItem = (repo, isRecent) => {
    const item = document.createElement('div');
    item.className = 'history-item';
    item.innerHTML = `
      <span class="repo-name">${repo.name}</span>
      <span class="repo-owner">${repo.owner}</span>
      <span class="stat stars">★ ${formatNumber(repo.stars)}</span>
      ${isRecent ? `<span class="badge-recent">${localization.t('history.recent')}</span>` : ''}
    `;
    item.addEventListener('click', () => onSelect(repo));
    const rmBtn = document.createElement('button');
    rmBtn.className = 'btn btn-ghost btn-small';
    rmBtn.textContent = '✕';
    rmBtn.addEventListener('click', (e) => { e.stopPropagation(); onRemove(repo.id); });
    item.appendChild(rmBtn);
    return item;
  };

  if (recentlyViewed && recentlyViewed.length > 0) {
    const recentHeader = document.createElement('h4');
    recentHeader.textContent = localization.t('history.recentlyViewed');
    list.appendChild(recentHeader);
    recentlyViewed.slice(0, 5).forEach(repo => list.appendChild(renderRepoItem(repo, true)));
  }

  if (history && history.length > 0) {
    const histHeader = document.createElement('h4');
    histHeader.textContent = localization.t('history.discoveryHistory');
    list.appendChild(histHeader);
    history.forEach(repo => list.appendChild(renderRepoItem(repo, false)));
  }

  if ((!history || history.length === 0) && (!recentlyViewed || recentlyViewed.length === 0)) {
    const empty = document.createElement('p');
    empty.className = 'empty-state';
    empty.textContent = localization.t('history.empty');
    list.appendChild(empty);
  }

  panel.appendChild(list);
  return panel;
}