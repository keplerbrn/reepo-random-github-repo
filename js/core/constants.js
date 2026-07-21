export const EVENTS = {
  APP_INITIALIZED: 'APP_INITIALIZED',
  STATE_CHANGED: 'STATE_CHANGED',
  REPOSITORY_LOADING: 'REPOSITORY_LOADING',
  REPOSITORY_LOADED: 'REPOSITORY_LOADED',
  REPOSITORY_LOAD_ERROR: 'REPOSITORY_LOAD_ERROR',
  LANGUAGE_CHANGED: 'LANGUAGE_CHANGED'
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
  POPULAR_STARS: 10000
};

export const DEFAULT_STATE = {
  user: null,
  repository: {
    current: null,
    loading: false,
    error: null
  },
  discovery: {
    history: [],
    count: 0,
    sessionStart: null
  },
  collections: [],
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