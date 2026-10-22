const path = require("node:path");

const micromatchDir = path.dirname(
  require.resolve("micromatch/package.json", { paths: [__dirname] })
);
const bracesEntry = require.resolve("braces", { paths: [micromatchDir] });
const braces = require(bracesEntry);
const bracesPkg = require(path.join(path.dirname(bracesEntry), "package.json"));

const UPSTREAM_DIR = process.env.UPSTREAM_BRACES_DIR;
const upstream = UPSTREAM_DIR ? require(path.join(UPSTREAM_DIR, "index.js")) : null;

let failed = false;
const check = (name, fn) => {
  try {
    fn();
    console.log(`PASS  ${name}`);
  } catch (err) {
    failed = true;
    console.log(`FAIL  ${name}: ${err.message}`);
  }
};

check("resolved package is the patched build", () => {
  if (bracesPkg.version !== "3.0.4") {
    throw new Error(`expected 3.0.4, got ${bracesPkg.version}`);
  }
  if (!bracesPkg.description.includes("CVE-2026-93687")) {
    throw new Error("resolved package is not the locally patched build");
  }
});

check("expand mode still works", () => {
  const out = braces("a/{b,c}/d", { expand: true });
  if (JSON.stringify(out) !== JSON.stringify(["a/b/d", "a/c/d"])) {
    throw new Error(`unexpected output ${JSON.stringify(out)}`);
  }
});

check("ranges still work", () => {
  const out = braces("{1..5}", { expand: true });
  if (JSON.stringify(out) !== JSON.stringify(["1", "2", "3", "4", "5"])) {
    throw new Error(`unexpected output ${JSON.stringify(out)}`);
  }
});

check("compile mode still works", () => {
  const out = braces("a/{b,c}/d");
  if (!out.includes("a/(b|c)/d")) throw new Error(`unexpected output ${JSON.stringify(out)}`);
});

check("deeply nested pattern is rejected instead of overflowing the stack", () => {
  const evil = "{".repeat(3000) + "a" + "}".repeat(3000);
  if (evil.length >= 10000) throw new Error("test pattern must stay under the 10k char cap");
  let threw = null;
  try {
    braces(evil);
  } catch (err) {
    threw = err;
  }
  if (!threw) throw new Error("expected a thrown error, but the pattern was accepted");
  if (/call stack/i.test(threw.message)) {
    throw new Error("stack overflow was not prevented");
  }
  if (!/depth/i.test(threw.message)) {
    throw new Error(`expected a depth-related error, got: ${threw.message}`);
  }
});

check("deeply nested pattern is rejected in expand mode too", () => {
  const evil = "{".repeat(3000) + "a" + "}".repeat(3000);
  let threw = null;
  try {
    braces(evil, { expand: true });
  } catch (err) {
    threw = err;
  }
  if (!threw) throw new Error("expected a thrown error, but the pattern was accepted");
});

check("moderately nested patterns are still accepted", () => {
  const out = braces("{a,b}{c,d}{e,f}", { expand: true });
  if (out.length !== 8) throw new Error(`unexpected output ${JSON.stringify(out)}`);
});

if (upstream) {
  const corpus = [
    "a/{b,c}/d",
    "{1..10}",
    "{a..e}",
    "{1..10..2}",
    "{a,b}{c,d}",
    "x/{y,{z,w}}/v",
    "{a,b,c}",
    "pre{a,b,c}post",
    "{a,b}{c,d}{e,f}{g,h}",
    "a{b,c}d{e,f}g",
    "{a,b}{1..3}",
    "}",
    "{",
    "{}",
    "{a}",
    "{a,b",
    "a}b",
    "{a,{b,{c,{d}}}}",
    "{-a,+b}",
    "{a,b}{c,d}{e,f}{g,h}{i,j}",
  ];

  check("output matches upstream 3.0.3 for a corpus of patterns", () => {
    for (const pattern of corpus) {
      for (const opts of [{}, { expand: true }, { compile: true }]) {
        const label = `${pattern} ${JSON.stringify(opts)}`;
        let mine;
        let theirs;
        try {
          mine = JSON.stringify(braces(pattern, opts));
        } catch (err) {
          mine = `THREW:${err.name}`;
        }
        try {
          theirs = JSON.stringify(upstream(pattern, opts));
        } catch (err) {
          theirs = `THREW:${err.name}`;
        }
        if (mine !== theirs) {
          throw new Error(`mismatch for ${label}\n  patched:   ${mine}\n  upstream:  ${theirs}`);
        }
      }
    }
  });
} else {
  console.log("SKIP  differential test (UPSTREAM_BRACES_DIR not set)");
}

console.log(failed ? "\nRESULT: FAILURES PRESENT" : "\nRESULT: ALL CHECKS PASSED");
process.exit(failed ? 1 : 0);
