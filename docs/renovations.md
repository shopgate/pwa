# Planned Renovations

Larger clean-ups that were deliberately postponed to keep tickets small. Each entry says why it's
open, what is in place until then, and what has to happen. Remove an entry once it's done.

## Remove glamor (next major release)

- **Status:** nothing in this repo imports glamor anymore. It stays only for extensions, which
  still import it in many places. `@shopgate/eslint-config` warns about the import, and AGENTS.md
  lists it under "Deprecated APIs".
- **Until then:** an npm override pins glamor's `fbjs` to 3.x (root and both theme
  `package.json` files), which removes its vulnerable dependencies.
- **To do:** migrate the extensions in use to `makeStyles` (needs a list of the extension
  versions that live shops actually run). Then remove glamor from both themes,
  `libraries/common` and `libraries/ui-material`, the glamor alias in `utils/webpack`, the glamor
  handling in the local tss-react `cx`, the insertion order workaround in `engage/styles/tss`, the
  `fbjs` override and `@shopgate/pwa-ui-shared/AddToCartButton/style`. Breaking for extensions
  that still import glamor.

## Replace validate.js

- **Status:** validate.js is archived upstream (last release 2019) and its email regex has a
  ReDoS vulnerability (CVE-2020-26308).
- **Until then:** `libraries/engage/core/validation/vendor/validate.cjs` is a copy of 0.13.1 with
  the vulnerable regex fixed. It's a `.cjs` file so that Babel copies it unchanged into `dist`.
- **To do:** let `validate()`, `useValidation()` and `useFormState()` accept a schema of a
  maintained library (e.g. Zod), migrate the engage forms (login, registration, guest checkout,
  checkout, profile, contact, reservation, order details) and deprecate the validate.js constraint
  syntax, which extensions may pass. Login and registration are the forms customers use most.

## Upgrade Sentry beyond 7

- **Status:** `@sentry/browser` 7 only gets critical fixes. Version 8 changed the integration API.
- **To do:** upgrade, check the options in `libraries/common/subscriptions/error.js` and the
  events in a dev project. Consider making the DSN configurable and using Sentry's EU region.

## Unhandled rejections of pipeline actions

- **Status:** about 40 actions handle pipeline errors themselves but return the original request
  promise, which still rejects. Callers that don't attach a handler cause unhandled rejections.
- **Until then:** a listener in `libraries/common/subscriptions/error.js` prevents the browser's
  console error for pipeline errors (a hint is logged in development), and Sentry ignores them.
- **To do:** decide on one pattern for actions in a major release, e.g. resolve with the result
  and reject only when the caller opts in. Breaking for callers that rely on the rejection.

## Replace enzyme

- **Status:** enzyme is unmaintained and doesn't support React 18. `@shopgate/pwa-unit-test`
  pins `cheerio` to a CommonJS release candidate for it, which causes most of the remaining
  `npm audit` findings.
- **To do:** migrate the enzyme tests to React Testing Library, then remove enzyme and the
  cheerio pin from `@shopgate/pwa-unit-test`. Breaking for extension tests that use enzyme.

## query-string in @virtuous/conductor

- **Status:** `@virtuous/conductor` depends on `query-string`, whose `decode-uri-component` has a
  ReDoS finding without a fixed version. The risk is limited to the user's own browser.
- **To do:** replace `query-string` with `URLSearchParams` in conductor, or replace conductor.

## JSDoc type imports in engage

- **Status:** five places in `libraries/engage` import names that only exist as JSDoc
  `@typedef`: `RouteFilters` (`filter/components/FilterPageContentWithProvider`),
  `ProductListEntryContextValue` (`product/hooks/useProductListEntry`),
  `ProductListTypeContextValue` (`product/hooks/useProductListType`) and
  `ProductListTypeContextType` / `ProductListTypeContextSubType`
  (`product/providers/ProductListEntry/context`). Webpack 5.108 ignores them; 5.111 and later
  print "export … was not found" warnings.
- **To do:** replace each import with `/** @typedef {import('<path>').Name} Name */` and remove
  the `eslint-disable` comments, at the latest with the next webpack update.
