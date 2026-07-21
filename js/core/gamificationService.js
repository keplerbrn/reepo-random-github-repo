import { stateManager } from '../core/stateManager.js';
import { storage } from '../core/storage.js';
import { eventBus } from '../core/eventBus.js';
import { STORAGE_KEYS, EVENTS } from '../core/constants.js';
import { XP_VALUES, getLevelFromXP, getXPForNextLevel, ACHIEVEMENTS, BADGES, QUEST_TEMPLATES } from '../core/gamificationData.js';

class GamificationService {
  init() {
    const saved = storage.getItem(STORAGE_KEYS.GAMIFICATION);
    if (saved) {
      stateManager.setState('gamification', { ...stateManager.getState().gamification, ...saved });
    }
    // Reset quests if new day
    this.checkNewDay();
  }

  // Core XP
  awardXP(amount, reason) {
    if (amount <= 0) return;
    const state = stateManager.getState();
    const oldXP = state.gamification.xp;
    const newXP = oldXP + amount;
    stateManager.setState('gamification.xp', newXP);
    eventBus.emit(EVENTS.XP_GAINED, { amount, reason, total: newXP });

    const oldLevel = state.gamification.level;
    const newLevel = getLevelFromXP(newXP);
    if (newLevel > oldLevel) {
      stateManager.setState('gamification.level', newLevel);
      eventBus.emit(EVENTS.LEVEL_UP, { level: newLevel });
    }
    this.save();
    this.checkBadges();  // some badges tied to level
    this.checkAchievements();
  }

  // Process an action (called from feature listeners)
  processAction(actionType, details = {}) {
    let xpAmount = 0;
    switch (actionType) {
      case 'discovery': xpAmount = XP_VALUES.DISCOVERY; break;
      case 'save': xpAmount = XP_VALUES.SAVE; break;
      case 'like': xpAmount = XP_VALUES.LIKE; break;
      case 'dislike': xpAmount = XP_VALUES.DISLIKE; break;
      case 'collection_created': xpAmount = XP_VALUES.COLLECTION_CREATED; break;
    }
    if (xpAmount > 0) {
      this.awardXP(xpAmount, actionType);
    }
    // Update streak (any action counts)
    this.updateStreak();
    // Update quest progress
    this.updateQuestProgress(actionType, details);
    // Check achievements and badges after state changes
    this.checkAchievements();
    this.checkBadges();
  }

  // Streak
  updateStreak() {
    const today = new Date().toISOString().split('T')[0];
    const state = stateManager.getState();
    let { lastActivityDate, currentStreak, longestStreak } = state.gamification;
    if (lastActivityDate === today) return; // already recorded today

    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    if (lastActivityDate === yesterday) {
      currentStreak += 1;
    } else if (lastActivityDate !== today) {
      currentStreak = 1; // reset if not consecutive
    }
    if (currentStreak > longestStreak) longestStreak = currentStreak;

    stateManager.setState('gamification.currentStreak', currentStreak);
    stateManager.setState('gamification.longestStreak', longestStreak);
    stateManager.setState('gamification.lastActivityDate', today);
    eventBus.emit(EVENTS.STREAK_UPDATED, { currentStreak, longestStreak });
    this.save();
  }

  // Daily quests
  checkNewDay() {
    const today = new Date().toISOString().split('T')[0];
    const state = stateManager.getState();
    const questDate = state.gamification._questDate;
    if (questDate !== today) {
      this.generateDailyQuests();
      stateManager.setState('gamification._questDate', today);
      stateManager.setState('gamification.questsCompletedToday', 0);
    }
  }

  generateDailyQuests() {
    // Select 3 random quests from templates
    const shuffled = [...QUEST_TEMPLATES].sort(() => Math.random() - 0.5).slice(0, 3);
    const quests = shuffled.map(q => ({ ...q, progress: 0, completed: false }));
    stateManager.setState('gamification.dailyQuests', quests);
    this.save();
  }

  updateQuestProgress(actionType) {
    const quests = stateManager.getState().gamification.dailyQuests || [];
    let updated = false;
    quests.forEach(q => {
      if (q.completed) return;
      if (q.type === actionType || (q.type === 'discovery' && actionType === 'discovery')) {
        q.progress += 1;
        if (q.progress >= q.target) {
          q.completed = true;
          stateManager.updateState('gamification.questsCompletedToday', v => (v || 0) + 1);
          this.awardXP(XP_VALUES.QUEST_COMPLETED, 'quest');
          eventBus.emit(EVENTS.QUEST_COMPLETED, { quest: q });
        }
        updated = true;
      }
    });
    if (updated) {
      stateManager.setState('gamification.dailyQuests', quests);
      this.save();
    }
  }

  // Achievements & Badges
  checkAchievements() {
    const state = stateManager.getState();
    const unlocked = state.gamification.achievements || [];
    ACHIEVEMENTS.forEach(ach => {
      if (unlocked.find(a => a.id === ach.id)) return;
      if (ach.condition(state)) {
        const entry = { ...ach, unlockedAt: new Date().toISOString() };
        stateManager.updateState('gamification.achievements', arr => [...arr, entry]);
        eventBus.emit(EVENTS.ACHIEVEMENT_UNLOCKED, entry);
        this.save();
      }
    });
  }

  checkBadges() {
    const state = stateManager.getState();
    const owned = state.gamification.badges || [];
    BADGES.forEach(badge => {
      if (owned.find(b => b.id === badge.id)) return;
      if (badge.condition(state)) {
        const entry = { ...badge, unlockedAt: new Date().toISOString() };
        stateManager.updateState('gamification.badges', arr => [...arr, entry]);
        eventBus.emit(EVENTS.BADGE_UNLOCKED, entry);
        this.save();
      }
    });
  }

  // Helpers
  getLevelProgress() {
    const state = stateManager.getState();
    const xp = state.gamification.xp;
    const level = state.gamification.level;
    const currentLevelXP = getXPForNextLevel(level - 1);
    const nextLevelXP = getXPForNextLevel(level);
    return {
      current: xp - currentLevelXP,
      needed: nextLevelXP - currentLevelXP,
      level
    };
  }

  save() {
    storage.setItem(STORAGE_KEYS.GAMIFICATION, stateManager.getState().gamification);
  }
}

export const gamificationService = new GamificationService();