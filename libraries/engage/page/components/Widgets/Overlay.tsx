import {
  useState, useRef, useEffect, useCallback, type RefObject,
} from 'react';
import { makeStyles, keyframes, colorToRgba } from '@shopgate/engage/styles';
import { useRoute } from '@shopgate/engage/core/hooks';
import { getScrollContainer } from './helpers';
import { useWidgetPreviewEvent } from './events';
import { useWidgetsPreview } from './hooks';

/**
 * Position and dimensions of a single overlay rectangle.
 */
interface OverlayStyle {
  /**
   * Style for the top position of the overlay.
   */
  top: number;
  /**
   * Style for the left position of the overlay.
   */
  left: number;
  /**
   * Style for the width of the overlay.
   */
  width: number;
  /**
   * Style for the height of the overlay.
   */
  height: number;
}

/**
 * Styles for the four margin overlays surrounding the active widget.
 */
interface MarginOverlayStyles {
  /**
   * Style for the top margin overlay.
   */
  top: OverlayStyle;
  /**
   * Style for the left margin overlay.
   */
  left: OverlayStyle;
  /**
   * Style for the bottom margin overlay.
   */
  bottom: OverlayStyle;
  /**
   * Style for the right margin overlay.
   */
  right: OverlayStyle;
}

/**
 * Style parameters for the overlay.
 */
interface OverlayStyleParams {
  highlightColor?: string;
  overlayBorderColor?: string;
  marginOverlayColor?: string;
  isFlashing: boolean;
}

const useStyles = makeStyles<OverlayStyleParams>({ name: 'WidgetPreviewOverlay' })((_, {
  highlightColor,
  overlayBorderColor,
  marginOverlayColor,
  isFlashing,
}) => ({
  root: {

  },
  mainOverlay: {
    position: 'absolute',
    pointerEvents: 'none',
    zIndex: 10,
    boxShadow: '0 0 8px 2px rgba(34, 42, 69, 0.07)',
    outline: `1px solid ${overlayBorderColor || '#50A9AD'}`,
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
  marginOverlay: {
    position: 'absolute',
    backgroundColor: colorToRgba(marginOverlayColor || '#50A9AD', 0.1),
    pointerEvents: 'none',
    zIndex: 9,
  },
}));

/**
 * Props of the {@link Overlay} component.
 */
export interface OverlayProps {
  /**
   * The reference to the container element that holds the widgets.
   */
  containerRef: RefObject<HTMLDivElement>;
}

/**
 * The Overlay component is used to highlight the active widget when preview mode is active.
 * It also visualizes the margins of the widget and the borders to its sibling widgets.
 */
const Overlay = ({
  containerRef,
}: OverlayProps) => {
  const {
    query: {
      highlightColor,
      overlayBorderColor,
      marginOverlayColor,
    },
  } = useRoute() as { query: Record<string, string | undefined> };

  const { activeWidget } = useWidgetsPreview();

  // State to hold the style for the main overlay that highlights the active widget.
  const [mainOverlayStyle, setMainOverlayStyle] = useState<OverlayStyle | null>(null);

  // State to hold the styles for the margin overlays that visualize the widget margins.
  const [marginOverlays, setMarginOverlays] = useState<MarginOverlayStyles | null>(null);

  const [isFlashing, setIsFlashing] = useState(false);

  const { classes } = useStyles({
    highlightColor,
    overlayBorderColor,
    marginOverlayColor,
    isFlashing,
  });

  const resizeRef = useRef<ResizeObserver | null>(null);
  const mutationRef = useRef<MutationObserver | null>(null);

  /**
   * Callback to update the overlay position, margin overlays and size based on the active widget.
   */
  const updateOverlay = useCallback(() => {
    if (!containerRef.current || !activeWidget) {
      return;
    }

    const target = containerRef.current.querySelector<HTMLElement>(`#widget-code-${activeWidget}`);

    if (!target) {
      setMainOverlayStyle(null);
      return;
    }

    const scrollContainer = getScrollContainer();

    if (!scrollContainer) {
      return;
    }

    // Get the computed styles of the active widget to calculate margins
    const styles = window.getComputedStyle(target);
    const marginLeft = parseFloat(styles.marginLeft);
    const marginRight = parseFloat(styles.marginRight);
    const marginTop = parseFloat(styles.marginTop);
    const marginBottom = parseFloat(styles.marginBottom);

    // Get bounding rectangles for the target widget and the scroll container
    const elementRect = target.getBoundingClientRect();
    const containerRect = scrollContainer.getBoundingClientRect();

    const baseTop = elementRect.top - containerRect.top + scrollContainer.scrollTop;
    const baseLeft = elementRect.left - containerRect.left + scrollContainer.scrollLeft;

    const top = baseTop;
    const left = baseLeft - marginLeft;
    const width = target.offsetWidth + marginLeft + marginRight;
    const height = target.offsetHeight;

    // Keep a backdoor to re-enable overlay outline inside the widget margins
    const mainOverlayBordersOnMarginEdges = true;
    const mainTop = baseTop - (mainOverlayBordersOnMarginEdges ? marginTop : 0);
    const mainHeight = height + (mainOverlayBordersOnMarginEdges ? marginTop + marginBottom : 0);

    setMainOverlayStyle({
      top: mainTop + 1,
      left,
      width,
      height: mainHeight - 2,
    });

    setMarginOverlays({
      top: {
        top: top - marginTop,
        left,
        width,
        height: marginTop,
      },
      bottom: {
        top: top + height,
        left,
        width,
        height: marginBottom,
      },
      left: {
        top,
        left,
        width: marginLeft,
        height,
      },
      right: {
        top,
        left: left + width - marginRight,
        width: marginRight,
        height,
      },
    });
  }, [activeWidget, containerRef]);

  // Effect to setup observers that watch for changes in the container and its children.
  // Needed to update the overlay style when the layout changes.
  useEffect(() => {
    const containerEl = containerRef.current;
    if (!containerEl) return undefined;

    // Create a ResizeObserver to watch for size changes of children
    const resizeObserver = new ResizeObserver(() => {
      // Whenever any observed child resizes, update overlay
      updateOverlay();
    });
    resizeRef.current = resizeObserver;

    // Observe all existing children
    Array.from(containerEl.children).forEach((child) => {
      if (child.nodeType === Node.ELEMENT_NODE) {
        resizeObserver.observe(child);
      }
    });

    // Create one MutationObserver on the container to watch for changes in the DOM
    const mutationObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'childList') {
          // Handle newly added nodes - observe them for size changes
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              resizeObserver.observe(node as Element);
            }
          });

          // Handle removed nodes - remove them from observation
          mutation.removedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              resizeObserver.unobserve(node as Element);
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
    mutationRef.current = mutationObserver;

    // Start observing:
    // - childList:true → to catch added/removed children
    // - subtree:true + attributes:true → to catch any class/style changes in descendants
    mutationObserver.observe(containerEl, {
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

  if (!mainOverlayStyle) return null;

  return (
    <div className={classes.root}>
      <div
        className={classes.mainOverlay}
        style={mainOverlayStyle}
        onAnimationEnd={handleAnimationEnd}
      />
      {marginOverlays && Object.entries(marginOverlays).map(([key, overlayStyle]) => (
        <div
          key={key}
          className={classes.marginOverlay}
          style={overlayStyle}
        />
      ))}
    </div>
  );
};

export default Overlay;
