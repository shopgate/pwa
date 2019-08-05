import React from 'react';
import { mount } from 'enzyme';
import Glow from '@shopgate/pwa-ui-shared/Glow';
import Item from './index';

jest.mock('@shopgate/pwa-common/components/Link', () => {
  /**
   * Mocked LinkComponent.
   * @return {JSX}
   */
  const Link = () => <div />;
  return Link;
});

describe('<SheetList.Item />', () => {
  const title = 'My Title';

  it('should render with a title but no image', () => {
    const wrapper = mount(<Item title={title} />);

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('img').exists()).toBeFalsy();
  });

  it('should render with an image', () => {
    const image = <img src="url/to/image" alt="Alternative text" />;

    const wrapper = mount(<Item title={title} image={image} />);

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('img').exists()).toBeTruthy();
  });

  it('should render with a right component', () => {
    const rightComponent = <span>I`m a span.</span>;

    const wrapper = mount(<Item
      title={title}
      rightComponent={rightComponent}
    />);

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.contains(<span>I`m a span.</span>)).toEqual(true);
  });

  it('should render without a Glow when selected', () => {
    const wrapper = mount(<Item title={title} isSelected />);

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(Glow).exists()).toBeFalsy();
  });

  it('should render without a Glow when disabled', () => {
    const wrapper = mount(<Item title={title} isDisabled />);

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(Glow).exists()).toBeFalsy();
  });

  it('should render with a link', () => {
    const wrapper = mount(<Item title={title} link="url/to/somewhere" />);

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('Link').exists()).toBeTruthy();
  });

  it('should render with an onClick element', () => {
    const spy = jest.fn();

    // eslint-disable-next-line require-jsdoc
    const clickHandler = () => {
      /**
       * The spy can't be assigned directly to the event, since the snapshot gets too big
       * and the test execution is heavily slowed down.
       */
      spy();
    };

    const wrapper = mount(<Item title={title} onClick={clickHandler} />);

    wrapper.simulate('click');

    expect(wrapper).toMatchSnapshot();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should update the component when the isDisabled prop changed', () => {
    const wrapper = mount(<Item title={title} isDisabled />);
    const props = wrapper.props();
    const updated = wrapper.find('Item').instance().shouldComponentUpdate({
      ...props,
      isDisabled: false,
    });

    expect(updated).toBe(true);
  });

  it('should update the component when the isSelected prop changed', () => {
    const wrapper = mount(<Item title={title} isSelected />);
    const props = wrapper.props();
    const updated = wrapper.find('Item').instance().shouldComponentUpdate({
      ...props,
      isSelected: false,
    });

    expect(updated).toBe(true);
  });
});
