import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import {
  resolveSiteLinkPrefetch,
  type SiteLinkPrefetchValue,
} from "../src/lib/link-prefetch.ts";

const repositoryRoot = fileURLToPath(new URL("..", import.meta.url));
const sourceRoot = join(repositoryRoot, "src");
const wrapperPath = "src/components/SiteLink.tsx";

function sourceFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const absolute = join(directory, entry.name);
    if (entry.isDirectory()) return sourceFiles(absolute);
    return /\.(?:ts|tsx)$/u.test(entry.name) ? [absolute] : [];
  });
}

test("production internal links force prefetch off", () => {
  const requestedValues: SiteLinkPrefetchValue[] = [
    undefined,
    null,
    "auto",
    true,
    false,
  ];

  for (const requested of requestedValues) {
    assert.equal(resolveSiteLinkPrefetch(requested, "production"), false);
    assert.equal(resolveSiteLinkPrefetch(requested, "development"), requested);
    assert.equal(resolveSiteLinkPrefetch(requested, "test"), requested);
  }
});

test("only the central wrapper imports next/link", () => {
  const directImports = sourceFiles(sourceRoot)
    .filter((file) =>
      /(?:from\s+|import\s*\(|require\s*\()\s*["']next\/link["']/u.test(
        readFileSync(file, "utf8"),
      ),
    )
    .map((file) => relative(repositoryRoot, file).split("\\").join("/"));

  assert.deepEqual(directImports, [wrapperPath]);
});

test("the wrapper preserves NextLink anchor props and owns the prefetch override", () => {
  const wrapper = readFileSync(join(repositoryRoot, wrapperPath), "utf8");

  assert.match(wrapper, /type SiteLinkProps = ComponentProps<typeof NextLink>/u);
  assert.match(wrapper, /<NextLink\s+[\s\S]*\.\.\.props/u);
  assert.match(
    wrapper,
    /prefetch=\{resolveSiteLinkPrefetch\(prefetch, process\.env\.NODE_ENV\)\}/u,
  );
  assert.ok(
    wrapper.indexOf("{...props}") < wrapper.indexOf("prefetch={"),
    "forced prefetch must be applied after the spread props",
  );
});
