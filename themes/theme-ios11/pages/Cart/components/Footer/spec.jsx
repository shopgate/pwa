import React from 'react';
import { mount } from 'enzyme';
import { TaxDisclaimer } from '@shopgate/engage/components';
import Footer from './index';
import CouponsHint from './components/CouponsHint';

// Mock the redux connect() method instead of providing a fake store.
jest.mock('./connector', () => obj => obj);

describe('<Footer />', () => {
  it('should render as expected when all items are supposed to be shown', () => {
    const wrapper = mount(<Footer showCouponsHint showTaxDisclaimer />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(CouponsHint).length).toBe(1);
    expect(wrapper.find(TaxDisclaimer).length).toBe(1);
  });

  it('should render as expected when no items are supposed to be shown', () => {
    const wrapper = mount(<Footer showCouponsHint={false} showTaxDisclaimer={false} />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(CouponsHint).length).toBe(0);
    expect(wrapper.find(TaxDisclaimer).length).toBe(0);
  });

  it('should render as expected when only the the coupons hint is supposed to be shown', () => {
    const wrapper = mount(<Footer showCouponsHint showTaxDisclaimer={false} />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(CouponsHint).length).toBe(1);
    expect(wrapper.find(TaxDisclaimer).length).toBe(0);
  });

  it('should render as expected when only the tax disclaimer is supposed to be shown', () => {
    const wrapper = mount(<Footer showCouponsHint={false} showTaxDisclaimer />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(CouponsHint).length).toBe(0);
    expect(wrapper.find(TaxDisclaimer).length).toBe(1);
  });
});
