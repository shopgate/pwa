import React from 'react';
import { shallow, mount } from 'enzyme';
import Image from '../../components/Image';
import ZoomPanContainer from './index';

/**
 * Test element component.
 * @returns {JSX}
 */
const TestElement = () => <Image src="http://placekitten.com/300/300" />;

describe('<ZoomPanContainer />', () => {
  it('renders with children', () => {
    const numChildren = 5;
    const Component = (
      <ZoomPanContainer>
        <TestElement />
        <TestElement />
        <TestElement />
        <TestElement />
        <TestElement />
      </ZoomPanContainer>
    );
    const wrapper = mount(Component);

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(TestElement).length).toBe(numChildren);
  });

  it('renders the correct initial zoom when minZoom > 1', () => {
    const minZoom = 2;
    const Component = (
      <ZoomPanContainer minZoom={minZoom}>
        <TestElement />
      </ZoomPanContainer>
    );
    const wrapper = shallow(Component);
    const instance = wrapper.instance();

    expect(wrapper).toMatchSnapshot();
    expect(instance.scale).toBe(minZoom);
  });

  it('renders the correct initial zoom when minZoom < 1', () => {
    const minZoom = 0.5;
    const Component = (
      <ZoomPanContainer minZoom={minZoom}>
        <TestElement />
      </ZoomPanContainer>
    );
    const wrapper = shallow(Component);

    const instance = wrapper.instance();
    expect(wrapper).toMatchSnapshot();
    expect(instance.scale).toBe(1);
  });

  it('applies correct zoom factor when pinched', () => {
    const Component = (
      <ZoomPanContainer>
        <TestElement />
      </ZoomPanContainer>
    );
    const wrapper = mount(Component);

    expect(wrapper).toMatchSnapshot();

    const instance = wrapper.instance();
    instance.handlePinchStart();
    instance.handlePinch({
      scale: 2,
      deltaX: 0,
      deltaY: 0,
    });
    instance.handlePinchEnd();

    expect(instance.scale).toBe(2);
  });

  it('applies correct position when panned', () => {
    const Component = (
      <ZoomPanContainer>
        <TestElement />
      </ZoomPanContainer>
    );
    const wrapper = mount(Component);

    expect(wrapper).toMatchSnapshot();

    const instance = wrapper.instance();
    instance.cachedTransformWidth = 100;
    instance.cachedTransformHeight = 100;
    instance.cachedContentWidth = 100;
    instance.cachedContentHeight = 100;
    instance.handlePan({
      deltaX: 12,
      deltaY: 34,
    });

    // Don't pan when the image is not zoomed in.
    expect(instance.posX).toBe(0);
    expect(instance.posY).toBe(0);

    instance.handlePinchStart();
    instance.handlePinch({
      scale: 2,
      deltaX: 0,
      deltaY: 0,
    });
    instance.handlePinchEnd();
    instance.handlePanStart();
    instance.handlePan({
      deltaX: 12,
      deltaY: 34,
    });
    instance.handlePanEnd({
      velocityX: 0,
      velocityY: 0,
    });

    // Apply the pan when zoomed.
    expect(instance.posX).toBe(12);
    expect(instance.posY).toBe(34);
  });

  it('applies the correct zoom when double tapped', () => {
    const Component = (
      <ZoomPanContainer>
        <TestElement />
      </ZoomPanContainer>
    );
    const wrapper = mount(Component);
    const instance = wrapper.instance();

    expect(wrapper).toMatchSnapshot();

    instance.handleDoubleTap({
      center: {
        x: 0,
        y: 0,
      },
    });

    const expectedZoom = wrapper.props().minZoom + wrapper.props().zoomOnTap;

    expect(instance.scale).toBe(expectedZoom);

    // Make sure a second double tap is reverting to the original zoom.
    instance.handleDoubleTap({
      center: {
        x: 0,
        y: 0,
      },
    });

    expect(instance.scale).toBe(wrapper.props().minZoom);
  });

  it('triggers the zoom event', () => {
    const callback = jest.fn();
    const Component = (
      <ZoomPanContainer onZoom={callback}>
        <TestElement />
      </ZoomPanContainer>
    );
    const wrapper = mount(Component);
    const instance = wrapper.instance();

    expect(wrapper).toMatchSnapshot();

    instance.handleDoubleTap({
      center: {
        x: 0,
        y: 0,
      },
    });

    expect(callback).toHaveBeenCalled();
  });
});
