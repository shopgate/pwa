import range from 'lodash/range';
import React from 'react';
import { shallow, mount } from 'enzyme';
import { ITEMS_PER_LOAD } from '../../constants/DisplayOptions';
import InfiniteContainer from './index';

global.console.error = jest.fn();

const context = { state: {} };

describe('<InfiniteContainer />', () => {
  let renderedElement;
  let renderedInstance;
  let mockLoader;
  let mockIterator;
  let mockItems;

  const mockData = range(100).map(id => ({
    id,
    title: `Item ${id}`,
  }));

  /**
   * The view component
   * @param {Object} props The component props.
   */
  const renderComponent = (props) => {
    renderedElement = shallow(<InfiniteContainer {...props} />, { context });
    renderedInstance = renderedElement.instance();
  };

  /**
   * Mocks the mapStateToProps connector.
   * @param {number} amount The new product amount.
   */
  const receiveItemsByProp = (amount) => {
    mockItems = mockData.slice(0, amount);

    const nextProps = {
      ...renderedInstance.props,
      items: mockItems,
      totalItems: mockData.length,
    };

    renderedElement.setProps(nextProps);
  };

  beforeEach(() => {
    mockLoader = jest.fn();
    mockIterator = jest.fn(data => <li key={data.id}>{data.title}</li>);
  });

  describe('Given the component was mounted to the DOM', () => {
    beforeEach(() => {
      renderComponent({
        items: [],
        loader: mockLoader,
        iterator: mockIterator,
        totalItems: null,
      });

      renderedInstance.componentDidMount();
    });

    it('should match snapshot', () => {
      expect(renderedElement).toMatchSnapshot();
    });

    it('should call the loader function', () => {
      const [offset] = renderedInstance.state.offset;

      expect(mockLoader).toBeCalledWith(offset);
    });

    describe('Given the loader requested new items', () => {
      const mockItemsLength = 10;

      beforeEach(() => {
        receiveItemsByProp(mockItemsLength);
      });

      it('should call the iterator function according to the number of loaded items', () => {
        expect(mockIterator).toBeCalled();
        expect(mockIterator.mock.calls.length).toBe(mockItemsLength);
      });

      it('should render the loaded items', () => {
        expect(renderedElement.find('li').length).toBe(mockItemsLength);
      });
    });

    describe('Given the component was mounted within a scroll container', () => {
      const mockItemsLength = 11;

      beforeEach(() => {
        // Receive items from initial mounting before proceeding...
        receiveItemsByProp(mockItemsLength);

        // Reset any previous calls (e.g. from componentDidMount())
        mockLoader.mock.calls = [];
        renderedInstance.componentDidUpdate();
      });

      it('should call the loader function if scrolled to the bottom', () => {
        renderedInstance.domScrollContainer = {
          scrollTop: 900,
          scrollHeight: 1000,
          clientHeight: 100,
        };

        renderedInstance.handleLoading();
        expect(mockLoader).toBeCalled();
      });

      it('should not call the loader function if the scroll position did not change', () => {
        renderedInstance.domScrollContainer = {
          scrollTop: 0,
          scrollHeight: 1000,
          clientHeight: 100,
        };

        renderedInstance.handleLoading();
        expect(mockLoader.mock.calls.length).toBe(0);
      });
    });

    describe('Given all items have been received', () => {
      const mockItemsLength = mockData.length;

      beforeEach(() => {
        receiveItemsByProp(mockItemsLength);
      });

      it('should expect no more items to be received', () => {
        expect(renderedInstance.needsToReceiveItems()).toBe(false);
      });

      it('should keep state.awaitingItems as true if not all items are rendered', () => {
        expect(renderedInstance.allItemsAreRendered()).toBe(false);
        expect(renderedInstance.state.awaitingItems).toBe(true);
        expect(renderedElement.find('li').length).toBeLessThan(mockItemsLength);
      });

      it('should set state.awaitingItems to false if all items are rendered', () => {
        renderedElement.setState({
          offset: [0, mockItemsLength],
        });
        renderedInstance.handleLoading();

        expect(renderedInstance.allItemsAreRendered()).toBe(true);
        expect(renderedInstance.state.awaitingItems).toBe(false);
        expect(renderedElement.find('li').length).toBe(mockItemsLength);
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

        // Check if the iniLimit was used
        expect(renderedElement.find('li').length).toBe(renderedInstance.props.initialLimit);

        // Reset the limit from props.initialLimit back to props.limit
        renderedInstance.componentDidMount();
        renderedInstance.handleLoading();

        // Re-render with the new limit
        renderedElement.update();

        // Check if the correct limit was used for the second render
        const newLimit = renderedInstance.props.initialLimit + renderedInstance.props.limit;
        expect(renderedElement.find('li').length).toBe(newLimit);
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

        renderedInstance.componentDidMount();
        receiveItemsByProp(ITEMS_PER_LOAD);

        // Check if the iniLimit wasn't used
        expect(renderedElement).toMatchSnapshot();
        expect(renderedElement.find('li').length).toBe(renderedInstance.props.limit);
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

      const wrapper = mount(<InfiniteContainer {...props} />);
      const instance = wrapper.instance();
      instance.componentDidMount();
      instance.domScrollContainer = document.createElement('div');

      wrapper.setState({
        awaitingItems: false,
        offset: [10, 10],
      });

      wrapper.setProps({
        requestHash: 'price_desc',
      });

      expect(wrapper.state()).toEqual({
        offset: [0, 32],
        awaitingItems: true,
      });
    });
  });
});
