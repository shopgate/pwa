import React from 'react';
import { shallow } from 'enzyme';
import { i18n } from '@shopgate/engage/core';
import StoreAddressDistance, { UNIT_SYSTEM_METRIC, UNIT_SYSTEM_IMPERIAL } from '../StoreAddressDistance';

jest.mock('@shopgate/engage/components', () => ({
  I18n: {
    Text: function Translate() { return null; },
  },
}));

jest.mock('@shopgate/engage/core', () => ({
  i18n: {
    number: jest.fn().mockImplementation(number => `${number}`),
  },
}));

describe('<StoreAddressDistance', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should not render when no distance was passed', () => {
    const wrapper = shallow((<StoreAddressDistance />));
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.isEmptyRender()).toEqual(true);
  });

  it('should render when the distance is 0', () => {
    const distance = 0;
    const wrapper = shallow((<StoreAddressDistance distance={distance} />));
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('Translate').prop('string')).toEqual(`locations.distance_${UNIT_SYSTEM_METRIC}`);
    expect(wrapper.find('Translate').prop('params')).toEqual({ distance: '0' });
    expect(i18n.number).toHaveBeenCalledTimes(1);
    expect(i18n.number).toHaveBeenCalledWith(distance, 2);
  });

  it('should render when a unit system is set', () => {
    const distance = 5.4;
    const wrapper = shallow((
      <StoreAddressDistance
        distance={distance}
        unitSystem={UNIT_SYSTEM_IMPERIAL}
      />
    ));
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('Translate').prop('string')).toEqual(`locations.distance_${UNIT_SYSTEM_IMPERIAL}`);
    expect(wrapper.find('Translate').prop('params')).toEqual({ distance: '5.4' });
    expect(i18n.number).toHaveBeenCalledTimes(1);
    expect(i18n.number).toHaveBeenCalledWith(distance, 2);
  });
});
