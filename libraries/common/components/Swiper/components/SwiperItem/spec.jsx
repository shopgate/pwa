import React from 'react';
import { shallow } from 'enzyme';
import { item } from './styles';
import SwiperItem from '.';

describe('<SwiperItem />', () => {
  it('should not render without children', () => {
    const wrapper = shallow((
      <SwiperItem>
        <div />
      </SwiperItem>
    ));

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.html()).toEqual(`<div class="${item}" data-test-id="Slider"><div></div></div>`);
  });

  it('should add custom className', () => {
    const wrapper = shallow((
      <SwiperItem className="test">
        <div />
      </SwiperItem>
    ));

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.html()).toEqual(`<div class="${item} test" data-test-id="Slider"><div></div></div>`);
  });
});
