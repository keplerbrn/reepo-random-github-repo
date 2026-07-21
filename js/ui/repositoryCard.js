import { formatNumber } from '../utils/formatting.js';
import { getDaysAgo } from '../utils/dateUtils.js';
import { truncateText } from '../utils/formatting.js';
import { localization } from '../core/localization.js';
import { THRESHOLDS } from '../core/constants.js';

export function createRepositoryCard(repository) {
  if (!repository) {
    return createEmptyCard();
  }

  const card = document.createElement('article');
  card.className = 'repository-card';
  card.setAttribute('role', 'article');
  card.setAttribute('aria-label', `Repository: ${repository.name}`);

  // Header
  const header = document.createElement('header');
  header.className = 'card-header';
  
  const repoName = document.createElement('h2');
  repoName.className = 'repo-name';
  repoName.textContent = repository.name;
  
  const owner = document.createElement('span');
  owner.className = 'repo-owner';
  owner.textContent = repository.owner;
  
  const verificationBadge = document.createElement('span');
  verificationBadge.className = 'verification-badge';
  verificationBadge.setAttribute('aria-label', localization.t('status.verified'));
  verificationBadge.setAttribute('role', 'img');
  verificationBadge.innerHTML = '<span aria-hidden="true">✓</span>';
  
  header.appendChild(repoName);
  header.appendChild(owner);
  header.appendChild(verificationBadge);
  
  // Description
  const description = document.createElement('p');
  description.className = 'repo-description';
  description.textContent = truncateText(repository.description, 200);
  
  // Stats
  const stats = document.createElement('div');
  stats.className = 'repo-stats';
  
  if (repository.language) {
    const language = document.createElement('span');
    language.className = 'stat language';
    language.textContent = repository.language;
    stats.appendChild(language);
  }
  
  const stars = document.createElement('span');
  stars.className = 'stat stars';
  stars.textContent = `★ ${formatNumber(repository.stars)}`;
  stats.appendChild(stars);
  
  const forks = document.createElement('span');
  forks.className = 'stat forks';
  forks.textContent = `⑂ ${formatNumber(repository.forks)}`;
  stats.appendChild(forks);
  
  if (repository.license) {
    const license = document.createElement('span');
    license.className = 'stat license';
    license.textContent = repository.license;
    stats.appendChild(license);
  }
  
  const updated = document.createElement('span');
  updated.className = 'stat updated';
  updated.textContent = `Updated ${getDaysAgo(repository.lastUpdated)} days ago`;
  stats.appendChild(updated);
  
  // Topics
  const topics = document.createElement('div');
  topics.className = 'repo-topics';
  
  if (repository.topics && Array.isArray(repository.topics)) {
    repository.topics.slice(0, 5).forEach(topic => {
      const tag = document.createElement('span');
      tag.className = 'topic-tag';
      tag.textContent = topic;
      topics.appendChild(tag);
    });
  }
  
  // Status indicators
  const statusIndicators = document.createElement('div');
  statusIndicators.className = 'status-indicators';
  
  if (repository.archived) {
    const archivedBadge = document.createElement('span');
    archivedBadge.className = 'status-badge archived';
    archivedBadge.textContent = localization.t('status.archived');
    statusIndicators.appendChild(archivedBadge);
  }
  
  if (repository.fork) {
    const forkBadge = document.createElement('span');
    forkBadge.className = 'status-badge fork';
    forkBadge.textContent = localization.t('status.fork');
    statusIndicators.appendChild(forkBadge);
  }
  
  if (repository.stars > THRESHOLDS.POPULAR_STARS) {
    const popularBadge = document.createElement('span');
    popularBadge.className = 'status-badge popular';
    popularBadge.textContent = localization.t('status.popular');
    statusIndicators.appendChild(popularBadge);
  }
  
  // Actions
  const actions = document.createElement('div');
  actions.className = 'card-actions';
  
  const openButton = createButton(localization.t('card.openGitHub'), 'primary', () => {
    window.open(repository.url, '_blank', 'noopener,noreferrer');
  });
  
  const saveButton = createButton(localization.t('card.save'), 'secondary', () => {
    card.dispatchEvent(new CustomEvent('save-repository', { 
      bubbles: true, 
      detail: repository 
    }));
  });
  
  const likeButton = createButton(localization.t('card.like'), 'ghost', () => {
    card.dispatchEvent(new CustomEvent('like-repository', { 
      bubbles: true, 
      detail: repository 
    }));
  });
  
  const dislikeButton = createButton(localization.t('card.dislike'), 'ghost', () => {
    card.dispatchEvent(new CustomEvent('dislike-repository', { 
      bubbles: true, 
      detail: repository 
    }));
  });
  
  actions.appendChild(openButton);
  actions.appendChild(saveButton);
  actions.appendChild(likeButton);
  actions.appendChild(dislikeButton);
  
  // Assembly
  card.appendChild(header);
  card.appendChild(description);
  card.appendChild(stats);
  card.appendChild(topics);
  card.appendChild(statusIndicators);
  card.appendChild(actions);
  
  return card;
}

function createButton(text, variant = 'primary', onClick) {
  const button = document.createElement('button');
  button.className = `btn btn-${variant}`;
  button.textContent = text;
  button.setAttribute('type', 'button');
  
  if (onClick) {
    button.addEventListener('click', onClick);
  }
  
  return button;
}

function createEmptyCard() {
  const card = document.createElement('article');
  card.className = 'repository-card empty';
  card.setAttribute('role', 'status');
  card.setAttribute('aria-label', localization.t('discovery.noRepository'));
  
  const message = document.createElement('p');
  message.className = 'empty-message';
  message.textContent = localization.t('discovery.noRepository');
  
  card.appendChild(message);
  return card;
}