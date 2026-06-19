# Navigation & rendering model

Read this before building anything that has to survive or react to a
route change — page transitions, a header shared across pages, or any
code that measures layout across a navigation. The behaviors below are
stable properties of how the app renders, and they bite feature work
repeatedly because they're not obvious from any single file.

## Route changes crossfade, they don't swap

On navigation the outgoing page's body stays mounted and rendered for the
duration of a fade while the incoming page mounts on top. For that window
two pages' content coexist in the DOM — do not assume the old page is
gone the instant the URL changes.

- The fade is driven by `View` — see
  [`libraries/engage/components/View/index.jsx`](../libraries/engage/components/View/index.jsx).
  The outgoing view lingers in a `rendered` state for `FADE_DURATION`
  while its opacity animates out.
- The duration lives in one place:
  [`libraries/engage/components/View/constants.js`](../libraries/engage/components/View/constants.js)
  (`FADE_DURATION`). Import it rather than hard-coding the number if you
  need to coordinate timing with the crossfade.

## The header does not linger like the body

The page header / AppBar unmounts **immediately** when its route turns
invisible — it does *not* stay for the crossfade the way body content
does. The incoming page's header only appears once that page has mounted.
Net effect: there is a short window during navigation where the header
region is empty.

- The header preset bails out the moment its route is no longer visible —
  see the early `return null` in
  [`themes/theme-ios11/components/AppBar/presets/DefaultBar/index.jsx`](../themes/theme-ios11/components/AppBar/presets/DefaultBar/index.jsx)
  (`if (!this.props.route.visible ...) return null;`).
- The header slot itself is `<header id="AppHeader" />` in
  [`themes/theme-ios11/components/Viewport/index.jsx`](../themes/theme-ios11/components/Viewport/index.jsx).

## The first visit to a page is a cold render, and that dominates the cost

Routes are code-split with `React.lazy` (see
[`themes/theme-ios11/pages/routes.js`](../themes/theme-ios11/pages/routes.js)),
each wrapped in `<Suspense>` with a `null` fallback
([`libraries/common/components/Loading/index.jsx`](../libraries/common/components/Loading/index.jsx)
renders nothing). The first time a page is opened, the cost you feel is
the chunk **parse + first React mount**, not the chunk **download**
(download is usually tens of ms).

Signature symptom: **the first navigation to a page is janky/slow, every
subsequent one is smooth.** When you see that asymmetry, suspect cold
render (or a one-time measurement / layout settle), not the network — and
instrument the real timeline before optimizing, because the obvious
culprit (chunk fetch, the feature's own logic) is usually the wrong one
here.

## The header is in flow and positions the content below it (theme-ios11)

The Viewport is a flex column: header above (`flexShrink`), content below
(`flexGrow`) — see
[`themes/theme-ios11/components/Viewport/style.js`](../themes/theme-ios11/components/Viewport/style.js).
The header's height physically pushes the content down. So if the header
region collapses to zero — e.g. during the empty-header window described
above — the still-visible content **jumps upward**.

When something must hold that vertical space across a transition, reserve
a `minHeight` on the header rather than letting it collapse. The header
style already floors itself to one AppBar's height
(`calc(44px + var(--safe-area-inset-top))`) for exactly this reason; keep
that floor in mind if you change the header layout.

## Practical checklist

- Coordinating animation/timing with a route change? Pull `FADE_DURATION`
  from the View constants; don't re-hard-code it.
- Adding UI in the header area? Remember it disappears first and reappears
  last during a navigation — don't rely on it being present mid-transition.
- A glitch that only happens on the *first* navigation? Measure the
  timeline before theorizing — it's almost always cold render or a
  one-time layout settle, not your feature.
- Anything that changes header height or the Viewport flex layout? Make
  sure the header can't collapse to zero during a transition, or content
  below it will jump.
