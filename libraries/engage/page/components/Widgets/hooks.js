import {
  useEffect, useCallback, useRef, useContext, useMemo,
} from 'react';
import { logger } from '@shopgate/engage/core/helpers';
import { useDispatch } from 'react-redux';
import { useRoute } from '@shopgate/engage/core/hooks';
import { receivePageConfigV2 } from '@shopgate/engage/page/action-creators';
import { PAGE_PREVIEW_SLUG } from '@shopgate/engage/page/constants';
import {
  ALLOWED_PAGE_PREVIEW_ORIGINS,
  CONSIDER_CONTAINER_MARGINS_ON_SCROLL_DEFAULT,
} from './constants';
import { getScrollContainer } from './helpers';
import { WidgetsPreviewContext } from './WidgetsPreviewContext';
import {
  dispatchWidgetPreviewEvent,
  useWidgetPreviewEvent,
} from './events';

/**
 * @typedef {Object} MessageData
 * @property {string} type Identifier for the kind of message
 * @property {any} [payload] Optional data payload for this message
 */

/**
 * @typedef {Object} IframeMessengerResult
 * @property {function(MessageData, string=): void} sendToParent
 *   - Send data up to window.parent. If targetOrigin is omitted, uses the
 *     most recently seen origin (from an incoming message). If none seen yet,
 *     falls back to parentOrigins[0] or "*".
 */

/**
 * Hook for postMessage communication when your component is inside an iframe.
 *
 * Listens on window for "message" events from any origin in parentOrigins,
 * and only calls onMessage(data, rawEvent) if both origin and source match.
 *
 * @param {function(MessageData, any): void} onMessage
 *   Callback invoked when a trusted message arrives. Receives data and the
 *   raw event (so you can inspect origin, source, etc.).
 * @param {string[]} parentOrigins
 *   Array of allowed parent origin strings (e.g.
 *   ['https://a.example.com','https://b.example.com']).
 * @returns {IframeMessengerResult}
 *   An object with a single method:
 *   • sendToParent(data, [targetOrigin]): void
 *     – Posts data up to window.parent. By default it uses the most recently
 *       seen origin (from an incoming message). If none, uses parentOrigins[0].
 */
function useIframeMessenger(onMessage, parentOrigins) {
  // Keep a ref to the latest onMessage callback so the listener always has it.
  const onMessageRef = useRef(onMessage);
  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  // Keep track of the last allowed origin we heard from
  const lastOriginRef = useRef(null);

  // Attach / detach the "message" listener.
  useEffect(() => {
    /**
     * Handler for incoming postMessage events.
     * @param {any} rawEvent  – The original MessageEvent object.
     */
    function handler(rawEvent) {
      if (rawEvent?.data?.type === 'webpackOk') {
        onMessageRef.current({
          type: 'requestPageConfig',
        }, rawEvent);

        return;
      }

      // Only proceed if the origin is in our whitelist.
      if (!parentOrigins.includes(rawEvent.origin)) return;
      // Ensure the message actually came from window.parent.
      if (rawEvent.source !== window.parent) return;

      // Record this origin as most recently seen.
      lastOriginRef.current = rawEvent.origin;

      // Forward the event.data and the raw event to the callback.
      onMessageRef.current(rawEvent.data, rawEvent);
    }

    window.addEventListener('message', handler);
    return () => {
      window.removeEventListener('message', handler);
    };
  }, [parentOrigins]);

  /**
   * Send a message up to the parent window.
   * @param {MessageData} data       - The data object to post.
   * @param {string}      [targetOrigin]
   *   Optional override for the origin to post to. Must be one of
   *   parentOrigins. If omitted, uses the last seen origin (lastOriginRef),
   *   or parentOrigins[0], or "*" if array is empty.
   */
  const sendToParent = useCallback(
    (data, targetOrigin) => {
      // Determine which origin to use: explicit, then last seen, then first, then "*".
      const originToUse =
        typeof targetOrigin === 'string'
          ? targetOrigin
          : lastOriginRef.current || new URL(document.referrer).origin || parentOrigins[0] || '*';

      if (!originToUse) {
        logger.warn(
          'useIframeMessenger: no targetOrigin available. ' +
            'Provide parentOrigins or pass targetOrigin.'
        );
        return;
      }

      window.parent.postMessage(data, originToUse);
    },
    [parentOrigins]
  );

  return { sendToParent };
}

/**
 * Hook to handle communication with the parent window in a page preview iframe.
 * @param {boolean} isActive Whether the preview communication is active.
 */
export const usePreviewIframeCommunication = (isActive = false) => {
  const dispatch = useDispatch();

  const { query: { considerContainerMarginsOnScroll } } = useRoute();

  // Detect if container margins should be considered at scroll to widget.
  const considerVerticalMargins = useMemo(() => {
    if (!considerContainerMarginsOnScroll) {
      return CONSIDER_CONTAINER_MARGINS_ON_SCROLL_DEFAULT;
    }

    return considerContainerMarginsOnScroll === 'true';
  }, [considerContainerMarginsOnScroll]);

  const { sendToParent } = useIframeMessenger((data) => {
    if (data.type === 'receivePageConfig') {
      // Page preview config received from the parent window.
      dispatch(receivePageConfigV2({
        type: 'cms',
        slug: PAGE_PREVIEW_SLUG,
        data: data.payload,
      }));
    } else if (data.type === 'scrollToWidget' && data.payload?.widgetCode) {
      // Parent window requested to scroll to a specific widget.
      const scrollContainer = getScrollContainer();
      const target = document.getElementById(data.payload.widgetCode);

      if (scrollContainer && target) {
        let marginTop = 0;

        if (considerVerticalMargins) {
          const styles = window.getComputedStyle(target);
          marginTop = parseFloat(styles.marginTop);
        }

        const containerTop = scrollContainer.getBoundingClientRect().top;
        const targetTop = target.getBoundingClientRect().top;
        const scrollOffset = targetTop - containerTop + scrollContainer.scrollTop - marginTop;
        const maxScrollTop = scrollContainer.scrollHeight - scrollContainer.clientHeight;
        const actualScrollTop = Math.min(scrollOffset, maxScrollTop);

        // Register the target element as the active widget.
        dispatchWidgetPreviewEvent('set-active-widget-id', data.payload.widgetCode);

        /**
         * Callback to highlight the widget after scrolling.
         */
        const highlightWidget = () => {
          dispatchWidgetPreviewEvent('highlight-widget', data.payload.widgetCode);
        };

        // Add listener to onScrollEnd if available, otherwise use scroll event.
        if ('onscrollend' in scrollContainer) {
          /**
           * Callback for the scrollend event.
           */
          const onEnded = () => {
            scrollContainer.removeEventListener('scrollend', onEnded);
            highlightWidget();
          };
          scrollContainer.addEventListener('scrollend', onEnded, { once: true });
          scrollContainer.scrollTo({
            top: actualScrollTop,
            behavior: 'smooth',
          });
          return;
        }

        // Fallback: listen for scroll events until scrollTop ≈ actualScrollTop

        /**
         * Callback for the scroll event.
         */
        const onScroll = () => {
          // Allow a 1 px leeway for subpixel rendering
          if (Math.abs(scrollContainer.scrollTop - actualScrollTop) < 1) {
            scrollContainer.removeEventListener('scroll', onScroll);
            highlightWidget();
          }
        };

        scrollContainer.addEventListener('scroll', onScroll);
        scrollContainer.scrollTo({
          top: actualScrollTop,
          behavior: 'smooth',
        });
      }
    }
  }, ALLOWED_PAGE_PREVIEW_ORIGINS);

  useWidgetPreviewEvent('widget-clicked', (e) => {
    if (!isActive) {
      return;
    }

    sendToParent({
      type: 'widgetClicked',
      payload: {
        widgetCode: e.detail.widgetCode,
      },
    });
  });
};

/**
 * @typedef {import('./WidgetsPreviewContext.js').WidgetsPreviewContextType}
 * WidgetsPreviewContextType
 */

/**
 * The useWidgetsPreview hook provides access to the context that is wrapped around the Widgets
 * component when it's rendered in preview mode.
 * @returns {WidgetsPreviewContextType} The widget context.
 */
export const useWidgetsPreview = () => useContext(WidgetsPreviewContext);
