/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { mount } from 'enzyme';
import Picker from './index';
import PickerList from './components/List';

jest.mock('react-portal', () => (
  ({ isOpened, children }) => (
    isOpened ? children : null
  )
));

// Mock the redux connect() method instead of providing a fake store.
jest.mock('../Router/components/RouteGuard/connector', () => obj => obj);

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

  /**
   * The view component
   * @param {Object} props The component props.
   */
  const renderComponent = (props) => {
    renderedElement = mount(
      <Picker {...props} />
    );
    renderedInstance = renderedElement.instance();
  };

  beforeEach(() => {
    renderComponent({
      items: mockItems,
      onChange: mockOnChange,
    });
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
          mockOnChange.mock.calls = [];
          renderedElement.find('li button').first().simulate('click');
          jest.runAllTimers();
        });

        afterEach(() => {
          jest.clearAllTimers();
        });

        it('should trigger onChange when the value changed', () => {
          expect(mockOnChange).toBeCalled();
        });

        it('should not trigger onChange when the value did not change', () => {
          renderedInstance.setState({ selectedIndex: 0 });
          renderedInstance.toggleOpenState(true);
          renderedElement.find('li button').first().simulate('touchStart');
          jest.runAllTimers();
          expect(mockOnChange.mock.calls.length).toBe(1);
        });
      });
    });
  });
});
