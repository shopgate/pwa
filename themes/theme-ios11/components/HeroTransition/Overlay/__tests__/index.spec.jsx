/**
 * theme-ios11 > components > HeroTransition > Overlay
 *
 * Exercises the REAL clone adapter. The flight state machine is tested through
 * fake adapters elsewhere; here we mount the actual Overlay, capture the adapter
 * it registers with `flight`, and drive its four methods (render/fly/fade/remove)
 * to assert the exact DOM style writes and branches the FLIP relies on.
 *
 * The historical bug guarded here is the deferred-fly race: when flight calls
 * render()+fly() in the same tick, the clone <img> is not yet committed, so fly
 * must stash the target and run the FLIP from the layout effect after commit. If
 * that deferral were dropped the flight would silently jump instead of animate.
 *
 * jsdom does not run CSS transitions, so these assertions check the STYLE WRITES
 * and the BRANCH TAKEN, not visual animation.
 */
import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';

// `mock`-prefixed names are the only out-of-scope refs jest allows inside a mock
// factory. We capture the registered adapter and a settle spy here.
const mockState = { capturedAdapter: null };
const mockUnregister = jest.fn();
const mockSettle = jest.fn();

jest.mock('../../flight', () => ({
  registerClone: jest.fn((adapter) => {
    mockState.capturedAdapter = adapter;
    return mockUnregister;
  }),
  settle: (...args) => mockSettle(...args),
}));

// Keep this unit isolated from the engage import graph (timing pulls in View).
jest.mock('../../timing', () => ({ FLIGHT_DURATION: 350 }));

const Overlay = require('../index').default;

const SOURCE_RECT = {
  top: 10, left: 20, width: 100, height: 200,
};
const TARGET_RECT = {
  top: 300, left: 40, width: 250, height: 500,
};

describe('theme-ios11 > components > HeroTransition > Overlay', () => {
  let originalRaf;
  let originalCancelRaf;
  let wrapper;

  beforeEach(() => {
    mockState.capturedAdapter = null;
    mockUnregister.mockClear();
    mockSettle.mockClear();

    // Run rAF callbacks synchronously so the FLIP "Play" phase (two nested
    // rAFs) executes within the test.
    originalRaf = window.requestAnimationFrame;
    originalCancelRaf = window.cancelAnimationFrame;
    window.requestAnimationFrame = (cb) => {
      cb();
      return 0;
    };
    window.cancelAnimationFrame = () => {};

    act(() => {
      wrapper = mount(<Overlay />);
    });
  });

  afterEach(() => {
    if (wrapper) {
      act(() => {
        wrapper.unmount();
      });
      wrapper = null;
    }
    window.requestAnimationFrame = originalRaf;
    window.cancelAnimationFrame = originalCancelRaf;
  });

  /**
   * Returns the committed clone img DOM node, flushing React first.
   * @returns {HTMLElement} The clone img node.
   */
  const getImgNode = () => {
    wrapper.update();
    return wrapper.find('img').getDOMNode();
  };

  it('should register the clone adapter on mount and unregister on unmount', () => {
    expect(mockState.capturedAdapter).toEqual({
      render: expect.any(Function),
      fly: expect.any(Function),
      fade: expect.any(Function),
      remove: expect.any(Function),
    });
  });

  it('should mount the clone img at the source rect on render', () => {
    act(() => {
      mockState.capturedAdapter.render({ src: 'a.jpg', sourceRect: SOURCE_RECT });
    });

    const node = getImgNode();

    expect(node.getAttribute('src')).toBe('a.jpg');
    expect(node.getAttribute('aria-hidden')).toBe('true');
    expect(node.style.position).toBe('fixed');
    expect(node.style.top).toBe('10px');
    expect(node.style.left).toBe('20px');
    expect(node.style.width).toBe('100px');
    expect(node.style.height).toBe('200px');
  });

  it('should run the FLIP immediately when the img is already committed', () => {
    act(() => {
      mockState.capturedAdapter.render({ src: 'a.jpg', sourceRect: SOURCE_RECT });
    });

    // The img is now committed: fly takes the immediate path.
    act(() => {
      mockState.capturedAdapter.fly(TARGET_RECT);
    });

    const node = getImgNode();

    // rAF ran synchronously, so the Play phase has written the final state.
    expect(node.style.transition).toBe('transform 350ms ease');
    expect(node.style.transform).toBe('translate(0px, 0px) scale(1, 1)');

    // The clone was sized to the target rect (the FLIP "Last" position).
    expect(node.style.top).toBe('300px');
    expect(node.style.left).toBe('40px');
    expect(node.style.width).toBe('250px');
    expect(node.style.height).toBe('500px');
  });

  // BLOCKER regression: flight calls render() then fly() in the SAME tick, before
  // React has committed the img. fly must stash the target (imageRef is null) and
  // the layout effect must run the FLIP after commit. An instant jump writes no
  // transition; this asserts the deferred FLIP actually ran.
  it('should run the deferred FLIP when render and fly fire before commit', () => {
    act(() => {
      mockState.capturedAdapter.render({ src: 'a.jpg', sourceRect: SOURCE_RECT });
      // No wrapper.update() between these: imageRef.current is still null when
      // fly runs, so it stores pendingFlyRef instead of flying immediately.
      mockState.capturedAdapter.fly(TARGET_RECT);
    });

    const node = getImgNode();

    // The layout effect drained pendingFlyRef after commit and ran the FLIP.
    expect(node.style.transition).toBe('transform 350ms ease');
    expect(node.style.transform).toBe('translate(0px, 0px) scale(1, 1)');
  });

  it('should fade the clone out on fade', () => {
    act(() => {
      mockState.capturedAdapter.render({ src: 'a.jpg', sourceRect: SOURCE_RECT });
    });

    act(() => {
      mockState.capturedAdapter.fade();
    });

    const node = getImgNode();

    expect(node.style.transition).toBe('opacity 350ms ease');
    expect(node.style.opacity).toBe('0');
  });

  it('should tear the clone down on remove', () => {
    act(() => {
      mockState.capturedAdapter.render({ src: 'a.jpg', sourceRect: SOURCE_RECT });
    });
    wrapper.update();

    expect(wrapper.find('img')).toHaveLength(1);

    act(() => {
      mockState.capturedAdapter.remove();
    });
    wrapper.update();

    expect(wrapper.find('img')).toHaveLength(0);
  });

  it('should call flight.settle() only for the transform transitionend', () => {
    act(() => {
      mockState.capturedAdapter.render({ src: 'a.jpg', sourceRect: SOURCE_RECT });
    });
    wrapper.update();

    // A non-transform property must not settle.
    act(() => {
      wrapper.find('img').props().onTransitionEnd({ propertyName: 'opacity' });
    });
    expect(mockSettle).not.toHaveBeenCalled();

    // The transform leg drives settle.
    act(() => {
      wrapper.find('img').props().onTransitionEnd({ propertyName: 'transform' });
    });
    expect(mockSettle).toHaveBeenCalledTimes(1);
  });
});
