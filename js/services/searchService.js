class SearchService {
  search(query, repositories) {
    if (!query || !query.trim()) return [];
    const q = query.toLowerCase().trim();
    return repositories.filter(repo =>
      repo.name?.toLowerCase().includes(q) ||
      repo.owner?.toLowerCase().includes(q) ||
      repo.description?.toLowerCase().includes(q) ||
      (repo.topics || []).some(t => t.toLowerCase().includes(q))
    );
  }
}
export const searchService = new SearchService();