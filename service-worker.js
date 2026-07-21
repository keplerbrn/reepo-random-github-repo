const CACHE_NAME = 'reepo-v1.1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/style.css',
  '/js/app.js',
  '/js/core/config.js',
  '/js/core/constants.js',
  '/js/core/eventBus.js',
  '/js/core/stateManager.js',
  '/js/core/storage.js',
  '/js/core/localization.js',
  '/js/core/locales/en.js',
  '/js/core/locales/tr.js',
  '/js/core/gamificationData.js',
  '/js/utils/formatting.js',
  '/js/utils/validation.js',
  '/js/utils/dateUtils.js',
  '/js/services/repositoryService.js',
  '/js/services/collectionService.js',
  '/js/services/reactionService.js',
  '/js/services/filterService.js',
  '/js/services/searchService.js',
  '/js/services/discoveryQueueService.js',
  '/js/services/profileService.js',
  '/js/services/gamificationService.js',
  '/js/services/statisticsService.js',
  '/js/services/settingsService.js',
  '/js/ui/repositoryCard.js',
  '/js/ui/appController.js',
  '/js/ui/collectionsView.js',
  '/js/ui/collectionCard.js',
  '/js/ui/savedReposList.js',
  '/js/ui/searchSortBar.js',
  '/js/ui/importExport.js',
  '/js/ui/filterPanel.js',
  '/js/ui/searchBar.js',
  '/js/ui/historyPanel.js',
  '/js/ui/discoveryModeSelector.js',
  '/js/ui/profileView.js',
  '/js/ui/profileEditor.js',
  '/js/ui/rewardNotification.js',
  '/js/ui/statisticsDashboard.js',
  '/js/ui/settingsPanel.js',
  '/js/features/discovery.js',
  '/js/features/repository/interactions.js',
  '/js/features/collections/index.js',
  '/js/features/filters/index.js',
  '/js/features/search/index.js',
  '/js/features/profile/index.js',
  '/js/features/gamification/index.js',
  '/js/features/statistics/index.js',
  '/js/features/settings/index.js',
  '/data/repos.json',
  '/manifest.json',
  '/assets/icons/icon.svg'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      const networked = fetch(event.request)
        .then(response => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          return response;
        })
        .catch(() => cached || caches.match('/offline.html'));
      return cached || networked;
    })
  );
});

self.addEventListener('activate', event => {
  clients.claim();
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
});