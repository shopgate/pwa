export interface ViewScrollEvent {
  /** The original scroll event object */
  event: UIEvent;

  /** Current vertical scroll position */
  scrollTop: number;

  /** Previous scrollTop value */
  previousScrollTop: number;

  /** True if scrolling down */
  scrollDown: boolean;

  /** True if scrolling up */
  scrollUp: boolean;

  /** Scroll direction: 'up', 'down', or null */
  direction: 'up' | 'down' | null;

  /** Optional internal/legacy props (not passed to callbacks) */
  [key: string]: unknown;
}

/**
 * @param event Scroll event
 */
export type ScrollCallback = (event: ViewScrollEvent) => void;

export interface UseScrollDirectionChangeParams {
  /** Whether the hook is active */
  enabled: boolean;

  /**
   * ScrollTop threshold for down scroll triggers. When set,
   * `onScrollDown` fires only when the scroll position is greater than this.
   * @default 100
   */
  offset?: number;

  /**
   * If true, callbacks fire only once per direction change
   * @default true
   */
  onlyFireOnDirectionChange?: boolean;

  /** Callback triggered on scroll up */
  onScrollUp?: ScrollCallback;

  /** Callback triggered on scroll down past offset */
  onScrollDown?: ScrollCallback;
}

/**
 * A scroll hook that detects scroll direction changes (up/down) and
 * triggers the appropriate callbacks. Commonly used to show/hide
 * UI elements based on scroll behavior.
 *
 * @param {UseScrollDirectionChangeParams} params The hook parameters
 */
export default function useScrollDirectionChange(params: UseScrollDirectionChangeParams): void;
