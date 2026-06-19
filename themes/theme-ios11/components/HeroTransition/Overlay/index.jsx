import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { registerClone, settle } from '../flight';
import { FLIGHT_DURATION } from '../timing';
import { getFlipDelta, deltaToTransform } from '../helpers';

const HIGH_Z_INDEX = 2147483646;

/**
 * The HeroTransition Overlay. A thin clone adapter: it renders a fixed-position
 * flying clone of a product image and runs the FLIP DOM animation. All flight
 * orchestration (state machine, timers, teardown latch) lives in `../flight`.
 * On mount it registers itself with the flight module and exposes the four
 * adapter methods (render/fly/fade/remove) that flight drives.
 * @returns {JSX|null}
 */
const Overlay = () => {
  const [clone, setClone] = useState(null);

  const imageRef = useRef(null);
  const sourceRef = useRef(null);
  const rafIds = useRef([]);
  const pendingFlyRef = useRef(null);

  /**
   * Cancels any scheduled animation frames.
   */
  const cancelScheduled = useCallback(() => {
    rafIds.current.forEach((id) => {
      cancelAnimationFrame(id);
    });
    rafIds.current = [];
  }, []);

  /**
   * Adapter: mounts the clone as a fixed-position img at the source rect.
   * @param {Object} payload The render payload.
   * @param {string} payload.src The image source.
   * @param {DOMRect|Object} payload.sourceRect The rect to position the clone at.
   */
  const render = useCallback(({ src, sourceRect }) => {
    cancelScheduled();
    sourceRef.current = sourceRect;
    setClone({
      src,
      rect: sourceRect,
    });
  }, [cancelScheduled]);

  /**
   * Runs the FLIP flight from the stored source rect to the target. Requires the
   * clone img to be committed (imageRef set); callers guarantee that either by
   * checking imageRef directly (immediate path) or by waiting for the layout
   * effect to fire after commit (deferred path).
   * @param {DOMRect} targetRect The destination rect.
   */
  const runFlip = useCallback((targetRect) => {
    const node = imageRef.current;
    const source = sourceRef.current;

    if (!node || !source) {
      return;
    }

    cancelScheduled();

    // Last: position the clone at the final (target) rect.
    node.style.top = `${targetRect.top}px`;
    node.style.left = `${targetRect.left}px`;
    node.style.width = `${targetRect.width}px`;
    node.style.height = `${targetRect.height}px`;
    node.style.transition = 'none';

    // Invert: transform back to look like the source rect.
    const delta = getFlipDelta(source, targetRect);
    node.style.transform = deltaToTransform(delta);
    node.style.opacity = '1';

    // Force a reflow so the inverted state is committed before we animate.
    // eslint-disable-next-line no-unused-expressions
    node.offsetHeight;

    // Play: on the next frame, transition transform to identity.
    rafIds.current.push(requestAnimationFrame(() => {
      rafIds.current.push(requestAnimationFrame(() => {
        const { current } = imageRef;

        if (!current) {
          return;
        }

        // Keep the clone fully opaque for the whole flight: the real PDP image
        // stays hidden until the flight finishes, so the clone must not fade
        // (an invisible swap happens at teardown, same position). Only the
        // transform animates; transform's transitionend drives `settle`.
        current.style.transition = `transform ${FLIGHT_DURATION}ms ease`;
        current.style.transform = 'translate(0px, 0px) scale(1, 1)';
      }));
    }));
  }, [cancelScheduled]);

  /**
   * Adapter: runs the FLIP flight to the target. If the clone img is already
   * committed, runs it immediately; otherwise defers it until the layout effect
   * fires after the img commits (flight may call render()+fly() in the same tick,
   * before React has flushed the img into the DOM).
   * @param {DOMRect} targetRect The destination rect.
   */
  const fly = useCallback((targetRect) => {
    if (imageRef.current) {
      runFlip(targetRect);
      return;
    }

    pendingFlyRef.current = targetRect;
  }, [runFlip]);

  /**
   * Adapter: fades the clone out (no-target fallback path). flight schedules the
   * teardown after the duration, so no teardown is scheduled here.
   */
  const fade = useCallback(() => {
    const node = imageRef.current;

    if (!node) {
      return;
    }

    node.style.transition = `opacity ${FLIGHT_DURATION}ms ease`;
    node.style.opacity = '0';
  }, []);

  /**
   * Adapter: tears the clone down immediately and cancels pending frames.
   */
  const remove = useCallback(() => {
    cancelScheduled();
    sourceRef.current = null;
    pendingFlyRef.current = null;
    setClone(null);
  }, [cancelScheduled]);

  // Runs synchronously after the clone img commits (before paint). If a fly()
  // was deferred because the img wasn't mounted yet, run the FLIP now so it
  // starts from the source rect with no visible flash.
  useLayoutEffect(() => {
    if (!clone || pendingFlyRef.current == null) {
      return;
    }

    const targetRect = pendingFlyRef.current;
    pendingFlyRef.current = null;
    runFlip(targetRect);
  }, [clone, runFlip]);

  useEffect(() => {
    const unregister = registerClone({
      render,
      fly,
      fade,
      remove,
    });

    return () => {
      unregister();
      cancelScheduled();
    };
  }, [render, fly, fade, remove, cancelScheduled]);

  if (!clone) {
    return null;
  }

  return (
    <img
      ref={imageRef}
      src={clone.src}
      alt=""
      aria-hidden="true"
      onTransitionEnd={(event) => {
        // transitionend fires once per animated property; only react to the
        // transform leg. flight.settle() is idempotent, so a stray call is safe.
        if (event.propertyName === 'transform') {
          settle();
        }
      }}
      style={{
        position: 'fixed',
        top: `${clone.rect.top}px`,
        left: `${clone.rect.left}px`,
        width: `${clone.rect.width}px`,
        height: `${clone.rect.height}px`,
        objectFit: 'cover',
        pointerEvents: 'none',
        zIndex: HIGH_Z_INDEX,
        transformOrigin: 'top left',
        willChange: 'transform, opacity',
        opacity: 1,
      }}
    />
  );
};

export default Overlay;
