# Release process

This folder contains the scripts for releasing the PWA npm packages and themes. Releases start in
the GitLab pipeline of `pwa-liveupdate`. Its npm token can only **stage** packages, so a developer
approves each release with npm 2FA before anything becomes public.

The scripts are TypeScript and run directly with Node ≥ 24; there is no build step.

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
`@shopgate` packages, since they read the staged versions. `GITHUB_AUTH_TOKEN` avoids the GitHub rate
limit.

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
5. For stable versions, the tablet themes are uploaded automatically after finalize. For
   prereleases, `release:tablet-themes` is a manual job that can be skipped.

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
cherry-pick `scripts/release` onto the branch. The published GitHub release also starts the theme
pipelines, as for every release.

## What the steps do

Nothing becomes public before the approval. `prepare` only pushes release branches and stages the
packages. Master, the tags and the GitHub releases, which start the theme pipelines, are created in
`finalize`, after the packages are published.

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
   `theme-ios11`.
8. Stages the packages on npm, dependencies first, with the dist-tag `beta`, `latest` or, for
   patches of an older release line, `latest-<major>.<minor>`.

Steps 3, 5 and 6 are skipped when they are already done, and so are packages that are already
staged or published. With `DRY_RUN=true`, steps 1 to 6 only happen in the CI clone, step 7 is
skipped and step 8 only packs the packages (`npm stage publish --dry-run`).

### `approve` (your machine)

Needs your npm login with write access to the `@shopgate` packages and 2FA.

1. Looks up the staged version of every package. Aborts when a package is neither staged nor
   published.
2. For versions that update master, compares `releases/vX` with master and asks before approving
   when master has commits that are missing in the release.
3. Asks for your one-time password and approves the packages, dependencies first, so that no package
   is public before the packages it depends on.
4. Checks that npm shows every approved version as published. A new version can take a moment to
   appear, so it checks again every 10 seconds for up to a minute and fails with the missing
   packages otherwise.

After this step, the packages are public on npm.

### `finalize` (manual job `release:finalize`)

1. Aborts when a package is not published yet.
2. Checks out `releases/vX`.
3. Only when the version becomes `latest` and `SKIP_MASTER_UPDATE` isn't set:
   1. For each theme: merges the master of the theme repository into `releases/vX`
      (`git subtree pull`) and pushes the result to that master (`git subtree push`).
   2. Merges master of pwa into `releases/vX` and pushes it to `releases/vX`, `vX` and master.
4. Creates the GitHub release `vX` in pwa and both theme repositories. The target is master when master
   was updated, otherwise `releases/vX`. The release notes are the changelog entry of the
   version plus a compare link to the previous stable version, or "No notable changes in this
   release." without an entry. Pre-releases are marked as such, and patches of an older release
   line are not marked as latest.
   Publishing a release creates its tag. The published release in pwa starts the upload of both
   themes to the extension service (`.github/workflows/main.yml`), which checks out the tag `vX`
   in the theme repositories. So the theme releases are created first and the pwa release last.

With `DRY_RUN=true`, it only lists the packages that are not published and stops.

### `release:tablet-themes`

Runs automatically after `finalize` for stable versions; for prereleases it's a manual job that
can be skipped. It checks out `releases/vX`, renames the
themes to `*-tablet` and uploads them with `sgconnect`. A failed upload, including a failed
processing of the theme on the platform, fails the job, which can be retried on its own. With `DRY_RUN=true`, it checks out `BRANCH`
instead, since `releases/vX` isn't pushed, and skips the upload.

With `DRY_RUN=true`, all Slack messages of the new process are sent as well, marked with
"[DRY RUN]". Set `MUTE_SLACK=true` to send none.

## When something fails

Every step checks what is already done and skips it, so a failed job can be **retried** as it is.
No step force-pushes, so a push can be rejected, but never overwrites anything.

This includes `release:prepare`: once it has pushed `releases/vX`, its `check` finds the version
taken, but continues because the "Released X" commit names the same pipeline.

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

**After the approval**, the packages are public and `finalize` has to be completed:

- **Merge conflict with the master of a theme** (someone committed directly in the theme
  repository): run `git subtree pull --prefix=themes/<theme> <repository> master` on
  `releases/vX`, resolve the conflict, push `releases/vX` and retry `finalize`.
- **Merge conflict with master of pwa**: merge master into `releases/vX`, resolve the conflict, push
  `releases/vX` and retry `finalize`.

The themes are handled one after another, so after such a failure a theme master can already be
updated while the other one and master of pwa are not. Retrying `finalize` completes them.

### Theme upload

The published GitHub release in pwa starts the workflow "Trigger GitLab Pipelines on Release"
(`.github/workflows/main.yml`). It starts one pipeline per theme in the GitLab project
`github-extension-upload`, which uploads the theme at the tag `vX` to the extension service.

| What failed | Where to see it | What to do |
|---|---|---|
| Creating a GitHub release in `finalize` | `release:finalize` job | Retry `finalize`. The pwa release is created last, so nothing was uploaded yet |
| Triggering the upload | Actions tab of pwa on GitHub, the run is red and shows the answer of GitLab | Fix the cause (e.g. `GITLAB_PIPELINE_TOKEN`) and use "Re-run jobs". This triggers both themes again |
| The upload of a theme | Pipelines of `github-extension-upload` in GitLab (source "trigger") | Retry the failed job there. It keeps its variables. Pipelines can't be started by hand there, since they only run for triggers |

If only the upload of one theme failed, retry its pipeline in GitLab instead of re-running the
workflow, since a re-run uploads the other theme again as well. The workflow file is taken from the
tagged commit, so releases from branches without the current workflow behave like before.

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
