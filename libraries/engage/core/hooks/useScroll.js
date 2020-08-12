import { useEffect, useState, useCallback } from 'react';
import { throttle } from 'lodash';

/**
 *
 * @param {Function} callback callback
 * @param {Object} [element] element
 */
export function useScroll(callback, element) {
  const [, setScrollPosition] = useState(0);
  let previousScrollTop = 0;

  /**
   * Scroll handler
   */
  const handleDocumentScroll = useCallback(throttle(() => {
    const container = element || document.documentElement || document.body;
    const currentScrollTop = container.scrollY === undefined
      ? container.scrollTop
      : container.scrollY;
    setScrollPosition((previousPosition) => {
      previousScrollTop = previousPosition;
      return currentScrollTop;
    });

    callback({
      previousScrollTop,
      currentScrollTop,
    });
  }, 250), [setScrollPosition, element, callback]);

  useEffect(() => {
    (element || window).addEventListener('scroll', handleDocumentScroll);

    return () =>
      (element || window).removeEventListener('scroll', handleDocumentScroll);
  }, [handleDocumentScroll, element]);
}
