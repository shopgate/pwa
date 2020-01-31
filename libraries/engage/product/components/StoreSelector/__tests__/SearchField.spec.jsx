import React from 'react';
import { shallow, mount } from 'enzyme';
import { SearchFieldUnwrapped as SearchField } from '../SearchField';

jest.mock('@shopgate/engage/components', () => ({
  LocatorIcon: () => '',
  MagnifierIcon: () => '',
  ProgressBar: () => '',
}));

describe('<SearchField />', () => {
  const getLocationsByGeolocation = jest.fn();
  const getLocationsByPostalCode = jest.fn();

  const productId = 'ABC123';
  const defaultProps = {
    productId,
    getLocationsByGeolocation,
    getLocationsByPostalCode,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render as expected', () => {
    const wrapper = shallow((
      <SearchField {...defaultProps} />
    ));
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('ProgressBar').prop('isVisible')).toEqual(false);
    expect(wrapper.find('input').prop('disabled')).toEqual(false);
  });

  it.only('should react on updates of the loading prop', () => {
    const wrapper = shallow((
      <SearchField {...defaultProps} />
    ));

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('ProgressBar').prop('isVisible')).toEqual(false);
    expect(wrapper.find('input').prop('disabled')).toEqual(false);

    wrapper.setProps({ loading: true });
    expect(wrapper.find('ProgressBar').prop('isVisible')).toEqual(true);
    expect(wrapper.find('input').prop('disabled')).toEqual(true);

    wrapper.setProps({ loading: false });
    expect(wrapper.find('ProgressBar').prop('isVisible')).toEqual(false);
    expect(wrapper.find('input').prop('disabled')).toEqual(false);
  });

  it('should call getLocationsByPostalCode after filling the input and pressing enter', () => {
    const wrapper = mount((
      <SearchField {...defaultProps} />
    ));
    const mockValue = 'ACME';
    const input = wrapper.find('input');
    input.simulate('change', { target: { value: mockValue } });
    input.simulate('keyDown', { keyCode: 13 });
    expect(wrapper).toMatchSnapshot();
    expect(getLocationsByPostalCode).toHaveBeenCalledTimes(1);
    expect(getLocationsByPostalCode).toHaveBeenCalledWith(productId, mockValue);
  });

  it('should call getLocationsByGeolocation after clicking the locate button', () => {
    const wrapper = shallow((
      <SearchField {...defaultProps} />
    ));
    const button = wrapper.find('button');
    button.simulate('click');
    expect(wrapper).toMatchSnapshot();
    expect(getLocationsByGeolocation).toHaveBeenCalledTimes(1);
    expect(getLocationsByGeolocation).toHaveBeenCalledWith(productId);
  });
});
