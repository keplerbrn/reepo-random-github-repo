export const EVENTS = {
  APP_INITIALIZED: 'APP_INITIALIZED',
  STATE_CHANGED: 'STATE_CHANGED',
  REPOSITORY_LOADING: 'REPOSITORY_LOADING',
  REPOSITORY_LOADED: 'REPOSITORY_LOADED',
  REPOSITORY_LOAD_ERROR: 'REPOSITORY_LOAD_ERROR',
  LANGUAGE_CHANGED: 'LANGUAGE_CHANGED',
  DISCOVERY_STARTED: 'DISCOVERY_STARTED',
  DISCOVERY_LOADING: 'DISCOVERY_LOADING',
  DISCOVERY_COMPLETED: 'DISCOVERY_COMPLETED',
  DISCOVERY_FAILED: 'DISCOVERY_FAILED',
  DISCOVERY_HISTORY_UPDATED: 'DISCOVERY_HISTORY_UPDATED',
  REPOSITORY_CHANGED: 'REPOSITORY_CHANGED',
  KEYBOARD_SHORTCUT_TRIGGERED: 'KEYBOARD_SHORTCUT_TRIGGERED',
  REQUEST_NEXT_REPOSITORY: 'REQUEST_NEXT_REPOSITORY',
  REPOSITORY_RENDERED: 'REPOSITORY_RENDERED',
  REPOSITORY_OPENED: 'REPOSITORY_OPENED',
  REPOSITORY_SAVED: 'REPOSITORY_SAVED',
  REPOSITORY_REMOVED: 'REPOSITORY_REMOVED',
  REPOSITORY_LIKED: 'REPOSITORY_LIKED',
  REPOSITORY_DISLIKED: 'REPOSITORY_DISLIKED',
  REPOSITORY_SHARED: 'REPOSITORY_SHARED',
  COLLECTION_CREATED: 'COLLECTION_CREATED',
  COLLECTION_UPDATED: 'COLLECTION_UPDATED',
  COLLECTION_DELETED: 'COLLECTION_DELETED',
  REPOSITORY_ASSIGNED: 'REPOSITORY_ASSIGNED',
  IMPORT_COMPLETED: 'IMPORT_COMPLETED',
  EXPORT_COMPLETED: 'EXPORT_COMPLETED',
  VIEW_CHANGED: 'VIEW_CHANGED',
  FILTER_CHANGED: 'FILTER_CHANGED',
  FILTER_RESET: 'FILTER_RESET',
  FILTER_APPLIED: 'FILTER_APPLIED',
  FILTER_REMOVED: 'FILTER_REMOVED',
  FILTER_PANEL_OPENED: 'FILTER_PANEL_OPENED',
  FILTER_PANEL_CLOSED: 'FILTER_PANEL_CLOSED',
  SEARCH_STARTED: 'SEARCH_STARTED',
  SEARCH_COMPLETED: 'SEARCH_COMPLETED',
  SEARCH_CLEARED: 'SEARCH_CLEARED',
  DISCOVERY_MODE_CHANGED: 'DISCOVERY_MODE_CHANGED',
  DISCOVERY_QUEUE_UPDATED: 'DISCOVERY_QUEUE_UPDATED',
  HISTORY_OPENED: 'HISTORY_OPENED',
  HISTORY_CLEARED: 'HISTORY_CLEARED',
  RECENT_VIEW_UPDATED: 'RECENT_VIEW_UPDATED',
  PROFILE_CREATED: 'PROFILE_CREATED',
  PROFILE_UPDATED: 'PROFILE_UPDATED',
  PROFILE_RESET: 'PROFILE_RESET',
  PROFILE_IMPORTED: 'PROFILE_IMPORTED',
  PROFILE_EXPORTED: 'PROFILE_EXPORTED',
  PROFILE_OPENED: 'PROFILE_OPENED',
  PROFILE_CLOSED: 'PROFILE_CLOSED',
  SETTINGS_UPDATED: 'SETTINGS_UPDATED',
  THEME_CHANGED: 'THEME_CHANGED',
  ACCESSIBILITY_CHANGED: 'ACCESSIBILITY_CHANGED',
  SHORTCUTS_UPDATED: 'SHORTCUTS_UPDATED',
  APPLICATION_RESET: 'APPLICATION_RESET',
  XP_GAINED: 'XP_GAINED',
  LEVEL_UP: 'LEVEL_UP',
  BADGE_UNLOCKED: 'BADGE_UNLOCKED',
  ACHIEVEMENT_UNLOCKED: 'ACHIEVEMENT_UNLOCKED',
  QUEST_COMPLETED: 'QUEST_COMPLETED',
  STREAK_UPDATED: 'STREAK_UPDATED'
};

export const DISCOVERY_MODES = {
  RANDOM: 'random',
  LEAST_VIEWED: 'leastViewed',
  RECENTLY_UPDATED: 'recentlyUpdated',
  POPULAR: 'popular'
};

export const DISCOVERY_MODE_LABELS = {
  random: 'Random',
  leastViewed: 'Least Viewed',
  recentlyUpdated: 'Recently Updated',
  popular: 'Popular'
};

export const RECENT_REPOS_LIMIT = 10;
export const QUEUE_SIZE = 5;
export const THRESHOLDS = {
  POPULAR_STARS: 1000,
  RECENTLY_UPDATED_DAYS: 30
};

export const SUPPORTED_LANGUAGES = ['JavaScript', 'TypeScript', 'Python', 'Ruby', 'Go', 'Rust', 'Java', 'C#', 'C++', 'PHP'];
export const UPDATE_RANGES = [
  { value: 'any', label: 'Any Time' },
  { value: 'week', label: 'Last Week' },
  { value: 'month', label: 'Last Month' },
  { value: 'year', label: 'Last Year' }
];

export const AVATARS = ['default', '🐱', '🐶', '🦊', '🐸', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐭'];

export const STORAGE_KEYS = {
  SAVED_REPOSITORIES: 'savedRepositories',
  REACTIONS: 'reactions',
  COLLECTIONS: 'collections',
  FILTERS: 'filters',
  DISCOVERY_HISTORY: 'discoveryHistory',
  RECENTLY_VIEWED: 'recentlyViewed',
  DISCOVERY_MODE: 'discoveryMode',
  VIEW_COUNTS: 'viewCounts',
  USER_PROFILE: 'userProfile',
  ACTIVITY_LOG: 'activityLog',
  GAMIFICATION: 'gamification',
  SETTINGS: 'settings'
};

export const DEFAULT_FILTERS = {
  language: '',
  minStars: 0,
  updatedWithin: 'any',
  includeForks: true,
  includeArchived: true,
  license: '',
  topics: []
};

export const DEFAULT_STATE = {
  user: {
    username: '',
    avatar: 'default',
    joinDate: null,
    bio: ''
  },
  activityLog: [],
  repository: { current: null, loading: false, error: null },
  discovery: {
    currentRepository: null,
    history: [],
    count: 0,
    sessionStart: null,
    mode: DISCOVERY_MODES.RANDOM,
    queue: []
  },
  collections: [],
  savedRepositories: [],
  reactions: {},
  filters: { ...DEFAULT_FILTERS },
  viewCounts: {},
  recentlyViewed: [],
  search: { query: '', results: [] },
  statistics: {},
  gamification: {
    xp: 0,
    level: 1,
    badges: [],
    achievements: [],
    currentStreak: 0,
    longestStreak: 0,
    lastActivityDate: null,
    dailyQuests: [],
    questsCompletedToday: 0
  },
  settings: {
    theme: 'dark',
    language: 'en',
    notifications: { xp: true, badge: true, achievement: true, quest: true },
    accessibility: { reducedMotion: false, largeFont: false, highContrast: false },
    discovery: { defaultMode: 'random', autoOpenFilters: false, enableQueue: true },
    shortcutsEnabled: true
  },
  localization: { activeLanguage: 'en' },
  session: { startTime: null },
  currentView: 'home'
};