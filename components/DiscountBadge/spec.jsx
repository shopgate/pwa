import React from 'react';
import { shallow } from 'enzyme';
import DiscountBadge from './index';

describe('<DiscountBadge />', () => {
  it('should render the text', () => {
    const wrapper = shallow(<DiscountBadge text="foo" />);

    expect(wrapper).toMatchSnapshot();
  });

  it('should render the text and discount', () => {
    const wrapper = shallow(<DiscountBadge text="SAVE {0}%" discount={20} />);

    expect(wrapper).toMatchSnapshot();
  });
});
