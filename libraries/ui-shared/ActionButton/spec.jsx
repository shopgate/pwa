import React from 'react';
import { shallow } from 'enzyme';
import IndicatorCircle from '../IndicatorCircle';
import RippleButton from '../RippleButton';
import ActionButton from './index';

describe('<ActionButton />', () => {
  let renderedElement;
  let mockOnClick;

  jest.useFakeTimers();

  /**
   * Renders the component.
   * @param {Object} props The component props.
   */
  const renderComponent = (props = {}) => {
    renderedElement = shallow((
      <ActionButton {...props}>
        Action Button
      </ActionButton>
    ));
  };

  describe('Given the component was mounted to the DOM', () => {
    beforeEach(() => {
      mockOnClick = jest.fn();

      renderComponent({
        onClick: mockOnClick,
      });
    });

    it('should match snapshot', () => {
      expect(renderedElement).toMatchSnapshot();
    });

    it('should not show the loading indicator by default', () => {
      const indicator = renderedElement.find(IndicatorCircle);
      expect(indicator.length).toBe(0);
    });

    describe('Given the loading prop is set to true', () => {
      beforeEach(() => {
        renderedElement.setProps({ loading: true });
      });

      it('should match snapshot', () => {
        expect(renderedElement).toMatchSnapshot();
      });

      it('should show the loading indicator', () => {
        const indicator = renderedElement.find(IndicatorCircle);
        expect(indicator.length).toBe(1);
      });
    });

    describe('Given the component gets clicked', () => {
      let timeoutSpy;

      beforeEach(() => {
        timeoutSpy = jest.spyOn(global, 'setTimeout');
        renderedElement.find(RippleButton).simulate('click');
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
