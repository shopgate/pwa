import React from 'react';
import { shallow } from 'enzyme';
import mockRenderOptions from '@shopgate/pwa-common/helpers/mocks/mockRenderOptions';
import StarIcon from '../StarIcon';
import StarHalfIcon from '../StarHalfIcon';
import Stars from './index';

const numEmptyStars = 5;

describe('<RatingStars />', () => {
  it('renders with value of 50', () => {
    const wrapper = shallow(
      <Stars value={50} />,
      mockRenderOptions
    );

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(StarIcon).length).toBe(numEmptyStars + 2);
    expect(wrapper.find(StarHalfIcon).length).toBe(1);
  });

  it('renders with value of 0', () => {
    const wrapper = shallow(
      <Stars value={0} />,
      mockRenderOptions
    );

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(StarIcon).length).toBe(numEmptyStars);
    expect(wrapper.find(StarHalfIcon).length).toBe(0);
  });

  it('renders with value of 100', () => {
    const wrapper = shallow(
      <Stars value={100} />,
      mockRenderOptions
    );

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(StarIcon).length).toBe(numEmptyStars + 5);
    expect(wrapper.find(StarHalfIcon).length).toBe(0);
  });

  it('should change rating on click', () => {
    const wrapper = shallow(
      <Stars value={100} isSelectable />,
      mockRenderOptions
    );
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(StarIcon).length).toBe(10);
    wrapper.setProps({ value: 20 });
    expect(wrapper.find(StarIcon).length).toBe(6);
    wrapper.setProps({ value: 70 });
    expect(wrapper.find(StarIcon).length).toBe(8);
    expect(wrapper.find(StarHalfIcon).length).toBe(1);
    expect(wrapper).toMatchSnapshot();
  });

  it('should call onSelection callback when component is selectable', () => {
    const spy = jest.fn();
    const wrapper = shallow(
      <Stars
        value={100}
        isSelectable
        onSelection={(e) => {
          wrapper.setProps({ value: e.target.value });
          spy();
        }}
      />,
      mockRenderOptions
    );
    // Click on 1 filled star.
    wrapper.find('[role="button"]').at(5).simulate('click', { target: { value: 10 } });
    expect(spy.mock.calls.length).toBe(1);
    expect(wrapper.find('[role="button"]').length).toBe(6);
    // Click on 4th empty star
    wrapper.find('[role="button"]').at(3).simulate('click', { target: { value: 80 } });
    expect(wrapper.find('[role="button"]').length).toBe(9);
    expect(spy.mock.calls.length).toBe(2);
  });

  it('should NOT call onSelection callback when component is NOT selectable', () => {
    const spy = jest.fn();
    const wrapper = shallow(
      <Stars value={100} onSelection={spy} />,
      mockRenderOptions
    );

    wrapper.find(StarIcon).at(5).parent('div').simulate('click');
    expect(wrapper.find('[role="button"]').length).toBe(0);
    expect(spy.mock.calls.length).toBe(0);
  });
});
