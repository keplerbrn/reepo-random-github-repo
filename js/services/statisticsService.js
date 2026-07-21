import { stateManager } from '../core/stateManager.js';

class StatisticsService {
  getOverview() {
    const state = stateManager.getState();
    return {
      discovered: state.discovery?.count || 0,
      saved: (state.savedRepositories || []).length,
      collections: (state.collections || []).length,
      likes: Object.values(state.reactions || {}).filter(v => v === 'like').length,
      dislikes: Object.values(state.reactions || {}).filter(v => v === 'dislike').length,
      xp: state.gamification?.xp || 0,
      level: state.gamification?.level || 1,
      currentStreak: state.gamification?.currentStreak || 0
    };
  }

  getLanguageBreakdown() {
    const state = stateManager.getState();
    const allRepos = new Map(); // id -> repo
    (state.savedRepositories || []).forEach(r => allRepos.set(r.id, r));
    // Also include history if available
    (state.discovery?.history || []).forEach(r => allRepos.set(r.id, r));
    // Count languages
    const langCount = {};
    let total = 0;
    for (const repo of allRepos.values()) {
      const lang = repo.language || 'Unknown';
      langCount[lang] = (langCount[lang] || 0) + 1;
      total++;
    }
    const breakdown = Object.entries(langCount).map(([lang, count]) => ({
      language: lang,
      count,
      percentage: total ? Math.round((count / total) * 100) : 0
    }));
    breakdown.sort((a, b) => b.count - a.count);
    return { breakdown, topLanguage: breakdown[0]?.language || 'N/A' };
  }

  getActivityTimeline(period = '7days') {
    const state = stateManager.getState();
    const log = state.activityLog || [];
    const now = new Date();
    let filterDate;
    switch (period) {
      case 'today': filterDate = new Date(now.getFullYear(), now.getMonth(), now.getDate()); break;
      case '7days': filterDate = new Date(now.getTime() - 7 * 86400000); break;
      case '30days': filterDate = new Date(now.getTime() - 30 * 86400000); break;
      case 'all':
      default: filterDate = new Date(0); break;
    }
    return log.filter(entry => new Date(entry.timestamp) >= filterDate);
  }

  getDiscoveryInsights() {
    const state = stateManager.getState();
    const allRepos = [];
    (state.savedRepositories || []).forEach(r => allRepos.push(r));
    (state.discovery?.history || []).forEach(r => { if (!allRepos.find(x => x.id === r.id)) allRepos.push(r); });
    if (allRepos.length === 0) return null;
    const stars = allRepos.map(r => r.stars).filter(s => s !== undefined);
    const mostStarred = allRepos.reduce((a, b) => (a.stars || 0) > (b.stars || 0) ? a : b, allRepos[0]);
    const leastStarred = allRepos.reduce((a, b) => (a.stars || Infinity) < (b.stars || Infinity) ? a : b, allRepos[0]);
    const avgStars = stars.length ? Math.round(stars.reduce((sum, s) => sum + s, 0) / stars.length) : 0;
    const licenses = {};
    const topics = {};
    allRepos.forEach(r => {
      if (r.license) licenses[r.license] = (licenses[r.license] || 0) + 1;
      (r.topics || []).forEach(t => topics[t] = (topics[t] || 0) + 1);
    });
    const favoriteLicense = Object.entries(licenses).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';
    const favoriteTopic = Object.entries(topics).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';
    return { mostStarred, leastStarred, avgStars, favoriteLicense, favoriteTopic };
  }

  getCollectionInsights() {
    const state = stateManager.getState();
    const cols = state.collections || [];
    if (cols.length === 0) return null;
    const largest = cols.reduce((a, b) => (a.repositoryIds?.length || 0) > (b.repositoryIds?.length || 0) ? a : b, cols[0]);
    const newest = cols.reduce((a, b) => new Date(a.createdAt) > new Date(b.createdAt) ? a : b, cols[0]);
    const oldest = cols.reduce((a, b) => new Date(a.createdAt) < new Date(b.createdAt) ? a : b, cols[0]);
    const mostActive = cols.reduce((a, b) => new Date(a.updatedAt) > new Date(b.updatedAt) ? a : b, cols[0]);
    return { largest, newest, oldest, mostActive };
  }

  getAchievementSummary() {
    const state = stateManager.getState();
    const gamification = state.gamification || {};
    const quests = gamification.dailyQuests || [];
    const completedQuests = quests.filter(q => q.completed).length;
    return {
      totalBadges: (gamification.badges || []).length,
      completedAchievements: (gamification.achievements || []).length,
      questCompletionRate: quests.length ? Math.round((completedQuests / quests.length) * 100) : 0,
      currentStreak: gamification.currentStreak || 0,
      longestStreak: gamification.longestStreak || 0
    };
  }

  exportStatistics() {
    return {
      overview: this.getOverview(),
      languageBreakdown: this.getLanguageBreakdown(),
      discoveryInsights: this.getDiscoveryInsights(),
      collectionInsights: this.getCollectionInsights(),
      achievementSummary: this.getAchievementSummary(),
      exportedAt: new Date().toISOString()
    };
  }
}

export const statisticsService = new StatisticsService();