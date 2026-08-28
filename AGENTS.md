This file gives AI coding assistants (Claude Code, etc.) and new developers a
fast on-ramp to this repository. Keep it short, factual, and up to date — when
behavior here drifts from the code, update this document in the same PR.

## AI Coding Agent Ground Rules

1. Ask, don't assume. If something is unclear, ask before writing a single line. Never make silent assumptions about intent, architecture, or requirements.

2. Simplest solution first. Always implement the simplest thing that could work. Do not add abstractions or flexibility that weren't explicitly requested.

3. Don't touch unrelated code. If a file or function is not directly part of the current task, do not modify it, even if you think it could be improved.

4. Flag uncertainty explicitly. If you are not confident about an approach or technical detail, say so before proceeding. Confidence without certainty causes more damage than admitting a gap.

5. Never update snapshots. Do not run `jest -u` / `--updateSnapshot`, and do not hand-edit `.snap` files. When a change makes snapshots stale, show the diff and stop — the developer reviews and updates them. A snapshot diff is how humans catch unintended UI changes; an agent accepting it destroys that signal. A local `PreToolUse` hook blocks the command, but the rule stands regardless of tooling.

6. Don't comment your code. Do not add comments that explain what the code does or why you chose an approach — write code that reads clearly instead, and put the reasoning in your reply. The only comments to write are doc comments on types (interfaces, type aliases and their members), and those are two lines at most.

## Project Overview

Shopgate's ENGAGE PWA — a Lerna + Yarn-workspaces monorepo holding the shared
`@shopgate/*` libraries and the two app themes (`theme-gmd`, `theme-ios11`) that
power Shopgate's mobile-commerce apps and (via the GMD "web bridge") responsive
desktop web. Libraries are published to npm; themes and most extensions are
consumed, not published from here.

## Tech Stack

- **Languages:** JS/JSX (primary) and TypeScript (`typescript ^5.9.3`, 140+ `.ts/.tsx` files). New typed code should use TypeScript.
- **UI:** React 17 (`^17.0.2`, automatic JSX runtime), Redux (`redux ^5`, `react-redux ^8`, redux-thunk, reselect), RxJS 5 (`~5.5.12`, legacy), Swiper 12, `@virtuous/conductor` routing.
- **Styling (multiple coexist):** write new CSS with `makeStyles` / `useStyles` (`tss-react`). glamor is legacy — do not use it for new styling; prefer `makeStyles`/`useStyles` and migrate glamor away where you touch it.
- **Human-readable CSS classes:** components also emit stable, unhashed classes alongside the generated
  ones — see below. Do not remove or rename them.
- **Monorepo:** Lerna 2.9.0 (`npmClient: yarn`, `--no-optional`), Yarn workspaces.
- **Build:** Babel 7 (canonical config is `themes/theme-gmd/babel.config.js`; root `babel.config.js` just extends it), Webpack 5 via `@shopgate/webpack`. Actual dev/build entry is the external **`sgconnect`** (Shopgate Connect) CLI, not a direct webpack script.
- **Test:** Jest 29 + jsdom, enzyme 3 (`enzyme-adapter-react-17`) and `@testing-library/react` 12 both present.
- **Targets:** `.browserslistrc` — iOS ≥ 13.4, Chrome ≥ 80.

## Common Commands

Requires the external `sgconnect` CLI (not installed by `yarn install`).

- Install / setup: `yarn install`, then `yarn setup` (`sgconnect init && lerna bootstrap`). Full reset: `yarn resetup`.
- Run locally: `yarn start` (`sgconnect frontend start`); `yarn start-cloud` (backend + frontend). Desktop web bridge: `WEB_BRIDGE=1 sgconnect frontend start -t theme-gmd`.
- Test: **`yarn test:short` is the default** — use it for routine runs, and scope it to the paths you touched (`yarn test:short <path>`) rather than sweeping the repo. `yarn test` (`RUN_LONG=true jest`) is the full run, reserved for changes that touch `@shopgate/engage/*` exports (see Pitfalls); `yarn test:watch`; `yarn cover`.
- Lint: `yarn lint` (eslint `.js/.jsx/.ts/.tsx/.json`, ignores `extensions/`); `yarn lint:summary`. A Husky pre-commit hook runs `lint-staged`.
- Theme git subtrees: `yarn add-remotes` / `yarn remove-remotes`.
- Release / build: `yarn release` → `make release` (publishes npm + GitHub releases — **verify before use**; `make release-dry-run` to inspect output). `yarn clean` → `make clean`.

## Repository Structure

- **Workspaces are only:** `libraries/*`, `themes/*`, `utils/*`, and the single extension `extensions/@shopgate-theme-config/frontend` (`package.json` + `lerna.json`). Everything else under `extensions/`, plus `pipelines/`, `trustedPipelines/`, `scripts/`, is **not** a workspace.
- **Folder name ≠ package name** in `libraries/*`: e.g. `libraries/engage` → `@shopgate/engage`, `common` → `@shopgate/pwa-common`, `core` → `@shopgate/pwa-core`, `commerce` → `@shopgate/pwa-common-commerce`, `webcheckout` → `@shopgate/pwa-webcheckout-shopify`. The Makefile auto-prefixes `@shopgate/pwa-` except `eslint-config` and `tracking-core`.
- **`libraries/engage`** is the umbrella library themes consume. It has **no `main`/`exports`** — imports like `@shopgate/engage/core` resolve to `libraries/engage/core/index.js` (directory-as-subpath, via workspace symlinks in `node_modules/@shopgate/`). API lives in per-domain `index.js` barrels (`cart/`, `product/`, `checkout/`, `styles/`, …).
- **App entry point:** `themes/theme-ios11/index.jsx` — imports `initialize` from `@shopgate/engage/core`, builds the store from `pages/reducers` + `pages/subscribers`, renders `<Pages/>` into `#root`.
- **Themes are git subtrees** (`theme-gmd`, `theme-ios11`, defined in `repos.json`); they may be absent in a fresh checkout. `theme-gmd` is on its way out and must not be changed — see Editing Guidelines.
- **`utils/*`** are tooling packages: `unit-tests` → `@shopgate/pwa-unit-test` (root `jest.config.js` extends it), `webpack`, `eslint-config`, `e2e`, `benchmark`.
- **`pipelines/` / `trustedPipelines/`** are backend pipeline JSON definitions, not JS.
- **Naming conventions:** tests `*.spec.js(x)` colocated; `index.js` barrels; colocated `*.types.js`. Existing redux wiring lives in `connector.js` (not `connect.js`) — these are legacy; do not add new `connector.js` files (see Editing Guidelines).
- **`.sgcloud/`** is local `sgconnect` dev state (gitignored, machine-specific).

## Human-Readable CSS Classes

Merchants restyle the app with injected CSS — a `theme.css` fetched from `appConfig.themeCssUrl`
(`libraries/engage/styles/helpers/loadThemeCss.ts`), a legacy `customStyleUrl` file, and the admin live
preview. `makeStyles` class names are hashed (`sg-1a2b3c`) and change every build, so components also
emit **stable, unhashed classes** that merchant CSS can target. There are ~200 of them.

- **Grammar:** `prefix__segment__segment`, `__` between every level, segments in `kebab-case` — e.g.
  `engage__typography`, `theme__product-grid__item__item-details`. Prefixes track where the component
  lives: `engage__`, `theme__`, `ui-shared__`, `common__`, `widget__`.
- **Order matters:** generated class first, human-readable class next, caller `className` **last**, so a
  consumer override still wins. See `libraries/engage/components/Typography/Typography.tsx`.
- **Never rename or remove one.** They are a public API for merchant CSS; a rename silently breaks
  styling that nobody in this repo can see. When a component is replaced, the successor should re-emit
  the old class — `Card` emits `engage__card` + `ui-shared__card`, and `components/v2/Button` re-emits
  `common__button` / `ui-shared__button` / `ui-shared__ripple-button`. Note these sit on `Button`, not
  `ButtonBase` - a bare `ButtonBase` is a plain click target, not a styled button.
- **New components: expose state and configuration as `data-*` attributes, not modifier classes.** e.g.
  `data-variant`, `data-color`, `data-size` on `components/v2/Button`. An attribute qualifier
  (`.engage__button[data-variant="contained"]`) outranks the generated class on specificity, and there
  is no modifier naming grammar to get wrong — older code has four competing spellings for this.
  The rule: expose every prop that changes appearance and has no DOM equivalent, named as the
  kebab-case prop (`data-full-width`), booleans emitted only when true so selectors read
  `[data-full-width]`.
- **Don't duplicate what the DOM already exposes.** Disabled is addressable via `:disabled` and
  `[aria-disabled="true"]`; a `data-disabled` would just be a third spelling.
- **Read component tokens as vars, so a subtree can be restyled.** A component that renders
  `theme.components.x.y` emits `var(--sg-components-x-y)`, which resolves on the element itself — so
  any ancestor that redeclares the var restyles everything below it. `components/v2/IconButton`
  draws `components.iconButton.boxShadow`, a token left unseeded so that only a declaration reaches
  it — the component itself falls back to `none`. The gmd product header declares it on the cta row
  carrying `theme__product__header__cta-buttons`, the ios11 one on the whole header section
  (`theme__product__header`), which is what also elevates the buttons extensions render into the
  surrounding cta portals. Merchant CSS overrides either element (equal specificity, `theme.css`
  later in the cascade). Resolving the token to a literal on a container instead would break this:
  custom properties substitute at computed-value time, so a `--a: var(--b)` on an ancestor freezes
  against that ancestor's `--b` and a later override of `--b` no longer reaches it.
- **Cascade:** `<meta>` anchors in `utils/webpack/templates/default.ejs` fix the layer order as
  emotion/tss → font CSS → `theme.css` → admin preview. All four are equal specificity, so document
  order decides and merchant CSS wins without `!important`.

## Internal Knowledge Base

Additional internal documentation may be available in the Knowledge Base:

https://gitlab.localdev.cc/internal/knowledge-base

Future AI coding assistants and developers should check this Knowledge Base when they need context about cross-service dependencies, shared platform conventions, infrastructure, deployment, authentication/authorization, internal libraries, or service contracts.

Do not copy Knowledge Base content into this file. Keep AGENTS.md focused on this repository.

## Testing Notes

- Tests are `*.spec.js(x)` colocated with source. Config: root `jest.config.js` extends `@shopgate/pwa-unit-test/jest.config`.
- **Prefer `yarn test:short`, scoped to the paths you changed.** A repo-wide run takes minutes and rarely tells you more than the affected suites do. Widen to the whole suite only when the change could reach unrelated packages, and to `yarn test` only for the export-surface reason below.
- `RUN_LONG=true` (set only by `yarn test`) runs everything; without it, the 18 `libraries/engage/<pkg>/index.spec.js(x)` barrel specs are skipped. `test:short`, `test:watch`, **and CI** (`yarn cover` = `jest --coverage`, no `RUN_LONG`) all skip them — so they run only when someone manually runs `yarn test`. These specs guard the `@shopgate/engage/*` public export surface, so run `yarn test` locally before merging changes that touch exports.
- Only the `@shopgate-theme-config` extension is included in tests; all other `extensions/` are excluded.
- Both enzyme and `@testing-library/react` (RTL) exist; the direction is to migrate from enzyme to RTL. **Write all new tests with RTL, not enzyme.** Keep RTL tests forward-compatible (query via `screen.*`, `getByRole`/`findBy*`, drive with `fireEvent` or wrapped `userEvent`) so they survive the planned RTL 12→16 / React 17→18 upgrade.

## Deployment / CI Notes

- **GitHub Actions** (`.github/workflows/main.yml`) does **not** run tests — it only triggers GitLab theme pipelines on `release: published`.

## Project-Specific Pitfalls

- **`extensions/` is invisible to lint and (mostly) tests.** Only `@shopgate-theme-config` is tracked/linted/tested; the rest is gitignored local checkout not covered by CI.
- **The engage `index.spec` barrel checks are unenforced by CI.** `test:short`, `test:watch`, and CI all skip them (only `yarn test` sets `RUN_LONG=true`) — a green CI run does not prove the `@shopgate/engage/*` exports resolve. Run `yarn test` locally before merging export-affecting changes.
- **`CHANGELOG.md` is generated** by `lerna-changelog` — never hand-edit.
- **Build code in `utils/webpack` must stay cross-platform** (macOS, Linux, Windows). Compose filesystem paths with `path.join`/`path.resolve`, never by concatenating with `/`. Component paths inside `config/components.json` are a different thing: the SDK always writes them with forward slashes, so they are safe both as path *segments* (`path.join` normalizes them) and for string checks like `component.path.replace('/dist/', '/src/')`. Tests that assert on a composed path must build the expectation with `path.join` too — a hardcoded `/` in an assertion passes on POSIX and fails on Windows. And because Linux is case sensitive, prefer fixed lowercase file names over names derived from a folder or component name.
- **CMS widget configs are read at build time.** A `config.json` inside a widget folder (see `libraries/engage/page/widgets/README.md`) reaches the app through `DefinePlugin`. It is wired as a `runtimeValue` with the config files as watch dependencies, so editing one is picked up by a running build, while adding a new widget still needs a restart. An invalid config fails the build.
- **No pinned Node version** — there is no `engines` field or `.nvmrc`; use a Node version compatible with the modern toolchain (jest 29 / eslint 8 / TS 5.9).
- **Package versions are managed by the release process** — the root `package.json` `version` is (re)written on every release; don't bump it by hand. Treat `lerna.json` as the source of truth for package versions.

## Editing Guidelines for AI Agents

- Do not hand-edit generated/local files: `CHANGELOG.md`, `dist/`, `coverage/`, `.sgcloud/`, `node_modules/`.
- `themes/theme-ios11` may be edited here. **Do not change `themes/theme-gmd`** — it is being dropped, so its code is no longer maintained. A fix that would land in gmd either goes into `libraries/*` or is left undone; say so rather than editing it.
- When adding a library/extension, keep `package.json` `workspaces` and `lerna.json` `packages` in sync, and respect the Makefile's `@shopgate/pwa-` prefixing rule.
- New typed code should use TypeScript (`.ts/.tsx`).
- Don't import `React` just for JSX — the Babel automatic JSX runtime (React 17) handles it.
- Prefer `import type { X } from '...'` (keyword before the braces) for type-only imports; use the inline `type` marker only when a line mixes values and types.
- Do not add new glamor styling — write CSS with `makeStyles` / `useStyles` (`tss-react`) instead.
- Do not create new `connector.js` files — wire redux in new code with hooks (`useSelector`, `useDispatch`); `connector.js` is legacy.
- Write new tests with `@testing-library/react`, not enzyme (enzyme→RTL migration in progress).
- Run tests with `yarn test:short`, narrowed to the paths you touched; keep `yarn test` for export-surface changes.
- Don't rely on `extensions/*` being linted or CI-covered; only `@shopgate-theme-config` is.
