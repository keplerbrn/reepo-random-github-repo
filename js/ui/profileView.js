import { localization } from '../core/localization.js';
import { formatNumber } from '../utils/formatting.js';

export function createProfileView(profile, summary, activityLog, onEdit, onExport, onImport, onReset) {
  const container = document.createElement('div');
  container.className = 'profile-view';

  // Header
  const header = document.createElement('div');
  header.className = 'profile-header';
  const avatarEl = document.createElement('span');
  avatarEl.className = 'profile-avatar';
  avatarEl.textContent = profile.avatar || '?';
  const nameEl = document.createElement('h2');
  nameEl.textContent = profile.username || localization.t('profile.guest');
  const joinDate = document.createElement('p');
  joinDate.className = 'profile-join-date';
  joinDate.textContent = profile.joinDate 
    ? localization.t('profile.joined', { date: new Date(profile.joinDate).toLocaleDateString() })
    : '';
  header.appendChild(avatarEl);
  header.appendChild(nameEl);
  header.appendChild(joinDate);
  container.appendChild(header);

  // Edit button
  const editBtn = document.createElement('button');
  editBtn.className = 'btn btn-primary';
  editBtn.textContent = localization.t('profile.edit');
  editBtn.addEventListener('click', onEdit);
  container.appendChild(editBtn);

  // Stats
  const statsGrid = document.createElement('div');
  statsGrid.className = 'profile-stats-grid';
  const stats = [
    { label: localization.t('profile.saved'), value: summary.savedCount },
    { label: localization.t('profile.collections'), value: summary.collectionsCount },
    { label: localization.t('profile.discoveries'), value: summary.discoveries },
    { label: localization.t('profile.likes'), value: summary.likes },
    { label: localization.t('profile.dislikes'), value: summary.dislikes }
  ];
  stats.forEach(s => {
    const card = document.createElement('div');
    card.className = 'stat-card';
    card.innerHTML = `<span class="stat-value">${s.value}</span><span class="stat-label">${s.label}</span>`;
    statsGrid.appendChild(card);
  });
  container.appendChild(statsGrid);

  // Activity
  const activityTitle = document.createElement('h3');
  activityTitle.textContent = localization.t('profile.recentActivity');
  container.appendChild(activityTitle);
  const activityList = document.createElement('div');
  activityList.className = 'activity-list';
  if (!activityLog || activityLog.length === 0) {
    activityList.innerHTML = `<p class="empty-state">${localization.t('profile.noActivity')}</p>`;
  } else {
    activityLog.slice(0, 10).forEach(entry => {
      const item = document.createElement('div');
      item.className = 'activity-item';
      item.textContent = formatActivity(entry);
      activityList.appendChild(item);
    });
  }
  container.appendChild(activityList);

  // Import/Export/Reset
  const actions = document.createElement('div');
  actions.className = 'profile-actions';
  [ 
    { text: localization.t('profile.export'), handler: onExport },
    { text: localization.t('profile.import'), handler: onImport },
    { text: localization.t('profile.reset'), handler: onReset, className: 'btn-danger' }
  ].forEach(({ text, handler, className }) => {
    const btn = document.createElement('button');
    btn.className = `btn btn-secondary ${className || ''}`;
    btn.textContent = text;
    btn.addEventListener('click', handler);
    actions.appendChild(btn);
  });
  container.appendChild(actions);

  return container;
}

function formatActivity(entry) {
  const d = new Date(entry.timestamp);
  const time = d.toLocaleTimeString();
  switch (entry.type) {
    case 'profile_created': return `🆕 Profile created`;
    case 'profile_updated': return `✏️ Profile updated`;
    case 'repository_saved': return `💾 Saved ${entry.details?.name || 'a repository'}`;
    case 'repository_removed': return `🗑️ Removed ${entry.details?.name || 'a repository'}`;
    case 'liked': return `👍 Liked ${entry.details?.name || 'a repository'}`;
    case 'disliked': return `👎 Disliked ${entry.details?.name || 'a repository'}`;
    case 'collection_created': return `📁 Created collection "${entry.details?.name || ''}"`;
    default: return `${entry.type}`;
  }
}