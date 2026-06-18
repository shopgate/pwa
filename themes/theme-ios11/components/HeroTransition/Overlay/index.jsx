import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { subscribe, clear } from '../coordinator';
import {
  prefersReducedMotion,
  getFlipDelta,
  deltaToTransform,
} from '../helpers';

const FLIGHT_DURATION = 350;
const TARGET_TIMEOUT = 600;
const CLEANUP_SAFETY = FLIGHT_DURATION + 100;
const HIGH_Z_INDEX = 2147483646;

/**
 * The HeroTransition Overlay. Renders a fixed-position flying clone of a product
 * image and animates it from a source rect to a target rect using FLIP.
 * @returns {JSX|null}
 */
const Overlay = () => {
  const [clone, setClone] = useState(null);

  const imageRef = useRef(null);
  const sourceRef = useRef(null);
  const rafIds = useRef([]);
  const timeoutIds = useRef([]);
  // Latch ensuring teardown (and the coordinator 'clear') runs at most once per
  // flight, regardless of how many transitionend events fire or whether the
  // safety timeout races a real transitionend.
  const finishedRef = useRef(false);

  /**
   * Cancels any scheduled animation frames and timeouts.
   */
  const cancelScheduled = useCallback(() => {
    rafIds.current.forEach((id) => {
      cancelAnimationFrame(id);
    });
    rafIds.current = [];

    timeoutIds.current.forEach((id) => {
      clearTimeout(id);
    });
    timeoutIds.current = [];
  }, []);

  /**
   * Tears down the clone, resets internal state and notifies the coordinator.
   */
  const finish = useCallback(() => {
    // Idempotency latch: transitionend fires once per animated property
    // (transform + opacity) and may also race the safety timeout, so guard the
    // teardown body to run exactly once per flight.
    if (finishedRef.current) {
      return;
    }
    finishedRef.current = true;

    cancelScheduled();
    sourceRef.current = null;
    setClone(null);
    clear();
  }, [cancelScheduled]);

  /**
   * Runs the FLIP flight from the stored source rect to the given target rect.
   * @param {DOMRect} targetRect The destination rect.
   */
  const runFlight = useCallback((targetRect) => {
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
    const delta = getFlipDelta(source.sourceRect, targetRect);
    node.style.transform = deltaToTransform(delta);
    node.style.opacity = '1';

    // Force a reflow so the inverted state is committed before we animate.
    // eslint-disable-next-line no-unused-expressions
    node.offsetHeight;

    // Play: on the next frame, transition transform/opacity to identity.
    rafIds.current.push(requestAnimationFrame(() => {
      rafIds.current.push(requestAnimationFrame(() => {
        const { current } = imageRef;

        if (!current) {
          return;
        }

        // Keep the clone fully opaque for the whole flight: the real PDP image
        // stays hidden until the flight finishes, so the clone must not fade
        // (an invisible swap happens at teardown, same position). Only the
        // transform animates; transform's transitionend drives `finish`.
        current.style.transition = `transform ${FLIGHT_DURATION}ms ease`;
        current.style.transform = 'translate(0px, 0px) scale(1, 1)';
      }));
    }));

    // Safety timeout in case transitionend never fires.
    timeoutIds.current.push(setTimeout(finish, CLEANUP_SAFETY));
  }, [cancelScheduled, finish]);

  useEffect(() => {
    const unsubscribe = subscribe((event) => {
      if (event.type === 'source') {
        if (prefersReducedMotion()) {
          // Skip the flight entirely for reduced-motion users.
          clear();
          return;
        }

        cancelScheduled();
        // New flight begins: re-arm the teardown latch so the next animation
        // can finish even though a previous one already fired.
        finishedRef.current = false;
        sourceRef.current = event;
        setClone({
          src: event.src,
          rect: event.sourceRect,
        });

        // Fallback: if no target arrives in time, fade out and clear.
        timeoutIds.current.push(setTimeout(() => {
          const node = imageRef.current;

          if (node) {
            node.style.transition = `opacity ${FLIGHT_DURATION}ms ease`;
            node.style.opacity = '0';
          }

          timeoutIds.current.push(setTimeout(finish, FLIGHT_DURATION));
        }, TARGET_TIMEOUT));

        return;
      }

      if (event.type === 'target') {
        if (!sourceRef.current) {
          // Target arrived without a pending source; nothing to fly.
          return;
        }

        runFlight(event.targetRect);
        return;
      }

      if (event.type === 'clear') {
        cancelScheduled();
        sourceRef.current = null;
        setClone(null);
      }
    });

    return () => {
      unsubscribe();
      cancelScheduled();
    };
  }, [cancelScheduled, finish, runFlight]);

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
        // transform leg so teardown isn't triggered twice.
        if (event.propertyName === 'transform') {
          finish();
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
      }}
    />
  );
};

export default Overlay;
