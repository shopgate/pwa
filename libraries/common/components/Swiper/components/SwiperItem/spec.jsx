import React from 'react';
import { shallow } from 'enzyme';
import { CLASS_PREFIX } from '@shopgate/engage/styles/tss';
import SwiperItem from '.';

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useLayoutEffect: jest.requireActual('react').useEffect,
}));

describe('<SwiperItem />', () => {
  it('should not render without children', () => {
    const wrapper = shallow((
      <SwiperItem>
        <div />
      </SwiperItem>
    ));

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.html()).toMatch(
      new RegExp(`^<div class="swiper-slide ${CLASS_PREFIX}-[^"]+" data-test-id="Slider"><div></div></div>$`)
    );
  });

  it('should add custom className', () => {
    const wrapper = shallow((
      <SwiperItem className="test">
        <div />
      </SwiperItem>
    ));

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.html()).toMatch(
      new RegExp(`^<div class="swiper-slide ${CLASS_PREFIX}-[^"]+ test" data-test-id="Slider"><div></div></div>$`)
    );
  });
});
