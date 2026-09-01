import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import Picker from './index';

jest.mock('@shopgate/engage/components');

describe('<Picker />', () => {
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

  const renderComponent = props => render(<Picker {...props} />);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Given the component was mounted to the DOM', () => {
    it('should match snapshot', () => {
      const renderedElement = renderComponent({
        items: mockItems,
        onChange: mockOnChange,
        onSelect: mockOnSelect,
      });

      expect(renderedElement.container.firstChild).toMatchSnapshot();
    });

    it('should have no selected value', () => {
      renderComponent({
        items: mockItems,
        onChange: mockOnChange,
        onSelect: mockOnSelect,
      });

      expect(screen.queryByText('String only')).toBeNull();
      expect(screen.getByText('Pick ...')).toBeTruthy();
    });

    describe('Given picker component gets opened', () => {
      const openPicker = () => {
        const renderedElement = renderComponent({
          items: mockItems,
          onChange: mockOnChange,
          onSelect: mockOnSelect,
        });

        fireEvent.click(renderedElement.container.querySelector('button.engage__picker__button'));

        return renderedElement;
      };

      it('should have isOpen state', () => {
        openPicker();

        expect(document.querySelector('.engage__picker_modal')).toBeTruthy();
      });

      it('should render the picker list', () => {
        openPicker();

        expect(document.querySelector('ul.engage__picker_list')).toBeTruthy();
      });

      it('should render the picker items', () => {
        const renderedElement = openPicker();

        expect(renderedElement.container.querySelectorAll('li button').length).toBe(mockItems.length);
      });

      describe('Given a item gets selected', () => {
        jest.useFakeTimers();

        afterEach(() => {
          jest.clearAllTimers();
        });

        it('should trigger onChange when the value changed', () => {
          const renderedElement = openPicker();

          fireEvent.click(renderedElement.container.querySelectorAll('li button')[0]);
          jest.runAllTimers();

          expect(mockOnChange).toHaveBeenCalledTimes(1);
        });

        it('should trigger onSelect when the value changed', () => {
          const renderedElement = openPicker();

          fireEvent.click(renderedElement.container.querySelectorAll('li button')[0]);
          jest.runAllTimers();

          expect(mockOnSelect).toHaveBeenCalledTimes(1);
        });

        it('should not trigger onChange when the value did not change, but trigger onSelect', () => {
          const renderedElement = renderComponent({
            items: mockItems,
            value: 'String only',
            onChange: mockOnChange,
            onSelect: mockOnSelect,
          });

          fireEvent.click(renderedElement.container.querySelector('button.engage__picker__button'));
          fireEvent.click(renderedElement.container.querySelectorAll('li button')[0]);
          jest.runAllTimers();

          expect(mockOnChange).toHaveBeenCalledTimes(0);
          expect(mockOnSelect).toHaveBeenCalledTimes(1);
        });
      });
    });
  });
});
