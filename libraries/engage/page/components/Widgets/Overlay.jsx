import React, {
  useState, useRef, useEffect, useCallback, useMemo,
} from 'react';
import PropTypes from 'prop-types';
import { makeStyles, keyframes, colorToRgba } from '@shopgate/engage/styles';
import { useRoute } from '@shopgate/engage/core/hooks';
import { CONSIDER_CONTAINER_MARGINS_DEFAULT } from './constants';
import { getScrollContainer } from './helpers';
import { useWidgetPreviewEvent } from './events';
import { useWidgetsPreview } from './hooks';

/**
 * @typedef {Object} PositionStyle
 * @property {number} top
 * @property {number} left
 * @property {number} width
 * @property {number} height
 */

const useStyles = makeStyles()((_, { highlightColor, borderColor, isFlashing }) => ({
  root: {
    position: 'absolute',
    pointerEvents: 'none',
    zIndex: 10,
    boxShadow: '0 0 8px 2px rgba(34, 42, 69, 0.07)',
    outline: `1px solid ${borderColor || '#50A9AD'}`,
    ...(isFlashing && {
      animationName: keyframes({
        '0%': { backgroundColor: 'transparent' },
        '50%': { backgroundColor: colorToRgba(highlightColor || '#50A9AD', 0.5) },
        '100%': { backgroundColor: 'transparent' },
      }),
      animationDuration: '0.5s',
      animationTimingFunction: 'ease-in-out',
      animationFillMode: 'forwards',
    }),
  },
}));

/**
 * The Overlay component is used to highlight the active widget when preview mode is active.
 * @param {Object} props The component props.
 * @param {React.Ref<HTMLDivElement>} props.containerRef The reference to the container element that
 * holds the widgets.
 * @returns {JSX.Element|null}
 */
const Overlay = ({
  containerRef,
}) => {
  const {
    query: {
      highlightColor,
      borderColor,
      considerContainerMargins,
    },
  } = useRoute();

  // Detect if container margins should be considered at overlay calculation.
  const considerVerticalMargins = useMemo(() => {
    if (!considerContainerMargins) {
      return CONSIDER_CONTAINER_MARGINS_DEFAULT;
    }

    return considerContainerMargins === 'true';
  }, [considerContainerMargins]);

  const { activeId } = useWidgetsPreview();

  const [style, setStyle] = useState/** @type {PositionStyle|null} */(null);
  const [isFlashing, setIsFlashing] = useState(false);

  const { classes } = useStyles({
    highlightColor,
    borderColor,
    isFlashing,
  });

  /**
   * @type {import('react').MutableRefObject<ResizeObserver|null>}
   */
  const resizeRef = useRef(null);
  /**
   * @type {import('react').MutableRefObject<MutationObserver|null>}
   */
  const mutationRef = useRef(null);

  /**
   * Callback to update the overlay position and size based on the active widget.
   */
  const updateOverlay = useCallback(() => {
    if (!containerRef.current || !activeId) {
      return;
    }

    const target = containerRef.current.querySelector(`#${CSS.escape(activeId)}`);

    if (!target) {
      setStyle(null);
      return;
    }

    const scrollContainer = getScrollContainer();

    const styles = window.getComputedStyle(target);
    const marginLeft = parseFloat(styles.marginLeft);
    const marginRight = parseFloat(styles.marginRight);

    let marginTop = 0;
    let marginBottom = 0;

    if (considerVerticalMargins) {
      marginTop = parseFloat(styles.marginTop);
      marginBottom = parseFloat(styles.marginBottom);
    }
    // Bounding rects
    const elementRect = target.getBoundingClientRect();
    const containerRect = scrollContainer.getBoundingClientRect();

    // Calculate position relative to the container's content area
    const top = elementRect.top - containerRect.top + scrollContainer.scrollTop - marginTop;
    const left = elementRect.left - containerRect.left + scrollContainer.scrollLeft - marginLeft;

    const width = target.offsetWidth + marginLeft + marginRight;
    const height = target.offsetHeight + marginTop + marginBottom;

    setStyle({
      top: `${top + 1}px`,
      left: `${left}px`,
      width: `${width}px`,
      height: `${height}px`,
    });
  }, [activeId, containerRef, considerVerticalMargins]);

  // Effect to setup observers that watch for changes in the container and its children.
  // Needed to update the overlay style when the layout changes.
  useEffect(() => {
    const containerEl = containerRef.current;
    if (!containerEl) return undefined;

    // Create a ResizeObserver to watch for size changes of children
    resizeRef.current = new ResizeObserver(() => {
      // Whenever any observed child resizes, update overlay
      updateOverlay();
    });

    // Observe all existing children
    Array.from(containerEl.children).forEach((child) => {
      if (child.nodeType === Node.ELEMENT_NODE) {
        resizeRef.current.observe(child);
      }
    });

    // Create one MutationObserver on the container to watch for changes in the DOM
    mutationRef.current = new MutationObserver((mutations) => {
      // eslint-disable-next-line no-restricted-syntax
      for (const mutation of mutations) {
        if (mutation.type === 'childList') {
          // Handle newly added nodes - observe them for size changes
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              resizeRef.current.observe(node);
            }
          });

          // Handle removed nodes - remove them from observation
          mutation.removedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              resizeRef.current.unobserve(node);
            }
          });

          // If children were added/removed, recalculate overlay position
          updateOverlay();
        } else if (
          mutation.type === 'attributes' &&
          (mutation.attributeName === 'class' || mutation.attributeName === 'style')
        ) {
          // Update overlay if the class or style of a child changes
          if (mutation.target.parentElement === containerEl) {
            updateOverlay();
          }
        }
      }
    });

    // Start observing:
    // - childList:true → to catch added/removed children
    // - subtree:true + attributes:true → to catch any class/style changes in descendants
    mutationRef.current.observe(containerEl, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'style'],
    });

    // Cleanup on unmount or if updateOverlay changes:
    return () => {
      if (resizeRef.current) {
        resizeRef.current.disconnect();
        resizeRef.current = null;
      }
      if (mutationRef.current) {
        mutationRef.current.disconnect();
        mutationRef.current = null;
      }
    };
  }, [containerRef, updateOverlay]);

  useWidgetPreviewEvent('highlight-widget', () => {
    setIsFlashing(true);
  });

  const handleAnimationEnd = useCallback(() => {
    setIsFlashing(false);
  }, []);

  if (!style) return null;

  return (
    <div
      className={classes.root}
      style={style}
      onAnimationEnd={handleAnimationEnd}
    />
  );
};

Overlay.propTypes = {
  containerRef: PropTypes.shape().isRequired,
};

export default Overlay;
