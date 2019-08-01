import React from 'react';
import { shallow } from 'enzyme';
import OpeningHours from '../OpeningHours';

const hours = {
  mon: '8:00am - 4:00pm',
  tue: '',
  wen: '8:00am - 8:00pm',
};

describe('<OpeningHours />', () => {
  it('should not render if no hours are passed', () => {
    const wrapper = shallow(<OpeningHours />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.instance()).toEqual(null);
  });

  it('should not render hours that are empty', () => {
    const wrapper = shallow(<OpeningHours hours={hours} />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('[data-test-id="hours-mon"]').text()).toEqual(hours.mon);
    expect(wrapper.find('[data-test-id="hours-tue"]').getElements().length).toEqual(0);
    expect(wrapper.find('[data-test-id="hours-wen"]').text()).toEqual(hours.wen);
  });
});
