import React from 'react';
import ReactDOM from 'react-dom';
import { prefersReducedMotion } from './helpers';
import {
  TARGET_TIMEOUT,
  CLEANUP_SAFETY,
  HERO_REVEAL_SAFETY,
} from './timing';

const MOUNT_ID = 'hero-transition-root';

/**
 * The current phase of the flight state machine.
 * @type {'idle'|'captured'|'flying'}
 */
let phase = 'idle';

/**
 * The stored source of the in-flight transition.
 * @type {?{sourceRect: DOMRect, src: string, productId: string}}
 */
let source = null;

/**
 * The stored target rect the clone is flying to.
 * @type {?DOMRect}
 */
let targetRect = null;

/**
 * The registered clone adapter (built by the Overlay).
 * @type {?{render: Function, fly: Function, fade: Function, remove: Function}}
 */
let cloneAdapter = null;

/**
 * The registered hero adapter (built by the PDP slider).
 * @type {?{setHidden: Function, getRect: Function}}
 */
let heroAdapter = null;

/**
 * Timer id for the no-target fallback.
 * @type {?number}
 */
let fallbackTimer = null;

/**
 * Timer id for the cleanup safety backstop.
 * @type {?number}
 */
let cleanupTimer = null;

/**
 * Timer id for the hero reveal safety backstop.
 * @type {?number}
 */
let heroRevealTimer = null;

/**
 * Per-flight idempotency latch so settle() runs its body at most once per
 * flight. Re-armed (set false) at the start of each capture.
 * @type {boolean}
 */
let settled = true;

/**
 * Whether the Overlay has already been mounted into the document body.
 * @type {boolean}
 */
let mounted = false;

/**
 * Lazily mounts a single Overlay instance into the document body. Guards against
 * double-mounting and against SSR / non-browser environments.
 */
const ensureMounted = () => {
  if (mounted || typeof document === 'undefined' || !document.body) {
    return;
  }

  mounted = true;

  const div = document.createElement('div');
  div.id = MOUNT_ID;
  document.body.appendChild(div);

  // Required lazily to avoid a static import cycle between this module and the
  // Overlay (which imports the flight API).
  // eslint-disable-next-line global-require
  const Overlay = require('./Overlay').default;

  ReactDOM.render(React.createElement(Overlay), div);
};

/**
 * Cancels all pending flight timers and nulls their stored ids. Robust to
 * undefined / already-null ids. Shared by capture() (start of a new flight) and
 * settle() (teardown) so a stale timer from a prior flight can never fire.
 */
const cancelTimers = () => {
  if (fallbackTimer != null) {
    clearTimeout(fallbackTimer);
    fallbackTimer = null;
  }

  if (cleanupTimer != null) {
    clearTimeout(cleanupTimer);
    cleanupTimer = null;
  }

  if (heroRevealTimer != null) {
    clearTimeout(heroRevealTimer);
    heroRevealTimer = null;
  }
};

/**
 * The single idempotent teardown. Cancels all timers, removes the clone, reveals
 * the hero and resets the flight to idle. Safe to call multiple times per
 * flight.
 */
export const settle = () => {
  if (settled) {
    return;
  }
  settled = true;

  cancelTimers();

  if (cloneAdapter) {
    cloneAdapter.remove();
  }

  if (heroAdapter) {
    heroAdapter.setHidden(false);
  }

  phase = 'idle';
  source = null;
  targetRect = null;
};

/**
 * Promotes the flight to 'flying' and starts the actual FLIP animation. Stores
 * the target rect, cancels the no-target fallback, arms the cleanup-safety
 * backstop measured from this fly-start moment, and tells the clone to fly.
 * Shared by _tryFly() and registerClone()'s late-replay path.
 * @param {DOMRect} rect The target rect to fly to.
 */
const _startFlying = (rect) => { // eslint-disable-line no-underscore-dangle
  phase = 'flying';
  targetRect = rect;

  // The flight has begun; the no-target fallback is no longer relevant.
  if (fallbackTimer != null) {
    clearTimeout(fallbackTimer);
    fallbackTimer = null;
  }

  // Arm the cleanup-safety backstop from fly-start, not from capture. Clear any
  // existing one first so the replay path cannot double-arm it.
  if (cleanupTimer != null) {
    clearTimeout(cleanupTimer);
    cleanupTimer = null;
  }
  cleanupTimer = setTimeout(settle, CLEANUP_SAFETY);

  if (cloneAdapter) {
    cloneAdapter.fly(rect);
  }
};

/**
 * Attempts to start the flight: only when captured and a hero is present with a
 * valid rect. Delegates the actual start to _startFlying.
 */
const _tryFly = () => { // eslint-disable-line no-underscore-dangle
  if (phase !== 'captured' || !heroAdapter) {
    return;
  }

  const r = heroAdapter.getRect();

  if (!r || !r.width || !r.height) {
    return;
  }

  _startFlying(r);
};

/**
 * Runs when no hero target arrives in time: fade the clone out then settle.
 */
const _fallback = () => { // eslint-disable-line no-underscore-dangle
  if (cloneAdapter) {
    cloneAdapter.fade();
    fallbackTimer = setTimeout(settle, CLEANUP_SAFETY - 100);
    return;
  }

  settle();
};

/**
 * Captures the source rect of a clicked product image and kicks off the flight.
 * @param {Object} options The capture options.
 * @param {DOMRect} options.sourceRect The bounding rect of the clicked image.
 * @param {string} options.src The image URL.
 * @param {string} options.productId The product identifier.
 */
export const capture = ({ sourceRect, src, productId }) => {
  if (prefersReducedMotion()) {
    return;
  }

  ensureMounted();

  // Cancel any timers still armed from a prior, not-yet-settled flight so a
  // stale timer cannot tear down this new flight after we re-arm the latch.
  cancelTimers();

  phase = 'captured';
  source = { sourceRect, src, productId };

  // New flight begins: re-arm the teardown latch.
  settled = false;

  if (cloneAdapter) {
    cloneAdapter.render({ src, sourceRect });
  }

  // Always arm the no-target fallback as a backstop. When the flight actually
  // starts flying (hero present with a valid rect), _startFlying cancels it.
  // Arming it unconditionally guarantees the clone is never stranded — e.g. a
  // hero is registered but measures a null/zero rect, so _tryFly bails without
  // starting a flight; the fallback then fades the clone out and settles.
  fallbackTimer = setTimeout(_fallback, TARGET_TIMEOUT);

  if (heroAdapter) {
    heroAdapter.setHidden(true);
    _tryFly();
  }
};

/**
 * Registers the clone adapter. Replays in-flight state so a late-mounting
 * Overlay catches up.
 * @param {Object} adapter The clone adapter.
 * @param {Function} adapter.render Renders the clone at the source rect.
 * @param {Function} adapter.fly Animates the clone to the target rect.
 * @param {Function} adapter.fade Fades the clone out.
 * @param {Function} adapter.remove Tears the clone down instantly.
 * @returns {Function} An unregister function.
 */
export const registerClone = ({
  render, fly, fade, remove,
}) => {
  cloneAdapter = {
    render, fly, fade, remove,
  };

  if (phase === 'flying') {
    render({ src: source.src, sourceRect: source.sourceRect });
    // Re-arm the cleanup-safety backstop for this (re)started flight via the
    // shared starter so the late-mounting Overlay's flight is still backstopped.
    _startFlying(targetRect);
  } else if (phase === 'captured') {
    render({ src: source.src, sourceRect: source.sourceRect });
    _tryFly();
  }

  return () => {
    if (cloneAdapter && cloneAdapter.render === render) {
      cloneAdapter = null;
    }
  };
};

/**
 * Registers the hero adapter (the PDP destination). Hides the hero if this PDP
 * mounted as the in-flight destination, schedules a reveal backstop, and tries
 * to start the flight.
 * @param {Object} adapter The hero adapter.
 * @param {Function} adapter.setHidden Hides or reveals the hero.
 * @param {Function} adapter.getRect Returns the hero's bounding rect.
 * @returns {Function} An unregister function.
 */
export const registerHero = ({ setHidden, getRect }) => {
  heroAdapter = { setHidden, getRect };

  if (phase === 'captured') {
    setHidden(true);
    _tryFly();
  }

  // Clear any previous reveal timer (remount / two instances) so its id is not
  // leaked when we overwrite it below.
  if (heroRevealTimer != null) {
    clearTimeout(heroRevealTimer);
    heroRevealTimer = null;
  }

  heroRevealTimer = setTimeout(() => {
    if (heroAdapter && heroAdapter.setHidden === setHidden && phase !== 'idle') {
      setHidden(false);
    }
  }, HERO_REVEAL_SAFETY);

  return () => {
    if (heroRevealTimer !== null) {
      clearTimeout(heroRevealTimer);
      heroRevealTimer = null;
    }

    if (heroAdapter && heroAdapter.setHidden === setHidden) {
      heroAdapter = null;
    }
  };
};

/**
 * External cancel: an alias for settle().
 */
export const reset = () => {
  settle();
};

/**
 * Whether a flight is currently pending (not idle).
 * @returns {boolean}
 */
export const isFlightPending = () => phase !== 'idle';
