import { useCallback } from 'react';
import { getCSSCustomProp } from '@shopgate/engage/styles';
import { hasWebBridge } from '../helpers/bridge';

/**
 * @param {Object} ref A ref to the scroll container
 * @param {number} [offset=10] Optional offset for the scroll operation
 * @returns {Object}
 */
export const useScrollTo = (ref, offset = 10) => {
  const scrollTo = useCallback((selector) => {
    if (!ref?.current) {
      return;
    }

    const firstElement = ref.current.querySelector(selector);

    if (firstElement) {
      if (hasWebBridge()) {
        const scrollOffset = offset;
        const appBarHeight = getCSSCustomProp('--app-bar-height') || 0;
        const { top } = firstElement.getBoundingClientRect();

        const scrollTop = top + window.pageYOffset - parseInt(appBarHeight, 10) - scrollOffset;

        window.scroll({
          top: scrollTop,
          behavior: 'smooth',
        });
      } else {
        firstElement.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [offset, ref]);

  return {
    scrollTo,
  };
};
