import { useRef } from 'react';
import type { PointerEvent } from 'react';

const OFFSET_PROPERTY = '--media-viewer-drag-offset';
const PROGRESS_PROPERTY = '--media-viewer-drag-progress';
const AXIS_LOCK_DISTANCE = 10;
const DISMISS_DISTANCE = 100;

export const DRAG_OFFSET = `var(${OFFSET_PROPERTY}, 0px)`;
export const DRAG_PROGRESS = `var(${PROGRESS_PROPERTY}, 0)`;

interface Gesture {
  pointerId: number;
  x: number;
  y: number;
  offset: number;
  dragging: boolean;
}

/**
 * Moves the element's content with the drag and fades its backdrop with the distance.
 * @param element The element of the viewer.
 * @param offset The vertical distance of the drag.
 */
const setDrag = (element: HTMLElement, offset: number) => {
  const progress = Math.min(Math.abs(offset) / (element.clientHeight / 2 || 1), 1);

  element.style.setProperty(OFFSET_PROPERTY, `${offset}px`);
  element.style.setProperty(PROGRESS_PROPERTY, `${progress}`);
};

/**
 * Lets a vertical swipe or mouse drag move the media out of the viewer. A short drag snaps back,
 * a long one moves the media out of the screen and dismisses the viewer.
 * @param onDismiss Called when a drag dismisses the viewer.
 * @param canDrag Whether a new drag may start, e.g. not while the media is zoomed.
 * @returns The ref for the viewer element and its pointer handlers.
 */
export const useDragToDismiss = <T extends HTMLElement>(
  onDismiss: () => void,
  canDrag: () => boolean
) => {
  const ref = useRef<T>(null);
  const gesture = useRef<Gesture | null>(null);

  /**
   * Ends the current drag.
   * @param dismiss Whether the drag dismisses the viewer when it was long enough.
   */
  const end = (dismiss: boolean) => {
    const { current } = gesture;
    const element = ref.current;
    gesture.current = null;

    if (!current?.dragging || !element) {
      return;
    }

    element.removeAttribute('data-dragging');

    if (dismiss && Math.abs(current.offset) > DISMISS_DISTANCE) {
      setDrag(element, Math.sign(current.offset) * element.clientHeight);
      onDismiss();
    } else {
      setDrag(element, 0);
    }
  };

  /**
   * Starts a drag with the mouse or a single finger. A further finger cancels a running drag.
   * @param event The pointer event.
   */
  const onPointerDown = (event: PointerEvent) => {
    end(false);

    gesture.current = event.isPrimary && canDrag() ? {
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      offset: 0,
      dragging: false,
    } : null;
  };

  /**
   * Follows a vertical drag. A horizontal one is left to the slider.
   * @param event The pointer event.
   */
  const onPointerMove = (event: PointerEvent) => {
    const { current } = gesture;
    const element = ref.current;

    if (!current || !element || event.pointerId !== current.pointerId) {
      return;
    }

    if (!event.buttons) {
      end(true);
      return;
    }

    const deltaX = event.clientX - current.x;
    const deltaY = event.clientY - current.y;

    if (!current.dragging) {
      if (Math.max(Math.abs(deltaX), Math.abs(deltaY)) < AXIS_LOCK_DISTANCE) {
        return;
      }

      if (Math.abs(deltaX) >= Math.abs(deltaY)) {
        gesture.current = null;
        return;
      }

      current.dragging = true;
      element.setAttribute('data-dragging', '');
    }

    current.offset = deltaY;
    setDrag(element, deltaY);
  };

  return {
    ref,
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp: () => end(true),
      onPointerCancel: () => end(false),
    },
  };
};
