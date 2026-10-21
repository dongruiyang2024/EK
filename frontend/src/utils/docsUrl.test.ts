import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { DOC_PAGES, docsUrl } from "./docsUrl";

test("help links stay on this deployment and every linked section exists", () => {
  const help = readFileSync(
    new URL("../views/public/Help.vue", import.meta.url),
    "utf8",
  );
  for (const [key, anchor] of Object.entries(DOC_PAGES)) {
    const link = docsUrl(key as keyof typeof DOC_PAGES);
    assert.equal(link, anchor ? `/help#${anchor}` : "/help");
    if (anchor)
      assert.ok(
        new RegExp(`id:\\s*["']${anchor}["']`).test(help),
        `Missing help section: ${anchor}`,
      );
  }
});
