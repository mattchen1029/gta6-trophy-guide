[![GTA 6 Trophy Guide](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/c/gta6-trophy-guide-01)
[![Rank](https://make.fun/badge/gta6-trophy-guide-01/mattchen1029/gta6-trophy-guide/rank.svg)](https://make.fun/c/gta6-trophy-guide-01)
[![Reward](https://make.fun/badge/gta6-trophy-guide-01/mattchen1029/gta6-trophy-guide/reward.svg)](https://make.fun/c/gta6-trophy-guide-01)

# GTA VI Trophy Guide & Tracker

An offline guide and tracker for all **55 PlayStation 5 trophies** of Grand Theft Auto VI (1 platinum, 2 gold, 6 silver, 46 bronze), built for the [make.fun gta6-trophy-guide-01 competition](https://make.fun/c/gta6-trophy-guide-01).

## What it covers

- **Every trophy** with its official name, description and grade as PlayStation publishes them, plus a guide in our own words — what to do, where and how, and when it can be missed — with a cited source beside each guide.
- **A roadmap to the platinum** in order: the five story chapters and their missions, the character questlines, the collectibles and their counts, then the free-roam cleanup and the 100% checklist.
- **The one possibly missable trophy** (Positive Mental Attitude) flagged, with the Chapter 1 meditation spelled out. PowerPyx and GTABase both flag it as the only one.
- **A checklist tracker**: tick trophies off, progress saves in your browser (localStorage), and can be exported to a file and imported back.
- **Filters** by kind (story, missable, collectibles, activities, online — there are no online trophies), by grade, by missable-only, and by search.
- **A spoiler setting** that hides story trophy names and descriptions until they are earned.
- **Five trophies with no confirmed method yet** (as of 19 November 2026) are marked unconfirmed plainly instead of guessed at.

## How to run it

```sh
node serve.ts
```

Then open http://localhost:8080 — the app is static files under `app/`, works with the network off, and loads nothing from outside itself. Every view is deep-linkable through the URL hash (for example `#trophy=28` opens the Positive Mental Attitude guide, `#kind=missable&spoiler=1` shows the missable filter with spoilers hidden).

## Sources

The guides draw on the PowerPyx GTA 6 Trophy Guide & Roadmap, the GTABase trophy guide, GTA Zone, Output Lag and CryptoGames (linked beside each trophy in the app), and are written in this guide's own words — sources are cited, never copied. Official names and descriptions are shown as PlayStation publishes them.

## Hand-in

`main.ts` copies `app/` and `screenshots/` to the output directory and writes `dossier.json` with the vendored make.fun library:

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

## License

MIT — see [LICENSE](LICENSE).
