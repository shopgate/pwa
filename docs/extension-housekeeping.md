# Extension Housekeeping

How to bring the frontend setup of an existing extension up to date: its `package.json`, lockfile,
lint, test and editor configuration. It doesn't cover changes to the extension's features or
styling.

The target state is small: an extension depends on three `@shopgate` packages and on the
third-party packages its own code imports. Everything else that older extensions carry, such as
Babel packages or single `@shopgate` libraries, is a leftover.

All paths are relative to the `frontend` folder of the extension, unless stated otherwise. An
extension folder without `frontend`, or with a `frontend` without `package.json`, needs nothing.

## Before you start

- **An extension is its own git repository.** Its folder under `extensions/` is ignored by this
  repository. Run git commands inside the extension. A few extension folders are plain copies
  without `.git`: the cleanup is the same, only the copy in [Verifying](#verifying) is made
  differently and there is nothing to commit.
- **Use the Node version of this repository** (`.nvmrc`) with the npm that comes with it, so the
  lockfile is written in the current format.
- **The cleanup doesn't depend on a migration to the current theme.** When the extension's code
  doesn't work with the current packages, for example because it uses an API that was removed,
  report that instead of changing the code.
- **Compare first, then change.** List what the code imports and what `package.json` declares
  (see [Dependencies](#dependencies)), and write down what gets removed, added and kept. Only
  then edit the files.
- **Don't commit.** The cleanup ends with uncommitted changes and a report. The developer
  reviews them and creates the commit, see [Commit](#commit).

## Target state

### `package.json`

An extension with tests:

```json
{
  "scripts": {
    "lint": "eslint --ignore-path ../.gitignore --ext .js,.jsx .",
    "test": "jest",
    "test:watch": "jest --watch",
    "coverage": "jest --coverage",
    "coverage:watch": "jest --coverage --watch"
  },
  "devDependencies": {
    "@shopgate/engage": "^7.33.1",
    "@shopgate/eslint-config": "^7.33.1",
    "@shopgate/pwa-unit-test": "^7.33.1",
    "eslint": "^8.57.1",
    "jest": "^29.7.0",
    "react": "^17.0.2",
    "react-dom": "^17.0.2"
  }
}
```

An extension without tests, which is the more common case, has only the `lint` script and no
`jest` entry. Everything else stays the same.

This is the base. Other packages are added only when the code imports them: `prop-types` for
components that declare prop types, `react-redux` and `reselect` only when the extension accesses
the store, and so on. See [Dependencies](#dependencies).

- **`@shopgate` packages:** these three, all at the current version, at least `7.33.1`.
  `@shopgate/engage` brings the main libraries, `@shopgate/eslint-config` the lint rules with
  their plugins, `@shopgate/pwa-unit-test` the Jest and Babel setup for tests. The few other
  `@shopgate` packages an extension may need are listed under [Dependencies](#dependencies).
- **`@shopgate/pwa-unit-test` in every extension,** also in one without tests. It brings the Jest
  types that the TypeScript config of engage lists; without them the editor reports an error for
  the `jsconfig.json`. It has `jest` as a peer dependency, so npm installs Jest in an extension
  without tests as well.
- **`lint` script:** every extension has it; add it when it is missing. Replace variants that were
  copied from elsewhere (`--quiet --ignore-pattern extensions`, `./node_modules/.bin/eslint`, a
  second `--ignore-path .eslintignore`) by the one above, and delete an `.eslintignore` file. Add
  `.ts,.tsx` to `--ext` when the extension contains TypeScript.
- **`--ignore-path ../.gitignore`** keeps ESLint away from what git ignores, mainly the `coverage`
  folder, whose report contains JavaScript files that fail the lint. ESLint aborts when the file
  doesn't exist. An extension without a `.gitignore` in its root gets one with at least
  `node_modules`, `coverage`, `frontend/config.json` and `extension/config.json`.
- **Test scripts:** call `jest` directly instead of `npm run test -- --watch`. Remove
  placeholders such as `echo TBA`, `echo "Error: no test specified" && exit 1` or an empty
  `dummy` script.
- **TypeScript:** an extension with TypeScript files has a `typecheck` script that runs `tsc`,
  and declares `typescript` and `@types/react` under `devDependencies`, in the ranges of
  `themes/theme-ios11/package.json` (currently `^5.9.3` and `^17.0.93`).
- **Pre-commit hooks stay.** When an extension uses `husky` and `lint-staged`, keep the packages,
  their keys in `package.json` and their scripts; the developer set them up on purpose. The hook
  only runs with a commit, so it can't be tested during the cleanup: say in the report that it
  wasn't. When the versions are old, propose an update to the current ones in the report instead
  of doing it.
- **Left alone:** `name`, `version` (also when it differs from `extension-config.json`), `main`,
  `description`, `license`, and scripts that aren't named here and still work.

### Minimum PWA version

`peerDependencies` states the oldest PWA version the extension runs with. It is independent of the
versions under `devDependencies`, which are the ones used for development.

```json
"peerDependencies": {
  "@shopgate/engage": ">=7.32.0"
}
```

- **Add it when the extension is migrated to the current theme.** That theme is available from
  7.32, so the range is `>=7.32.0`.
- **Add it when the code relies on something that a certain engage version introduced,** for
  example a new component, hook or helper. The range starts at that version. Raise an existing
  range when a new feature needs a newer version.
- **An existing range for PWA 7 stays** and is named in the report, since it may stand for a
  feature. Write it as `>=x.y.z`: no caret, no pre-release suffix (`^7.29.0` and
  `>=7.29.0-beta.3` both become `>=7.29.0`).
- **An existing range for PWA 6 is removed,** also as part of a combined range such as
  `^6.11.0 || ^7.11.0`, which becomes `>=7.11.0`.
- **Without one of these reasons there is no entry.** An extension that runs with any PWA version
  states no minimum.

Only `@shopgate/engage` belongs there. A range for PWA 7 that is stated through another core
library, such as `"@shopgate/pwa-common": ">=7.29.0"`, becomes the same range for
`@shopgate/engage`, so the minimum isn't lost. Other entries are handled like every other
package: when the code imports the package, the entry moves to `devDependencies` or
`dependencies` according to the table below, otherwise it is removed. Some extensions declare
packages only there, so don't delete an entry before checking the imports. Remove a misspelled
key such as `peerDependenciees` after moving its entries the same way.

### Dependencies

Every package that the extension's code imports directly is declared, and nothing else. Where a
package goes depends on who provides it when the app runs:

| The package is … | Goes into | Examples |
| --- | --- | --- |
| provided through webpack at runtime | `devDependencies` | `react`, `react-dom`, `react-redux`, `redux`, `reselect`, `prop-types`, `lodash`, `@virtuous/conductor` |
| brought by a core library and shared through the theme | `devDependencies`, in the version of that library | `rxjs` and `intl-messageformat` from `@shopgate/pwa-common` |
| used at runtime and not provided through webpack | `dependencies`; ask the developer before adding one | a library only this extension uses, e.g. `react-spring` |
| only used by tests, lint or scripts | `devDependencies` | `jest`, `redux-mock-store` |
| a library that `@shopgate/engage` brings | not declared | `@shopgate/pwa-common`, `pwa-common-commerce`, `pwa-core`, `pwa-ui-ios`, `pwa-ui-material`, `pwa-ui-shared`, `native-modules` |
| a core library that engage doesn't bring | `devDependencies`, in the version of engage | `@shopgate/pwa-tracking`, `@shopgate/tracking-core`, `@shopgate/pwa-webcheckout-shopify` |
| a test library that `@shopgate/pwa-unit-test` brings | not declared | `@testing-library/react`, `@testing-library/jest-dom`, `enzyme` |
| legacy and replaced by something the PWA offers | `devDependencies` as long as the code imports it, see below | `@shopgate-ps/pwa-extension-kit`, `classnames`, `react-portal` |

- **Is it provided through webpack?** Two places decide it. The `resolve.alias` list in
  `utils/webpack/webpack.config.js` names the packages that are always taken from the theme's
  copy. Packages in the `dependencies` of `themes/theme-ios11/package.json` are found in the
  theme as well. What the extension installs of these packages only serves lint, tests and the
  editor.
- **Everything else the code uses at runtime goes under `dependencies`.** These are the packages
  only this extension brings.
- **When to ask the developer.** Move a package from `dependencies` to `devDependencies` without
  asking when it is in the alias list of webpack or is a core library: its installed copy is
  never bundled, so the move can't change the app. A package that is under `dependencies`
  already, is imported and isn't provided by webpack or the theme stays there without a
  question, and is named in the report. Ask in every other case: before a package that is only
  found through the theme's `dependencies`, such as `classnames`, changes its section, and
  before a package is added to `dependencies`. Name where the code imports it. Don't decide
  these cases alone.
- **A runtime package that isn't declared at all** only works as long as another package happens
  to bring it along. Check this case most carefully.
- **Take the version range from the theme's `package.json`** for packages the theme provides.
  Report it when the code needs another major version.
- **`react` and `react-dom`:** Babel uses the automatic JSX runtime, so a file that only contains
  JSX needs no `import React`, and the lint rules don't ask for it. The packages are still
  needed: the compiled JSX loads `react/jsx-runtime`, and most components import hooks from
  `react`. Declare both together at `^17.0.2`. `@shopgate/pwa-unit-test` would bring React 17 on
  its own, but as soon as another package with a React peer dependency is declared, such as
  `react-redux`, the install fails without them, because npm then picks a newer React for that
  package.
- **Legacy packages go when nothing imports them anymore.** The theme still provides them, so
  code that uses them keeps working. The cleanup makes one replacement itself, the import of
  `isIOSTheme`. Every other import is reported, and the package stays under `devDependencies`
  until a developer has replaced it.
  - `@shopgate-ps/pwa-extension-kit` and `@shopgate/pwa-extension-kit`:
    - `isIOSTheme` is replaced as part of the cleanup, see
      [Code changes](#code-changes-that-are-part-of-the-cleanup).
    - The connectors (`withHistoryActions`, `withPageProductId`, `withPageState`,
      `withThemeComponents`, …) are reported. Engage has HOCs for the same purposes
      (`withNavigation`, `withCurrentProduct`, `withRoute`, `withThemeComponents`, …), but they
      pass other props. Name the counterpart in the report with its import from
      `@shopgate/engage/core/hocs`, or from `@shopgate/engage/core/hooks` for a hook, not from
      the `@shopgate/engage/core` index. `withThemeComponents` of the kit, for example, passes
      every component of the theme as a prop of its own, while the one of engage passes a single
      `themeComponents` prop. Replacing them changes behaviour and needs testing in the app.
    - `TaggedLogger` is reported. Engage has no counterpart.
  - `classnames`: reported. Its replacement is `cx`, which `makeStyles` returns next to `classes`
    and which `@shopgate/engage/styles` exports. That is done when the extension is migrated to
    the current theme.
  - `react-portal`: reported. Its replacement is `createPortal` from `react-dom`, which means
    rewriting the component that uses `Portal`.
- **No Redux packages without store access.** `react-redux`, `redux`, `reselect`,
  `redux-mock-store` and the like are only declared when the code or the tests import them. An
  extension never ships its own copy of them: they are always `devDependencies`.
- **Lint and tests don't find undeclared imports reliably.** A package that isn't declared often
  resolves anyway, because another package brings it along. Compare the imports with the
  declarations yourself.

To list the packages the code imports, including imports without a binding such as
`import 'intersection-observer'`:

```shell
grep -rhoE "(from|import|require\(|import\(|jest\.mock\()\s*'[^.'][^']*'" \
  --include='*.js' --include='*.jsx' --include='*.ts' --include='*.tsx' \
  --exclude-dir=node_modules --exclude-dir=coverage . \
  | sed -E "s/.*'([^']*)'/\1/" | awk -F/ '{print ($1 ~ /^@/ ? $1"/"$2 : $1)}' | sort | uniq -c
```

### Imports stay inside the `frontend` folder

The code under `frontend` only imports its own files and the packages it declares:

- no file outside of `frontend`, such as `../extension-config.json` or a file of another
  extension. It works while the extension is developed inside this repository, because the files
  happen to be there; in production it isn't possible anymore.
- nothing from the `extension` folder. The backend code is split from the browser bundles and
  runs in a different environment.
- no alias of a theme (`Components/…`, `Pages/…`), which would tie the extension to that theme.

Configuration comes from `./config.json`, which is generated into `frontend` from the
`configuration` of `extension-config.json`. Lint and tests don't catch the first two cases. Look
for them, and report a hit instead of rewriting the code:

```shell
grep -rnE "(from|import|require\(|import\(|jest\.mock\()\s*'(\.\./)+(extension|extension-config|package\.json)" \
  --include='*.js' --include='*.jsx' --include='*.ts' --include='*.tsx' \
  --exclude-dir=node_modules .
```

### What gets removed

| What | Why it can go |
| --- | --- |
| Single `@shopgate` libraries that engage brings (see the table above) | imports from them keep working |
| Babel packages (`@babel/*`, `babel-*`) and `.babelrc` / `babel.config.js` | extensions have no build of their own: the theme's webpack compiles them, and Jest gets its Babel setup from `@shopgate/pwa-unit-test` |
| `--parser babel-eslint` in the lint script, ESLint plugins, parsers and shared configs | `@shopgate/eslint-config` brings what it needs; only `eslint` itself stays |
| Test tooling besides `jest` (enzyme adapters, `babel-jest`, `jest-environment-*`, `coveralls`) | part of `@shopgate/pwa-unit-test`, or unused |
| Hot reloading and resolver tooling (`react-hot-loader`, `@hot-loader/react-dom`, `eslint-import-resolver-babel-module`) | belonged to the old build setup |
| `overrides` and `resolutions` | they worked around problems of the old setup; `@shopgate/pwa-unit-test` pins `cheerio` for enzyme itself |
| The `jest` key in `package.json` | the config comes from `jest.config.js` |
| Packages nothing imports | leftovers |
| A test setup without any test (scripts, `jest.config.js`, `jest`) | `npm test` fails with "No tests found"; `@shopgate/pwa-unit-test` stays for its types |
| `.npmrc` with `package-lock=false` or `legacy-peer-deps=true` | the first prevents the lockfile, the second hides conflicts between the declared versions and changes what gets installed. Neither is needed with the versions of the target state. Delete the file when nothing else is in it. When the install fails afterwards, correct the declared versions instead of bringing the setting back |
| `yarn.lock`, and its line in `.gitignore` | extensions use npm |
| `.travis.yml` in the extension root | Travis is no longer used |

Before deleting a Babel config, check whether it defines aliases with a module resolver and
whether the code imports through them. Such an import breaks when the config goes; report it.

A `.gitlab-ci.yml` stays. When it calls a script or tool that the cleanup removes, say so in the
report.

### Lockfile

`package-lock.json` is tracked. Remove what ignores it:

- the line in the `.gitignore` of the extension root, in whatever form: `package-lock.json`,
  `/package-lock.json`, `*/package-lock.json`, `**/package-lock.json`,
  `frontend/package-lock.json`, together with a comment that explains it
- the same line in a `frontend/.gitignore`

The lockfile of the backend keeps its state. When the removed line also covered
`extension/package-lock.json`, add that path as a line of its own.

Run `npm install` after every change to `package.json`, so the lockfile is up to date at the end.
When the install fails with `ERESOLVE` although the versions are right, the folder contains an
outdated lockfile or `node_modules` from an old setup: delete both and install again. Old
lockfiles (`lockfileVersion` 1) are replaced this way.

### ESLint config

```json
{
  "root": true,
  "extends": "@shopgate/eslint-config"
}
```

- **Keep the file the extension has** (`.eslintrc` or `.eslintrc.js`) and align its content.
  Create `.eslintrc` when there is none.
- **`root: true` is required,** also in the ESLint config of the backend folder
  (`extension/.eslintrc`) when there is one. Without it, ESLint merges the configs of the
  folders above. For an extension inside this repository that is the config of the monorepo,
  and the lint run aborts with "ESLint couldn't determine the plugin … uniquely".
- **Remove what the shared config does itself:** a `parser` with `parserOptions`, and an own
  `import/no-unresolved` rule that ignores `config.json`. Keep rules the extension sets on
  purpose.
- **A frontend that uses another rule set,** such as `standard`, keeps it together with the
  packages it needs; there may be a reason for it. Report it, and recommend the migration to
  `@shopgate/eslint-config` when nothing in the extension speaks against it.

### Editor config

An extension without TypeScript gets a `jsconfig.json`:

```json
{
  "extends": "@shopgate/engage/tsconfig.extension.json",
  "exclude": ["node_modules", "coverage"]
}
```

An extension with TypeScript has the same content in a `tsconfig.json` instead. The config maps
the `@shopgate/*` packages to their folders, so the editor proposes their sub-folders in import
paths. It doesn't turn on type errors for JavaScript files. Don't add `paths` of your own: they
replace the inherited ones.

### Jest config

`jest.config.js`, only in extensions with tests:

```js
module.exports = require('@shopgate/pwa-unit-test/jest.config');
```

Check every setting an existing config adds (`transformIgnorePatterns`, `moduleNameMapper`, …)
and remove it when the tests pass without it. An own `transformIgnorePatterns` drops the packages
the shared config handles.

## Code changes that are part of the cleanup

The cleanup changes import statements in two cases. It makes no other change to the code.

**File extensions of imports.** The update of `@shopgate/eslint-config` turns one pattern into an
error in most extensions: imports need their file extension when it isn't `.js` or `.jsx`.

```js
import config from './config.json';
```

Add the missing extension to such imports (`./config` for `config.json`, also in `jest.mock`
calls and for other JSON files). The rule `import/extensions` is intended; don't switch it off.

**`isIOSTheme` from the extension kit.** Import it from engage instead. It is a named export
there, so the default import of the second form becomes a named one:

```js
// before, in one of two forms
import { isIOSTheme } from '@shopgate-ps/pwa-extension-kit/env/helpers';
import isIOSTheme from '@shopgate-ps/pwa-extension-kit/env/helpers/isIOSTheme';

// after
import { isIOSTheme } from '@shopgate/engage/core/helpers';
```

The engage version is compatible: it returns `false` when no theme is set, where the kit version
throws. The change needs no `peerDependencies` entry. Adjust `jest.mock` calls for the old path
as well. When this was the only import from the kit, remove the package.

## Verifying

Run all of these, and report the results:

1. **Install:** `npm ls` reports nothing as invalid or missing, and `npm ci --dry-run` passes,
   which shows that the lockfile matches `package.json`.
2. **Lint:** `npm run lint` runs through and reports no error that the setup causes: no config
   or parser error, no unresolved import, no missing file extension. Most extensions come from a
   much older ESLint and rule set, so rules may report errors in the code. Those aren't fixed,
   also not with `eslint --fix`: list them in the report with rule and count, together with the
   warnings.
3. **Tests, isolated:** from the root of this repository, `npm run test:extension -- <extension>`.
   It runs the extension's tests and only lets them use the extension's own `node_modules`. Skip
   it for an extension without tests; the command fails there with "No jest.config.js found".
4. **A copy outside this repository,** with the files a clone would have: in the extension root,
   run

   ```shell
   git ls-files -co --exclude-standard -z \
     | perl -0ne 'chomp(my $f = $_); print "$f\0" if -e $f' \
     | rsync -a --from0 --files-from=- . <target folder>
   ```

   then `npm ci`, lint, tests and, with TypeScript, the type check in the `frontend` folder of
   the copy. The command copies the whole extension without anything git ignores, so
   `node_modules` and the generated `frontend/config.json` are missing, as in a clone. The
   `perl` part skips tracked files that the cleanup deleted; without it rsync stops at the first
   of them. Continue only when the command ends with exit code 0, otherwise the copy is
   incomplete. When the tests need `config.json`, create it with the content `{}` and say so in
   the report.

   For an extension folder without `.git`, copy the folder without `node_modules`, `coverage`
   and the two `config.json` files instead:

   ```shell
   rsync -a --exclude node_modules --exclude coverage \
     --exclude /frontend/config.json --exclude /extension/config.json . <target folder>
   ```
5. **Types,** only for an extension with TypeScript: `npm run typecheck`, in the extension folder
   and in the copy of step 4. An extension that never had the script will probably show errors.
   Report them with their count; fix one only when the setup causes it, for example missing
   types of a package.

Step 4 is not optional. Inside this repository, a package the extension doesn't declare is found
in the `node_modules` of the monorepo, so lint, tests and the type check pass by accident.

When tests fail after the update, report them with their output. Fix a failure only when the
setup causes it, for example a missing package. Never update or edit snapshots; a snapshot that
no longer matches is reported.

Check the real exit codes. A command whose output is piped into `tail` or `grep` reports the exit
code of that filter.

## Where housekeeping ends

Report these instead of changing them:

- **Imports of `glamor`.** It is deprecated and replaced by `makeStyles` from
  `@shopgate/engage/styles`. Migrating the styles is part of adopting the current theme. As long
  as the code imports it, it stays declared.
- **Tests written with enzyme.** They keep working, since `@shopgate/pwa-unit-test` still brings
  enzyme. Converting them to Testing Library is a task of its own.
- **Lint warnings and errors of lint rules in the code,** see [Verifying](#verifying).
- **Type errors in the code** of an extension with TypeScript.
- **Imports from legacy packages** other than `isIOSTheme`, see [Dependencies](#dependencies).
- **Updates to a new major version** of a third-party package.
- **The backend** in the `extension` folder. It has its own `package.json` and lint config. Apart
  from `root: true`, it isn't part of this.

## Report

End the cleanup of an extension with a report that contains:

- what was removed, added and kept in `package.json`, with the reason for every package that was
  kept although it looked unused, and for every package under `dependencies`
- the `peerDependencies` range before and after
- the files that were deleted, created or changed
- the result of each verification step, including the steps that were skipped and why
- everything from [Where housekeeping ends](#where-housekeeping-ends) that was found, and
  anything else that needs a decision
- a proposed commit title

## Commit

An agent doesn't create the commit, also not after all checks have passed, and doesn't push.
It leaves the changes in the working folder and proposes a commit title with the report. The
developer commits, or asks for the commit explicitly.

A commit message, whether proposed or written on request, doesn't refer to an AI: no
`Co-Authored-By` line for an assistant, no "generated with" note, no mention of an agent in the
title or the description. The same applies to pull request descriptions.

The cleanup of an extension is one commit, in the repository of the extension, with
`package.json`, `package-lock.json`, the config files, the changed `.gitignore` and the code
files whose imports were changed. The lockfile has to be added explicitly the first time, since it
was ignored before. When a `README.md` or `AGENTS.md` of the extension describes scripts or setup
that changed, it is updated as part of the same change.
