import React from 'react';
import { shallow } from 'enzyme';
import Footer from './index';

jest.mock('./connector', () => obj => obj);
jest.mock('../../context', () => ({
  Consumer: ({ children }) => children({
    flags: {},
  }),
}));

describe('<Footer />', () => {
  it('should render as expected when all items are supposed to be shown', () => {
    const wrapper = shallow(<Footer showCouponsHint showTaxDisclaimer />).dive();
    expect(wrapper).toMatchSnapshot();
  });

  it('should render as expected when no items are supposed to be shown', () => {
    const wrapper = shallow(<Footer showCouponsHint={false} showTaxDisclaimer={false} />).dive();
    expect(wrapper).toMatchSnapshot();
  });

  it('should render as expected when only the the coupons hint is supposed to be shown', () => {
    const wrapper = shallow(<Footer showCouponsHint showTaxDisclaimer={false} />).dive();
    expect(wrapper).toMatchSnapshot();
  });

  it('should render as expected when only the tax disclaimer is supposed to be shown', () => {
    const wrapper = shallow(<Footer showCouponsHint={false} showTaxDisclaimer />).dive();
    expect(wrapper).toMatchSnapshot();
  });
});
