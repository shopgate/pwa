import {
  useCallback, useContext, useEffect, useMemo, useState,
} from 'react';
import { useDispatch } from 'react-redux';
import type { UnknownAction } from 'redux';
import { useRoute } from '@shopgate/engage/core/hooks';
import { receivePageConfigV2 } from '@shopgate/engage/page/action-creators';
import { PAGE_PREVIEW_SLUG } from '@shopgate/engage/page/constants';
import { useIframeMessenger, type MessageData } from '@shopgate/engage/admin-preview/hooks';
import { ALLOWED_ADMIN_PREVIEW_ORIGINS } from '@shopgate/engage/admin-preview/constants';
import {
  CONSIDER_CONTAINER_MARGINS_ON_SCROLL_DEFAULT,
  ENTRANCE_MAX_DELAY,
  ENTRANCE_MIN_VISIBLE_PX,
  ENTRANCE_MIN_VISIBLE_RATIO,
  ENTRANCE_STAGGER,
  WIDGETS_PER_RENDER,
} from './constants';
import { getScrollContainer } from './helpers';
import {
  WidgetsPreviewContext,
  type WidgetsPreviewContextType,
} from './WidgetsPreviewContext';
import {
  dispatchWidgetPreviewEvent,
  useWidgetPreviewEvent,
} from './events';

/**
 * Message payload exchanged with the parent window in the page preview iframe.
 */
interface WidgetPreviewMessage extends MessageData {
  type: string;
  payload?: {
    /**
     * The code of the widget the message refers to.
     */
    widgetCode?: string;
    [key: string]: unknown;
  };
}

/**
 * Hook to handle communication with the parent window in a page preview iframe.
 * @param isActive Whether the preview communication is active.
 */
export const usePreviewIframeCommunication = (isActive = false) => {
  const dispatch = useDispatch();

  const {
    query: { considerContainerMarginsOnScroll },
  } = useRoute() as { query: Record<string, string | undefined> };

  // Detect if container margins should be considered at scroll to widget.
  const considerVerticalMargins = useMemo(() => {
    if (!considerContainerMarginsOnScroll) {
      return CONSIDER_CONTAINER_MARGINS_ON_SCROLL_DEFAULT;
    }

    return considerContainerMarginsOnScroll === 'true';
  }, [considerContainerMarginsOnScroll]);

  const { sendToParent } = useIframeMessenger<WidgetPreviewMessage>((data) => {
    // Allowed parents can also emit unrelated messages with arbitrary payloads.
    if (typeof data !== 'object' || data === null) {
      return;
    }

    if (data.type === 'receivePageConfig') {
      // Page preview config received from the parent window.
      dispatch(receivePageConfigV2({
        type: 'cms',
        slug: PAGE_PREVIEW_SLUG,
        data: data.payload ?? {},
      }) as UnknownAction);
    } else if (data.type === 'scrollToWidget' && data.payload?.widgetCode) {
      // Parent window requested to scroll to a specific widget.
      const { widgetCode } = data.payload;
      const scrollContainer = getScrollContainer();
      const target = scrollContainer?.querySelector(`#widget-code-${widgetCode}`);

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
        dispatchWidgetPreviewEvent('set-active-widget-id', widgetCode);

        /**
         * Callback to highlight the widget after scrolling.
         */
        const highlightWidget = () => {
          dispatchWidgetPreviewEvent('highlight-widget', widgetCode);
        };

        // Add listener to onScrollEnd if available, otherwise use scroll event.
        if ('onscrollend' in (scrollContainer as object)) {
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
  }, ALLOWED_ADMIN_PREVIEW_ORIGINS, isActive);

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
 * The useWidgetsPreview hook provides access to the context that is wrapped around the Widgets
 * component when it's rendered in preview mode.
 * @returns The widget preview context.
 */
export const useWidgetsPreview = (): WidgetsPreviewContextType => useContext(WidgetsPreviewContext);

/**
 * Renders the widgets of a page in batches, so that the first ones show and react at once.
 * @param total The number of widgets.
 * @param renderAll Whether to render all widgets right away.
 * @returns The number of widgets to render.
 */
export const useRenderedWidgetCount = (total: number, renderAll: boolean): number => {
  const [count, setCount] = useState(renderAll ? Infinity : WIDGETS_PER_RENDER);

  useEffect(() => {
    if (count >= total) {
      return undefined;
    }

    const timeout = setTimeout(() => setCount(count + WIDGETS_PER_RENDER), 0);
    return () => clearTimeout(timeout);
  }, [count, total]);

  return count;
};

/**
 * Fades in the waiting widgets once enough of them is visible, one after the other.
 * @param entries The intersection reports.
 * @param observer The observer.
 */
const revealWidgets: IntersectionObserverCallback = (entries, observer) => {
  entries
    .filter(({
      isIntersecting, intersectionRatio, intersectionRect, boundingClientRect,
    }) => isIntersecting && (
      intersectionRatio >= ENTRANCE_MIN_VISIBLE_RATIO ||
      intersectionRect.height >= ENTRANCE_MIN_VISIBLE_PX ||
      boundingClientRect.height >= window.innerHeight
    ))
    .forEach(({ target }, index) => {
      const widget = target as HTMLElement;
      observer.unobserve(widget);
      widget.style.transitionDelay = `${Math.min(index * ENTRANCE_STAGGER, ENTRANCE_MAX_DELAY)}ms`;
      widget.dataset.entrance = 'shown';
    });
};

/**
 * Lets the widgets that are below the screen when they first get their content fade in once
 * when they scroll into view.
 * @param isEnabled Whether widgets fade in.
 * @returns A ref callback for the widget containers.
 */
export const useWidgetEntrance = (isEnabled: boolean) => {
  const [observers] = useState(() => {
    if (!isEnabled || typeof IntersectionObserver === 'undefined' || typeof ResizeObserver === 'undefined') {
      return null;
    }

    const reveal = new IntersectionObserver(revealWidgets, {
      threshold: [0, 0.05, 0.1, 0.15, ENTRANCE_MIN_VISIBLE_RATIO],
    });

    const measure = new ResizeObserver(entries => entries.forEach(({ target, contentRect }) => {
      if (!contentRect.height) {
        return;
      }

      measure.unobserve(target);

      const widget = target as HTMLElement;

      if (widget.getBoundingClientRect().top >= window.innerHeight) {
        widget.dataset.entrance = 'waiting';
        reveal.observe(widget);
      }
    }));

    return {
      reveal,
      measure,
    };
  });

  useEffect(() => () => {
    observers?.reveal.disconnect();
    observers?.measure.disconnect();
  }, [observers]);

  return useCallback((widget: HTMLElement | null) => {
    if (widget) {
      observers?.measure.observe(widget);
    }
  }, [observers]);
};
