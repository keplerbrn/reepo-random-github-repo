export function validateRepository(repo) {
  const errors = [];
  
  if (!repo || typeof repo !== 'object') {
    return { valid: false, errors: ['Repository must be an object'] };
  }
  
  if (!repo.name || typeof repo.name !== 'string') {
    errors.push('Repository name is required');
  }
  
  if (!repo.owner || typeof repo.owner !== 'string') {
    errors.push('Repository owner is required');
  }
  
  if (!repo.url || typeof repo.url !== 'string') {
    errors.push('Repository URL is required');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

export function validateRepositories(repos) {
  if (!Array.isArray(repos)) {
    return { valid: false, errors: ['Data must be an array'] };
  }
  
  const results = repos.map(repo => validateRepository(repo));
  const invalidRepos = results.filter(r => !r.valid);
  
  return {
    valid: invalidRepos.length === 0,
    validCount: repos.length - invalidRepos.length,
    invalidCount: invalidRepos.length,
    errors: invalidRepos.flatMap(r => r.errors)
  };
}