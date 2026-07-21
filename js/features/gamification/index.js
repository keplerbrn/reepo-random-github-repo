import { eventBus } from '../../core/eventBus.js';
import { EVENTS } from '../../core/constants.js';
import { gamificationService } from '../../services/gamificationService.js';
import { showRewardNotification } from '../../ui/rewardNotification.js';

export function initializeGamification() {
  // Listen to actions that award XP
  eventBus.on(EVENTS.DISCOVERY_COMPLETED, () => gamificationService.processAction('discovery'));
  eventBus.on(EVENTS.REPOSITORY_SAVED, () => gamificationService.processAction('save'));
  eventBus.on(EVENTS.REPOSITORY_LIKED, () => gamificationService.processAction('like'));
  eventBus.on(EVENTS.REPOSITORY_DISLIKED, () => gamificationService.processAction('dislike'));
  eventBus.on(EVENTS.COLLECTION_CREATED, () => gamificationService.processAction('collection_created'));

  // Reward notifications
  eventBus.on(EVENTS.LEVEL_UP, ({ level }) => showRewardNotification(`Level Up! You are now level ${level}.`, '⬆️'));
  eventBus.on(EVENTS.BADGE_UNLOCKED, (badge) => showRewardNotification(`Badge Unlocked: ${badge.title}`, '🏅'));
  eventBus.on(EVENTS.ACHIEVEMENT_UNLOCKED, (ach) => showRewardNotification(`Achievement: ${ach.title}`, '🏆'));
  eventBus.on(EVENTS.QUEST_COMPLETED, ({ quest }) => showRewardNotification(`Quest Completed: ${quest.title}`, '✅'));
  eventBus.on(EVENTS.STREAK_UPDATED, ({ currentStreak }) => {
    if (currentStreak > 1) showRewardNotification(`Streak: ${currentStreak} days!`, '🔥');
  });
}