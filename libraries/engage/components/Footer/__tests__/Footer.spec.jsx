import React from 'react';
import { mount } from 'enzyme';
import { getAbsoluteHeight } from '@shopgate/pwa-common/helpers/dom';
import UIEvents from '@shopgate/pwa-core/emitters/ui';
import { SHEET_EVENTS } from '@shopgate/pwa-ui-shared/Sheet';
import { updateInsetBackgroundColor, updateFooterHeight } from '../Footer.style';
import Footer from '../Footer';

const mutationConstructorSpy = jest.fn();
const mutationObserveSpy = jest.fn();

/* eslint-disable require-jsdoc, extra-rules/potential-point-free, class-methods-use-this */
global.MutationObserver = class {
  constructor(callback) { mutationConstructorSpy(callback); }

  observe(element, initObject) { mutationObserveSpy(element, initObject); }
};
/* eslint-enable require-jsdoc, extra-rules/potential-point-free, class-methods-use-this */

let mockedPortalContent;

jest.mock('../Footer.style', () => {
  const actual = require.requireActual('../Footer.style');
  return {
    ...actual,
    updateInsetBackgroundColor: jest.fn(),
    updateFooterHeight: jest.fn(),
  };
});
jest.mock('@shopgate/pwa-core/emitters/ui', () => ({
  addListener: jest.fn(),
  removeListener: jest.fn(),
}));
jest.mock('@shopgate/pwa-common/helpers/dom', () => {
  const actual = require.requireActual('@shopgate/pwa-common/helpers/dom');
  return {
    ...actual,
    getAbsoluteHeight: jest.fn(),
  };
});
jest.mock('@shopgate/pwa-common/components/Portal', () => {
  // eslint-disable-next-line require-jsdoc
  function Portal() {
    return mockedPortalContent || null;
  }

  return Portal;
});

const FOOTER_CHILD_ID = 'footer-child';
const PORTAL_CONTENT_ID = 'portal-content';
const insetBackgroundUpdateSpy = jest.spyOn(Footer.prototype, 'performFooterUpdate');
const defaultBackgroundColor = 'red';
const defaultChildren = (<div
  id={FOOTER_CHILD_ID}
  style={{ backgroundColor: defaultBackgroundColor }}
/>);

/**
 * @param {NodeList} children Children for the footer.
 * @returns {JSX}
 */
const createComponent = (children = defaultChildren) => {
  const wrapper = mount((
    <div>
      <Footer>
        {children}
      </Footer>
    </div>
  ));

  return wrapper.find(Footer);
};

/**
 * @param {Object} wrapper A wrapper.
 * @param {string} id Id of the element to change.
 */
const addHeightToWrapperElement = (wrapper, id) => {
  const elements = wrapper.instance().ref.current.querySelectorAll(`#${id}`);
  if (elements) {
    Array.from(elements).forEach((element) => {
      Object.defineProperty(element, 'clientHeight', {
        get: () => 30,
      });
    });
  }
};

describe('<Footer />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedPortalContent = null;
  });

  it('should render the component', () => {
    const wrapper = createComponent();
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('Portal')).toHaveLength(2);
    expect(wrapper.find(`div#AppFooter > #${FOOTER_CHILD_ID}`)).toExist();
    expect(mutationConstructorSpy).toHaveBeenCalledWith(expect.any(Function));
    expect(insetBackgroundUpdateSpy).toHaveBeenCalledTimes(1);
  });

  describe('.hasVisibleContent()', () => {
    it('should return FALSE when footer has no visible content', () => {
      const wrapper = createComponent();
      expect(wrapper.instance().hasVisibleContent()).toBe(false);
    });

    it('should return FALSE when there are components, but they are not visible', () => {
      mockedPortalContent = <div id={PORTAL_CONTENT_ID} />;
      const wrapper = createComponent();
      expect(wrapper.instance().hasVisibleContent()).toBe(false);
    });

    it('should return FALSE when there are components, but they are supposed to be ignored', () => {
      mockedPortalContent = <div id={PORTAL_CONTENT_ID} data-footer-inset-update-ignore />;
      const wrapper = createComponent(null);
      addHeightToWrapperElement(wrapper, PORTAL_CONTENT_ID);
      expect(wrapper.instance().hasVisibleContent()).toBe(false);
    });

    it('should return TRUE when the core portal has visible content', () => {
      const wrapper = createComponent();
      addHeightToWrapperElement(wrapper, FOOTER_CHILD_ID);
      expect(wrapper.instance().hasVisibleContent()).toBe(true);
    });

    it('should return TRUE when the an extension portal has visible content', () => {
      mockedPortalContent = <div id={PORTAL_CONTENT_ID} />;
      const wrapper = createComponent(null);
      addHeightToWrapperElement(wrapper, PORTAL_CONTENT_ID);
      expect(wrapper.instance().hasVisibleContent()).toBe(true);
    });
  });

  describe('.getInsetBackgroundColor()', () => {
    it('should return null when there is no visible content', () => {
      const wrapper = createComponent(null);
      addHeightToWrapperElement(wrapper, FOOTER_CHILD_ID);
      const elements = wrapper.instance().ref.current.children;
      expect(wrapper.instance().getInsetBackgroundColor(elements)).toBe(null);
    });

    it('should return "red" when there is visible content within the core portal', () => {
      const wrapper = createComponent();
      addHeightToWrapperElement(wrapper, FOOTER_CHILD_ID);
      const elements = wrapper.instance().ref.current.children;
      expect(wrapper.instance().getInsetBackgroundColor(elements))
        .toBe(defaultBackgroundColor);
    });

    it('should return "blue" when there is visible content within the core portal', () => {
      const backgroundColor = 'blue';
      mockedPortalContent = <div id={FOOTER_CHILD_ID} style={{ backgroundColor }} />;
      const wrapper = createComponent();
      addHeightToWrapperElement(wrapper, PORTAL_CONTENT_ID);
      addHeightToWrapperElement(wrapper, FOOTER_CHILD_ID);
      const elements = wrapper.instance().ref.current.children;
      expect(wrapper.instance().getInsetBackgroundColor(elements))
        .toBe(backgroundColor);
    });

    it('should return "red" when there is visible content within the core portal', () => {
      const backgroundColor = 'blue';
      mockedPortalContent = (<div
        id={FOOTER_CHILD_ID}
        style={{ backgroundColor }}
        data-footer-inset-update-ignore
      />);

      const wrapper = createComponent();
      addHeightToWrapperElement(wrapper, PORTAL_CONTENT_ID);
      addHeightToWrapperElement(wrapper, FOOTER_CHILD_ID);
      const elements = wrapper.instance().ref.current.children;
      expect(wrapper.instance().getInsetBackgroundColor(elements))
        .toBe(defaultBackgroundColor);
    });

    it('should return null when the last visible content in invisible by the background color', () => {
      const backgroundColor = 'rgba(0, 0, 0, 0)';
      mockedPortalContent = <div id={FOOTER_CHILD_ID} style={{ backgroundColor }} />;
      const wrapper = createComponent();
      addHeightToWrapperElement(wrapper, PORTAL_CONTENT_ID);
      addHeightToWrapperElement(wrapper, FOOTER_CHILD_ID);
      const elements = wrapper.instance().ref.current.children;
      expect(wrapper.instance().getInsetBackgroundColor(elements)).toBe(null);
    });
  });

  describe('.performFooterUpdate()', () => {
    it('should do nothing when the ref is empty', () => {
      const wrapper = createComponent();
      wrapper.instance().ref.current = null;
      updateInsetBackgroundColor.mockClear();
      wrapper.instance().performFooterUpdate();
      expect(updateInsetBackgroundColor).not.toHaveBeenCalled();
    });

    it('should update the inset background color', () => {
      const wrapper = createComponent();
      updateInsetBackgroundColor.mockClear();
      const instance = wrapper.instance();
      instance.performFooterUpdate();
      const backgroundColor = instance.getInsetBackgroundColor(instance.ref.current.children);
      expect(updateInsetBackgroundColor).toHaveBeenCalledTimes(1);
      expect(updateInsetBackgroundColor).toHaveBeenCalledWith(backgroundColor);
    });
  });

  describe('MutationObserver', () => {
    let callback;
    let instance;

    beforeEach(() => {
      const wrapper = createComponent();
      instance = wrapper.instance();
      insetBackgroundUpdateSpy.mockClear();
      ([[callback]] = mutationConstructorSpy.mock.calls);
    });

    it('should observer with the correct initialization', () => {
      expect(mutationObserveSpy).toHaveBeenCalledWith(
        instance.ref.current,
        {
          attributes: true,
          childList: true,
          subtree: true,
        }
      );
    });

    it('should perform an inset update when the updated DOM element is not ignored', () => {
      const element = document.createElement('div');
      callback([{ target: element }]);
      expect(insetBackgroundUpdateSpy).toHaveBeenCalledTimes(1);
    });

    it('should not perform an inset update when the updated DOM element is ignored', () => {
      const element = document.createElement('div');
      element.setAttribute('data-footer-inset-update-ignore', 'true');
      callback([{ target: element }]);
      expect(insetBackgroundUpdateSpy).not.toHaveBeenCalled();
    });
  });

  describe('UI events subscriptions', () => {
    it('should subscribe / unsubscribe UI events', () => {
      const wrapper = mount((
        <Footer>
          <div>Footer</div>
        </Footer>
      ));
      const instance = wrapper.instance();

      expect(UIEvents.addListener).toBeCalledTimes(2);
      expect(UIEvents.addListener).nthCalledWith(1, SHEET_EVENTS.OPEN, instance.hide);
      expect(UIEvents.addListener).nthCalledWith(2, SHEET_EVENTS.CLOSE, instance.show);

      wrapper.unmount();
      expect(UIEvents.removeListener).toBeCalledTimes(2);
      expect(UIEvents.removeListener).nthCalledWith(1, SHEET_EVENTS.OPEN, instance.hide);
      expect(UIEvents.removeListener).nthCalledWith(2, SHEET_EVENTS.CLOSE, instance.show);
    });
  });

  describe('updateFooterHeight', () => {
    let instance;

    beforeEach(() => {
      const wrapper = createComponent();
      instance = wrapper.instance();
    });

    it('should set footer height to zero', () => {
      instance.hide();
      expect(updateFooterHeight).toHaveBeenCalledWith(0);
    });
    it('should set footer height', () => {
      getAbsoluteHeight.mockReturnValueOnce('48px');
      instance.show();
      expect(updateFooterHeight).toHaveBeenCalledWith('48px');
    });
  });
});
