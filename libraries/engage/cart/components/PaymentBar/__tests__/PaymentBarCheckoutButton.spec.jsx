import React from 'react';
import { shallow } from 'enzyme';
import Link from '@shopgate/pwa-common/components/Link';
import PaymentBarCheckoutButton from '../PaymentBarCheckoutButton';

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useContext: () => ({
    isLoading: false,
  }),
}));
jest.mock('../PaymentBarCheckoutButton.connector', () => cmp => cmp);

describe('<PaymentBarCheckoutButton />', () => {
  it('should render disabled button', () => {
    const wrapper = shallow(<PaymentBarCheckoutButton isOrderable={false} />).dive();
    const childLink = wrapper.find(Link);

    expect(wrapper).toMatchSnapshot();
    expect(childLink.props().disabled).toBe(true);
    expect(wrapper.find('Translate').props().string).toBe('cart.checkout');
  });

  it('should render enabled button', () => {
    const wrapper = shallow(<PaymentBarCheckoutButton isOrderable />).dive();
    const childLink = wrapper.find(Link);

    expect(wrapper).toMatchSnapshot();
    expect(childLink.props().disabled).toBe(false);
  });
});
