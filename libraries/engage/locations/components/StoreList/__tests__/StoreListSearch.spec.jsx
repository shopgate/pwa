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
}));
jest.mock('../../../locations.context', () => 'FulfillmentContext');
jest.mock('../StoreListSearch.connector', () => cmp => cmp);

describe('engage > locations > components > StoreListSearch', () => {
  const getProductLocations = jest.fn();
  const storeSearch = jest.fn();

  const productId = 'ABC123';
  const countryCode = 'DE';
  const postalCode = 'ACME';

  const defaultProps = {
    getProductLocations,
    storeSearch,
    search: {
      countryCode,
    },
  };
  const context = {
    product: { id: productId },
    locations: [{ code: 'LOCCODE' }],
    shopSettings: { supportedCountries: [countryCode] },
  };

  beforeEach(() => {
    useContext.mockReturnValue(context);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render as expected', () => {
    const wrapper = shallow((
      <StoreListSearch {...defaultProps} />
    ));
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('ProgressBar').prop('isVisible')).toEqual(false);
    expect(wrapper.find('input').prop('disabled')).toEqual(false);
  });

  it('should call getProductLocations with a postal code after filling the input and pressing enter', async () => {
    const wrapper = mount((
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
    });

    expect(wrapper).toMatchSnapshot();
    expect(getProductLocations).toHaveBeenCalledTimes(1);
    expect(getProductLocations).toHaveBeenCalledWith(productId, {
      postalCode,
      countryCode,
    });
    expect(wrapper.find('input').prop('value')).toEqual(postalCode);
  });

  it('should call getProductLocations with a country code after changing country', async () => {
    const wrapper = mount(<StoreListSearch {...defaultProps} />);

    await act(async () => {
      await wrapper.find('input').simulate('change', { target: { name: 'postalCode', value: postalCode } });
      await wrapper.find('select').simulate('change', { target: { name: 'countryCode', value: 'AT' } });
    });

    expect(getProductLocations).toHaveBeenCalledWith(productId, { postalCode, countryCode: 'AT' });
    expect(wrapper.find('select').prop('value')).toEqual('AT');
  });

  it('should call getProductLocations after clicking the locate button', async () => {
    const wrapper = mount((
      <StoreListSearch {...defaultProps} />
    ));

    await act(async () => {
      await wrapper.find('input').simulate('change', { target: { name: 'postalCode', value: postalCode } });
      await wrapper.find('button').simulate('click');
      await wrapper.update();
    });

    expect(getProductLocations).toHaveBeenCalledTimes(1);
    expect(getProductLocations).toHaveBeenCalledWith(productId, null);
    expect(wrapper.find('input').prop('value')).toEqual('');
  });
});
/* eslint-enable extra-rules/no-single-line-objects */
