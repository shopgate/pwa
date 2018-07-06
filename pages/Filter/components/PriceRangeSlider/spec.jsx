import React from 'react';
import { mount } from 'enzyme';
import I18n from '@shopgate/pwa-common/components/I18n';
import PriceRangeSlider from './index';

jest.mock('@shopgate/pwa-common/helpers/config', () => ({
  get currency() { return 'USD'; },
}));

describe('<PriceRangeSlider />', () => {
  const testLocales = {
    'price.range': 'From {fromPrice} to {toPrice}',
  };

  const langCode = 'en-US';

  /**
   * Renders the component.
   * @param {Object} props The component props.
   * @return {Object} The mounted component.
   */
  const renderComponent = (props = {}) => mount((
    <I18n.Provider lang={langCode} locales={testLocales}>
      <PriceRangeSlider {...props} />
    </I18n.Provider>));

  it('should render a range slider and two prices with default values', () => {
    const wrapper = renderComponent();

    expect(wrapper.find('RangeSlider').length).toBe(1);
    expect(wrapper.find('RangeSlider').prop('min')).toBe(0);
    expect(wrapper.find('RangeSlider').prop('max')).toBe(100);
    expect(wrapper.find('RangeSlider').prop('value')).toEqual([0, 100]);

    expect(wrapper.find('Placeholder').length).toBe(2);

    let index = 0;
    wrapper.find('FormatPrice').forEach((node) => {
      expect(node.prop('price')).toBe(index === 0 ? 0 : 1);
      index += 1;
    });
  });

  it('should render a range slider and two prices with custom values', () => {
    const min = 1;
    const max = 1000;

    const wrapper = renderComponent({
      min,
      max,
    });

    expect(wrapper.find('RangeSlider').prop('min')).toBe(1);
    expect(wrapper.find('RangeSlider').prop('max')).toBe(1000);
    expect(wrapper.find('RangeSlider').prop('value')).toEqual([1, 1000]);

    let index = 0;
    wrapper.find('FormatPrice').forEach((node) => {
      expect(node.prop('price')).toBe(index === 0 ? Math.floor(min / 100) : Math.ceil(max / 100));
      index += 1;
    });
  });
});
