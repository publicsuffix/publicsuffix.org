<!-- FOR AI AGENTS - Human readability is a side effect, not a goal -->
<!-- Managed by agent: keep sections and order; edit content, not structure -->
<!-- Last updated: 2026-11-15 | Last verified: 2026-11-15 -->

# AGENTS.md

Source of https://publicsuffix.org: static HTML styled with Mozilla Protocol. Many clients download the
Public Suffix List from this site, so a broken deploy or a moved URL breaks real software. Be conservative.

**Precedence:** the **closest `AGENTS.md`** to the files you're changing wins. Root holds global defaults only.

## Commands (verified 2026-11-15, Node 24)
> Source: `package.json`, `.github/workflows/test-site.yaml`

<!-- AGENTS-GENERATED:START commands -->
| Task | Command | ~Time |
|------|---------|-------|
| Install | `npm ci` | ~2s |
| Build CSS | `npm run build` | <1s |
| Test (all) | `npm test` | <1s |
| Test (single) | `node --test --test-name-pattern=<name> tests/site.test.mjs` | <1s |
| Validate HTML only | `npx html-validate index.html learn/index.html list/index.html submit/index.html` | <1s |
| Preview | `python3 -m http.server 8000` then open http://127.0.0.1:8000/ | - |
<!-- AGENTS-GENERATED:END commands -->

No lint, format or typecheck tooling exists; don't invent any. Use root-relative URLs, which need a server, not `file://`.

## Workflow
1. **Before editing**: read this file and `README.md` ("Maintaining the site").
2. **Content edits**: edit the HTML page directly, then `npm test`.
3. **Style edits**: edit `src/scss/`, run `npm run build`, commit `styles.css` + `assets/protocol/` with the source.
4. **Before claiming done**: paste `npm test` output; for visual changes, check desktop and ~390px mobile widths.

## File Map
<!-- AGENTS-GENERATED:START filemap -->
```
index.html, learn/, list/, submit/  → the 4 pages (hand-written HTML, each self-contained)
src/scss/site.scss                  → stylesheet entry: picks Protocol parts + site partials
src/scss/_layout|_header|_content   → site-specific styles (Protocol tokens/mixins only)
scripts/build.mjs                   → compiles styles.css, copies referenced Protocol assets
styles.css                          → GENERATED, committed; served at /styles.css
assets/protocol/                    → GENERATED, committed: fonts/images used by styles.css
assets/js/current-year.js           → sets footer copyright end year
tests/site.test.mjs                 → node:test site checks (run by npm test)
images/                             → legacy images, not used by pages; keep (rsync -d deletes live copies)
robots.txt                          → do not change
.github/workflows/                  → deploy + test workflows (see scoped AGENTS.md)
```
<!-- AGENTS-GENERATED:END filemap -->

## Golden Samples (follow these patterns)
<!-- AGENTS-GENERATED:START golden-samples -->
| For | Reference | Key patterns |
|-----|-----------|--------------|
| Page skeleton | `submit/index.html` | head, `#page.mzp-l-content`, nav with `aria-current`, `section.mzp-u-rich-text`, footer |
| Long content page | `learn/index.html` | `h3`/`h4` sections, library lists |
| Site styles | `src/scss/_header.scss` | `@use 'includes/lib' as *;` then Protocol tokens (`$spacing-*`, `$color-*`) |
<!-- AGENTS-GENERATED:END golden-samples -->

## Heuristics (quick decisions)
<!-- AGENTS-GENERATED:START heuristics -->
| When | Do |
|------|-----|
| Adding a library to `learn/` | Keep the language headings alphabetical; one `<li>` per library |
| Linking to another website | `<a href="https://..." target="_blank" rel="noopener">` (test-enforced) |
| Linking within the site | Plain `<a href="/path/">`, no `target` |
| Changing nav, `<head>` or footer | Apply identically to all 4 pages |
| Need a style | Protocol class or token first; else add to a `src/scss/_*.scss` partial |
| Need a Protocol component | Add one `@use 'components/<name>';` to `site.scss`, rebuild |
| Footer year | Leave the `<span data-current-year>` markup; the script updates it |
| Adding dependency | Ask first; deps are dev-only and pinned exactly |
<!-- AGENTS-GENERATED:END heuristics -->

## Repository Settings
<!-- AGENTS-GENERATED:START repo-settings -->
- Upstream: `publicsuffix/publicsuffix.org`, default branch `main`. Dependabot opens PRs for actions and npm.
- The list data is NOT here: it lives in `publicsuffix/list`. Changes to suffixes go there.
<!-- AGENTS-GENERATED:END repo-settings -->

<!-- AGENTS-GENERATED:START ci-rules -->
## CI/Quality Gates
- `test website` (`test-site.yaml`, PRs + `main`): `npm ci` → `npm run build` → fails if `styles.css`/`assets/` differ from committed → `npm test`.
- `deploy website` (`deploy-site.yaml`): production deploy. See `.github/workflows/AGENTS.md`.
<!-- AGENTS-GENERATED:END ci-rules -->

## Key Decisions
<!-- AGENTS-GENERATED:START key-decisions -->
- Deploy runs no build step, so generated CSS and assets are committed. Never edit `styles.css` by hand.
- Protocol `@mozilla-protocol/core` pinned to `22.0.0`. Protocol `main` renames CSS vars (`--body-*` → `--theme-*`); read its CHANGELOG before upgrading, and `_layout.scss` uses `--h-grid-*`.
- Custom header/nav instead of Protocol navigation (that one needs the Mozilla logo + JS menus).
- No third-party requests; fonts are self-hosted. Only script: `current-year.js`.
<!-- AGENTS-GENERATED:END key-decisions -->

## Boundaries

### Always Do
- Keep `/list/public_suffix_list.dat` and `/list/effective_tld_names.dat` working (URLs and the list link)
- Run `npm run build` after any `src/scss/` or Protocol change and commit the output
- Run `npm test` before committing; add a test in `tests/site.test.mjs` for new site-wide rules
- Keep the 4 pages' shared markup (head, nav, footer) consistent
- Atomic commits with plain imperative subjects (repo history doesn't use conventional commits)

### Ask First
- Changing existing wording or policy text, esp. `submit/` (adding a library/link entry is fine)
- Any change to `.github/workflows/deploy-site.yaml`
- Upgrading Protocol across a major version; adding dependencies or JavaScript
- Moving, renaming or deleting files or URLs, including `images/`

### Never Do
- Commit `.dat` files, secrets, or `node_modules/`
- Edit `styles.css` or `assets/protocol/` by hand
- Add third-party scripts, fonts, analytics or CDNs
- Push to `main` directly; open a PR

## Terminology
| Term | Means |
|------|-------|
| PSL | Public Suffix List (data in `publicsuffix/list`) |
| Protocol | Mozilla's design system, npm `@mozilla-protocol/core`; classes prefixed `mzp-` |
| `.dat` | The list file, added to the site only at deploy time |

## Scoped AGENTS.md (MUST read when working in these directories)
<!-- AGENTS-GENERATED:START scope-index -->
- `./.github/workflows/AGENTS.md` — deploy and test workflows; deploy is called by `publicsuffix/list`
<!-- AGENTS-GENERATED:END scope-index -->

## When instructions conflict
The nearest `AGENTS.md` wins. Explicit user prompts override files.
