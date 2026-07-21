import { eventBus } from './eventBus.js';
import { EVENTS, DEFAULT_STATE } from './constants.js';

class StateManager {
  constructor() {
    this.state = JSON.parse(JSON.stringify(DEFAULT_STATE));
    this.state.session.startTime = new Date().toISOString();
  }

  getState() {
    return JSON.parse(JSON.stringify(this.state));
  }

  setState(path, value) {
    const keys = path.split('.');
    let current = this.state;
    
    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) {
        current[keys[i]] = {};
      }
      current = current[keys[i]];
    }
    
    current[keys[keys.length - 1]] = value;
    
    eventBus.emit(EVENTS.STATE_CHANGED, { path, value });
  }

  updateState(path, updater) {
    const keys = path.split('.');
    let current = this.state;
    
    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) {
        current[keys[i]] = {};
      }
      current = current[keys[i]];
    }
    
    const key = keys[keys.length - 1];
    current[key] = updater(current[key]);
    
    eventBus.emit(EVENTS.STATE_CHANGED, { path, value: current[key] });
  }
}

export const stateManager = new StateManager();