import React from 'react';
import { shallow } from 'enzyme';
import { CART_MAX_ITEMS } from 'Pages/Cart/constants';
import CartButtonBadge from './index';

jest.mock('@shopgate/engage/core', () => ({
  useWidgetSettings: jest.fn().mockReturnValue({}),
}));

describe('<CartButtonBadge />', () => {
  it('should be null render', () => {
    const wrapper = shallow(<CartButtonBadge count={0} />);
    expect(wrapper).toBeEmptyRender();
  });

  it('should render with number', () => {
    const wrapper = shallow(<CartButtonBadge count={1} />);
    expect(wrapper.find('div').text()).toEqual('1');
  });

  it('should render with max plus count', () => {
    const wrapper = shallow(<CartButtonBadge count={CART_MAX_ITEMS + 1} />);
    expect(wrapper.find('div').text()).toEqual(`${CART_MAX_ITEMS}+`);
  });
});
