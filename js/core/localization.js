import { CONFIG } from './config.js';
import { en } from './locales/en.js';
import { tr } from './locales/tr.js';

const translations = { en, tr };

class Localization {
  constructor() {
    this.currentLanguage = CONFIG.DEFAULT_LANGUAGE;
  }

  setLanguage(lang) {
    if (translations[lang]) {
      this.currentLanguage = lang;
    }
  }

  t(key, params = {}) {
    const translation = translations[this.currentLanguage];
    let text = key.split('.').reduce((obj, k) => obj?.[k], translation) || key;
    
    Object.keys(params).forEach(param => {
      text = text.replace(`{${param}}`, params[param]);
    });
    
    return text;
  }
}

export const localization = new Localization();