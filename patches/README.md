# Vendored dependency patches

Patches applied to third-party packages that have no upstream fix available. Each patch is
wired into `package.json` through the `overrides` field.

## `braces` — CVE-2026-93687 (GHSA-vfj7-8cjw-p6xm)

`braces@3.0.3` bounds the *character length* of a pattern but not its *nesting depth*. The
recursive AST walkers in `lib/compile.js` and `lib/expand.js` consume one stack frame per
nesting level, so a short but deeply nested pattern such as `{{{{...a...}}}}` exhausts the
call stack and terminates the Node process with an uncaught `RangeError`.

Upstream has **not shipped a fixed release** (the advisory lists "Patched versions: None"),
and the only version `npm audit` suggests is a downgrade to `eslint-config-next@14.2.35`,
which is incompatible with Next.js 16. The vulnerability is reachable through
`eslint-config-next` → `@next/eslint-plugin-next` → `fast-glob` → `micromatch` → `braces`.

### What the patch changes

Relative to upstream `3.0.3`:

- `lib/constants.js` — added `MAX_DEPTH: 100`.
- `lib/parse.js` — rejects patterns whose brace nesting exceeds the depth limit, so the
  limit is enforced at the source rather than only in the downstream walkers. Honors a
  `maxDepth` option (capped at `MAX_DEPTH`), mirroring the existing `maxLength` option.
- `lib/compile.js` — depth guard in the recursive `walk()`.
- `lib/expand.js` — depth guard in the recursive `walk()`.
- `lib/compile.js` — removed a stray `console.log('node.isClose', ...)` that upstream 3.0.3
  left in the hot path.

The package version is bumped to `3.0.4` to reflect the local patch.

### Verification

```bash
npm run test:vendor
```

The script asserts that the patched build is the one actually resolved, that expansion,
ranges, and compilation are unchanged, and that deeply nested patterns are rejected rather
than overflowing the stack. When an upstream copy is available it additionally diffs the
output of both implementations across a corpus of patterns:

```bash
UPSTREAM_BRACES_DIR=/path/to/upstream/braces npm run test:vendor
```

### Removing the patch

Once upstream releases a fixed version, drop the `overrides` entry and this directory, and
remove `fill-range` from `devDependencies` (it is only required so the vendored copy can
resolve its own runtime dependency).
