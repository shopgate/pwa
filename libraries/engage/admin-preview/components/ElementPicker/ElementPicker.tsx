import React, {
  useCallback, useEffect, useLayoutEffect, useRef, useState,
} from 'react';
import { createPortal } from 'react-dom';
import { findStableElement, getStableClass, getStableSelectors } from './helpers';

// The admin's primary color, which the CMS preview uses for its highlights too.
const HIGHLIGHT_COLOR = '#50A9AD';

/**
 * Events the app must not see while picking, so taps neither navigate nor trigger ripples.
 */
const BLOCKED_EVENTS = ['pointerdown', 'pointerup', 'mousedown', 'mouseup', 'touchstart', 'touchend'];

/**
 * Caps the outlines for a selector that matches every item of a long list.
 */
const MAX_HIGHLIGHTS = 50;

type Target = {
  element: Element;
  label: string;
};

type Highlight = {
  rect: DOMRect;
  label: string;
};

type ElementPickerProps = {
  active: boolean;
  /**
   * Outlines all elements that match the selector while not picking, e.g. while the merchant
   * hovers a picked class in the admin.
   */
  highlightSelector?: string | null;
  /**
   * Called with the selectors of the picked element and its ancestors, closest first.
   */
  onPick: (selectors: string[]) => void;
  onCancel: () => void;
};

/**
 * Space between a label and the edges of the viewport.
 */
const LABEL_MARGIN = 4;

/**
 * Names the outlined element. It starts at the element's left edge, but moves left as far as needed
 * to stay inside the viewport, and wraps when it's wider than the viewport.
 */
const HighlightLabel = ({ rect, label }: Highlight) => {
  const ref = useRef<HTMLSpanElement>(null);
  const [offset, setOffset] = useState(0);

  useLayoutEffect(() => {
    const width = ref.current?.offsetWidth ?? 0;
    const left = Math.max(
      LABEL_MARGIN,
      Math.min(rect.left, window.innerWidth - width - LABEL_MARGIN)
    );

    setOffset(left - rect.left);
  }, [label, rect.left]);

  return (
    <span
      ref={ref}
      style={{
        position: 'absolute',
        left: offset,
        [rect.top < 24 ? 'top' : 'bottom']: '100%',
        width: 'max-content',
        maxWidth: `calc(100vw - ${LABEL_MARGIN * 2}px)`,
        padding: '2px 6px',
        borderRadius: 3,
        backgroundColor: HIGHLIGHT_COLOR,
        color: '#fff',
        font: '12px/1.4 ui-monospace, Menlo, monospace',
        overflowWrap: 'anywhere',
        boxSizing: 'border-box',
      }}
    >
      {label}
    </span>
  );
};

/**
 * Finds the elements that match a selector from the admin. An invalid selector matches nothing.
 * @param selector The selector to look for.
 * @returns The matching elements with a size, at most MAX_HIGHLIGHTS.
 */
const findTargets = (selector: string): Target[] => {
  try {
    return Array.from(document.querySelectorAll(selector))
      .filter(element => element.getClientRects().length > 0)
      .slice(0, MAX_HIGHLIGHTS)
      .map(element => ({ element, label: selector }));
  } catch {
    return [];
  }
};

/**
 * Lets the admin preview pick an element: it outlines the element under the pointer that carries a
 * stable class, and reports the classes of a clicked one instead of passing the click on. While
 * not picking, it outlines the elements of a selector the admin asks for.
 */
const ElementPicker = ({
  active,
  highlightSelector = null,
  onPick,
  onCancel,
}: ElementPickerProps) => {
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const targetsRef = useRef<Target[]>([]);

  const updateHighlights = useCallback(() => {
    setHighlights(targetsRef.current.map(({ element, label }) => ({
      rect: element.getBoundingClientRect(),
      label,
    })));
  }, []);

  const setTargets = useCallback((targets: Target[]) => {
    targetsRef.current = targets;
    updateHighlights();
  }, [updateHighlights]);

  // Keeps the outlines on their elements while the app scrolls or resizes.
  useEffect(() => {
    if (!active && !highlightSelector) {
      return undefined;
    }

    window.addEventListener('scroll', updateHighlights, true);
    window.addEventListener('resize', updateHighlights);

    return () => {
      window.removeEventListener('scroll', updateHighlights, true);
      window.removeEventListener('resize', updateHighlights);
    };
  }, [active, highlightSelector, updateHighlights]);

  useEffect(() => {
    if (!active) {
      setTargets(highlightSelector ? findTargets(highlightSelector) : []);
    }
  }, [active, highlightSelector, setTargets]);

  useEffect(() => {
    if (!active) {
      return undefined;
    }

    setTargets([]);

    const handlePointerMove = (event: PointerEvent) => {
      const element = findStableElement(event.target as Element);

      if (element !== targetsRef.current[0]?.element) {
        setTargets(element ? [{ element, label: `.${getStableClass(element)}` }] : []);
      }
    };

    const handleClick = (event: MouseEvent) => {
      event.preventDefault();
      event.stopImmediatePropagation();

      const element = findStableElement(event.target as Element);

      if (element) {
        onPick(getStableSelectors(element));
      }
    };

    const blockEvent = (event: Event) => {
      event.stopImmediatePropagation();
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onCancel();
      }
    };

    window.addEventListener('pointermove', handlePointerMove, true);
    window.addEventListener('click', handleClick, true);
    BLOCKED_EVENTS.forEach(type => window.addEventListener(type, blockEvent, true));
    window.addEventListener('keydown', handleKeyDown, true);
    document.documentElement.style.cursor = 'crosshair';

    return () => {
      window.removeEventListener('pointermove', handlePointerMove, true);
      window.removeEventListener('click', handleClick, true);
      BLOCKED_EVENTS.forEach(type => window.removeEventListener(type, blockEvent, true));
      window.removeEventListener('keydown', handleKeyDown, true);
      document.documentElement.style.cursor = '';
    };
  }, [active, onCancel, onPick, setTargets]);

  if (highlights.length === 0) {
    return null;
  }

  return createPortal(
    <>
      {highlights.map(({ rect, label }, index) => (
        <div
          // Outlines only change as a whole, so their order is a stable key.
          // eslint-disable-next-line react/no-array-index-key
          key={index}
          data-element-picker-highlight
          style={{
            position: 'fixed',
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height,
            outline: `2px solid ${HIGHLIGHT_COLOR}`,
            outlineOffset: -1,
            backgroundColor: 'rgba(80, 169, 173, 0.15)',
            pointerEvents: 'none',
            zIndex: 2147483647,
          }}
        >
          {/* One label is enough when a selector matches a whole list */}
          {index === 0 && <HighlightLabel rect={rect} label={label} />}
        </div>
      ))}
    </>,
    document.body
  );
};

export default ElementPicker;
