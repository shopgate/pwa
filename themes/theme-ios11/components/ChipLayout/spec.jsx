import React from 'react';
import { mount } from 'enzyme';
import { Chip } from '@shopgate/engage/components';
import ChipsLayout from './index';

/**
 * Since the component uses the <Measure> component it needs an actual
 * browser to be tested as it needs a full browser that supports styling and
 * width/height calculation.
 */
describe('<ChipsLayout />', () => {
  it('should render with one chip', () => {
    const Component = (
      <ChipsLayout>
        <Chip id="some-id">foo</Chip>
      </ChipsLayout>
    );
    const wrapper = mount(Component);

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(Chip).length).toEqual(1);
    expect(wrapper.find(Chip).at(0).find('button').at(1)
      .text()).toEqual('foo');
  });

  it('should render with two chips', () => {
    const Component = (
      <ChipsLayout>
        <Chip id="some-id">foo</Chip>
        <Chip id="some-other-id">bar</Chip>
      </ChipsLayout>
    );
    const wrapper = mount(Component);

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(Chip).length).toEqual(2);
    expect(wrapper.find(Chip).at(0).find('button').at(1)
      .text()).toEqual('foo');
    expect(wrapper.find(Chip).at(1).find('button').at(1)
      .text()).toEqual('bar');
  });
});
