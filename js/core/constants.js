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
  REPOSITORY_SHARED: 'REPOSITORY_SHARED'
};

export const FEATURE_IDS = {
  DISC_001: 'DISC-001',
  CARD_001: 'CARD-001',
  CARD_002: 'CARD-002',
  CARD_003: 'CARD-003',
  CARD_004: 'CARD-004',
  COL_001: 'COL-001'
};

export const THRESHOLDS = {
  POPULAR_STARS: 10000,
  RECENTLY_UPDATED_DAYS: 7
};

export const DISCOVERY_MODES = {
  RANDOM: 'random'
};

export const RECENT_REPOS_LIMIT = 10;

export const STORAGE_KEYS = {
  SAVED_REPOSITORIES: 'savedRepositories',
  REACTIONS: 'reactions'
};

export const DEFAULT_STATE = {
  user: null,
  repository: {
    current: null,
    loading: false,
    error: null
  },
  discovery: {
    currentRepository: null,
    history: [],
    count: 0,
    sessionStart: null,
    mode: DISCOVERY_MODES.RANDOM
  },
  collections: [],
  savedRepositories: [],
  reactions: {},
  filters: {},
  statistics: {},
  gamification: {},
  settings: {
    theme: 'dark',
    language: 'en',
    animations: true,
    sound: false,
    compactMode: false
  },
  localization: {
    activeLanguage: 'en'
  },
  session: {
    startTime: null
  }
};