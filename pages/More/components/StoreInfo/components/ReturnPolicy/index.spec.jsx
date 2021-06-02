import React from 'react';
import { shallow } from 'enzyme';

/**
 * Creates a component for testing.
 * @param {boolean} mockedShow Is the return policy supposed to be shown.
 * @returns {Object}
 */
const createComponent = (mockedShow) => {
  jest.resetModules();
  jest.mock('@shopgate/pwa-common-commerce/market/helpers/showReturnPolicy', () => mockedShow);
  const ReturnPolicy = require.requireActual('./index').default;

  return shallow(<ReturnPolicy />);
};

describe('<ReturnPolicy />', () => {
  it('should render as expected when the return policy is supposed to be shown', () => {
    const wrapper = createComponent(true);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('MoreMenuItem').exists()).toBe(true);
    expect(wrapper.find('Portal')).toHaveLength(3);
  });

  it('should render as expected when the return policy is not supposed to be shown', () => {
    const wrapper = createComponent(false);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('MoreMenuItem').exists()).toBe(false);
    expect(wrapper.find('Portal')).toHaveLength(2);
  });
});
