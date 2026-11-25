import { act, render } from '@testing-library/react';
import { ViewContext } from '@shopgate/engage/components/View/context';
import useViewScroll from './useViewScroll';
import type { ViewScrollState } from './useViewScroll';

jest.mock('@shopgate/pwa-common/helpers/config', () => ({
  themeConfig: {
    variables: {
      scroll: {
        offset: 100,
      },
    },
  },
}));
let mockRouteState: { scrollTop?: number } = {};
let mockVisible = true;
let mockRouteId = 0;
let mockScrollContainer = true;
jest.mock('../useRoute', () => ({
  useRoute: () => ({
    id: `route-${mockRouteId}`,
    state: mockRouteState,
    visible: mockVisible,
  }),
}));
jest.mock('@shopgate/engage/core/helpers/scrollContainer', () => ({
  applyScrollContainer: () => mockScrollContainer,
}));

/**
 * Builds a scroll state.
 * @param moved Whether the view is scrolled away from the top.
 * @param scrolled Whether the view is scrolled past the offset.
 * @param scrollingDown Whether the view scrolls down past the offset.
 * @returns The scroll state.
 */
const scrollState = (
  moved: boolean,
  scrolled: boolean,
  scrollingDown: boolean
): ViewScrollState => ({
  moved,
  scrolled,
  scrollingDown,
});

/**
 * Creates a scroll container with room to scroll 1500 px.
 * @returns The scroll container.
 */
const createScrollElement = () => {
  const element = document.createElement('div');
  Object.defineProperty(element, 'scrollHeight', { value: 2000 });
  Object.defineProperty(element, 'clientHeight', { value: 500 });
  return element;
};

describe('useViewScroll', () => {
  let element: HTMLDivElement;
  let state: ViewScrollState;

  /**
   * Renders the hook inside a view whose content is the scroll container.
   * @param enabled Whether the hook tracks the scrolling.
   * @returns The render result.
   */
  const renderHook = (enabled = true) => {
    /**
     * Stores the state of the hook.
     * @param props The component props.
     * @param props.active Whether the hook tracks the scrolling.
     * @returns Nothing.
     */
    const Probe = ({ active }: { active: boolean }) => {
      state = useViewScroll({ enabled: active });
      return null;
    };

    const contextValue = { contentRef: { current: element } } as never;
    const wrap = (active: boolean) => (
      <ViewContext.Provider value={contextValue}>
        <Probe active={active} />
      </ViewContext.Provider>
    );
    const result = render(wrap(enabled));
    return {
      ...result,
      rerenderWith: (active: boolean) => result.rerender(wrap(active)),
    };
  };

  /**
   * Scrolls the container and lets the next frame run.
   * @param scrollTop The new scroll position.
   */
  const scrollTo = (scrollTop: number) => {
    act(() => {
      element.scrollTop = scrollTop;
      element.dispatchEvent(new Event('scroll'));
      jest.advanceTimersByTime(16);
    });
  };

  beforeEach(() => {
    mockRouteState = {};
    mockVisible = true;
    mockRouteId += 1;
    mockScrollContainer = true;
    jest.useFakeTimers();
    element = createScrollElement();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should report scrolling past the offset within one frame', () => {
    renderHook();
    expect(state).toEqual(scrollState(false, false, false));

    scrollTo(150);
    expect(state).toEqual(scrollState(true, true, true));
  });

  it('should report the way back above the offset within one frame', () => {
    renderHook();
    scrollTo(300);

    scrollTo(200);
    expect(state).toEqual(scrollState(true, true, false));

    scrollTo(50);
    expect(state).toEqual(scrollState(true, false, false));
  });

  it('should keep the direction for steps below the minimum distance', () => {
    renderHook();
    scrollTo(300);

    scrollTo(295);
    expect(state.scrollingDown).toBe(true);
  });

  it('should reset the state when it gets disabled', () => {
    const { rerenderWith } = renderHook();
    scrollTo(300);

    rerenderWith(false);
    expect(state).toEqual(scrollState(false, false, false));
  });

  it('should start from the restored scroll position and stop scrolling down once it is restored', () => {
    mockRouteState = { scrollTop: 600 };
    renderHook();
    expect(state).toEqual(scrollState(true, true, true));

    act(() => {
      jest.advanceTimersByTime(16);
    });
    expect(state).toEqual(scrollState(true, true, true));

    scrollTo(600);
    expect(state).toEqual(scrollState(true, true, false));
  });

  it('should not count moving up within 100 px of the bottom as scrolling up', () => {
    renderHook();
    scrollTo(1500);

    scrollTo(1420);
    expect(state.scrollingDown).toBe(true);

    scrollTo(1300);
    expect(state.scrollingDown).toBe(false);
  });

  it('should treat positions past the bottom as the bottom', () => {
    renderHook();
    scrollTo(1500);

    scrollTo(1560);
    scrollTo(1500);
    expect(state.scrollingDown).toBe(true);
  });

  it('should only count moving up by 50 px as scrolling up', () => {
    renderHook();
    scrollTo(600);

    scrollTo(560);
    expect(state.scrollingDown).toBe(true);

    scrollTo(550);
    expect(state.scrollingDown).toBe(false);
  });

  it('should stop scrolling down when the route shows again', () => {
    const { rerenderWith } = renderHook();
    scrollTo(600);
    expect(state.scrollingDown).toBe(true);

    mockVisible = false;
    rerenderWith(true);
    mockVisible = true;
    mockRouteState = { scrollTop: 600 };
    rerenderWith(true);
    expect(state).toEqual(scrollState(true, true, false));
  });

  it('should wait for the restored scroll position when the route shows again', () => {
    const { rerenderWith } = renderHook();
    scrollTo(600);

    mockVisible = false;
    rerenderWith(true);
    element.scrollTop = 0;
    mockVisible = true;
    mockRouteState = { scrollTop: 600 };
    rerenderWith(true);
    expect(state.scrollingDown).toBe(true);

    scrollTo(600);
    expect(state).toEqual(scrollState(true, true, false));
  });

  it('should start an element that mounts again with the direction the route was left with', () => {
    const { unmount } = renderHook();
    scrollTo(600);
    scrollTo(500);
    unmount();

    element = createScrollElement();
    mockRouteState = { scrollTop: 500 };
    renderHook();
    expect(state).toEqual(scrollState(true, true, false));
  });

  it('should only remember the direction of the last 50 routes', () => {
    const firstRouteId = mockRouteId;
    const { unmount } = renderHook();
    scrollTo(600);
    scrollTo(500);
    unmount();

    for (let i = 0; i < 50; i += 1) {
      mockRouteId += 1;
      renderHook().unmount();
    }

    element = createScrollElement();
    mockRouteId = firstRouteId;
    mockRouteState = { scrollTop: 500 };
    renderHook();
    expect(state.scrollingDown).toBe(true);
  });

  it('should use the taller of the document and the body when the window scrolls', () => {
    mockScrollContainer = false;
    const { innerHeight } = window;
    const setProperty = (target: object, name: string, value: number) => {
      Object.defineProperty(target, name, {
        value,
        configurable: true,
        writable: true,
      });
    };
    setProperty(document.documentElement, 'scrollHeight', 1500);
    setProperty(document.body, 'scrollHeight', 3000);
    setProperty(window, 'innerHeight', 500);
    const scrollWindowTo = (scrollY: number) => {
      act(() => {
        setProperty(window, 'scrollY', scrollY);
        window.dispatchEvent(new Event('scroll'));
        jest.advanceTimersByTime(16);
      });
    };

    renderHook();
    scrollWindowTo(2500);
    expect(state.scrollingDown).toBe(true);

    scrollWindowTo(2300);
    expect(state.scrollingDown).toBe(false);

    setProperty(window, 'scrollY', 0);
    setProperty(window, 'innerHeight', innerHeight);
    setProperty(document.body, 'scrollHeight', 0);
    setProperty(document.documentElement, 'scrollHeight', 0);
  });
});
