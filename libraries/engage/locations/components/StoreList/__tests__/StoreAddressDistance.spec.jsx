import React from 'react';
import { shallow } from 'enzyme';
import formatDistance from '../../../helpers/formatDistance';
import StoreAddressDistance, { UNIT_SYSTEM_METRIC, UNIT_SYSTEM_IMPERIAL } from '../StoreAddressDistance';

jest.mock('../../../helpers/formatDistance', () => jest.fn());

describe('<StoreAddressDistance', () => {
  beforeAll(() => {
    formatDistance.mockImplementation((distance, imperial) => `${distance} ${imperial ? UNIT_SYSTEM_IMPERIAL : UNIT_SYSTEM_METRIC}`);
  });

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
    const unitSystem = UNIT_SYSTEM_METRIC;
    const wrapper = shallow((<StoreAddressDistance distance={distance} />));
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('span').text()).toBe(`${distance} ${unitSystem}`);
    expect(formatDistance).toHaveBeenCalledTimes(1);
    expect(formatDistance).toHaveBeenCalledWith(distance, false);
  });

  it('should render when a unit system is set', () => {
    const distance = 5.4;
    const unitSystem = UNIT_SYSTEM_IMPERIAL;
    const wrapper = shallow((
      <StoreAddressDistance
        distance={distance}
        unitSystem={unitSystem}
      />
    ));
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('span').text()).toBe(`${distance} ${unitSystem}`);
    expect(formatDistance).toHaveBeenCalledTimes(1);
    expect(formatDistance).toHaveBeenCalledWith(distance, true);
  });
});
