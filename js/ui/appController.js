import { eventBus } from '../core/eventBus.js';
import { EVENTS } from '../core/constants.js';
import { createRepositoryCard } from './repositoryCard.js';
import { localization } from '../core/localization.js';

export function initializeAppController() {
  const mainContent = document.getElementById('main-content');
  
  eventBus.on(EVENTS.REPOSITORY_LOADING, () => {
    showLoading(mainContent);
  });
  
  eventBus.on(EVENTS.REPOSITORY_LOADED, (data) => {
    renderRepository(mainContent, data.repository);
  });
  
  eventBus.on(EVENTS.REPOSITORY_LOAD_ERROR, (data) => {
    showError(mainContent, data.error);
  });
}

function showLoading(container) {
  container.innerHTML = '';
  const skeleton = document.createElement('div');
  skeleton.className = 'card-skeleton';
  skeleton.setAttribute('role', 'status');
  skeleton.setAttribute('aria-label', localization.t('discovery.loading'));
  
  skeleton.innerHTML = `
    <div class="skeleton-header"></div>
    <div class="skeleton-description"></div>
    <div class="skeleton-stats"></div>
    <div class="skeleton-actions"></div>
  `;
  
  container.appendChild(skeleton);
}

function renderRepository(container, repository) {
  container.innerHTML = '';
  const card = createRepositoryCard(repository);
  container.appendChild(card);
}

function showError(container, error) {
  container.innerHTML = '';
  const errorDiv = document.createElement('div');
  errorDiv.className = 'error-state';
  errorDiv.setAttribute('role', 'alert');
  
  const message = document.createElement('p');
  message.textContent = localization.t('discovery.error');
  
  const details = document.createElement('p');
  details.className = 'error-details';
  details.textContent = error;
  
  const retryButton = document.createElement('button');
  retryButton.className = 'btn btn-primary';
  retryButton.textContent = localization.t('discovery.retry');
  retryButton.addEventListener('click', () => {
    eventBus.emit(EVENTS.APP_INITIALIZED);
  });
  
  errorDiv.appendChild(message);
  errorDiv.appendChild(details);
  errorDiv.appendChild(retryButton);
  
  container.appendChild(errorDiv);
}