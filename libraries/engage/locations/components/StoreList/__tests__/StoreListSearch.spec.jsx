import React, { useContext } from 'react';
import { shallow, mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import StoreListSearch from '../StoreListSearch';

jest.mock('@shopgate/engage/components', () => ({
  LocatorIcon: () => '',
  MagnifierIcon: () => '',
  ProgressBar: () => '',
}));

jest.mock('react', () => ({
  ...require.requireActual('react'),
  useContext: jest.fn(),
}));
jest.mock('../StoreListSearch.connector', () => cmp => cmp);

describe('<StoreListSearch />', () => {
  const getProductLocations = jest.fn();
  const storeSearchQuery = jest.fn();

  const productId = 'ABC123';
  const postalCode = 'ACME';
  const defaultProps = {
    getProductLocations,
    storeSearchQuery,
    searchQuery: '',
  };
  const context = {
    product: { id: productId },
    locations: [{ code: 'LOCCODE' }],
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
      await wrapper.find('input').simulate('change', { target: { value: postalCode } });
      await wrapper.find('input').simulate('keyDown', { keyCode: 13 });
    });

    expect(wrapper).toMatchSnapshot();
    expect(getProductLocations).toHaveBeenCalledTimes(1);
    expect(getProductLocations).toHaveBeenCalledWith(productId, postalCode);
    expect(wrapper.find('input').prop('value')).toEqual(postalCode);
  });

  it('should call getProductLocations after clicking the locate button', async () => {
    const wrapper = mount((
      <StoreListSearch {...defaultProps} />
    ));

    await act(async () => {
      await wrapper.find('input').simulate('change', { target: { value: postalCode } });
      await wrapper.find('button').simulate('click');
      await wrapper.update();
    });

    expect(wrapper).toMatchSnapshot();
    expect(getProductLocations).toHaveBeenCalledTimes(1);
    expect(getProductLocations).toHaveBeenCalledWith(productId, null);
    expect(wrapper.find('input').prop('value')).toEqual('');
  });
});
