import React from 'react';
import { shallow } from 'enzyme';
import { I18n } from '@shopgate/engage/components';

jest.mock('@shopgate/engage/components');
jest.mock('@shopgate/engage/styles', () => ({
  makeStyles: () => function mockUseStylesFactory(defs) {
    return function useStylesMock() {
      const keys = Object.keys(defs);
      const classes = keys.reduce((acc, key) => {
        acc[key] = `mock-class-${key}`;
        return acc;
      }, {});
      const cx = (...parts) => parts.filter(Boolean).join(' ');
      return {
        classes,
        cx,
      };
    };
  },
  keyframes: () => ({}),
}));

jest.mock('@shopgate/engage/core/hooks/useWidgetSettings', () => ({
  useWidgetSettings: jest.fn().mockReturnValue({
    show: null,
    hint: '*',
    text: null,
  }),
}));

describe('<TaxDisclaimer />', () => {
  afterEach(() => {
    jest.resetModules();
  });

  it('should display the component', () => {
    jest.mock('@shopgate/pwa-common-commerce/market/helpers/showTaxDisclaimer', () => true);
    const TaxDisclaimer = jest.requireActual('./index').default;
    const wrapper = shallow(<TaxDisclaimer />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(I18n.Text).exists()).toBe(true);
  });

  it('should display null', () => {
    jest.mock('@shopgate/pwa-common-commerce/market/helpers/showTaxDisclaimer', () => false);
    const TaxDisclaimer = jest.requireActual('./index').default;
    const wrapper = shallow(<TaxDisclaimer />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(I18n.Text).exists()).toBe(false);
  });
});
