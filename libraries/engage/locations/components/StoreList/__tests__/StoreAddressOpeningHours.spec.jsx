import React from 'react';
import { shallow, mount } from 'enzyme';
import StoreAddressOpeningHours from '../StoreAddressOpeningHours';

const hours = {
  mon: '8:00am - 4:00pm',
  tue: '',
  wen: '8:00am - 8:00pm',
};

describe('<StoreAddressOpeningHours />', () => {
  it('should not render if no hours are passed', () => {
    const wrapper = shallow(<StoreAddressOpeningHours />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.instance()).toEqual(null);
  });

  it('should not render hours that are empty', () => {
    const wrapper = mount(<StoreAddressOpeningHours hours={hours} />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('[data-test-id="hours-mon"]').text()).toEqual(hours.mon);
    expect(wrapper.find('[data-test-id="hours-tue"]').getElements().length).toEqual(0);
    expect(wrapper.find('[data-test-id="hours-wen"]').text()).toEqual(hours.wen);
  });
});
