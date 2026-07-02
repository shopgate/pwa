import React from 'react';
import { render } from '@testing-library/react';
import DiscountBadge from './index';

jest.mock('@shopgate/engage/components');

describe('<DiscountBadge />', () => {
  it('should render the text', () => {
    const wrapper = render(<DiscountBadge text="foo" />);

    expect(wrapper.asFragment()).toMatchSnapshot();
  });

  it('should render the text and discount', () => {
    const wrapper = render(<DiscountBadge text="SAVE {0}%" discount={20} />);

    expect(wrapper.asFragment()).toMatchSnapshot();
  });
});
