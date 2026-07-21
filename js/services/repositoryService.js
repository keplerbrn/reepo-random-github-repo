import { CONFIG } from '../core/config.js';
import { validateRepositories } from '../utils/validation.js';

class RepositoryService {
  constructor() {
    this.repositories = [];
    this.loaded = false;
  }

  async loadRepositories() {
    try {
      const response = await fetch(CONFIG.REPOSITORY_DATA_PATH);
      if (!response.ok) {
        return {
          success: false,
          error: `Failed to load repositories: ${response.statusText}`
        };
      }
      
      const data = await response.json();
      const validation = validateRepositories(data);
      
      if (!validation.valid) {
        return {
          success: false,
          error: 'Invalid repository data',
          validationErrors: validation.errors
        };
      }
      
      this.repositories = data;
      this.loaded = true;
      
      return {
        success: true,
        count: this.repositories.length
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  getRepository(index = 0) {
    if (!this.loaded || this.repositories.length === 0) {
      return {
        success: false,
        error: 'No repositories loaded'
      };
    }
    
    const safeIndex = Math.max(0, Math.min(index, this.repositories.length - 1));
    
    return {
      success: true,
      repository: { ...this.repositories[safeIndex] }
    };
  }

  getRandomRepository() {
    if (!this.loaded || this.repositories.length === 0) {
      return {
        success: false,
        error: 'No repositories loaded'
      };
    }
    
    const randomIndex = Math.floor(Math.random() * this.repositories.length);
    
    return {
      success: true,
      repository: { ...this.repositories[randomIndex] },
      index: randomIndex
    };
  }

  getRepositoryCount() {
    return this.repositories.length;
  }
}

export const repositoryService = new RepositoryService();