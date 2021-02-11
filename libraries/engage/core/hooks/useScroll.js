import {
  useEffect, useState, useCallback, useRef,
} from 'react';
import throttle from 'lodash/throttle';

/**
 *
 * @param {Function} callback callback
 * @param {Object} [element] element
 */
export function useScroll(callback, element) {
  const [scrollPosition, setScrollPosition] = useState(0);
  const previousScrollPosition = useRef(0);

  /**
   * Scroll handler
   */
  const handleDocumentScroll = useCallback(throttle(() => {
    const container = element || document.documentElement || document.body;
    const currentScrollTop = container.scrollY === undefined
      ? container.scrollTop
      : container.scrollY;

    setScrollPosition((previousPosition) => {
      previousScrollPosition.current = previousPosition;
      return currentScrollTop;
    });
  }, 250), [setScrollPosition, element, callback]);

  /**
   * Notify callback when scroll changes
   */
  useEffect(() => {
    callback({
      previousScrollTop: previousScrollPosition.current,
      currentScrollTop: scrollPosition,
      scrolled: previousScrollPosition.current !== scrollPosition,
      scrollOut: previousScrollPosition.current < scrollPosition,
      scrollIn: previousScrollPosition.current >= scrollPosition,
    });
  }, [callback, scrollPosition]);

  /**
   * Subscribe to scroll events
   */
  useEffect(() => {
    (element || window).addEventListener('scroll', handleDocumentScroll);

    return () =>
      (element || window).removeEventListener('scroll', handleDocumentScroll);
  }, [handleDocumentScroll, element]);
}
