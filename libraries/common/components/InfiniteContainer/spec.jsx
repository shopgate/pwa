import range from 'lodash/range';
import { render, screen, fireEvent } from '@testing-library/react';
import { RouteContext } from '../../context';
import { ITEMS_PER_LOAD } from '../../constants/DisplayOptions';
import InfiniteContainer from './index';

jest.mock('lodash/throttle', () => fn => fn);
jest.mock('@virtuous/conductor', () => ({
  router: {
    update: jest.fn(),
  },
}));

const context = {
  id: 'route-id',
  state: {},
};

describe('<InfiniteContainer />', () => {
  let renderResult;
  let currentProps;
  let scrollContainer;
  let mockLoader;
  let MockIterator;
  let mockItems;

  const mockData = range(100).map(id => ({
    id,
    title: `Item ${id}`,
  }));

  /**
   * @param {Object} props The component props.
   * @returns {JSX.Element}
   */
  const createElement = props => (
    <RouteContext.Provider value={context}>
      <InfiniteContainer {...props} />
    </RouteContext.Provider>
  );

  /**
   * The view component
   * @param {Object} props The component props.
   */
  const renderComponent = (props) => {
    currentProps = {
      containerRef: { current: scrollContainer },
      loadingIndicator: <div>Loading</div>,
      ...props,
    };
    renderResult = render(createElement(currentProps));
  };

  /**
   * Mocks the mapStateToProps connector.
   * @param {number} amount The new product amount.
   */
  const receiveItemsByProp = (amount) => {
    mockItems = mockData.slice(0, amount);

    currentProps = {
      ...currentProps,
      items: mockItems,
      totalItems: mockData.length,
    };

    renderResult.rerender(createElement(currentProps));
  };

  /**
   * Scrolls the scroll container.
   * @param {number} scrollTop The new scroll position.
   */
  const scrollTo = (scrollTop) => {
    Object.defineProperties(scrollContainer, {
      scrollTop: {
        configurable: true,
        value: scrollTop,
      },
      scrollHeight: {
        configurable: true,
        value: 1000,
      },
      clientHeight: {
        configurable: true,
        value: 100,
      },
    });

    fireEvent.scroll(scrollContainer);
  };

  beforeEach(() => {
    mockLoader = jest.fn();
    MockIterator = jest.fn(data => <li key={data.id}>{data.title}</li>);
    scrollContainer = document.createElement('div');
  });

  describe('Given the component was mounted to the DOM', () => {
    beforeEach(() => {
      renderComponent({
        items: [],
        loader: mockLoader,
        iterator: MockIterator,
        totalItems: null,
      });
    });

    it('should render an empty container with a loading indicator', () => {
      expect(renderResult.container.innerHTML)
        .toBe('<div class="common__infinite-container"><div><div></div></div><div>Loading</div></div>');
    });

    it('should call the loader function', () => {
      expect(mockLoader).toHaveBeenCalledTimes(1);
      expect(mockLoader).toBeCalledWith(0);
    });

    describe('Given the loader requested new items', () => {
      const mockItemsLength = 10;

      beforeEach(() => {
        receiveItemsByProp(mockItemsLength);
      });

      it('should render the loaded items', () => {
        expect(screen.getAllByRole('listitem')).toHaveLength(mockItemsLength);
      });
    });

    describe('Given the component was mounted within a scroll container', () => {
      const mockItemsLength = 11;

      beforeEach(() => {
        receiveItemsByProp(mockItemsLength);

        mockLoader.mockClear();
      });

      it('should call the loader function if scrolled to the bottom', () => {
        scrollTo(900);
        expect(mockLoader).toBeCalled();
      });

      it('should not call the loader function if the scroll position did not change', () => {
        scrollTo(0);
        expect(mockLoader.mock.calls.length).toBe(0);
      });
    });

    describe('Given all items have been received', () => {
      const mockItemsLength = mockData.length;

      beforeEach(() => {
        receiveItemsByProp(mockItemsLength);
      });

      it('should expect no more items to be received', () => {
        mockLoader.mockClear();
        scrollTo(900);
        expect(mockLoader).not.toHaveBeenCalled();
      });

      it('should keep showing the loading indicator if not all items are rendered', () => {
        expect(screen.getByText('Loading')).toBeInTheDocument();
        expect(screen.getAllByRole('listitem').length).toBeLessThan(mockItemsLength);
      });

      it('should remove the loading indicator if all items are rendered', () => {
        scrollTo(900);
        scrollTo(900);
        expect(screen.getAllByRole('listitem').length).toBe(mockItemsLength);
        expect(screen.getByText('Loading')).toBeInTheDocument();

        scrollTo(900);

        expect(screen.queryByText('Loading')).not.toBeInTheDocument();
        expect(screen.getAllByRole('listitem').length).toBe(mockItemsLength);
      });
    });
  });

  describe('Given that the initialLimit is used in the correct ways', () => {
    const { initialLimit, limit } = InfiniteContainer.defaultProps;

    describe('Given that the initialLimit is used', () => {
      it('should render with the initialLimit', () => {
        renderComponent({
          items: mockData,
          loader: mockLoader,
          iterator: MockIterator,
          totalItems: mockData.length,
        });

        expect(screen.getAllByRole('listitem').length).toBe(initialLimit);

        scrollTo(900);

        expect(screen.getAllByRole('listitem').length).toBe(initialLimit + limit);
      });
    });

    describe('Given that the initialLimit is NOT used', () => {
      it('should render without the initialLimit', () => {
        renderComponent({
          items: [],
          loader: mockLoader,
          iterator: MockIterator,
          totalItems: null,
        });

        receiveItemsByProp(ITEMS_PER_LOAD);

        const items = screen.getAllByRole('listitem');

        expect(items.length).toBe(limit);
        expect(items.map(item => item.textContent))
          .toEqual(mockData.slice(0, ITEMS_PER_LOAD).map(({ title }) => title));
        expect(MockIterator.mock.calls[0][0]).toEqual({
          ...mockData[0],
          columns: 2,
        });
        expect(renderResult.container.firstChild).toHaveClass('common__infinite-container');
      });
    });
  });

  describe('Given that the requestHash changes', () => {
    it('should reset the component', () => {
      renderComponent({
        items: mockData,
        loader: mockLoader,
        iterator: MockIterator,
        totalItems: mockData.length,
        requestHash: 'default',
      });

      range(5).forEach(() => scrollTo(900));

      expect(screen.getAllByRole('listitem')).toHaveLength(mockData.length);
      expect(screen.queryByText('Loading')).not.toBeInTheDocument();

      renderResult.rerender(createElement({
        ...currentProps,
        requestHash: 'price_desc',
      }));

      expect(screen.getAllByRole('listitem')).toHaveLength(ITEMS_PER_LOAD);
      expect(screen.getByText('Loading')).toBeInTheDocument();
    });
  });
});
