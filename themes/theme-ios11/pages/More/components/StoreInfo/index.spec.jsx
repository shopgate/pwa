import React from 'react';
import { mount } from 'enzyme';
import StoreInfo from './index';

jest.mock('@shopgate/pwa-common/helpers/config');
jest.mock('@shopgate/pwa-common-commerce/market/helpers/showReturnPolicy', () => true);
jest.mock('@shopgate/pwa-common/components/Link', () => {
  /* eslint-disable react/prop-types */
  /**
   * Mocked LinkComponent.
   * @param {Object} props Component props.
   * @return {JSX}
   */
  const Link = ({ children }) => (
    <div>
      {children}
    </div>
  );

  /* eslint-enable react/prop-types */
  return Link;
});

describe('<StoreInfo />', () => {
  it('should render as expected', () => {
    const wrapper = mount(<StoreInfo />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.children('Portal').length).toBe(3);
    expect(wrapper.find('Section').exists()).toBe(true);

    ['Shipping', 'Payment', 'Terms', 'Privacy', 'ReturnPolicy', 'Imprint'].forEach((component) => {
      const item = `Section ${component}`;
      expect(wrapper.find(item).exists()).toBe(true);
      expect(wrapper.find(`${item} Portal`).length).toBe(3);
      expect(wrapper.find(`${item} MoreMenuItem`).exists()).toBe(true);
    });
  });
});
