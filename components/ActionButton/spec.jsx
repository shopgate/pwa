/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { shallow } from 'enzyme';
import IndicatorCircle from 'Components/IndicatorCircle';
import RippleButton from 'Components/RippleButton';
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
      beforeEach(() => {
        renderedElement.find(RippleButton).simulate('click');
      });

      it('should use setTimeout for delaying the onClick handler', () => {
        expect(setTimeout.mock.calls.length).toBe(1);
        expect(setTimeout.mock.calls[0][1]).toBe(ActionButton.clickDelay);
      });

      it('should eventually call the onClick handler', () => {
        jest.runOnlyPendingTimers();

        expect(mockOnClick).toBeCalled();
        expect(mockOnClick.mock.calls.length).toBe(1);
      });
    });
  });
});
