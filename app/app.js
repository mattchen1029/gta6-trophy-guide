// Bootstraps the guide: loads the trophy data, wires the filters, the
// checklist, the detail panel and the roadmap, and keeps the URL hash in step
// with the view so any state can be opened directly.

import {
  loadEarned,
  saveEarned,
  clearSavedEarned,
  earnedCount,
  downloadProgressFile,
  readProgressFile,
} from './tracker.js';
import {
  readFiltersFromHash,
  writeFiltersToHash,
  trophyMatchesFilters,
} from './filters.js';
import { renderRoadmap } from './roadmap.js';
import { renderTrophyList, renderDetail, renderSources } from './render.js';

const data = await (await fetch('data/trophies.json')).json();
const trophies = data.trophies;

const searchInput = document.getElementById('searchInput');
const kindFilter = document.getElementById('kindFilter');
const gradeFilter = document.getElementById('gradeFilter');
const missableOnly = document.getElementById('missableOnly');
const spoilerToggle = document.getElementById('spoilerToggle');
const exportBtn = document.getElementById('exportBtn');
const importFile = document.getElementById('importFile');
const resetBtn = document.getElementById('resetBtn');
const clearFiltersBtn = document.getElementById('clearFiltersBtn');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const resultCount = document.getElementById('resultCount');
const trophyList = document.getElementById('trophyList');
const detailPanel = document.getElementById('detailPanel');
const roadmapList = document.getElementById('roadmapList');
const sourceList = document.getElementById('sourceList');

let earned = loadEarned();
let filters = readFiltersFromHash();

function selectedTrophy() {
  return trophies.find((trophy) => trophy.id === filters.trophy) || null;
}

function renderAll() {
  const shown = trophies.filter((trophy) => trophyMatchesFilters(trophy, filters));
  const count = earnedCount(earned, trophies);
  progressFill.style.width = (count / trophies.length) * 100 + '%';
  progressText.textContent = count + ' of ' + trophies.length + ' earned';
  resultCount.textContent = 'Showing ' + shown.length + ' of ' + trophies.length;
  const callbacks = {
    onToggleEarned(trophy) {
      if (earned.has(trophy.name)) earned.delete(trophy.name);
      else earned.add(trophy.name);
      saveEarned(earned);
      renderAll();
    },
    onSelectTrophy(id) {
      filters.trophy = id;
      writeFiltersToHash(filters);
      renderAll();
      detailPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    },
  };
  renderTrophyList(trophyList, shown, filters, earned, filters.trophy, callbacks);
  renderDetail(detailPanel, selectedTrophy(), filters, earned, callbacks);
  renderRoadmap(roadmapList, trophies, earned, callbacks.onSelectTrophy);
  renderSources(sourceList, data.sources || []);
}

function syncControlsFromFilters() {
  searchInput.value = filters.search;
  kindFilter.value = filters.kind;
  gradeFilter.value = filters.grade;
  missableOnly.checked = filters.missableOnly;
  spoilerToggle.checked = filters.spoiler;
}

searchInput.addEventListener('input', () => {
  filters.search = searchInput.value;
  writeFiltersToHash(filters);
  renderAll();
});
kindFilter.addEventListener('change', () => {
  filters.kind = kindFilter.value;
  writeFiltersToHash(filters);
  renderAll();
});
gradeFilter.addEventListener('change', () => {
  filters.grade = gradeFilter.value;
  writeFiltersToHash(filters);
  renderAll();
});
missableOnly.addEventListener('change', () => {
  filters.missableOnly = missableOnly.checked;
  writeFiltersToHash(filters);
  renderAll();
});
spoilerToggle.addEventListener('change', () => {
  filters.spoiler = spoilerToggle.checked;
  writeFiltersToHash(filters);
  renderAll();
});
exportBtn.addEventListener('click', () => downloadProgressFile(earned));
importFile.addEventListener('change', async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  try {
    earned = await readProgressFile(file, trophies.map((trophy) => trophy.name));
    saveEarned(earned);
  } catch {
    alert('That file is not a trophy progress export from this guide.');
  }
  event.target.value = '';
  renderAll();
});
resetBtn.addEventListener('click', () => {
  if (!confirm('Clear every earned tick?')) return;
  earned = new Set();
  clearSavedEarned();
  renderAll();
});
clearFiltersBtn.addEventListener('click', () => {
  filters = { kind: 'all', grade: 'all', missableOnly: false, spoiler: false, search: '', trophy: null };
  syncControlsFromFilters();
  writeFiltersToHash(filters);
  renderAll();
});
window.addEventListener('hashchange', () => {
  filters = readFiltersFromHash();
  syncControlsFromFilters();
  renderAll();
  scrollToRoadmapIfRequested();
});

// The roadmap section only exists once the data has loaded and rendered, so
// an opening link to #roadmap has to scroll after the first render, not on
// page load when the section is not there yet.
function scrollToRoadmapIfRequested() {
  if (window.location.hash === '#roadmap') {
    document.getElementById('roadmap').scrollIntoView();
  }
}

syncControlsFromFilters();
renderAll();
scrollToRoadmapIfRequested();
