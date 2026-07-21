import { eventBus } from '../../core/eventBus.js';
import { EVENTS } from '../../core/constants.js';
import { statisticsService } from '../../services/statisticsService.js';
import { localization } from '../../core/localization.js';

export function initializeStatisticsFeature() {
  function getStatsData() {
    return {
      overview: statisticsService.getOverview(),
      languageBreakdown: statisticsService.getLanguageBreakdown(),
      activity: statisticsService.getActivityTimeline('30days'),
      discoveryInsights: statisticsService.getDiscoveryInsights(),
      collectionInsights: statisticsService.getCollectionInsights(),
      achievementSummary: statisticsService.getAchievementSummary()
    };
  }

  function exportStats() {
    const data = statisticsService.exportStatistics();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'reepo-statistics.json';
    a.click();
    URL.revokeObjectURL(url);
    eventBus.emit(EVENTS.STATISTICS_EXPORTED);
  }

  return { getStatsData, exportStats };
}