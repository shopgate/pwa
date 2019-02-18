import React from 'react';
import { shallow } from 'enzyme';
import { OptionInfo } from './index';

describe('<OptionInfo />', () => {
  const emptyPrice = {
    price: 0,
    currency: 'EUR',
  };
  const notEmptyPrice = {
    price: 10,
    currency: 'EUR',
  };

  it('should not render when not required and no price', () => {
    const wrapper = shallow((
      <OptionInfo required={false} label="" price={emptyPrice} />
    ));
    expect(wrapper.type()).toBeNull();
  });
  it('should render required element', () => {
    const wrapper = shallow((
      <OptionInfo required label="" price={emptyPrice} />
    ));
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('Translate').prop('string')).toEqual('common.required');
    expect(wrapper.find('FormatPrice')).toHaveLength(0);
  });
  it('should render price element', () => {
    const wrapper = shallow((
      <OptionInfo required={false} label="Label" price={notEmptyPrice} />
    ));
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('Translate')).toHaveLength(0);

    const price = wrapper.find('FormatPrice');
    expect(price.prop('price')).toEqual(notEmptyPrice.price);
    expect(price.prop('currency')).toEqual('EUR');
  });
  it('should render full info with required and price element', () => {
    const wrapper = shallow((
      <OptionInfo required label="Label" price={notEmptyPrice} />
    ));
    expect(wrapper).toMatchSnapshot();
  });
});
