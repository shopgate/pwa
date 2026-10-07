# Release process

This folder contains the scripts for releasing the PWA npm packages and themes. Releases start in
the GitLab pipeline of `pwa-liveupdate`, which prepares the release branches. The packages are
published by the GitHub workflow "Publish packages" of this repository, after a developer approved
the run. npm trusts that workflow directly (trusted publishing), so no npm token, login or 2FA is
involved.

The scripts are TypeScript and run directly with Node ≥ 24; there is no build step. They run on
Linux (the GitLab pipeline) and macOS. Windows isn't supported, since they start npm and the build
tools directly.

## Usage

```sh
npm run release                        # overview of all commands and options
npm run release -- <command> [version] [options]
```

| Command | Where | What it does |
|---|---|---|
| `check <version>` | local, CI | Checks that the version is still free on npm, git and GitHub and that the branch contains master. Read-only |
| `prepare <version>` | CI | Bumps the versions, builds, writes the changelog and pushes the release branches |
| `publish <version>` | GitHub workflow | Publishes the built packages on npm, dependencies first. Skips packages that are published. Outside the workflow it only runs with `--dry-run` |
| `unpublished <version>` | local, GitHub workflow | Lists the packages of the version that aren't published yet. Read-only |
| `finalize <version>` | CI | Updates master (only when the version becomes `latest`) and creates the GitHub releases. Pre-releases only get a tag |
| `changelog <version>` | local | Shows the changelog entry of the version without writing any files (`GITHUB_AUTH_TOKEN` avoids the GitHub rate limit) |
| `build` | local | Builds all packages into `dist` without publishing. `--purge` deletes the `dist` folders, `--normalize-only` removes test files from existing ones |

| Option | Variable | Pipeline input | Description |
|---|---|---|---|
| `<version>` | `VERSION` | `version` | Version to release |
| `--branch <name>` | `BRANCH` | `branch` | Branch to release from |
| `--resume` | `RESUME` | `resume` | Continue an interrupted release of the same version in a new pipeline |
| `--dry-run` | `DRY_RUN` | `dry_run` | No pushes, packages are only packed (`npm publish --dry-run`) |
| `--skip-master-update` | `SKIP_MASTER_UPDATE` | `skip_master_update` | Don't update master, although the version becomes `latest` |
| `--wait-for-publish` | `WAIT_FOR_PUBLISH` | – (always set by the pipeline) | `finalize` waits until the packages are published instead of failing |
| – | `MUTE_SLACK` | `mute_slack` | No Slack notifications of the pipeline. The GitHub workflow still posts its result |

No command needs an npm login: they only read public data from npm, and the workflow publishes
without one. `GITHUB_AUTH_TOKEN` avoids the GitHub rate limit.

The version can also be passed via `VERSION`. Command line options take precedence over the
variables. The pipeline form of `pwa-liveupdate` shows the inputs and passes them to the jobs as
these variables.

## Releasing a version

1. **Check the version** (optional): `npm run release -- check 7.33.0`. The pipeline does the same
   check first, but locally you get the answer before filling in the form.
2. **Start the pipeline** of `pwa-liveupdate` with the inputs `version` and `branch`. The jobs `release:check`
   and `release:prepare` run automatically. When they're done, Slack posts "is prepared" with the link to the
   workflow run.
3. **Approve the publishing** on GitHub: open the run of the workflow
   [Publish packages](https://github.com/shopgate/pwa/actions/workflows/publish.yml) for
   `releases/v7.33.0`, choose "Review deployments" and approve the environment `npm-release`. The
   workflow then builds and publishes the packages, which takes a few minutes. When it's done,
   Slack posts "published on npm".
4. **`release:finalize`** continues in the pipeline by itself: it starts right after
   `release:prepare` and waits for up to 30 minutes until the workflow has published the
   packages. When that isn't enough, it fails without having changed anything and can simply be
   retried.
5. After finalize, the themes are uploaded: `release:themes` for every version,
   `release:tablet-themes` automatically for stable versions and as a manual job that can be
   skipped for prereleases.

Pre-releases (`-alpha.N`, `-beta.N`, `-rc.N`) are published with the npm dist-tag `beta`, stable
releases with `latest` (patches of older release lines see below).

**Master is updated exactly when the version becomes `latest`**, i.e. for the newest stable
version. Pre-releases and patches of older release lines never reach master, and there is no
option to force it. `SKIP_MASTER_UPDATE=true` (`--skip-master-update`) is the only exception: it
keeps master unchanged for a newest stable version. `check` logs which case applies.

A release that updates master must be released from a branch that contains all commits of master.
Otherwise `check` aborts, because the release would drop these commits and the master merge in
`finalize` could conflict after the packages are already public. Merge master into the branch and
start the pipeline again. For other releases, `check` only warns.

### Patching an older release line

To fix e.g. 7.32 while 7.33.0 is the current release:

1. Create a branch from the tag of the last release of that line (`v7.32.2`), commit the fix and
   push the branch.
2. Start the pipeline with that branch and `version` 7.32.3. Master is not updated, since the
   version doesn't become `latest`.

A stable version that is lower than the current `latest` version is published with the dist-tag
`latest-<major>.<minor>` (here `latest-7.32`), and its GitHub releases are not marked as latest, so
new installs keep getting the current release. `check` warns about it. The changelog entry only
lists the pull requests since the previous release of the same line and is only added to the
`CHANGELOG.md` of the branch.

The branch needs this release CLI and the workflow `.github/workflows/publish.yml`, since GitHub
takes the workflow from the release branch. Lines released before they existed can't be released
with this process.

`finalize` runs the CLI of the release branch as well. A branch whose CLI doesn't know
`WAIT_FOR_PUBLISH` yet doesn't wait: the job starts right after `release:prepare` and fails with
"Not published yet". Retry it when the packages are published.

## What the steps do

Nothing becomes public before the approval. `prepare` only pushes release branches. Master, the
tags and the GitHub releases are created in `finalize`, after the packages are published.

### `check` (job `release:check`)

Only reads, changes nothing.

1. In CI, fails when `GITHUB_AUTH_TOKEN` is not set, since `finalize` needs it later.
2. Compares `BRANCH` with master via the GitHub API. Fails when master has commits that are missing
   in the branch and the release updates master, otherwise only warns. Logs whether `finalize`
   updates master.
3. Warns when the version is not higher than the current version of its npm dist-tag.
4. Looks for the version in every place a release leaves behind: published versions of all
   packages on npm, the tag `vX`, the branches `releases/vX` and `vX` and GitHub releases
   (including drafts) in pwa and the theme repositories. When something is found, it lists it and
   aborts, unless `releases/vX` contains the "Released X" commit and either this pipeline created
   it (a retried job) or `RESUME=true` is set.

The job also logs in with `sgconnect` first, so invalid platform credentials fail the pipeline
before the release starts instead of in the tablet job.

### `prepare` (job `release:prepare`)

1. Runs `check`.
2. Creates `releases/vX` from `BRANCH`. When the branch already exists on GitHub (resume), it
   continues on it.
   Then it runs the type check (`npm run typecheck`) on the branch. A type error stops the release
   here, before anything is changed or pushed.
3. Sets the version in all `package.json` files of the workspace (internal `@shopgate` dependencies
   exactly pinned) and the `extension-config.json` of the themes.
4. Builds the packages into `dist`: babel, type declarations with tsc for packages with a
   `tsconfig.build.json`, then removes tests, snapshots, specs and tsconfig files.
5. Commits the version changes as "Released X". In the pipeline, the commit message also contains
   the line `Pipeline: <ID>`, so a retried job recognizes the release as its own. `dist` is not
   committed.
6. Adds the entries of all labeled pull requests since the previous stable tag to `CHANGELOG.md`,
   copies it to the themes and commits it as "Created changelog for version 'vX'.".
7. Pushes `releases/vX` to pwa and, with `git subtree push`, to `releases/vX` of `theme-gmd` and
   `theme-ios11`. Both subtree pushes run at the same time, since each one spends minutes splitting
   the history. The push to pwa starts the workflow "Publish packages".

Steps 3, 5 and 6 are skipped when they are already done. The build in step 4 isn't published; it
makes sure that a broken build fails before anything is pushed. With `DRY_RUN=true`, steps 1 to 6
only happen in the CI clone, step 7 is skipped and the packages are packed
(`npm publish --dry-run`).

### Workflow "Publish packages" (GitHub Actions)

The workflow `.github/workflows/publish.yml` runs for every push to a branch `releases/v*`.

1. Job "Check what to publish": reads the version from the branch and stops when all packages of
   that version are published. That's the case for the push `finalize` makes later, so that push
   doesn't ask for another approval.
2. Job "Publish": waits until a reviewer of the environment `npm-release` approves the run. Then
   it installs the dependencies, builds the packages and publishes them with
   `npm run release -- publish`, dependencies first, with the dist-tag `beta`, `latest` or, for
   patches of an older release line, `latest-<major>.<minor>`. Packages that are published
   already are skipped, so a failed run can be re-run. Afterwards it waits until every package
   can really be installed, i.e. the registry lists the version and hands out its file, for up
   to 10 minutes. Only then it posts the result to Slack.

A run only publishes the commit it was started for. When the release branch got another push
before the approval, the older run refuses to publish: approve the newest run of the branch.

After this step, the packages are public on npm, with a provenance statement that names the
commit and the workflow run.

The workflow can also be started by hand ("Run workflow") as a dry run. It then needs no approval,
builds the packages and packs the unpublished ones without publishing. On a branch whose version
is published already, it only proves that the install and the build work. GitHub only offers
"Run workflow" for workflows that exist on the default branch, so this needs `publish.yml` on
master; changes to the workflow on other branches can only be tested with a release.

#### One-time setup

- **npmjs.com:** every published package needs the workflow as trusted publisher (package
  settings, "Trusted publisher": organization `shopgate`, repository `pwa`, workflow
  `publish.yml`, environment `npm-release`). A new package has to be published once by hand
  before it can get one.
- **GitHub:** the repository needs the environment `npm-release` with the developers who may
  approve a release as required reviewers, limited to the branches `releases/v*`. Its secret
  `SLACK_WEBHOOK_URL` is the Slack webhook of the release messages; without it, the workflow
  publishes but doesn't post to Slack. The environment `npm-release-dry-run` for dry runs has no
  reviewers and no secret, and is created on its first run.

### `finalize` (job `release:finalize`)

1. Aborts when a package is not published yet. With `WAIT_FOR_PUBLISH=true`, it waits for them
   instead, for up to 30 minutes, and fails after that without having changed anything. When all
   are published, it waits for up to 10 minutes until every package can be installed, so the
   theme uploads that follow don't start too early.
2. Checks out `releases/vX`.
3. Only when the version becomes `latest` and `SKIP_MASTER_UPDATE` isn't set:
   1. For each theme, one after another: merges the master of the theme repository into
      `releases/vX` (`git subtree pull`). Then pushes the result to both theme masters at the same
      time (`git subtree push`).
   2. Merges master of pwa into `releases/vX` and pushes it to `releases/vX`, `vX` and master.
4. Stable versions: creates the GitHub release `vX` in pwa and both theme repositories. The target
   is master when master was updated, otherwise `releases/vX`. The release notes are the changelog
   entry of the version plus a compare link to the previous stable version, or "No notable
   changes in this release." without an entry. Patches of an older release line are not marked as
   latest. Publishing a release creates its tag.
5. Pre-releases (alpha, beta, rc): creates only the tag `vX` at the head of `releases/vX` in pwa
   and both theme repositories, and no GitHub release, so new pre-releases don't appear on the
   release pages. Their changes are in the `CHANGELOG.md` of the release branch.

With `DRY_RUN=true`, it only lists the packages that are not published and stops, without
waiting.

The pipeline of `pwa-liveupdate` starts the job right after `release:prepare` and sets
`WAIT_FOR_PUBLISH`. While it waits:

- It only looks at npm, not at the workflow. When the run of "Publish packages" fails or is
  rejected, the job keeps waiting until its limit. The workflow posts its failure to Slack;
  re-running it in time lets the job continue.
- It holds the resource group `pwa-release`, so `release:prepare` and `release:finalize` of other
  release pipelines wait for it. Cancel the waiting job before aborting a release or resuming it
  in a new pipeline.
- The 30 minutes, the 10 minutes for the installable check and the rest of the job have to fit
  into the job timeout of the GitLab project (1 hour).

### `release:themes` and `release:tablet-themes`

Both run one job per theme after `finalize`. Each job checks out `releases/vX` and uploads the
theme with `sgconnect`. A failed upload, including a failed processing of the theme on the
platform, fails the job, which can be retried on its own. With `DRY_RUN=true`, they check out
`BRANCH` instead, since `releases/vX` isn't pushed, and skip the upload.

- `release:themes` uploads the themes under their own IDs for every version.
- `release:tablet-themes` renames the themes to `*-tablet` before the upload. It runs
  automatically for stable versions; for prereleases it's a manual job that can be skipped.

With `DRY_RUN=true`, all Slack messages of the new process are sent as well, marked with
"[DRY RUN]". Set `MUTE_SLACK=true` to send none.

## When something fails

Every step checks what is already done and skips it, so a failed job can be **retried** as it is.
No step force-pushes, so a push can be rejected, but never overwrites anything.

This includes `release:prepare`: once it has pushed `releases/vX`, its `check` finds the version
taken, but continues because the "Released X" commit names the same pipeline.

A retry clones the repositories again and continues from what is already on GitHub and npm, so a
job that failed halfway doesn't leave anything behind that blocks it:

- Pushes that already went through report "Everything up-to-date". `git subtree push` produces the
  same commits again, so a theme branch that was already pushed doesn't reject the retry.
- A push that was rejected because the target moved in the meantime (e.g. someone merged into
  master during `finalize`) goes through on the retry, since the job fetches and merges first.
- A theme master that was already updated in a failed `finalize` gets merged into `releases/vX`
  once more. That adds a merge commit without changes, and the push stays a fast-forward.
- External causes (SSH key, `GITHUB_AUTH_TOKEN`, GitHub or npm outages): fix the cause, then
  retry.

When the pipeline has to be started again for the same version, for example after it was
cancelled, `check` reports the version as taken. Start the new pipeline with the input `resume` to
continue. Resuming is only allowed when the release branch contains the "Released X" commit of
this version, so a typo in the version can't continue someone else's release. A resumed release continues on `releases/vX`, so later changes to `BRANCH` are
not part of it.

**`check` stops because master has commits that are missing in `BRANCH`** (only for releases that
update master, e.g. after someone merged into master by mistake): nothing was created yet. Merge
master into `BRANCH`, or revert the unwanted commits on master first and then merge it. Afterwards
retry the job or start a new pipeline, `RESUME` isn't needed.

**Before the approval**, nothing is public. Failed pushes are fixed by retrying or resuming.

**Aborting a release** before the approval, e.g. after a wrong version: reject or cancel the
waiting run of "Publish packages", and delete the branch `releases/vX` in pwa, `theme-gmd` and
`theme-ios11` on GitHub. Otherwise `check` reports the version as taken in later pipelines.
After the approval, treat the version as final and release a new one instead of unpublishing it.

**Cancel a waiting `release:finalize` job** before aborting a release, and before resuming it in
a new pipeline: while it waits, it blocks the release jobs of other pipelines.

**No run of "Publish packages" waits for approval:** its first job failed, e.g. because npm
couldn't be reached. That job can't post to Slack, since the webhook is a secret of the
environment. Open the run from the link in the "is prepared" message, fix what its log
reports and re-run it.

**The workflow "Publish packages" failed:** re-run its failed job on GitHub. It skips the packages
that are published and continues with the rest. When npm rejects a package with E401, E403 or
E404, npm doesn't trust the workflow for it: check the trusted publisher of that package on
npmjs.com. The workflow didn't start at all when the release branch doesn't contain
`.github/workflows/publish.yml`; that's the case for branches created before it existed.

**After the approval**, the packages are public and `finalize` has to be completed:

- **Merge conflict with the master of a theme** (someone committed directly in the theme
  repository): run `git subtree pull --prefix=themes/<theme> <repository> master` on
  `releases/vX`, resolve the conflict, push `releases/vX` and retry `finalize`.
- **Merge conflict with master of pwa**: merge master into `releases/vX`, resolve the conflict, push
  `releases/vX` and retry `finalize`.

The theme masters are pushed at the same time, so after a failure one of them can already be
updated while the other one and master of pwa are not. The job waits for both pushes and names the
failed theme. Retrying `finalize` completes them.

### Theme upload

A failed `release:themes` or `release:tablet-themes` job only affects its theme: retry that job in
the pipeline. The packages and the GitHub releases or tags are already done at that point.

Releases with the legacy process upload the regular themes through the GitHub workflow "Trigger
GitLab Pipelines on Release" of their branch, which starts one pipeline per theme in the GitLab
project `github-extension-upload`. GitHub takes the workflow file from the tagged commit, so it only
runs for branches that still contain it. If its upload fails, retry the pipeline of the theme in
`github-extension-upload` instead of re-running the workflow, since a re-run uploads both themes
again.

## Testing changes

```sh
npm run release:typecheck && npm run release:test
npm run release -- check 7.33.0-beta.1
npm run release -- build
```

For a complete local run, use a **separate clone**: `prepare` needs a clean working tree and creates
the release branch, commits and changelog in the repository it runs in.

```sh
node scripts/release/cli.ts prepare 7.33.0-beta.1 --branch <branch> --dry-run
```

To test changes in CI, run the pipeline of `pwa-liveupdate` with the input `branch` set to your
branch (the scripts are taken from it) and `dry_run` enabled. A dry run of the pipeline doesn't
push, so it doesn't start the workflow "Publish packages". The workflow has its own dry run, see
its section for the restriction.

## Files

| Path | Content |
|---|---|
| `cli.ts` | Entry point and command overview |
| `commands/` | The commands `check`, `prepare`, `finalize` and `build` |
| `steps/` | Steps of the commands: version bump, changelog, subtree pushes, npm publishing |
| `lib/` | Helpers for git, npm, GitHub, options and version parsing |
| `config.ts` | Published packages and themes |
