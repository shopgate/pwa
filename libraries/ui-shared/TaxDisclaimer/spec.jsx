import React from 'react';
import { shallow } from 'enzyme';
import { I18n } from '@shopgate/engage/components';

jest.mock('@shopgate/engage/components');
jest.mock('@shopgate/engage/styles', () => ({
  makeStyles: () => function mockUseStylesFactory() {
    return function useStylesMock() {
      return {
        classes: {
          text: 'mock-class-text',
        },
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
