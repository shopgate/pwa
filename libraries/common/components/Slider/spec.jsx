import React from 'react';
import { shallow, mount } from 'enzyme';
import Slider from './index';

jest.mock('swiper/dist/css/swiper.min.css', () => {});

describe('<Slider />', () => {
  const children = [
    <Slider.Item key="0"><div /></Slider.Item>,
    <Slider.Item key="1"><div /></Slider.Item>,
    <Slider.Item key="2"><div /></Slider.Item>,
  ];

  const indicatorClasses = {
    bullets: 'bullet-class',
    fraction: 'fraction-class',
  };

  jest.useFakeTimers();

  it('renders with children', () => {
    const numChildren = children.length;
    const wrapper = shallow(<Slider>{children}</Slider>);

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(Slider.Item).length).toBe(numChildren);
  });

  it('renders with controls', () => {
    const wrapper = mount(<Slider controls>{children}</Slider>);

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('.swiper-button-next').length).toBe(1);
  });

  it('renders with bullet indicators', () => {
    const wrapper = mount((
      <Slider
        classNames={{ indicator: indicatorClasses }}
        indicators
      >
        {children}
      </Slider>
    ));

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(`.${indicatorClasses.bullets}`).length).toBe(1);
  });

  it('renders with a fraction indicator', () => {
    const wrapper = mount((
      <Slider
        classNames={{ indicator: indicatorClasses }}
        indicators
        maxIndicators={2}
      >
        {children}
      </Slider>
    ));

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(`.${indicatorClasses.fraction}`).length).toBe(1);
  });
});
