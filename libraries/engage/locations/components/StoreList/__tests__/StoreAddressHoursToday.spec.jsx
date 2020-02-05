import React from 'react';
import { shallow } from 'enzyme';
import { mockDate, resetMockDate } from '../../../../mocks';
import StoreAddressHoursToday from '../StoreAddressHoursToday';

const hours = {
  mon: '8:00am - 4:00pm',
  tue: '8:00am - 4:00pm',
  wed: '8:00am - 8:00pm',
  thu: '8:00am - 8:00pm',
  fri: '8:00am - 8:00pm',
  sat: '8:00am - 8:00pm',
  sun: '8:00am - 8:00pm',
};

describe('<StoreHoursToday />', () => {
  afterEach(() => {
    resetMockDate();
  });

  it('should not render if no hours have been passed', () => {
    const wrapper = shallow(<StoreAddressHoursToday />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.instance()).toEqual(null);
  });

  it('should render as expected', () => {
    mockDate('2019-01-01T10:00:00.000Z');
    const wrapper = shallow(<StoreAddressHoursToday hours={hours} />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('div').getElements().length).toEqual(1);
  });
});
