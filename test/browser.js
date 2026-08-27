'use strict';
/* Where the Chromium is — shared by the three browser harnesses.
 *
 * They were written against this project's dev container, which keeps one at
 * /opt/pw-browsers/chromium. That is not where a GitHub runner puts it, and
 * verify-v7.35.js hard-coded the container path with no way to say otherwise,
 * so it could only ever have run in one place. This is that fix, in one
 * place rather than three.
 *
 * The order matters, and the middle step is the subtle one: playwright's own
 * `executablePath()` PREDICTS the path for the version of playwright-core
 * that is installed — it does not check that a browser is actually there. Ask
 * it on a machine whose installed browser is a different build and it hands
 * back a confident path to nothing, and the launch fails with "executable
 * doesn't exist" rather than falling through to something that works. So its
 * answer is used only when it is really on disk. */

const fs = require('node:fs');

function chromePath() {
  // 1. an explicit CHROME always wins — the escape hatch for any machine
  if (process.env.CHROME) return process.env.CHROME;
  // 2. whatever `npx playwright install chromium` put down, if it is real
  try {
    const p = require('playwright-core').chromium.executablePath();
    if (p && fs.existsSync(p)) return p;
  } catch (e) { /* playwright-core not installed yet — fall through */ }
  // 3. the dev container these harnesses were written against
  return '/opt/pw-browsers/chromium';
}

module.exports = { chromePath };
