#!/usr/bin/env node
/**
 * Builds Org Roast as a static export for GitHub Pages.
 *
 * Static export rejects POST/etc Route Handlers, so we temporarily move
 * `app/api/` out of the tree, run `next build`, then restore it on success
 * (and on any failure, via the `finally` block).
 *
 * Inputs (env):
 *   NEXT_PUBLIC_BASE_PATH — e.g. "/org-roast" for github.io/<owner>/org-roast/
 */

import { existsSync, renameSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { join } from "node:path";
import process from "node:process";

const root = process.cwd();
const apiDir = join(root, "app", "api");
const stashDir = join(root, "app", "_api_stash_during_demo_build");

function moveIfExists(from, to) {
  if (existsSync(from)) renameSync(from, to);
}

let movedApi = false;
try {
  if (existsSync(apiDir)) {
    renameSync(apiDir, stashDir);
    movedApi = true;
    console.log("[build-demo] stashed app/api/ → app/_api_stash_during_demo_build/");
  }

  const env = {
    ...process.env,
    NEXT_PUBLIC_DEMO_MODE: "1",
    NEXT_PUBLIC_BASE_PATH: process.env.NEXT_PUBLIC_BASE_PATH ?? "/org-roast",
  };
  console.log(`[build-demo] basePath = ${env.NEXT_PUBLIC_BASE_PATH}`);

  const result = spawnSync("npx", ["next", "build"], {
    stdio: "inherit",
    env,
  });
  if (result.status !== 0) {
    process.exitCode = result.status ?? 1;
  }
} finally {
  if (movedApi) {
    moveIfExists(stashDir, apiDir);
    console.log("[build-demo] restored app/api/");
  }
}
