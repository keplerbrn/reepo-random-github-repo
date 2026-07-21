import { eventBus } from './core/eventBus.js';
import { EVENTS } from './core/constants.js';
import { startDiscovery } from './features/discovery.js';
import { initializeAppController } from './ui/appController.js';
import { initializeInteractions } from './features/repository/interactions.js';
import { localization } from './core/localization.js';
import { CONFIG } from './core/config.js';
import { collectionService } from './services/collectionService.js';
import { reactionService } from './services/reactionService.js';
import { filterService } from './services/filterService.js';
import { profileService } from './services/profileService.js';

class App {
  constructor() {
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) return;
    
    try {
      localization.setLanguage(CONFIG.DEFAULT_LANGUAGE);
      
      collectionService.init();
      reactionService.init();
      filterService.init();
      profileService.init();
      
      this.updateStaticTexts();
      
      await startDiscovery();
      initializeAppController();
      initializeInteractions();
      
      this.initialized = true;
      eventBus.emit(EVENTS.APP_INITIALIZED);
      
      console.log('Reepo initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Reepo:', error);
    }
  }

  updateStaticTexts() {
    const titleEl = document.getElementById('page-title');
    if (titleEl) titleEl.textContent = localization.t('app.pageTitle');
    const taglineEl = document.getElementById('app-tagline');
    if (taglineEl) taglineEl.textContent = localization.t('app.tagline');
    const footerEl = document.getElementById('footer-text');
    if (footerEl) footerEl.textContent = localization.t('app.footer');
  }
}

const app = new App();
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => app.initialize());
} else {
  app.initialize();
}

export { app };