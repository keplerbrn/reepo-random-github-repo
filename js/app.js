import { eventBus } from './core/eventBus.js';
import { EVENTS } from './core/constants.js';
import { initializeDiscovery } from './features/discovery.js';
import { initializeAppController } from './ui/appController.js';
import { localization } from './core/localization.js';
import { CONFIG } from './core/config.js';

class App {
  constructor() {
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) return;
    
    try {
      // Initialize core modules
      localization.setLanguage(CONFIG.DEFAULT_LANGUAGE);
      
      // Initialize features
      await initializeDiscovery();
      
      // Initialize UI controllers
      initializeAppController();
      
      this.initialized = true;
      
      // Signal app ready
      eventBus.emit(EVENTS.APP_INITIALIZED);
      
      console.log('Reepo initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Reepo:', error);
    }
  }
}

const app = new App();

// Start when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => app.initialize());
} else {
  app.initialize();
}

export { app };