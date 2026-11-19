// Renders the checklist and the guide panel from the trophy data, the filter
// state and the earned set. Names, descriptions and grades are shown exactly
// as the data carries them; the spoiler setting masks story trophies that are
// not earned yet instead of showing their names and descriptions.

import { isStoryHidden, KIND_LABELS } from './filters.js';

function gradeLabel(grade) {
  return grade.charAt(0).toUpperCase() + grade.slice(1);
}

function badge(text, className) {
  const span = document.createElement('span');
  span.className = 'badge ' + className;
  span.textContent = text;
  return span;
}

function metaBadges(trophy, filters, earned) {
  const wrap = document.createElement('div');
  wrap.className = 'trophy-meta';
  if (isStoryHidden(trophy, filters, earned)) {
    wrap.append(badge('Hidden', 'hidden'));
  } else {
    wrap.append(badge(gradeLabel(trophy.grade), trophy.grade));
  }
  wrap.append(badge(KIND_LABELS[trophy.kind] || trophy.kind, 'kind'));
  if (trophy.missable) wrap.append(badge('Missable', 'missable'));
  if (trophy.target) wrap.append(badge('Target: ' + trophy.target.toLocaleString('en-US'), 'target'));
  if (trophy.hidden) wrap.append(badge('Hidden on PS5', 'hidden'));
  return wrap;
}

export function renderTrophyList(listElement, trophies, filters, earned, selectedId, callbacks) {
  listElement.replaceChildren();
  if (!trophies.length) {
    const empty = document.createElement('li');
    empty.className = 'empty-state';
    empty.textContent =
      filters.kind === 'online'
        ? 'No online trophies: all 55 are earned in single-player. Pick another kind to see the list.'
        : 'No trophies match these filters. Clear the search or pick another kind or grade.';
    listElement.append(empty);
    return;
  }
  for (const trophy of trophies) {
    const hidden = isStoryHidden(trophy, filters, earned);
    const item = document.createElement('li');
    item.className = 'trophy-card' + (earned.has(trophy.name) ? ' earned' : '') + (trophy.id === selectedId ? ' selected' : '');
    const box = document.createElement('input');
    box.type = 'checkbox';
    box.checked = earned.has(trophy.name);
    box.setAttribute('aria-label', 'Mark ' + (hidden ? 'hidden story trophy' : trophy.name) + ' as earned');
    box.addEventListener('change', () => callbacks.onToggleEarned(trophy));
    box.addEventListener('click', (event) => event.stopPropagation());
    const body = document.createElement('div');
    const name = document.createElement('div');
    name.className = 'trophy-name';
    name.textContent = hidden ? 'Hidden story trophy' : trophy.name;
    const desc = document.createElement('div');
    desc.className = 'trophy-desc';
    desc.textContent = hidden
      ? 'Hidden on PlayStation until earned — tick it off to reveal it.'
      : trophy.description;
    body.append(name, desc, metaBadges(trophy, filters, earned));
    item.append(box, body);
    item.addEventListener('click', () => callbacks.onSelectTrophy(trophy.id));
    listElement.append(item);
  }
}

export function renderDetail(panel, trophy, filters, earned, callbacks) {
  panel.replaceChildren();
  if (!trophy) {
    const empty = document.createElement('p');
    empty.className = 'detail-empty';
    empty.textContent = 'Pick a trophy from the checklist to read its guide here — what to do, where and how, when it can be missed, and the sources behind each step.';
    panel.append(empty);
    return;
  }
  const hidden = isStoryHidden(trophy, filters, earned);
  const title = document.createElement('h3');
  title.textContent = hidden ? 'Hidden story trophy' : trophy.name;
  panel.append(title);
  if (hidden) {
    const note = document.createElement('p');
    note.className = 'spoiler-note';
    note.textContent =
      'Spoiler mode is on: this story trophy\u2019s name, description and guide stay hidden until you earn it. Tick it off in the checklist to reveal it.';
    panel.append(note);
  } else {
    const official = document.createElement('p');
    official.className = 'detail-official';
    official.textContent = 'Official: ' + trophy.description;
    const guide = document.createElement('p');
    guide.className = 'detail-guide';
    guide.textContent = trophy.guide;
    panel.append(official, metaBadges(trophy, filters, earned), guide);
    if (trophy.sources && trophy.sources.length) {
      const sources = document.createElement('div');
      sources.className = 'detail-sources';
      const heading = document.createElement('h4');
      heading.textContent = 'Sources for this guide';
      const list = document.createElement('ul');
      for (const source of trophy.sources) {
        const li = document.createElement('li');
        const link = document.createElement('a');
        link.textContent = source.name;
        link.href = source.url;
        link.target = '_blank';
        link.rel = 'noopener';
        li.append(link);
        list.append(li);
      }
      sources.append(heading, list);
      panel.append(sources);
    }
    if (trophy.steps && trophy.steps.length) {
      const steps = document.createElement('ol');
      steps.className = 'detail-steps';
      for (const step of trophy.steps) {
        const li = document.createElement('li');
        li.textContent = step;
        steps.append(li);
      }
      panel.append(steps);
    }
  }
  const earnButton = document.createElement('button');
  earnButton.type = 'button';
  earnButton.className = 'earn-btn' + (earned.has(trophy.name) ? ' earned' : '');
  earnButton.textContent = earned.has(trophy.name) ? 'Earned ✓ — mark as not earned' : 'Mark as earned';
  earnButton.addEventListener('click', () => callbacks.onToggleEarned(trophy));
  panel.append(earnButton);
}

export function renderSources(listElement, sources) {
  listElement.replaceChildren();
  for (const source of sources) {
    const li = document.createElement('li');
    const link = document.createElement('a');
    link.textContent = source.name;
    link.href = source.url;
    link.target = '_blank';
    link.rel = 'noopener';
    li.append(link);
    listElement.append(li);
  }
}
