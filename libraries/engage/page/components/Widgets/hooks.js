import {
  useContext, useMemo,
} from 'react';
import { useDispatch } from 'react-redux';
import { useRoute } from '@shopgate/engage/core/hooks';
import { receivePageConfigV2 } from '@shopgate/engage/page/action-creators';
import { PAGE_PREVIEW_SLUG } from '@shopgate/engage/page/constants';
import { useIframeMessenger } from '@shopgate/engage/admin-preview/hooks';
import { ALLOWED_ADMIN_PREVIEW_ORIGINS } from '@shopgate/engage/admin-preview/constants';
import {
  CONSIDER_CONTAINER_MARGINS_ON_SCROLL_DEFAULT,
} from './constants';
import { getScrollContainer } from './helpers';
import { WidgetsPreviewContext } from './WidgetsPreviewContext';
import {
  dispatchWidgetPreviewEvent,
  useWidgetPreviewEvent,
} from './events';

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
      const target = scrollContainer.querySelector(`#widget-code-${data.payload.widgetCode}`);

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
  }, ALLOWED_ADMIN_PREVIEW_ORIGINS);

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
