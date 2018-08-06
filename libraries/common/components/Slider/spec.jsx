import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { mount } from 'enzyme';
import Slider from './index';

jest.mock('swiper/dist/css/swiper.min.css', () => {});

describe('<Slider />', () => {
  const defaultState = {
    history: {
      pathname: '',
    },
  };

  /**
   * Creates a component.
   * @param {Array} children Children.
   * @param {Object} [props={}] Props.
   * @param {Object} [state=defaultState] State.
   * @returns {Object}
   */
  const createComponent = (children, props = {}, state = defaultState) => (
    mount((
      <Provider store={configureStore()(state)}>
        <Slider {...props}>
          {children}
        </Slider>
      </Provider>
    ))
  );
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
    const wrapper = createComponent(children);

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(Slider.Item).length).toBe(numChildren);
  });

  it('renders with controls', () => {
    const wrapper = createComponent(children, { controls: true });

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('.swiper-button-next').length).toBe(1);
  });

  it('renders with bullet indicators', () => {
    const wrapper = createComponent(children, {
      classNames: { indicator: indicatorClasses },
      indicators: true,
    });

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(`.${indicatorClasses.bullets}`).length).toBe(1);
  });

  it('renders with a fraction indicator', () => {
    const wrapper = createComponent(children, {
      classNames: { indicator: indicatorClasses },
      indicators: true,
      maxIndicators: 2,
    });

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(`.${indicatorClasses.fraction}`).length).toBe(1);
  });

  describe('.shouldComponentUpdate', () => {
    const wrapper = createComponent(children);
    const instance = wrapper.find('Slider').instance();

    it('should return false when nothing changed', () => {
      expect(instance.shouldComponentUpdate({ ...instance.props })).toBe(false);
    });

    it('should return true when primitive changed', () => {
      expect(instance.shouldComponentUpdate({
        ...instance.props,
        controls: !instance.props.controls,
      })).toBe(true);
    });

    it('should return true when children changed', () => {
      expect(instance.shouldComponentUpdate({
        ...instance.props,
        children: [
          ...instance.props.children,
          <Slider.Item key="3"><div /></Slider.Item>,
        ],
      })).toBe(true);
    });

    it('should return true when slidesPerView change', () => {
      expect(instance.shouldComponentUpdate({
        ...instance.props,
        slidesPerView: instance.props.slidesPerView + 1,
      })).toBe(true);
    });
  });

  describe('Callbacks', () => {
    const mockedOnSlideChange = jest.fn();
    const wrapper = createComponent(children, {
      loop: true,
      onSlideChange: mockedOnSlideChange,
    });
    const instance = wrapper.find('Slider').instance();

    instance.slider.update = jest.fn();
    instance.slider.lockSwipes = jest.fn();
    instance.slider.unlockSwipes = jest.fn();
    instance.slider.reLoop = jest.fn();
    instance.slider.fixLoop = jest.fn();

    beforeEach(() => {
      [
        'update',
        'lockSwipes',
        'unlockSwipes',
        'reLoop',
        'fixLoop',
      ].forEach((method) => {
        instance.slider[method].mockClear();
      });
      mockedOnSlideChange.mockClear();
    });

    it('should throw error when updating slider when not ready', () => {
      instance.constructor.updateSlider();
    });

    it('should call update on rerender', () => {
      instance.componentDidUpdate();
      expect(instance.slider.update).toHaveBeenCalled();
    });

    it('should call lockSwipes when slider becomes disabled', () => {
      instance.componentWillReceiveProps({ disabled: true });
      expect(instance.slider.lockSwipes).toHaveBeenCalled();
    });

    it('should call unlockSwipes when slider becomes enabled', () => {
      instance.componentWillReceiveProps({ disabled: false });
      expect(instance.slider.unlockSwipes).toHaveBeenCalled();
    });

    it('should call onSlideChange', () => {
      instance.handleSlideChange({ activeIndex: 2 });
      expect(mockedOnSlideChange).toHaveBeenCalledWith(1);
    });

    it('should call fixLoop', () => {
      instance.constructor.fixFakeLoop(instance.slider);
      expect(instance.slider.fixLoop).toHaveBeenCalled();
    });

    it('should call reloop', () => {
      instance.constructor.fixLoopLimits({
        ...instance.slider,
        slides: [1, 2],
        activeIndex: 1,
      });
      expect(instance.slider.reLoop).toHaveBeenCalled();
    });
  });
});
