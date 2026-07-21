// XP values for actions
export const XP_VALUES = {
  DISCOVERY: 5,
  SAVE: 10,
  LIKE: 2,
  DISLIKE: 1,
  COLLECTION_CREATED: 15,
  QUEST_COMPLETED: 20
};

// Level formula: level = floor(sqrt(xp / 100)) + 1
export function getLevelFromXP(xp) {
  return Math.floor(Math.sqrt(xp / 100)) + 1;
}

// XP required for next level
export function getXPForNextLevel(level) {
  return (level) * (level) * 100;
}

// Achievements definitions (condition functions receive app state)
export const ACHIEVEMENTS = [
  {
    id: 'first_discovery',
    title: 'First Discovery',
    description: 'Discover your first repository.',
    category: 'discovery',
    condition: (state) => state.discovery.count >= 1,
    hidden: false
  },
  {
    id: 'explorer_10',
    title: 'Explorer',
    description: 'Discover 10 repositories.',
    category: 'discovery',
    condition: (state) => state.discovery.count >= 10,
    hidden: false
  },
  {
    id: 'collector_5',
    title: 'Collector',
    description: 'Save 5 repositories.',
    category: 'collections',
    condition: (state) => (state.savedRepositories || []).length >= 5,
    hidden: false
  },
  {
    id: 'liker_20',
    title: 'Liker',
    description: 'Like 20 repositories.',
    category: 'activity',
    condition: (state) => {
      const reactions = state.reactions || {};
      return Object.values(reactions).filter(r => r === 'like').length >= 20;
    },
    hidden: false
  },
  {
    id: 'streak_3',
    title: 'Consistent Explorer',
    description: 'Maintain a 3-day streak.',
    category: 'activity',
    condition: (state) => (state.gamification.currentStreak || 0) >= 3,
    hidden: false
  },
  {
    id: 'streak_7',
    title: 'Weekly Warrior',
    description: 'Maintain a 7-day streak.',
    category: 'activity',
    condition: (state) => (state.gamification.currentStreak || 0) >= 7,
    hidden: true
  }
];

// Badge definitions (conditions based on milestones)
export const BADGES = [
  {
    id: 'beginner',
    title: 'Beginner',
    description: 'Reach level 5.',
    category: 'milestones',
    condition: (state) => state.gamification.level >= 5
  },
  {
    id: 'advanced',
    title: 'Advanced',
    description: 'Reach level 10.',
    category: 'milestones',
    condition: (state) => state.gamification.level >= 10
  },
  {
    id: 'saver_10',
    title: 'Super Saver',
    description: 'Save 10 repositories.',
    category: 'collections',
    condition: (state) => (state.savedRepositories || []).length >= 10
  },
  {
    id: 'discoverer_50',
    title: 'Discoverer',
    description: 'Discover 50 repositories.',
    category: 'discovery',
    condition: (state) => state.discovery.count >= 50
  }
];

// Daily quest templates
export const QUEST_TEMPLATES = [
  { id: 'q_discover_5', title: 'Discover 5 repos', target: 5, type: 'discovery', description: 'Discover 5 repositories today.' },
  { id: 'q_save_2', title: 'Save 2 repos', target: 2, type: 'save', description: 'Save 2 repositories today.' },
  { id: 'q_like_3', title: 'Like 3 repos', target: 3, type: 'like', description: 'Like 3 repositories today.' }
];