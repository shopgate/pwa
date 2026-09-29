# Release process

This folder contains the scripts for releasing the PWA npm packages and themes. Releases start in
the GitLab pipeline of `pwa-liveupdate`. Its npm token can only **stage** packages, so a developer
approves each release with npm 2FA before anything becomes public.

The scripts are TypeScript and run directly with Node ≥ 24; there is no build step. The legacy
process (`yarn release` → `make release`) still exists as a fallback and is not described here.

## Usage

```sh
yarn release:new                       # overview of all commands and options
yarn release:new <command> [version] [options]
```

| Command | Where | What it does |
|---|---|---|
| `check <version>` | local, CI | Checks that the version is still free on npm, git and GitHub. Read-only |
| `prepare <version>` | CI | Bumps the versions, builds, writes the changelog, pushes the release branches and stages the packages on npm |
| `approve <version>` | local | Approves the staged packages with your npm 2FA code |
| `finalize <version>` | CI | Updates master (stable releases only) and creates the GitHub releases |
| `changelog <version>` | local | Shows the changelog entry of the version without writing any files (`GITHUB_AUTH_TOKEN` avoids the GitHub rate limit) |
| `build` | local | Builds all packages into `dist` without publishing. `--purge` deletes the `dist` folders, `--normalize-only` removes test files from existing ones |

| Option | Variable | Description |
|---|---|---|
| `--branch <name>` | `BRANCH` | Branch to release from |
| `--update-master` | `UPDATE_MASTER` | Update master of pwa and the themes (stable releases only) |
| `--no-draft-release` | `DRAFT_RELEASE` | Publish the GitHub releases instead of creating drafts |
| `--resume` | `RESUME` | Continue an interrupted release of the same version |
| `--dry-run` | `DRY_RUN` | No pushes, packages are only packed (`npm stage publish --dry-run`) |

Locally, `check`, `prepare` and `approve` need an npm login (`npm login`) with access to the
`@shopgate` packages, since they read the staged versions. `GITHUB_AUTH_TOKEN` avoids the GitHub rate
limit.

The version can also be passed via `VERSION`. Command line options take precedence over the
variables.

## Releasing a version

1. **Check the version** (optional): `yarn release:new check 7.33.0`. The pipeline does the same
   check first, but locally you get the answer before filling in the form.
2. **Start the pipeline** of `pwa-liveupdate` with `RELEASE_PROCESS=new`, `BRANCH`, `VERSION` and,
   for stable releases, `UPDATE_MASTER=true`. The jobs `release:check` and `release:prepare` run
   automatically. When they're done, Slack posts "staged on npm".
3. **Approve the packages** on your machine:
   ```sh
   yarn release:new approve 7.33.0
   ```
   It lists the staged packages and asks for your npm 2FA code. If the code expires, npm asks for
   a new one. You can also approve the packages on npmjs.com.
4. **Run the manual `release:finalize` job** in the pipeline. It fails as long as a package isn't
   published yet, so it can simply be retried after the approval.
5. With `RELEASE_TABLET_THEMES=true`, the tablet themes are uploaded after finalize.

Pre-releases (`-alpha.N`, `-beta.N`, `-rc.N`) are published with the npm dist-tag `beta`, stable
releases with `latest`. Master is only updated for stable releases with `UPDATE_MASTER=true`.

## When something fails

Every step checks what is already done and skips it, so a failed job can be **retried** as it is.

When the pipeline has to be started again for the same version, `check` reports the version as
taken. Start it with `RESUME=true` to continue. Resuming is only allowed when the release branch
contains the "Released X" commit of this version, so a typo in the version can't continue someone
else's release.

## Testing changes

```sh
yarn release:typecheck && yarn release:test
yarn release:new check 7.33.0-beta.1
yarn release:new build
```

For a complete local run, use a **separate clone**: `prepare` needs a clean working tree and creates
the release branch, commits and changelog in the repository it runs in.

```sh
node scripts/release/cli.ts prepare 7.33.0-beta.1 --branch <branch> --dry-run
```

To test changes in CI, run the pipeline of `pwa-liveupdate` with `BRANCH` set to your branch (the
scripts are taken from it) and add `DRY_RUN=true` as a pipeline variable.

## Files

| Path | Content |
|---|---|
| `cli.ts` | Entry point and command overview |
| `check.ts`, `prepare.ts`, `approve.ts`, `finalize.ts`, `build.ts` | The commands |
| `steps/` | Steps of `prepare`: version bump, changelog, npm staging |
| `lib/` | Helpers for git, npm, GitHub, options and version parsing |
| `config.ts` | Published packages and themes |
