import React from 'react';
import { render } from '@shopgate/pwa-unit-test/rtlUtils';
import { UIEvents } from '@shopgate/engage/core/events';
import { SHEET_EVENTS } from '@shopgate/engage/components';
import { getAbsoluteHeight } from '@shopgate/engage/core/helpers';
import Footer from '../Footer';
import {
  handleSafeAreaInsets,
  updateFooterHeight,
} from '../helpers';
import { APP_FOOTER_ID } from '../constants';

const mutationConstructorSpy = jest.fn();
const mutationObserveSpy = jest.fn();
const mutationDisconnectSpy = jest.fn();

/* eslint-disable extra-rules/potential-point-free, class-methods-use-this */
global.MutationObserver = class {
  constructor(callback) { mutationConstructorSpy(callback); }

  observe(element, initObject) { mutationObserveSpy(element, initObject); }

  disconnect() { mutationDisconnectSpy(); }
};
/* eslint-enable extra-rules/potential-point-free, class-methods-use-this */
jest.mock('@shopgate/engage/components');
jest.mock('@shopgate/engage/core/events', () => ({
  UIEvents: {
    addListener: jest.fn(),
    removeListener: jest.fn(),
  },
}));
jest.mock('@shopgate/engage/core/helpers', () => ({
  getAbsoluteHeight: jest.fn(),
  applyScrollContainer: jest.fn().mockReturnValue(false),
}));
jest.mock('../helpers', () => ({
  getElementBackgroundColor: jest.fn(),
  handleSafeAreaInsets: jest.fn(),
  updateFooterHeight: jest.fn(),
}));

const FOOTER_CHILD_ID = 'footer-child';
const defaultBackgroundColor = 'red';
const defaultChildren = (
  <div
    id={FOOTER_CHILD_ID}
    style={{ backgroundColor: defaultBackgroundColor }}
  />
);

/**
 * @param {HTMLElement} container A render container.
 * @param {string} id Id of the element to change.
 */
const addHeightToWrapperElement = (container, id) => {
  const footer = container.querySelector(`#${APP_FOOTER_ID}`);
  const elements = footer ? footer.querySelectorAll(`#${id}`) : [];
  if (elements) {
    Array.from(elements).forEach((element) => {
      Object.defineProperty(element, 'clientHeight', {
        get: () => 30,
      });
    });
  }
};

/**
 * Returns the DOM node of the footer from a render container.
 * @param {HTMLElement} container A render container.
 * @returns {Node}
 */
const getFooterRefFromContainer = container => container.querySelector(`#${APP_FOOTER_ID}`);

/**
 * @param {NodeList} children Children for the footer.
 * @returns {Object}
 */
const createComponent = (children = defaultChildren) => {
  const renderResult = render((
    <div>
      <Footer>
        {children}
      </Footer>
    </div>
  ));

  return renderResult;
};

describe('<Footer />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the component', () => {
    const { container } = createComponent();
    expect(container.querySelector(`div#${APP_FOOTER_ID} > #${FOOTER_CHILD_ID}`)).not.toBeNull();
    expect(mutationConstructorSpy).toHaveBeenCalledWith(expect.any(Function));
    expect(handleSafeAreaInsets).toHaveBeenCalledTimes(1);
    expect(updateFooterHeight).toHaveBeenCalledTimes(1);
  });

  describe('MutationObserver', () => {
    let callback;
    let container;

    beforeEach(() => {
      jest.clearAllMocks();
      ({ container } = createComponent());
      ([[callback]] = mutationConstructorSpy.mock.calls);
    });

    it('should observer with the correct initialization', () => {
      expect(mutationObserveSpy).toHaveBeenCalledWith(
        getFooterRefFromContainer(container),
        {
          childList: true,
          subtree: true,
          attributes: true,
          attributeFilter: ['style', 'class'],
        }
      );
    });

    it('should perform an inset update when the updated DOM element is not ignored', () => {
      const element = document.createElement('div');
      callback([{ target: element }]);
      expect(handleSafeAreaInsets).toHaveBeenCalledTimes(2);
    });

    it('should not perform an inset update when the updated DOM element is ignored', () => {
      const element = document.createElement('div');
      element.setAttribute('data-footer-inset-update-ignore', 'true');
      callback([{ target: element }]);
      expect(handleSafeAreaInsets).toHaveBeenCalledTimes(1);
    });
  });

  describe('UI events subscriptions', () => {
    it('should subscribe / unsubscribe UI events', () => {
      const { unmount } = render((
        <Footer>
          <div>Footer</div>
        </Footer>
      ));

      expect(UIEvents.addListener).toBeCalledTimes(2);

      expect(UIEvents.addListener).nthCalledWith(1, SHEET_EVENTS.OPEN, expect.any(Function));
      expect(UIEvents.addListener).nthCalledWith(2, SHEET_EVENTS.CLOSE, expect.any(Function));

      unmount();
      expect(UIEvents.removeListener).toBeCalledTimes(2);
      expect(UIEvents.removeListener).nthCalledWith(1, SHEET_EVENTS.OPEN, expect.any(Function));
      expect(UIEvents.removeListener).nthCalledWith(2, SHEET_EVENTS.CLOSE, expect.any(Function));
    });
  });

  describe('helpers', () => {
    describe('updateFooterHeight()', () => {
      beforeAll(() => {
        handleSafeAreaInsets.mockClear();
      });

      beforeEach(() => {
        createComponent();
      });

      it('should set footer height to zero', () => {
        // Invoke event listener SHEET_EVENTS.OPEN (hide footer)
        UIEvents.addListener.mock.calls[0][1]();
        expect(updateFooterHeight).toHaveBeenCalledWith(0);
      });
      it('should set footer height', () => {
        getAbsoluteHeight.mockReturnValueOnce('48px');
        // Invoke event listener SHEET_EVENTS.HIDE (show footer)
        UIEvents.addListener.mock.calls[1][1]();
        expect(updateFooterHeight).toHaveBeenCalledWith('48px');
      });
    });

    describe('.getInsetBackgroundColor()', () => {
      let getElementBackgroundColor;
      beforeAll(() => {
        jest.resetModules();
        jest.unmock('../helpers');
      });

      beforeEach(() => {
        ({ getElementBackgroundColor } = jest.requireActual('../helpers'));
      });

      it('should return null when there is no visible content', () => {
        const { container } = createComponent(null);
        addHeightToWrapperElement(container, FOOTER_CHILD_ID);
        const elements = getFooterRefFromContainer(container).children[0];
        expect(getElementBackgroundColor(elements)).toBe(null);
      });

      it('should return "red" when there is visible content', () => {
        const { container } = createComponent();
        addHeightToWrapperElement(container, FOOTER_CHILD_ID);
        const elements = getFooterRefFromContainer(container).children[0];
        expect(getElementBackgroundColor(elements)).toBe(defaultBackgroundColor);
      });

      it('should return "yellow" for a deeply nested element with bg color', () => {
        const children = (
          <div id={FOOTER_CHILD_ID}>
            <div>
              <div style={{ backgroundColor: 'yellow' }} />
            </div>
          </div>
        );
        const { container } = createComponent(children);

        addHeightToWrapperElement(container, FOOTER_CHILD_ID);
        const elements = getFooterRefFromContainer(container).children[0];
        expect(getElementBackgroundColor(elements)).toBe('yellow');
      });
    });
  });
});
