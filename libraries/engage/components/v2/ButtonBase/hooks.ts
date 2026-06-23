import { useCallback, useRef, useState } from 'react';
import { RIPPLE_MIN_VISIBLE_MS } from './constants';

export interface RippleItem {
  key: number;
  pointerId: number;
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
  const startedAtByPointer = useRef(new Map<number, number>());

  const start = useCallback((event: React.PointerEvent<HTMLElement>) => {
    const element = event.currentTarget;
    const rect = element.getBoundingClientRect();

    const rippleX = Math.round(event.clientX - rect.left);
    const rippleY = Math.round(event.clientY - rect.top);

    const sizeX = Math.max(element.clientWidth - rippleX, rippleX) * 2 + 2;
    const sizeY = Math.max(element.clientHeight - rippleY, rippleY) * 2 + 2;
    const rippleSize = Math.sqrt(sizeX ** 2 + sizeY ** 2);

    startedAtByPointer.current.set(event.pointerId, performance.now());

    nextKey.current += 1;

    setRipples(prev => [
      ...prev,
      {
        key: nextKey.current,
        pointerId: event.pointerId,
        x: rippleX,
        y: rippleY,
        size: rippleSize,
      },
    ]);
  }, []);

  const end = useCallback((pointerId: number) => {
    const startedAt = startedAtByPointer.current.get(pointerId);
    if (startedAt == null) {
      return;
    }

    const elapsed = performance.now() - startedAt;
    const delay = Math.max(0, RIPPLE_MIN_VISIBLE_MS - elapsed);

    window.setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.pointerId !== pointerId));
      startedAtByPointer.current.delete(pointerId);
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
  };
}
