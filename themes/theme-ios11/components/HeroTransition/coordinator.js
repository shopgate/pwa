import React from 'react';
import ReactDOM from 'react-dom';

const MOUNT_ID = 'hero-transition-root';

/**
 * The set of active event listeners.
 * @type {Set<Function>}
 */
const listeners = new Set();

/**
 * The pending source state, retained so a late-mounting Overlay or an
 * out-of-order target can still be reconciled.
 * @type {?Object}
 */
let pendingSource = null;

/**
 * The pending target rect from the most recent registerTarget, retained so a
 * late-mounting Overlay can be told where to fly even if the target was
 * registered before it subscribed.
 * @type {?DOMRect}
 */
let pendingTarget = null;

/**
 * Whether the Overlay has already been mounted into the document body.
 * @type {boolean}
 */
let mounted = false;

/**
 * Emits an event to every active listener.
 * @param {Object} event The event object.
 */
const emit = (event) => {
  listeners.forEach((listener) => {
    listener(event);
  });
};

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
  // Overlay (which imports the coordinator's event API).
  // eslint-disable-next-line global-require
  const Overlay = require('./Overlay').default;

  ReactDOM.render(React.createElement(Overlay), div);
};

/**
 * Subscribes to coordinator events.
 * @param {Function} listener The listener invoked with each event object.
 * @returns {Function} An unsubscribe function.
 */
export const subscribe = (listener) => {
  listeners.add(listener);

  // Replay any in-flight state to THIS new listener only. A late-subscribing
  // Overlay (mounted via a post-commit effect) would otherwise miss the
  // synchronous 'source' event emitted during captureSource on the first
  // flight, leaving the clone uncreated and clear() never fired.
  try {
    if (pendingSource !== null) {
      listener(pendingSource);

      if (pendingTarget !== null) {
        listener({
          type: 'target',
          targetRect: pendingTarget,
        });
      }
    }
  } catch (e) {
    // A single throwing listener must not break the subscribe call.
  }

  return () => {
    listeners.delete(listener);
  };
};

/**
 * Whether a source is currently pending (a flight is in progress and has not
 * yet been cleared). Lets a mounting PDP know it arrived as the destination of
 * an in-progress flight.
 * @returns {boolean}
 */
export const hasPendingSource = () => pendingSource !== null;

/**
 * Captures the source rect of a clicked product image and kicks off the
 * transition. Ensures the Overlay is mounted before emitting.
 * @param {Object} options The capture options.
 * @param {DOMRect} options.rect The bounding rect of the clicked image.
 * @param {string} options.src The image URL.
 * @param {string} options.productId The product identifier.
 */
export const captureSource = ({ rect, src, productId }) => {
  ensureMounted();

  pendingSource = {
    type: 'source',
    src,
    sourceRect: rect,
    productId,
  };

  emit(pendingSource);
};

/**
 * Registers the PDP hero target element and emits its measured rect so the
 * clone can fly to it.
 * @param {HTMLElement} element The destination element.
 */
export const registerTarget = (element) => {
  if (!element || typeof element.getBoundingClientRect !== 'function') {
    return;
  }

  pendingTarget = element.getBoundingClientRect();

  emit({
    type: 'target',
    targetRect: pendingTarget,
  });
};

/**
 * Resets pending state and notifies subscribers that the transition is done.
 */
export const clear = () => {
  pendingSource = null;
  pendingTarget = null;
  emit({ type: 'clear' });
};
