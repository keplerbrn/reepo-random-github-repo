import { eventBus } from './core/eventBus.js';
import { EVENTS } from './core/constants.js';
import { startDiscovery } from './features/discovery.js';
import { initializeAppController } from './ui/appController.js';
import { initializeInteractions } from './features/repository/interactions-v3.js';
import { localization } from './core/localization.js';
import { CONFIG } from './core/config.js';
import { collectionService } from './services/collectionService.js';
import { reactionService } from './services/reactionService.js';
import { filterService } from './services/filterService.js';
import { profileService } from './services/profileService.js';
import { settingsService } from './services/settingsService.js';
import { gamificationService } from './core/gamificationService.js';
import { initializeGamification } from './features/gamification/index.js';
import { stateManager } from './core/stateManager.js';

class App {
  constructor() {
    this.initialized = false;
    this.deferredPrompt = null;
  }

  async initialize() {
    if (this.initialized) return;
    
    try {
      // 1. Önce servisleri başlat
      localization.setLanguage(CONFIG.DEFAULT_LANGUAGE);
      
      collectionService.init();
      reactionService.init();
      filterService.init();
      profileService.init();
      settingsService.init();
      gamificationService.init();
      initializeGamification();

      localization.setLanguage(stateManager.getState().settings.language);
      this.updateStaticTexts();

      // 2. Dil değişikliği dinleyicisi
      eventBus.on(EVENTS.LANGUAGE_CHANGED, ({ language }) => {
        localization.setLanguage(language);
        this.updateStaticTexts();
      });
      
      // 3. Discovery'yi başlat (sadece event dinleyicilerini kaydeder)
      await startDiscovery();
      
      // 4. UI kontrolcüsünü başlat (view'leri render eder)
      initializeAppController();
      
      // 5. Interaksiyonları başlat (buton tıklamaları vs)
      initializeInteractions();
      
      // 6. PWA
      this.registerServiceWorker();
      this.listenInstallPrompt();

      this.initialized = true;
      
      // 7. Uygulama hazır - HOME view gösterilecek
      eventBus.emit(EVENTS.APP_INITIALIZED);
      
      // 8. Home view'i göster (currentView zaten 'home')
      eventBus.emit(EVENTS.VIEW_CHANGED, { view: 'home' });
      
      console.log('Reepo initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Reepo:', error);
    }
  }

  updateStaticTexts() {
    const footerEl = document.getElementById('footer-text');
    if (footerEl) footerEl.textContent = localization.t('app.footer') || 'Reepo v2';
  }

  registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
          .then((reg) => console.log('SW registered:', reg.scope))
          .catch((err) => console.log('SW registration failed:', err));
      });
    }
  }

  listenInstallPrompt() {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
    });
    window.addEventListener('appinstalled', () => {
      console.log('PWA installed');
      this.deferredPrompt = null;
    });
  }
}

const app = new App();
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => app.initialize());
} else {
  app.initialize();
}

export { app };