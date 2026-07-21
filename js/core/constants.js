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
  FILTER_PANEL_CLOSED: 'FILTER_PANEL_CLOSED'
};

export const FEATURE_IDS = {
  DISC_001: 'DISC-001',
  CARD_001: 'CARD-001',
  CARD_002: 'CARD-002',
  CARD_003: 'CARD-003',
  CARD_004: 'CARD-004',
  COL_001: 'COL-001',
  COL_002: 'COL-002',
  COL_003: 'COL-003',
  COL_004: 'COL-004',
  COL_005: 'COL-005',
  COL_006: 'COL-006',
  FIL_001: 'FIL-001',
  FIL_002: 'FIL-002',
  FIL_003: 'FIL-003',
  FIL_004: 'FIL-004',
  FIL_005: 'FIL-005',
  FIL_006: 'FIL-006',
  FIL_007: 'FIL-007',
  FIL_008: 'FIL-008'
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
  REACTIONS: 'reactions',
  COLLECTIONS: 'collections',
  FILTERS: 'filters'
};

export const SUPPORTED_LANGUAGES = [
  'JavaScript', 'TypeScript', 'Python', 'Go', 'Rust',
  'Java', 'C#', 'C++', 'PHP', 'Swift', 'Kotlin'
];

export const UPDATE_RANGES = [
  { value: 'any', label: 'Any time' },
  { value: 'month', label: 'Last Month' },
  { value: '6months', label: 'Last 6 Months' },
  { value: 'year', label: 'Last Year' }
];

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
  filters: { ...DEFAULT_FILTERS },
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
  },
  currentView: 'discovery'
};