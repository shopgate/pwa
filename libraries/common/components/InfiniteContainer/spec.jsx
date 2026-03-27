import range from 'lodash/range';
import React from 'react';
import { mount } from 'enzyme';
import { ITEMS_PER_LOAD } from '../../constants/DisplayOptions';
import { RouteContext } from '../../context';
import InfiniteContainer from './index';

jest.mock('@virtuous/conductor', () => ({
  router: {
    update: jest.fn(),
  },
}));

global.console.error = jest.fn();

const routeContextValue = {
  id: 'test-route',
  state: {},
};

/**
 * Host so enzyme root setProps forwards to InfiniteContainer (not the Provider).
 * @param {Object} props Props for InfiniteContainer.
 * @returns {JSX.Element}
 */
const InfiniteContainerWithRoute = props => (
  <RouteContext.Provider value={routeContextValue}>
    <InfiniteContainer {...props} />
  </RouteContext.Provider>
);

/**
 * @param {Object} props Props for InfiniteContainerWithRoute.
 * @returns {Object} Enzyme mount wrapper.
 */
const mountWithRoute = props => mount(<InfiniteContainerWithRoute {...props} />);

describe('<InfiniteContainer />', () => {
  let wrapper;
  let mockLoader;
  let mockIterator;
  let mockItems;
  let scrollEl;

  const mockData = range(100).map(id => ({
    id,
    title: `Item ${id}`,
  }));

  /**
   * @param {Object} props InfiniteContainer props (without containerRef).
   * @returns {void}
   */
  const renderComponent = (props) => {
    scrollEl = document.createElement('div');
    Object.defineProperty(scrollEl, 'scrollHeight', {
      configurable: true,
      value: 1000,
    });
    Object.defineProperty(scrollEl, 'clientHeight', {
      configurable: true,
      value: 100,
    });
    Object.defineProperty(scrollEl, 'scrollTop', {
      configurable: true,
      value: 0,
      writable: true,
    });
    const containerRef = {
      current: scrollEl,
    };
    wrapper = mountWithRoute({
      ...props,
      containerRef,
    });
  };

  /**
   * @param {number} amount Number of mock items to pass in.
   * @returns {void}
   */
  const receiveItemsByProp = (amount) => {
    mockItems = mockData.slice(0, amount);
    wrapper.setProps({
      items: mockItems,
      totalItems: mockData.length,
    });
  };

  beforeEach(() => {
    mockLoader = jest.fn();
    mockIterator = jest.fn(data => <li key={data.id}>{data.title}</li>);
  });

  afterEach(() => {
    if (wrapper && wrapper.length) {
      wrapper.unmount();
    }
  });

  describe('Given the component was mounted to the DOM', () => {
    beforeEach(() => {
      renderComponent({
        items: [],
        loader: mockLoader,
        iterator: mockIterator,
        totalItems: null,
      });
    });

    it('should match snapshot', () => {
      expect(wrapper.find('.common__infinite-container').first()).toMatchSnapshot();
    });

    it('should call the loader function', () => {
      expect(mockLoader).toHaveBeenCalledWith(0);
    });

    describe('Given the loader requested new items', () => {
      const mockItemsLength = 10;

      beforeEach(() => {
        receiveItemsByProp(mockItemsLength);
      });

      it('should call the iterator function according to the number of loaded items', () => {
        expect(mockIterator).toHaveBeenCalled();
        const ids = new Set(mockIterator.mock.calls.map(([row]) => row.id));
        expect(ids.size).toBe(mockItemsLength);
      });

      it('should render the loaded items', () => {
        expect(wrapper.find('li').length).toBe(mockItemsLength);
      });
    });

    describe('Given the component was mounted within a scroll container', () => {
      const mockItemsLength = 11;

      beforeEach(() => {
        receiveItemsByProp(mockItemsLength);
        mockLoader.mockClear();
      });

      it('should call the loader function if scrolled to the bottom', () => {
        scrollEl.scrollTop = 900;
        scrollEl.dispatchEvent(new Event('scroll'));
        expect(mockLoader).toHaveBeenCalled();
      });

      it('should not call the loader function if the scroll position did not change', () => {
        scrollEl.scrollTop = 0;
        scrollEl.dispatchEvent(new Event('scroll'));
        expect(mockLoader).not.toHaveBeenCalled();
      });
    });

    describe('Given all items have been received', () => {
      const mockItemsLength = mockData.length;

      beforeEach(() => {
        receiveItemsByProp(mockItemsLength);
      });

      it('should expect no more items to be received', () => {
        const inner = wrapper.find(InfiniteContainer);
        const { totalItems, items } = inner.props();
        const needsMore = totalItems === null || items.length < totalItems;
        expect(needsMore).toBe(false);
      });

      it('should keep awaitingItems behavior if not all items are rendered', () => {
        expect(wrapper.find('li').length).toBeLessThan(mockItemsLength);
      });

      it('should show all items after loading through offset when scrolled', async () => {
        /**
         * @param {number} ms Milliseconds to wait.
         * @returns {Promise<void>}
         */
        const delay = ms => new Promise((resolve) => {
          setTimeout(resolve, ms);
        });
        /**
         * Scroll repeatedly (throttle is 10ms) until all items render or max steps.
         * @param {number} stepsLeft Max scroll attempts remaining.
         * @returns {Promise<void>}
         */
        const scrollUntilComplete = async (stepsLeft) => {
          if (stepsLeft <= 0 || wrapper.find('li').length >= mockItemsLength) {
            return Promise.resolve();
          }
          scrollEl.scrollTop = 900;
          scrollEl.dispatchEvent(new Event('scroll'));
          await delay(15);
          wrapper.update();
          return scrollUntilComplete(stepsLeft - 1);
        };
        await scrollUntilComplete(80);
        expect(wrapper.find('li').length).toBe(mockItemsLength);
      });
    });
  });

  describe('Given that the initialLimit is used in the correct ways', () => {
    describe('Given that the initialLimit is used', () => {
      it('should render with the initialLimit', () => {
        renderComponent({
          items: mockData,
          loader: mockLoader,
          iterator: mockIterator,
          totalItems: mockData.length,
        });

        expect(wrapper.find('li').length).toBe(
          wrapper.find(InfiniteContainer).prop('initialLimit')
        );

        scrollEl.scrollTop = 900;
        scrollEl.dispatchEvent(new Event('scroll'));
        wrapper.update();

        const initialLimit = wrapper.find(InfiniteContainer).prop('initialLimit');
        const limit = wrapper.find(InfiniteContainer).prop('limit');
        expect(wrapper.find('li').length).toBe(initialLimit + limit);
      });
    });

    describe('Given that the initialLimit is NOT used', () => {
      it('should render without the initialLimit', () => {
        renderComponent({
          items: [],
          loader: mockLoader,
          iterator: mockIterator,
          totalItems: null,
        });

        receiveItemsByProp(ITEMS_PER_LOAD);

        expect(wrapper.find('.common__infinite-container').first()).toMatchSnapshot();
        expect(wrapper.find('li').length).toBe(
          wrapper.find(InfiniteContainer).prop('limit')
        );
      });
    });
  });

  describe('Given that the requestHash changes', () => {
    it('should reset the component', () => {
      const props = {
        items: mockData,
        loader: mockLoader,
        iterator: mockIterator,
        totalItems: mockData.length,
        requestHash: 'default',
      };

      const containerRef = {
        current: document.createElement('div'),
      };
      const mounted = mountWithRoute({
        ...props,
        containerRef,
      });

      expect(mounted.find('li').length).toBe(
        mounted.find(InfiniteContainer).prop('initialLimit')
      );

      mounted.setProps({ requestHash: 'price_desc' });
      mounted.update();

      expect(mounted.find('li').length).toBe(ITEMS_PER_LOAD);

      mounted.unmount();
    });
  });
});
