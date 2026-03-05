import { useState, useCallback, useRef } from 'react';
import { RIPPLE_PRESS_MS, RIPPLE_RELEASE_MS, RIPPLE_MIN_VISIBLE_MS } from './constants';

type RippleState = 'pressing' | 'releasing';

interface Ripple {
  key: number;
  pointerId: number;
  x: number;
  y: number;
  size: number;
  state: RippleState;
}

/**
 * Custom hook to manage ripple effects for button interactions.
 * It calculates the position and size of the ripple based on the user's click or touch event.
 * @returns An object containing the current ripples and a function to create a new ripple.
 */
export function usePressRipple() {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const keySeq = useRef(0);
  const startedAtByPointer = useRef(new Map<number, number>());

  const start = useCallback((event: React.PointerEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);

    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    startedAtByPointer.current.set(event.pointerId, performance.now());

    keySeq.current += 1;
    setRipples(prev => [
      ...prev,
      {
        key: keySeq.current,
        pointerId: event.pointerId,
        x,
        y,
        size,
        state: 'pressing',
      },
    ]);
  }, []);

  const end = useCallback((pointerId: number) => {
    const startedAt = startedAtByPointer.current.get(pointerId);
    if (startedAt == null) return;

    const elapsed = performance.now() - startedAt;
    const delay = Math.max(0, Math.max(RIPPLE_PRESS_MS, RIPPLE_MIN_VISIBLE_MS) - elapsed);

    window.setTimeout(() => {
      setRipples(prev =>
        prev.map(r => (r.pointerId === pointerId ? {
          ...r,
          state: 'releasing',
        } : r)));

      window.setTimeout(() => {
        setRipples(prev => prev.filter(r => r.pointerId !== pointerId));
        startedAtByPointer.current.delete(pointerId);
      }, RIPPLE_RELEASE_MS);
    }, delay);
  }, []);

  const clearAll = useCallback(() => {
    startedAtByPointer.current.clear();
    setRipples([]);
  }, []);

  return {
    ripples,
    start,
    end,
    clearAll,
    RIPPLE_PRESS_MS,
    RIPPLE_RELEASE_MS,
  };
}
