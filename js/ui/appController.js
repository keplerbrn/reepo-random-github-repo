import { eventBus } from '../core/eventBus.js';
import { EVENTS } from '../core/constants.js';
import { createRepositoryCard } from './repositoryCard.js';
import { localization } from '../core/localization.js';

export function initializeAppController() {
  const mainContent = document.getElementById('main-content');
  
  // Discovery event listeners (only active events)
  eventBus.on(EVENTS.DISCOVERY_LOADING, () => {
    showLoading(mainContent);
  });
  
  eventBus.on(EVENTS.DISCOVERY_COMPLETED, (data) => {
    renderRepository(mainContent, data.repository);
  });
  
  eventBus.on(EVENTS.DISCOVERY_FAILED, (data) => {
    showError(mainContent, data.error);
  });
  
  // Keyboard shortcuts
  document.addEventListener('keydown', (event) => {
    if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA' || event.target.isContentEditable) {
      return;
    }
    
    let shortcut = null;
    let targetAction = null;
    
    switch (event.code) {
      case 'Space':
        event.preventDefault();
        shortcut = 'Space';
        eventBus.emit(EVENTS.REQUEST_NEXT_REPOSITORY);
        break;
      case 'Escape':
        shortcut = 'ESC';
        // Close modal logic will be added in future sprints
        break;
      case 'KeyS':
        if (!event.ctrlKey && !event.metaKey) {
          shortcut = 'S';
          targetAction = 'save-repository';
        }
        break;
      case 'KeyL':
        if (!event.ctrlKey && !event.metaKey) {
          shortcut = 'L';
          targetAction = 'like-repository';
        }
        break;
      case 'KeyD':
        if (!event.ctrlKey && !event.metaKey) {
          shortcut = 'D';
          targetAction = 'dislike-repository';
        }
        break;
    }
    
    if (shortcut) {
      eventBus.emit(EVENTS.KEYBOARD_SHORTCUT_TRIGGERED, { shortcut });
      
      if (targetAction) {
        const triggered = triggerActionButton(targetAction);
        if (!triggered) {
          console.warn(`Keyboard shortcut "${shortcut}" triggered but no "${targetAction}" button found.`);
        }
      }
    }
  });
}

/**
 * Finds and clicks a button with the given data-action value.
 * Provides visual feedback by briefly highlighting the button.
 * @param {string} action - The data-action attribute value to find.
 * @returns {boolean} Whether the button was found and clicked.
 */
function triggerActionButton(action) {
  const button = document.querySelector(`.repository-card .btn[data-action="${action}"]`);
  if (button) {
    button.click();
    
    // Provide visual feedback for keyboard users
    button.classList.add('keyboard-active');
    setTimeout(() => {
      button.classList.remove('keyboard-active');
    }, 150);
    
    return true;
  }
  return false;
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
  // Buttons already have data-action attributes from repositoryCard.js
}

function showError(container, error) {
  container.innerHTML = '';
  const errorDiv = document.createElement('div');
  errorDiv.className = 'error-state';
  errorDiv.setAttribute('role', 'alert');
  errorDiv.setAttribute('tabindex', '-1');
  
  const message = document.createElement('p');
  message.textContent = localization.t('discovery.error');
  
  const details = document.createElement('p');
  details.className = 'error-details';
  details.textContent = error || localization.t('discovery.error');
  
  const retryButton = document.createElement('button');
  retryButton.className = 'btn btn-primary';
  retryButton.textContent = localization.t('discovery.retry');
  retryButton.addEventListener('click', () => {
    eventBus.emit(EVENTS.REQUEST_NEXT_REPOSITORY);
  });
  
  errorDiv.appendChild(message);
  errorDiv.appendChild(details);
  errorDiv.appendChild(retryButton);
  
  container.appendChild(errorDiv);
  
  // Move focus to error message for keyboard users
  errorDiv.focus();
}