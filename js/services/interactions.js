import { eventBus } from '../../core/eventBus.js';
import { EVENTS } from '../../core/constants.js';
import { collectionService } from '../../services/collectionService.js';
import { reactionService } from '../../services/reactionService.js';

export function initializeInteractions() {
  // Listen for custom events bubbling from repository card
  document.addEventListener('save-repository', handleSave);
  document.addEventListener('like-repository', handleLike);
  document.addEventListener('dislike-repository', handleDislike);
  document.addEventListener('share-repository', handleShare);
  document.addEventListener('open-github', handleOpenGitHub);
}

function handleSave(event) {
  const repo = event.detail;
  if (!repo) return;

  const saved = collectionService.isSaved(repo.id);
  if (saved) {
    collectionService.removeRepository(repo.id);
    eventBus.emit(EVENTS.REPOSITORY_REMOVED, { repository: repo });
  } else {
    collectionService.saveRepository(repo);
    eventBus.emit(EVENTS.REPOSITORY_SAVED, { repository: repo });
  }
}

function handleLike(event) {
  const repo = event.detail;
  if (!repo) return;

  const current = reactionService.getReaction(repo.id);
  if (current === 'like') {
    // Toggle off
    reactionService.setReaction(repo.id, null);
    eventBus.emit(EVENTS.REPOSITORY_LIKED, { repository: repo, status: 'removed' });
  } else {
    reactionService.setReaction(repo.id, 'like');
    eventBus.emit(EVENTS.REPOSITORY_LIKED, { repository: repo, status: 'added' });
    // If dislike was set, DISLIKED event will fire as well
    if (current === 'dislike') {
      eventBus.emit(EVENTS.REPOSITORY_DISLIKED, { repository: repo, status: 'removed' });
    }
  }
}

function handleDislike(event) {
  const repo = event.detail;
  if (!repo) return;

  const current = reactionService.getReaction(repo.id);
  if (current === 'dislike') {
    reactionService.setReaction(repo.id, null);
    eventBus.emit(EVENTS.REPOSITORY_DISLIKED, { repository: repo, status: 'removed' });
  } else {
    reactionService.setReaction(repo.id, 'dislike');
    eventBus.emit(EVENTS.REPOSITORY_DISLIKED, { repository: repo, status: 'added' });
    if (current === 'like') {
      eventBus.emit(EVENTS.REPOSITORY_LIKED, { repository: repo, status: 'removed' });
    }
  }
}

async function handleShare(event) {
  const repo = event.detail;
  if (!repo) return;

  try {
    if (navigator.share) {
      await navigator.share({
        title: repo.name,
        text: repo.description,
        url: repo.url
      });
    } else {
      await navigator.clipboard.writeText(repo.url);
    }
    eventBus.emit(EVENTS.REPOSITORY_SHARED, { repository: repo, method: navigator.share ? 'native' : 'clipboard' });
  } catch (error) {
    console.warn('Share failed:', error);
  }
}

function handleOpenGitHub(event) {
  const repo = event.detail;
  if (repo) {
    // Open is already done by the card button, just fire event
    eventBus.emit(EVENTS.REPOSITORY_OPENED, { repository: repo });
  }
}