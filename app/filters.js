// Filter state for the checklist: kind, grade, missable-only, spoiler mode,
// search text and the selected trophy. The state is mirrored in the URL hash
// so any view — a filter, a spoiler setting, a single trophy's guide — can be
// opened directly with a link.

export function defaultFilters() {
  return { kind: 'all', grade: 'all', missableOnly: false, spoiler: false, search: '', trophy: null };
}

export function readFiltersFromHash() {
  const filters = defaultFilters();
  const hash = window.location.hash.replace(/^#/, '');
  for (const pair of hash.split('&')) {
    if (!pair) continue;
    const [rawKey, rawValue = ''] = pair.split('=');
    const key = decodeURIComponent(rawKey);
    const value = decodeURIComponent(rawValue);
    if (key === 'kind') filters.kind = value;
    if (key === 'grade') filters.grade = value;
    if (key === 'missable') filters.missableOnly = value === '1';
    if (key === 'spoiler') filters.spoiler = value === '1';
    if (key === 'q') filters.search = value;
    if (key === 'trophy') filters.trophy = Number(value) || null;
  }
  return filters;
}

export function writeFiltersToHash(filters) {
  const parts = [];
  if (filters.kind !== 'all') parts.push('kind=' + encodeURIComponent(filters.kind));
  if (filters.grade !== 'all') parts.push('grade=' + encodeURIComponent(filters.grade));
  if (filters.missableOnly) parts.push('missable=1');
  if (filters.spoiler) parts.push('spoiler=1');
  if (filters.search) parts.push('q=' + encodeURIComponent(filters.search));
  if (filters.trophy) parts.push('trophy=' + filters.trophy);
  const next = parts.length ? '#' + parts.join('&') : '';
  if (window.location.hash !== next) {
    history.replaceState(null, '', next || window.location.pathname + window.location.search);
  }
}

export function trophyMatchesFilters(trophy, filters) {
  if (filters.kind === 'missable' && !trophy.missable) return false;
  if (filters.kind === 'online') return false;
  if (filters.kind !== 'all' && filters.kind !== 'missable' && trophy.kind !== filters.kind) return false;
  if (filters.grade !== 'all' && trophy.grade !== filters.grade) return false;
  if (filters.missableOnly && !trophy.missable) return false;
  if (filters.search) {
    const needle = filters.search.toLowerCase();
    const haystack = [trophy.name, trophy.description, trophy.guide, trophy.kind]
      .join(' ')
      .toLowerCase();
    if (!haystack.includes(needle)) return false;
  }
  return true;
}

export function isStoryHidden(trophy, filters, earned) {
  return filters.spoiler && trophy.kind === 'story' && !earned.has(trophy.name);
}

export const KIND_LABELS = {
  story: 'Story',
  missable: 'Missable',
  collectibles: 'Collectibles',
  activities: 'Activities',
  online: 'Online',
};
