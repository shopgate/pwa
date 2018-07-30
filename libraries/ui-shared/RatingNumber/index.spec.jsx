import React from 'react';
import { mount } from 'enzyme';
import RatingNumber from './index';

jest.mock('@shopgate/pwa-common/components/I18n', () => ({
  // eslint-disable-next-line react/prop-types
  Number: ({ rating }) => <div>{rating}</div>,
}));

describe('RatingNumber', () => {
  it('should render a number', () => {
    const component = mount(<RatingNumber rating={100} className="class-test" />);
    expect(component).toMatchSnapshot();
    expect(component.find('Number').props().number).toBe(5);
    expect(component.find('Number').props().fractions).toBe(2);
    expect(component.find('Number').props().className).toBe('class-test');
  });

  it('should return when rating is null', () => {
    const component = mount(<RatingNumber rating={null} />);
    expect(component.html()).toBe(null);
  });

  it('should return Number when rating is zero', () => {
    const component = mount(<RatingNumber rating={0} />);
    expect(component.html()).not.toBe(null);
  });

  it('should return number when division result is NaN', () => {
    const component = mount(<RatingNumber rating={{}} />);
    expect(component.html()).toBe(null);
  });
});
