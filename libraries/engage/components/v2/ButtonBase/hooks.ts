import { useState, useCallback } from 'react';

interface Ripple {
  key: number;
  x: number;
  y: number;
  size: number;
}

/**
 * Custom hook to manage ripple effects for button interactions.
 * It calculates the position and size of the ripple based on the user's click or touch event.
 * @returns An object containing the current ripples and a function to create a new ripple.
 */
export function useRipple() {
  const [ripples, setRipples] = useState<Ripple[]>([]);

  const createRipple = useCallback((event: React.PointerEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();

    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    const ripple: Ripple = {
      key: Date.now(),
      x,
      y,
      size,
    };

    setRipples(old => [...old, ripple]);

    setTimeout(() => {
      setRipples(old => old.filter(r => r.key !== ripple.key));
    }, 550);
  }, []);

  return {
    ripples,
    createRipple,
  };
}
