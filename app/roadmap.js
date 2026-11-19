// The road to the platinum, in order, built from the official descriptions:
// which story chapters and missions come first, which collectibles and counts
// follow, and what is left for the free-roam cleanup. A trophy's stage number
// in trophies.json decides which step of the road it belongs to.

export const STAGE_META = {
  1: {
    title: 'Before you start',
    text: 'Cheats switch trophies and saving off, so keep them off for the whole run. There is no mission replay and no New Game+, so keep a manual save at the start and end of every chapter — the game has 15 manual save slots.',
  },
  2: {
    title: 'Chapter 1 — Leonida opens',
    text: 'The opening mission, the first chapter, Cal\u2019s fishing challenge, Kenton\u2019s treasure dives and the arcade games at home. Do the one thing that might not come back: the balcony meditation (see Positive Mental Attitude).',
  },
  3: {
    title: 'Chapter 2 — Two protagonists',
    text: 'Partner play opens after Coffee Break, so the partner trophies become possible: Hot Together, Personal Best and the calls to bring your partner along. Billy\u2019s Mud Club, Bret\u2019s hunts, the bowling alley valuables, the garages and the Scooter Bros app all start here.',
  },
  4: {
    title: 'Chapter 3 — Vice City',
    text: 'The Cartel Heist, Andy\u2019s chain (Lucia), Randy\u2019s car wish list, Tyrone\u2019s labs (Jason), the jewelry jobs with the Snap Gun, and the Dye Pack Jammer for laundering marked bills.',
  },
  5: {
    title: 'Chapter 4 — Endgame story',
    text: 'Child\u2019s Play, Headliners and the VCIA Takedown, plus the bank-vault robberies that the Chapter 4 mission That\u2019s Where The Money Is\u2026 opens up — the gateway to the vault and armored-truck trophies.',
  },
  6: {
    title: 'Chapter 5 & the finale',
    text: 'Operation Savage Glory, then the final mission and the credits. After the story the open world stays open and the 100% checklist appears.',
  },
  7: {
    title: 'Free-roam cleanup',
    text: 'The 100% checklist, the 70 challenges, the 250 stunts, the races and drone races, the shooting ranges, the card sets, the WAiNK scans, the map unfogging, the robberies and the Strangers & Freaks strands.',
  },
  8: {
    title: 'Platinum',
    text: 'A Long Road (100% completion) is the last big gate. The moment it pops, Vice Got a Price! follows.',
  },
};

export function renderRoadmap(listElement, trophies, earned, onSelectTrophy) {
  listElement.replaceChildren();
  const stages = Object.keys(STAGE_META).map(Number).sort((a, b) => a - b);
  for (const stage of stages) {
    const meta = STAGE_META[stage];
    const stageTrophies = trophies.filter((trophy) => trophy.stage === stage);
    const item = document.createElement('li');
    item.className = 'roadmap-stage';
    const heading = document.createElement('h3');
    heading.textContent = 'Step ' + stage + ': ' + meta.title;
    const text = document.createElement('p');
    text.textContent = meta.text;
    item.append(heading, text);
    if (stageTrophies.length) {
      const chips = document.createElement('div');
      chips.className = 'roadmap-trophies';
      for (const trophy of stageTrophies) {
        const chip = document.createElement('button');
        chip.type = 'button';
        chip.textContent = (earned.has(trophy.name) ? '\u2713 ' : '') + trophy.name;
        if (earned.has(trophy.name)) chip.classList.add('earned');
        chip.addEventListener('click', () => onSelectTrophy(trophy.id));
        chips.append(chip);
      }
      item.append(chips);
    }
    listElement.append(item);
  }
}
