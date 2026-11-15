<!-- Managed by agent: keep sections and order; edit content, not structure. Last updated: 2026-11-15 -->

# AGENTS.md — workflows

<!-- AGENTS-GENERATED:START overview -->
## Overview
`deploy-site.yaml` publishes the production site and the Public Suffix List. A mistake here can stop the list
updating or break the download URL for many clients. Treat every change as high risk and ask first.
<!-- AGENTS-GENERATED:END overview -->

<!-- AGENTS-GENERATED:START filemap -->
## Key Files
| File | Purpose |
|------|---------|
| `deploy-site.yaml` | Production deploy: checks out this repo + `publicsuffix/list`, stamps VERSION/COMMIT into the list, `gsutil rsync` to GCS |
| `test-site.yaml` | Build, stale-output check, `npm test` on PRs and `main` |
<!-- AGENTS-GENERATED:END filemap -->

<!-- AGENTS-GENERATED:START setup -->
## Setup
- Deploy: GitHub environment `website`; GCP auth via OIDC (`google-github-actions/auth`), no keys in the repo.
- Test: Node from `.nvmrc` via `actions/setup-node`, npm cache.
<!-- AGENTS-GENERATED:END setup -->

<!-- AGENTS-GENERATED:START commands -->
## Commands
| Task | Command |
|------|---------|
| Run what `test-site.yaml` runs | `npm ci && npm run build && git status --porcelain -- styles.css assets/ && npm test` |
| Parse-check workflow YAML | `python3 -c "import yaml,sys;[yaml.safe_load(open(f)) for f in sys.argv[1:]]" .github/workflows/*.yaml` |
<!-- AGENTS-GENERATED:END commands -->

<!-- AGENTS-GENERATED:START code-style -->
## Conventions
- **Deploy is a reusable workflow**: `publicsuffix/list/.github/workflows/deploy-site.yml` calls
  `publicsuffix/publicsuffix.org/.github/workflows/deploy-site.yaml@main` on every list update.
  The `workflow_call` trigger and its secrets (`GCP_PROJECT_NAME`, `BUCKET_NAME`, `WIP_PROJECT_ID`) are a contract with that repo.
- Deploy also runs on push to `main` here and by `workflow_dispatch`. It checks out `publicsuffix/publicsuffix.org`
  by name at the default branch, not the triggering ref.
- Deploy has no build step and must stay that way unless asked: it uploads the repo as-is (excluding `.git` and `*.dat`).
- Actions use version tags (`@v7.0.1`), updated by Dependabot; follow that style.
- File names `*.yaml`; step names in sentence case.
<!-- AGENTS-GENERATED:END code-style -->

<!-- AGENTS-GENERATED:START security -->
## Security
- Keep `permissions` minimal: `contents: read`; deploy also needs `id-token: write` for GCP OIDC.
- `test-site.yaml` must not get secrets, environments or write permissions.
- Don't change the `.dat` destinations, `Content-Type: text/plain; charset=UTF-8`, `Cache-Control`, or the `awk`
  line that inserts `// VERSION:`/`// COMMIT:` before line 8 of the list.
- `rsync -d` deletes from the live site anything deleted from the repo.
<!-- AGENTS-GENERATED:END security -->

<!-- AGENTS-GENERATED:START checklist -->
## PR checklist
- [ ] Workflow YAML parse-check passes (see Commands)
- [ ] `workflow_call` inputs/secrets unchanged, or `publicsuffix/list` updated in step
- [ ] Rehearsed: `git archive HEAD` plus a `.dat` copy served locally; `/list/public_suffix_list.dat` returns 200
<!-- AGENTS-GENERATED:END checklist -->

<!-- AGENTS-GENERATED:START examples -->
## Patterns to Follow
- `test-site.yaml`: top-level `permissions: contents: read`, `node-version-file: .nvmrc`, explicit failure message via `::error::`.
<!-- AGENTS-GENERATED:END examples -->

<!-- AGENTS-GENERATED:START help -->
## When stuck
- Caller workflow: https://github.com/publicsuffix/list/blob/main/.github/workflows/deploy-site.yml
- Workflow syntax: https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions
- Don't guess about GCP/bucket setup; ask the maintainers.
<!-- AGENTS-GENERATED:END help -->
