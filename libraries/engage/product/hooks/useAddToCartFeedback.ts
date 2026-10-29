import {
  useCallback, useEffect, useRef, useState,
} from 'react';

/** State of an add to cart button: waiting for the cart, confirming, or ready. */
export type AddToCartFeedbackState = 'idle' | 'pending' | 'added';

/** Shape of a cart pipeline result as far as the feedback needs it. */
interface AddToCartResult {
  messages?: { type?: string }[];
}

export const ADDED_FEEDBACK_DURATION = 1500;

/**
 * Tracks an add to cart request for a button: `pending` while it runs, `added` for a moment after
 * it succeeded, `idle` otherwise and after a failure.
 * @returns The state and a function that takes the running request.
 */
export const useAddToCartFeedback = () => {
  const [state, setState] = useState<AddToCartFeedbackState>('idle');
  const timeout = useRef<ReturnType<typeof setTimeout>>();
  const mounted = useRef(true);

  useEffect(() => () => {
    mounted.current = false;
    clearTimeout(timeout.current);
  }, []);

  const track = useCallback((request: unknown, onAdded?: () => void) => {
    clearTimeout(timeout.current);
    setState('pending');

    return Promise.resolve(request as AddToCartResult | undefined)
      .then((result) => {
        if (!mounted.current) {
          return;
        }

        if (result?.messages?.some(message => message.type === 'error')) {
          setState('idle');
          return;
        }

        onAdded?.();
        setState('added');
        timeout.current = setTimeout(() => setState('idle'), ADDED_FEEDBACK_DURATION);
      })
      .catch(() => {
        if (mounted.current) {
          setState('idle');
        }
      });
  }, []);

  return {
    state,
    track,
  };
};
