import React from 'react';
import { shallow } from 'enzyme';
import Footer from './index';

jest.mock('./connector', () => obj => obj);
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useContext: jest.fn().mockReturnValue({ flags: {} }),
}));
const mockContext = jest.fn();
jest.mock('@shopgate/engage/cart', () => ({
  FLAG_MULTI_LINE_RESERVE: 'FLAG_MULTI_LINE_RESERVE',
  CartContext: {
    Consumer: props => props.children(mockContext),
  },
  SupplementalContent: () => null,
}));

describe('<Footer />', () => {
  it('should render as expected when all items are supposed to be shown', () => {
    const wrapper = shallow(<Footer showCouponsHint showTaxDisclaimer />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render as expected when no items are supposed to be shown', () => {
    const wrapper = shallow(<Footer showCouponsHint={false} showTaxDisclaimer={false} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render as expected when only the the coupons hint is supposed to be shown', () => {
    const wrapper = shallow(<Footer showCouponsHint showTaxDisclaimer={false} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render as expected when only the tax disclaimer is supposed to be shown', () => {
    const wrapper = shallow(<Footer showCouponsHint={false} showTaxDisclaimer />);
    expect(wrapper).toMatchSnapshot();
  });
});
