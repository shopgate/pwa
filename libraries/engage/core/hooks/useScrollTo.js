import { useCallback } from 'react';
import { getCSSCustomProp } from '@shopgate/engage/styles';
import { hasWebBridge } from '../helpers/bridge';

/**
 * @param {Object} ref A ref to the scroll container
 * @returns {Object}
 */
export const useScrollTo = (ref) => {
  const scrollTo = useCallback((selector) => {
    if (!ref?.current) {
      return;
    }

    const firstElement = ref.current.querySelector(selector);

    if (firstElement) {
      if (hasWebBridge()) {
        const offset = 10;
        const appBarHeight = getCSSCustomProp('--app-bar-height') || 0;
        const { top } = firstElement.getBoundingClientRect();

        const scrollTop = top + window.pageYOffset - parseInt(appBarHeight, 10) - offset;

        window.scroll({
          top: scrollTop,
          behavior: 'smooth',
        });
      } else {
        firstElement.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [ref]);

  return {
    scrollTo,
  };
};
