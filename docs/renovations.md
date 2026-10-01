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

## Raise the browser targets, then upgrade Sentry

- **Status:** the `.browserslistrc` files (root, `themes/theme-gmd`, `themes/theme-ios11`) target
  `iOS >= 13.4`, set in CURB-4562 (November 2025) without a documented reason. The PWA runs in the
  React Native app (`react-native-engage`: iOS 15.6 since September 2025, Android 8.0 / API 26)
  and on the website.
  `@sentry/browser` stays on 7 because Sentry 9 and later officially require Safari 14. Babel
  doesn't transpile `node_modules`, so Sentry has to run as published.
- **Decided:** the website may drop iOS 13 and 14 (based on Google Analytics, October 2026).
- **To do:**
  1. Raise the targets in all three `.browserslistrc` files to `iOS >= 15.6`. Keep
     `Chrome >= 80`, since the Android system WebView has no guaranteed minimum version. Smoke
     test on iOS and Android devices (start page, product page, cart, login), since the whole
     bundle changes.
  2. Upgrade `@sentry/browser` to the latest version in a separate commit. The code in
     `libraries/common/subscriptions/error.js` only uses APIs that still exist (`setTags`, string
     levels, `withScope`, `beforeSend`). Check the events in the browser again: an exception, a
     failed login, the event content. Since version 8, Sentry no longer infers IP addresses by
     default.
  3. Consider making the DSN configurable and using Sentry's EU region.

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

- **Status:** `@virtuous/conductor` and `@virtuous/react-conductor` (the router) are no longer
  maintained, and nobody can publish new versions. Conductor requires `query-string` 6, whose
  `decode-uri-component` 0.2.2 has a denial of service vulnerability: a URL with crafted percent
  encoding can freeze the tab. `decode-uri-component` 0.5.0 fixes it, but it's ESM-only, so
  `query-string` 6 can't use it.
- **Tried and postponed:** an npm override `"@virtuous/conductor": { "query-string": "^9.5.1" }`
  (root and both theme `package.json` files) removes the finding. `query-string` 9 behaved
  identically for our `parseUrl` / `stringify` calls in a comparison of 28 cases. It and its
  dependencies (`decode-uri-component`, `filter-obj`, `split-on-first`) are ESM and use newer
  syntax, so the webpack Babel rule in `utils/webpack` and the Jest `transformIgnorePatterns` in
  `utils/unit-tests` have to transpile them. `common`, `commerce` and `tracking` import
  `query-string` directly without declaring it.
- **To do:** apply the override as described and test the routing in the browser (search, filters,
  login redirect, deep links), or replace the router. When replacing it, keep
  `@virtuous/conductor` resolvable for extensions (e.g. through a webpack alias), so that there's
  only one router instance.

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
