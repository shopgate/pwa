import React from 'react';
import { render } from '@shopgate/pwa-unit-test/rtlUtils';
import {
  AVAILABILITY_STATE_OK,
  AVAILABILITY_STATE_WARNING,
  AVAILABILITY_STATE_ALERT,
} from '@shopgate/pwa-common-commerce/product/constants';
import Availability from './index';

describe('<Availability />', () => {
  it('should not render when text is empty', () => {
    const wrapper = render(<Availability text="" />);

    expect(wrapper.asFragment()).toMatchSnapshot();
  });

  it('should not render by default if state is "ok"', () => {
    const wrapper = render(<Availability state={AVAILABILITY_STATE_OK} text="Available" />);

    expect(wrapper.asFragment()).toMatchSnapshot();
  });

  it('should render if state is "ok" when "showWhenAvailable" is set', () => {
    const wrapper = render(<Availability state={AVAILABILITY_STATE_OK} text="Available" showWhenAvailable />);

    expect(wrapper.asFragment()).toMatchSnapshot();
  });

  it('should render if state is "warning"', () => {
    const wrapper = render(<Availability state={AVAILABILITY_STATE_WARNING} text="Only 5 left" />);

    expect(wrapper.asFragment()).toMatchSnapshot();
  });

  it('should render if state is "warning"', () => {
    const wrapper = render(<Availability state={AVAILABILITY_STATE_ALERT} text="Out of stock" />);

    expect(wrapper.asFragment()).toMatchSnapshot();
  });
});
