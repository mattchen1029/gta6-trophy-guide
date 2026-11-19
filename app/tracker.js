// Progress that lives in the browser: which trophies are earned is kept in
// localStorage, and can be exported to a file and imported back.

export const STORAGE_KEY = 'gta6-trophy-guide-progress-v1';

export function loadEarned() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return new Set();
    return new Set(parsed.filter((name) => typeof name === 'string'));
  } catch {
    return new Set();
  }
}

export function saveEarned(earned) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...earned]));
}

export function clearSavedEarned() {
  localStorage.removeItem(STORAGE_KEY);
}

export function earnedCount(earned, trophies) {
  return trophies.filter((trophy) => earned.has(trophy.name)).length;
}

export function downloadProgressFile(earned) {
  const payload = JSON.stringify({ game: 'Grand Theft Auto VI', earned: [...earned] }, null, 2);
  const url = URL.createObjectURL(new Blob([payload], { type: 'application/json' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = 'gta6-trophy-progress.json';
  link.click();
  URL.revokeObjectURL(url);
}

export async function readProgressFile(file, knownNames) {
  const text = await file.text();
  const parsed = JSON.parse(text);
  const names = Array.isArray(parsed) ? parsed : parsed.earned;
  if (!Array.isArray(names)) throw new Error('not a progress file');
  const known = new Set(knownNames);
  return new Set(names.filter((name) => typeof name === 'string' && known.has(name)));
}
