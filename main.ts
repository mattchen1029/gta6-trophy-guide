// Hands in the GTA VI trophy guide: this program copies the guide's own
// files — app/ and screenshots/ from beside this file — into the output
// directory and writes the dossier.json the judge reads, built with the
// vendored make.fun library. The library file under vendor/ is the kit's and
// is left exactly as handed out, so the dossier the scorer rebuilds matches
// this one byte for byte.
//
// The guide itself is plain static files under app/ (index.html, its scripts
// and styles, and app/data/trophies.json with the 55 trophies and their
// guides), plus 3 or 4 real browser screenshots under screenshots/. Nothing
// here needs a build step and nothing is installed: Node 22 runs this file
// as it stands, standard library only.
//
// Run it outside the grader with:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// Inside the grader, MAKEFUN_OUTPUT_DIR is unset and /output is used.

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(out, { recursive: true });
cpSync(join(here, 'app'), join(out, 'app'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) {
  cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });
}

// The caps mirror the scorer's own: at most 4 screenshots, none over 256 KiB,
// app/ within 993 files and 48 MiB, and the dossier text capped at 160 KiB.
writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 50331648,
  }),
);
