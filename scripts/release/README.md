# Release process

This folder contains the scripts for releasing the PWA npm packages and themes. Releases start in
the GitLab pipeline of `pwa-liveupdate`. Its npm token can only **stage** packages, so a developer
approves each release with npm 2FA before anything becomes public.

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
| `prepare <version>` | CI | Bumps the versions, builds, writes the changelog, pushes the release branches and stages the packages on npm |
| `approve <version>` | local | Approves the staged packages with your npm 2FA code |
| `finalize <version>` | CI | Updates master (only when the version becomes `latest`) and creates the GitHub releases |
| `changelog <version>` | local | Shows the changelog entry of the version without writing any files (`GITHUB_AUTH_TOKEN` avoids the GitHub rate limit) |
| `build` | local | Builds all packages into `dist` without publishing. `--purge` deletes the `dist` folders, `--normalize-only` removes test files from existing ones |

| Option | Variable | Pipeline input | Description |
|---|---|---|---|
| `<version>` | `VERSION` | `version` | Version to release |
| `--branch <name>` | `BRANCH` | `branch` | Branch to release from |
| `--resume` | `RESUME` | `resume` | Continue an interrupted release of the same version in a new pipeline |
| `--dry-run` | `DRY_RUN` | `dry_run` | No pushes, packages are only packed (`npm stage publish --dry-run`) |
| `--skip-master-update` | `SKIP_MASTER_UPDATE` | `skip_master_update` | Don't update master, although the version becomes `latest` |
| – | `MUTE_SLACK` | `mute_slack` | No Slack notifications (pipeline only) |

Locally, `check`, `prepare` and `approve` need an npm login (`npm login`) with access to the
`@shopgate` packages, since they read the staged versions. A login lasts 12 hours, so log in right
before approving. `GITHUB_AUTH_TOKEN` avoids the GitHub rate limit.

The version can also be passed via `VERSION`. Command line options take precedence over the
variables. The pipeline form of `pwa-liveupdate` shows the inputs and passes them to the jobs as
these variables.

## Releasing a version

1. **Check the version** (optional): `npm run release -- check 7.33.0`. The pipeline does the same
   check first, but locally you get the answer before filling in the form.
2. **Start the pipeline** of `pwa-liveupdate` with the inputs `version` and `branch`. The jobs `release:check`
   and `release:prepare` run automatically. When they're done, Slack posts "staged on npm".
3. **Approve the packages** on your machine:
   ```sh
   npm run release -- approve 7.33.0
   ```
   It lists the staged packages and asks for your npm 2FA code. If the code expires, npm asks for
   a new one. You can also approve the packages on npmjs.com.
4. **Run the manual `release:finalize` job** in the pipeline. It fails as long as a package isn't
   published yet, so it can simply be retried after the approval.
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
start the pipeline again. For other releases, `check` only warns. `approve` compares the release
branch with master again for releases that update master and asks before approving.

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

The branch needs this release CLI. For lines released before it existed, use the legacy process or
cherry-pick `scripts/release` onto the branch. These branches contain the GitHub workflow
`.github/workflows/main.yml`, which uploads the themes for the legacy process when the GitHub
release is published. When you cherry-pick the release CLI, delete the workflow on the branch as
well, otherwise the themes are uploaded twice.

## What the steps do

Nothing becomes public before the approval. `prepare` only pushes release branches and stages the
packages. Master, the tags and the GitHub releases are created in `finalize`, after the packages are
published.

### `check` (job `release:check`)

Only reads, changes nothing.

1. In CI, fails when `GITHUB_AUTH_TOKEN` is not set, since `finalize` needs it later.
2. Compares `BRANCH` with master via the GitHub API. Fails when master has commits that are missing
   in the branch and the release updates master, otherwise only warns. Logs whether `finalize`
   updates master.
3. Warns when the version is not higher than the current version of its npm dist-tag.
4. Looks for the version in every place a release leaves behind: published or staged versions of
   all packages on npm, the tag `vX`, the branches `releases/vX` and `vX` and GitHub releases
   (including drafts) in pwa and the theme repositories. When something is found, it lists it and
   aborts, unless `releases/vX` contains the "Released X" commit and either this pipeline created
   it (a retried job) or `RESUME=true` is set.

The job also logs in with `sgconnect` first, so invalid platform credentials fail the pipeline
before the release starts instead of in the tablet job.

### `prepare` (job `release:prepare`)

1. Runs `check`.
2. Creates `releases/vX` from `BRANCH`. When the branch already exists on GitHub (resume), it
   continues on it.
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
   the history.
8. Stages the packages on npm, dependencies first, with the dist-tag `beta`, `latest` or, for
   patches of an older release line, `latest-<major>.<minor>`.

Steps 3, 5 and 6 are skipped when they are already done, and so are packages that are already
staged or published. With `DRY_RUN=true`, steps 1 to 6 only happen in the CI clone, step 7 is
skipped and step 8 only packs the packages (`npm stage publish --dry-run`).

### `approve` (your machine)

Needs your npm login with write access to the `@shopgate` packages and 2FA. It stops right away
when npm doesn't accept the login, e.g. because it's older than 12 hours.

1. Looks up the staged version of every package. Aborts when a package is neither staged nor
   published.
2. For versions that update master, compares `releases/vX` with master and asks before approving
   when master has commits that are missing in the release. Pass `--skip-master-update` for
   releases started with that option, since they leave master unchanged.
3. Asks for your one-time password and approves the packages, dependencies first, so that no package
   is public before the packages it depends on. With a security key or passkey, leave the password
   empty: npm then runs on the terminal and asks for the confirmation in the browser itself. npm
   only accepts a package once its automated review is finished, which can take several minutes
   for large packages like `@shopgate/engage`. Until then, it tries again every 30 seconds for up
   to 10 minutes. npm only reveals the review status once it accepts the 2FA, and it accepts a
   one-time password for about a minute, so after a longer wait `approve` asks for a new one.
   Each package gets one progress line; npm's own output is only shown when an approval fails.
   When the approval is done, fails or needs a new one-time password, the terminal rings its
   bell, and macOS also shows a notification. If it still fails, run `approve` again: it
   continues with the packages that aren't published yet.
4. Checks that npm shows every approved version as published. A new version can take a moment to
   appear, so it checks again every 10 seconds for up to a minute and fails with the missing
   packages otherwise.

npm's review starts when `prepare` stages the packages. Starting `approve` a few minutes after the
"staged on npm" message usually saves the waits and the additional one-time passwords.

After this step, the packages are public on npm.

With `--dry-run`, `approve` runs steps 1 and 2, then only shows the progress lines it would print,
without asking for the one-time password or approving anything.

### `finalize` (manual job `release:finalize`)

1. Aborts when a package is not published yet.
2. Checks out `releases/vX`.
3. Only when the version becomes `latest` and `SKIP_MASTER_UPDATE` isn't set:
   1. For each theme, one after another: merges the master of the theme repository into
      `releases/vX` (`git subtree pull`). Then pushes the result to both theme masters at the same
      time (`git subtree push`).
   2. Merges master of pwa into `releases/vX` and pushes it to `releases/vX`, `vX` and master.
4. Creates the GitHub release `vX` in pwa and both theme repositories. The target is master when master
   was updated, otherwise `releases/vX`. The release notes are the changelog entry of the
   version plus a compare link to the previous stable version, or "No notable changes in this
   release." without an entry. Pre-releases are marked as such, and patches of an older release
   line are not marked as latest. Publishing a release creates its tag.

With `DRY_RUN=true`, it only lists the packages that are not published and stops.

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
- External causes (SSH key, `GITHUB_AUTH_TOKEN`, npm token, GitHub or npm outages): fix the cause,
  then retry.

When the pipeline has to be started again for the same version, for example after it was
cancelled, `check` reports the version as taken. Start the new pipeline with the input `resume` to
continue. Resuming is only allowed when the release branch contains the "Released X" commit of
this version, so a typo in the version can't continue someone else's release. A resumed release continues on `releases/vX`, so later changes to `BRANCH` are
not part of it.

**`check` stops because master has commits that are missing in `BRANCH`** (only for releases that
update master, e.g. after someone merged into master by mistake): nothing was created yet. Merge
master into `BRANCH`, or revert the unwanted commits on master first and then merge it. Afterwards
retry the job or start a new pipeline, `RESUME` isn't needed.

**Before the approval**, nothing is public. Failed pushes and failed staging are fixed by retrying
or resuming.

**Aborting a release** before the approval, e.g. after a wrong version: reject the staged packages
with `npm stage reject` or on npmjs.com, and delete the branch `releases/vX` in pwa, `theme-gmd`
and `theme-ios11` on GitHub. Otherwise `check` reports the version as taken in later pipelines.
After the approval, treat the version as final and release a new one instead of unpublishing it.

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
the pipeline. The packages and the GitHub releases are already done at that point.

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
branch (the scripts are taken from it) and `dry_run` enabled.

## Files

| Path | Content |
|---|---|
| `cli.ts` | Entry point and command overview |
| `commands/` | The commands `check`, `prepare`, `approve`, `finalize` and `build` |
| `steps/` | Steps of `prepare`: version bump, changelog, npm staging |
| `lib/` | Helpers for git, npm, GitHub, options and version parsing |
| `config.ts` | Published packages and themes |
