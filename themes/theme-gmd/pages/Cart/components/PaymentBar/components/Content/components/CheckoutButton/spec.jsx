import React from 'react';
import { shallow } from 'enzyme';
import { Link } from '@shopgate/engage/components';
import CheckoutButton from './index';

jest.mock('Pages/Cart/context', () => ({
  Consumer: jest.fn(({ children }) => children({
    isLoading: false,
  })),
}));
jest.mock('./connector', () => cmp => cmp);

describe('<CheckoutButton />', () => {
  it('should render disabled button', () => {
    const wrapper = shallow(<CheckoutButton isOrderable={false} />).dive();
    const childLink = wrapper.find(Link);

    expect(wrapper).toMatchSnapshot();
    expect(childLink.props().disabled).toBe(true);
    expect(wrapper.find('Translate').props().string).toBe('cart.checkout');
  });

  it('should render enabled button', () => {
    const wrapper = shallow(<CheckoutButton isOrderable />).dive();
    const childLink = wrapper.find(Link);

    expect(wrapper).toMatchSnapshot();
    expect(childLink.props().disabled).toBe(false);
  });
});
