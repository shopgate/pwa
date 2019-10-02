import React from 'react';
import { mount } from 'enzyme';
import Picker from './index';
import PickerList from './components/List';

jest.mock('react-portal', () => (
  ({ isOpened, children }) => (isOpened ? children : null)
));

describe('<Picker />', () => {
  let renderedElement;
  let renderedInstance;
  const mockItems = [
    'String only',
    { value: 'Value only' },
    {
      value: 'value',
      label: 'Value and label',
    },
  ];
  const mockOnChange = jest.fn();
  const mockOnSelect = jest.fn();

  /**
   * The view component
   * @param {Object} props The component props.
   */
  const renderComponent = (props) => {
    renderedElement = mount(<Picker {...props} />);
    renderedInstance = renderedElement.find('Picker').instance();
  };

  beforeEach(() => {
    renderComponent({
      items: mockItems,
      onChange: mockOnChange,
      onSelect: mockOnSelect,
    });

    renderedElement.update();
  });

  describe('Given the component was mounted to the DOM', () => {
    it('should match snapshot', () => {
      expect(renderedElement).toMatchSnapshot();
    });

    it('should have no selected value', () => {
      expect(renderedInstance.selectedItem).toBe(null);
    });

    describe('Given picker component gets opened', () => {
      beforeEach(() => {
        renderedInstance.toggleOpenState(true);
        renderedElement.update();
      });

      it('should have isOpen state', () => {
        expect(renderedInstance.state.isOpen).toBe(true);
      });

      it('should render the picker list', () => {
        expect(renderedElement.find(PickerList).length).toBe(1);
      });

      it('should render the picker items', () => {
        expect(renderedElement.find('li button').length).toBe(mockItems.length);
      });

      describe('Given a item gets selected', () => {
        jest.useFakeTimers();

        beforeEach(() => {
          jest.clearAllMocks();
          renderedElement.find('li button').first().simulate('click');
          jest.runAllTimers();
        });

        afterEach(() => {
          jest.clearAllTimers();
        });

        it('should trigger onChange when the value changed', () => {
          expect(mockOnChange).toHaveBeenCalledTimes(1);
        });

        it('should trigger onSelect when the value changed', () => {
          expect(mockOnSelect).toHaveBeenCalledTimes(1);
        });

        it('should not trigger onChange when the value did not change, but trigger onSelect', () => {
          renderedInstance.setState({ selectedIndex: 0 });
          renderedInstance.toggleOpenState(true);
          renderedElement.find('li button').first().simulate('click');
          jest.runAllTimers();
          expect(mockOnChange).toHaveBeenCalledTimes(1);
          expect(mockOnSelect).toHaveBeenCalledTimes(2);
        });
      });
    });
  });
});
