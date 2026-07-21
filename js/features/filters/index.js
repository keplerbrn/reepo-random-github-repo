import { eventBus } from '../../core/eventBus.js';
import { EVENTS } from '../../core/constants.js';
import { filterService } from '../../services/filterService.js';

export function initializeFiltersFeature(onFiltersChanged) {
  const handleFilterChange = (key, value) => {
    filterService.setFilter(key, value);
    eventBus.emit(EVENTS.FILTER_CHANGED, { key, value });
    eventBus.emit(EVENTS.FILTER_APPLIED, { filters: filterService.getFilters() });
    if (onFiltersChanged) onFiltersChanged();
  };

  const handleReset = () => {
    filterService.resetFilters();
    eventBus.emit(EVENTS.FILTER_RESET);
    eventBus.emit(EVENTS.FILTER_APPLIED, { filters: filterService.getFilters() });
    if (onFiltersChanged) onFiltersChanged();
  };

  return {
    onFilterChange: handleFilterChange,
    onReset: handleReset
  };
}