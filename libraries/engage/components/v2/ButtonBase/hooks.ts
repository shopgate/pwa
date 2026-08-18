import {
  useCallback, useEffect, useRef, useState,
} from 'react';
import { RIPPLE_MIN_VISIBLE_MS } from './constants';

export interface RippleItem {
  key: number;
  x: number;
  y: number;
  size: number;
}

/**
 * Manages the active ripple queue.
 *
 * A ripple is added on pointer down and removed on pointer up/cancel/leave.
 * Removal is delayed so very quick taps still show the full press animation.
 *
 * The actual exit animation is handled by react-transition-group in the Ripple component.
 * @returns An object containing the active ripples and functions to start and end ripples.
 */
export function usePressRipple() {
  const [ripples, setRipples] = useState<RippleItem[]>([]);
  const nextKey = useRef(0);
  const startedAtByKey = useRef(new Map<number, number>());
  const activeKeyByPointer = useRef(new Map<number, number>());
  const pendingTimeouts = useRef(new Set<number>());

  useEffect(() => () => {
    pendingTimeouts.current.forEach(timeoutId => window.clearTimeout(timeoutId));
    pendingTimeouts.current.clear();
  }, []);

  const start = useCallback((event: React.PointerEvent<HTMLElement>) => {
    const element = event.currentTarget;
    const rect = element.getBoundingClientRect();

    const hasPointerPosition = Number.isFinite(event.clientX) && Number.isFinite(event.clientY);

    const rippleX = hasPointerPosition
      ? Math.round(event.clientX - rect.left)
      : Math.round(element.clientWidth / 2);
    const rippleY = hasPointerPosition
      ? Math.round(event.clientY - rect.top)
      : Math.round(element.clientHeight / 2);

    const sizeX = Math.max(element.clientWidth - rippleX, rippleX) * 2 + 2;
    const sizeY = Math.max(element.clientHeight - rippleY, rippleY) * 2 + 2;
    const rippleSize = Math.sqrt(sizeX ** 2 + sizeY ** 2);

    nextKey.current += 1;
    const key = nextKey.current;

    startedAtByKey.current.set(key, performance.now());

    // A mouse reuses one pointerId for every press, so the pointer only ever points at the newest
    // one. Keying the rest by ripple instead means an earlier press can no longer end this one.
    activeKeyByPointer.current.set(event.pointerId, key);

    setRipples(prev => [
      ...prev,
      {
        key,
        x: rippleX,
        y: rippleY,
        size: rippleSize,
      },
    ]);
  }, []);

  const end = useCallback((pointerId: number) => {
    const key = activeKeyByPointer.current.get(pointerId);

    if (key == null) {
      return;
    }

    // Pointer up, cancel, leave and lost capture can all fire for a single press, and the press is
    // over after whichever comes first.
    activeKeyByPointer.current.delete(pointerId);

    const startedAt = startedAtByKey.current.get(key);

    if (startedAt == null) {
      return;
    }

    const elapsed = performance.now() - startedAt;
    const delay = Math.max(0, RIPPLE_MIN_VISIBLE_MS - elapsed);

    const timeoutId = window.setTimeout(() => {
      pendingTimeouts.current.delete(timeoutId);
      setRipples(prev => prev.filter(ripple => ripple.key !== key));
      startedAtByKey.current.delete(key);
    }, delay);

    pendingTimeouts.current.add(timeoutId);
  }, []);

  const clearAll = useCallback(() => {
    pendingTimeouts.current.forEach(timeoutId => window.clearTimeout(timeoutId));
    pendingTimeouts.current.clear();
    startedAtByKey.current.clear();
    activeKeyByPointer.current.clear();
    setRipples([]);
  }, []);

  return {
    ripples,
    start,
    end,
    clearAll,
  };
}
