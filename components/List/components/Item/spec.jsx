/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { mount } from 'enzyme';
import Link from '@shopgate/pwa-common/components/Router/components/Link';
import Glow from 'Components/Glow';
import List from '../../index';

describe.skip('<List.Item />', () => {
  const title = 'My Title';

  it('should render with a title', () => {
    const wrapper = mount(
      <List.Item title={title} />
    );

    expect(wrapper).toMatchSnapshot();
  });

  it('should render with an image', () => {
    const image = <img src="url/to/image" alt="Alternative text" />;

    const wrapper = mount(
      <List.Item title={title} image={image} />
    );

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('img').length).toEqual(1);
  });

  it('should render with a right component', () => {
    const rightComponent = <span>I`m a span.</span>;

    const wrapper = mount(
      <List.Item
        title={title}
        rightComponent={rightComponent}
      />
    );

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.contains(<span>I`m a span.</span>)).toEqual(true);
  });

  it('should render without a Glow when selected', () => {
    const wrapper = mount(
      <List.Item title={title} isSelected />
    );

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(Glow).length).toEqual(0);
  });

  it('should render without a Glow when disabled', () => {
    const wrapper = mount(
      <List.Item title={title} isDisabled />
    );

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(Glow).length).toEqual(0);
  });

  it('should render with a link', () => {
    const wrapper = mount(
      <List.Item title={title} link="url/to/somewhere" />
    );

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(Link).length).toEqual(1);
  });

  it('should render with an onClick element', () => {
    const spy = jest.fn();

    const wrapper = mount(
      <List.Item title={title} onClick={spy} />
    );

    wrapper.simulate('click');

    expect(wrapper).toMatchSnapshot();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
