import React from 'react';
import { fireEvent, render, screen } from '@shopgate/pwa-unit-test/rtlUtils';
import ActionButton from './index';

describe('<ActionButton />', () => {
  const renderComponent = (props = {}) => render((
    <ActionButton {...props}>
      Action Button
    </ActionButton>
  ));

  describe('Given the component was mounted to the DOM', () => {
    let renderedElement;
    let mockOnClick;

    beforeEach(() => {
      jest.useFakeTimers();
      mockOnClick = jest.fn();

      renderedElement = renderComponent({
        onClick: mockOnClick,
      });
    });

    afterEach(() => {
      jest.clearAllTimers();
      jest.useRealTimers();
    });

    it('should match snapshot', () => {
      expect(renderedElement.container.firstChild).toMatchSnapshot();
    });

    it('should not show the loading indicator by default', () => {
      const indicator = renderedElement.container.querySelector('[data-test-id="loadingIndicator"]');
      expect(indicator).toBeNull();
    });

    describe('Given the loading prop is set to true', () => {
      beforeEach(() => {
        renderedElement.rerender((
          <ActionButton onClick={mockOnClick} loading>
            Action Button
          </ActionButton>
        ));
      });

      it('should match snapshot', () => {
        expect(renderedElement.container.firstChild).toMatchSnapshot();
      });

      it('should show the loading indicator', () => {
        const indicator = renderedElement.container.querySelector('[data-test-id="loadingIndicator"]');
        expect(indicator).toBeTruthy();
      });
    });

    describe('Given the component gets clicked', () => {
      let timeoutSpy;

      beforeEach(() => {
        timeoutSpy = jest.spyOn(global, 'setTimeout');
        fireEvent.click(screen.getByRole('button'));
      });

      afterEach(() => {
        timeoutSpy.mockRestore();
      });

      it('should use setTimeout for delaying the onClick handler', () => {
        expect(timeoutSpy).toHaveBeenCalledTimes(1);
        expect(timeoutSpy.mock.calls[0][1]).toBe(ActionButton.clickDelay);
      });

      it('should eventually call the onClick handler', () => {
        jest.runOnlyPendingTimers();
        expect(mockOnClick).toHaveBeenCalledTimes(1);
      });
    });
  });
});
