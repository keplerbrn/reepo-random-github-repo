import { localization } from '../core/localization.js';
import { formatNumber } from '../utils/formatting.js';

export function createStatisticsDashboard(stats, onExport) {
  const container = document.createElement('div');
  container.className = 'statistics-dashboard';

  // Title
  const title = document.createElement('h2');
  title.textContent = localization.t('statistics.title');
  container.appendChild(title);

  // Overview Cards
  const overviewGrid = document.createElement('div');
  overviewGrid.className = 'overview-grid';
  [
    { label: localization.t('statistics.discovered'), value: stats.overview.discovered },
    { label: localization.t('statistics.saved'), value: stats.overview.saved },
    { label: localization.t('statistics.collections'), value: stats.overview.collections },
    { label: localization.t('statistics.likes'), value: stats.overview.likes },
    { label: localization.t('statistics.dislikes'), value: stats.overview.dislikes },
    { label: localization.t('statistics.xp'), value: stats.overview.xp },
    { label: localization.t('statistics.level'), value: stats.overview.level },
    { label: localization.t('statistics.streak'), value: stats.overview.currentStreak }
  ].forEach(({ label, value }) => {
    const card = document.createElement('div');
    card.className = 'overview-card';
    card.innerHTML = `<span class="overview-value">${value}</span><span class="overview-label">${label}</span>`;
    overviewGrid.appendChild(card);
  });
  container.appendChild(overviewGrid);

  // Language Breakdown
  const langSection = document.createElement('section');
  langSection.innerHTML = `<h3>${localization.t('statistics.languageBreakdown')}</h3>`;
  const langBreakdown = stats.languageBreakdown;
  if (langBreakdown.breakdown.length) {
    const topLang = document.createElement('p');
    topLang.textContent = `${localization.t('statistics.topLanguage')}: ${langBreakdown.topLanguage}`;
    langSection.appendChild(topLang);
    const barContainer = document.createElement('div');
    barContainer.className = 'lang-bar-container';
    langBreakdown.breakdown.forEach(l => {
      const row = document.createElement('div');
      row.className = 'lang-row';
      row.innerHTML = `<span class="lang-name">${l.language}</span>
        <div class="lang-bar"><div class="lang-fill" style="width:${l.percentage}%"></div></div>
        <span class="lang-count">${l.count} (${l.percentage}%)</span>`;
      barContainer.appendChild(row);
    });
    langSection.appendChild(barContainer);
  } else {
    langSection.innerHTML += `<p class="empty-state">${localization.t('statistics.noData')}</p>`;
  }
  container.appendChild(langSection);

  // Activity Timeline (simple list)
  const timelineSection = document.createElement('section');
  timelineSection.innerHTML = `<h3>${localization.t('statistics.recentActivity')}</h3>`;
  const activityList = document.createElement('div');
  activityList.className = 'activity-list';
  (stats.activity || []).forEach(entry => {
    const item = document.createElement('div');
    item.className = 'activity-item';
    item.textContent = `[${new Date(entry.timestamp).toLocaleString()}] ${entry.type}`;
    activityList.appendChild(item);
  });
  if (!stats.activity || stats.activity.length === 0) {
    activityList.innerHTML = `<p class="empty-state">${localization.t('statistics.noActivity')}</p>`;
  }
  timelineSection.appendChild(activityList);
  container.appendChild(timelineSection);

  // Discovery Insights
  const insights = stats.discoveryInsights;
  if (insights) {
    const insightsSection = document.createElement('section');
    insightsSection.innerHTML = `<h3>${localization.t('statistics.discoveryInsights')}</h3>`;
    const grid = document.createElement('div');
    grid.className = 'insights-grid';
    [
      { label: localization.t('statistics.mostStarred'), value: insights.mostStarred.name },
      { label: localization.t('statistics.leastStarred'), value: insights.leastStarred.name },
      { label: localization.t('statistics.avgStars'), value: insights.avgStars },
      { label: localization.t('statistics.favLicense'), value: insights.favoriteLicense },
      { label: localization.t('statistics.favTopic'), value: insights.favoriteTopic }
    ].forEach(({ label, value }) => {
      const card = document.createElement('div');
      card.className = 'insight-card';
      card.innerHTML = `<span class="insight-value">${value}</span><span class="insight-label">${label}</span>`;
      grid.appendChild(card);
    });
    insightsSection.appendChild(grid);
    container.appendChild(insightsSection);
  }

  // Collection Insights
  const colInsights = stats.collectionInsights;
  if (colInsights) {
    const colSection = document.createElement('section');
    colSection.innerHTML = `<h3>${localization.t('statistics.collectionInsights')}</h3>`;
    const grid = document.createElement('div');
    grid.className = 'insights-grid';
    [
      { label: localization.t('statistics.largestCollection'), value: colInsights.largest.name },
      { label: localization.t('statistics.newestCollection'), value: colInsights.newest.name },
      { label: localization.t('statistics.oldestCollection'), value: colInsights.oldest.name },
      { label: localization.t('statistics.mostActiveCollection'), value: colInsights.mostActive.name }
    ].forEach(({ label, value }) => {
      const card = document.createElement('div');
      card.className = 'insight-card';
      card.innerHTML = `<span class="insight-value">${value}</span><span class="insight-label">${label}</span>`;
      grid.appendChild(card);
    });
    colSection.appendChild(grid);
    container.appendChild(colSection);
  }

  // Achievement Summary
  const achSummary = stats.achievementSummary;
  const achSection = document.createElement('section');
  achSection.innerHTML = `<h3>${localization.t('statistics.achievements')}</h3>`;
  const achGrid = document.createElement('div');
  achGrid.className = 'overview-grid';
  [
    { label: localization.t('statistics.badges'), value: achSummary.totalBadges },
    { label: localization.t('statistics.achievementsCompleted'), value: achSummary.completedAchievements },
    { label: localization.t('statistics.questRate'), value: `${achSummary.questCompletionRate}%` },
    { label: localization.t('statistics.currentStreak'), value: achSummary.currentStreak },
    { label: localization.t('statistics.longestStreak'), value: achSummary.longestStreak }
  ].forEach(({ label, value }) => {
    const card = document.createElement('div');
    card.className = 'overview-card';
    card.innerHTML = `<span class="overview-value">${value}</span><span class="overview-label">${label}</span>`;
    achGrid.appendChild(card);
  });
  achSection.appendChild(achGrid);
  container.appendChild(achSection);

  // Export button
  const exportBtn = document.createElement('button');
  exportBtn.className = 'btn btn-primary';
  exportBtn.textContent = localization.t('statistics.export');
  exportBtn.addEventListener('click', onExport);
  container.appendChild(exportBtn);

  return container;
}