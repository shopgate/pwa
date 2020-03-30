/* eslint-disable extra-rules/no-single-line-objects */
import React, { useContext } from 'react';
import { shallow, mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import StoreListSearch from '../StoreListSearch';

jest.mock('@shopgate/engage/core');
jest.mock('@shopgate/engage/components');
jest.mock('@shopgate/engage/i18n/countries.hooks');
jest.mock('react', () => ({
  ...require.requireActual('react'),
  useContext: jest.fn(),
  memo: component => component,
}));
jest.mock('../../../locations.context', () => 'FulfillmentContext');
jest.mock('../StoreListSearch.connector', () => cmp => cmp);

describe('engage > locations > components > StoreListSearch', () => {
  let wrapper;
  const getProductLocations = jest.fn();
  const setCountryCode = jest.fn((countryCode) => {
    wrapper.setProps({ countryCode });
  });
  const setPostalCode = jest.fn((postalCode) => {
    wrapper.setProps({ postalCode });
  });

  const productId = 'ABC123';
  const countryCode = 'DE';
  const postalCode = 'ACME';

  const defaultProps = {
    getProductLocations,
    setCountryCode,
    setPostalCode,
    countryCode,
    postalCode: null,
  };
  const context = {
    product: { id: productId },
    locations: [{ code: 'LOCCODE' }],
    shopSettings: { supportedCountries: [countryCode, countryCode] },
  };

  beforeEach(() => {
    useContext.mockReturnValue(context);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render as expected', () => {
    wrapper = shallow((
      <StoreListSearch {...defaultProps} />
    ));
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('ProgressBar').prop('isVisible')).toEqual(false);
    expect(wrapper.find('input').prop('disabled')).toEqual(false);
  });

  it('should call getProductLocations with a postal code after filling the input and pressing enter', async () => {
    wrapper = mount((
      <StoreListSearch {...defaultProps} />
    ));

    await act(async () => {
      await wrapper.find('input').simulate('change', {
        target: {
          name: 'postalCode',
          value: postalCode,
        },
      });
      await wrapper.find('input').simulate('keyDown', { keyCode: 13 });
      await wrapper.find('input').simulate('blur');
    });

    expect(wrapper).toMatchSnapshot();
    expect(getProductLocations).toHaveBeenCalledTimes(2);
    expect(getProductLocations).toHaveBeenCalledWith(productId, null, true);
    expect(getProductLocations).toHaveBeenCalledWith(productId, {
      postalCode,
      countryCode,
    }, false);
    expect(setCountryCode).not.toHaveBeenCalled();
    expect(setPostalCode).toHaveBeenCalledWith(postalCode);
    expect(wrapper.find('input').prop('value')).toEqual(postalCode);
  });

  it('should call getProductLocations with a country code after changing country', async () => {
    wrapper = mount(<StoreListSearch {...defaultProps} postalCode={postalCode} />);

    await act(async () => {
      await wrapper.find('select').simulate('change', { target: { name: 'countryCode', value: 'AT' } });
    });

    expect(getProductLocations).toHaveBeenCalledTimes(2);
    expect(getProductLocations).toHaveBeenCalledWith(productId, { postalCode, countryCode: 'AT' }, false);
    expect(setCountryCode).toHaveBeenCalledWith('AT');
    expect(setPostalCode).not.toHaveBeenCalled();
    expect(wrapper.find('select').prop('value')).toEqual('AT');
  });

  it('should NOT call getProductLocations when the country was changed but the postal code input is empty', async () => {
    wrapper = mount(<StoreListSearch {...defaultProps} postalCode="" />);
    await act(async () => {
      await wrapper.find('select').simulate('change', { target: { name: 'countryCode', value: 'AT' } });
    });

    expect(getProductLocations).toHaveBeenCalledTimes(1);
    expect(getProductLocations).toHaveBeenCalledWith(productId, { countryCode, postalCode: '' }, true);
    expect(setCountryCode).toHaveBeenCalledWith('AT');
    expect(setPostalCode).not.toHaveBeenCalled();
  });

  it('should call getProductLocations after clicking the locate button', async () => {
    wrapper = mount((
      <StoreListSearch {...defaultProps} />
    ));

    await act(async () => {
      await wrapper.find('input').simulate('change', { target: { name: 'postalCode', value: postalCode } });
      await wrapper.find('button').simulate('click');
      await wrapper.update();
    });

    expect(getProductLocations).toHaveBeenCalledTimes(2);
    expect(getProductLocations).toHaveBeenCalledWith(productId, null, false);
    expect(wrapper.find('input').prop('value')).toEqual('');
  });
});
/* eslint-enable extra-rules/no-single-line-objects */
