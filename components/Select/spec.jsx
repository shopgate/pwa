/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { shallow, mount } from 'enzyme';
import Select from './index';
import SelectItem from './components/Item';

describe('<Select />', () => {
  jest.useFakeTimers();

  it('opens and closes the item list', () => {
    const wrapper = shallow(<Select />);

    let previousOpenState = wrapper.state('isOpen');
    wrapper.instance().toggleOpenState();
    expect(wrapper.state('isOpen')).toBe(!previousOpenState);

    previousOpenState = wrapper.state('isOpen');
    wrapper.instance().toggleOpenState();
    expect(wrapper.state('isOpen')).toBe(!previousOpenState);
  });

  it('renders without items', () => {
    const wrapper = mount(<Select />);

    wrapper.instance().toggleOpenState();
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(SelectItem).length).toBe(0);
  });

  it('renders with implicit items (closed)', () => {
    const items = ['a', 'b', 'c', 'd', 'e', 'f'];

    const wrapper = mount(<Select items={items} />);

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(SelectItem).length).toBe(0);
  });

  it('renders with implicit items (opened)', () => {
    const items = ['a', 'b', 'c', 'd', 'e', 'f'];

    const wrapper = mount(<Select items={items} />);
    wrapper.instance().toggleOpenState();
    wrapper.update();

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(SelectItem).length).toBe(items.length);
  });

  it('accepts implicit and explicit items', () => {
    const items = [
      'a',
      'b',
      {
        value: 'c',
      },
      'd',
      {
        value: 'e',
        label: 'E',
      },
      'f',
    ];

    const wrapper = mount(<Select items={items} />);

    wrapper.instance().toggleOpenState();
    wrapper.update();

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(SelectItem).length).toBe(items.length);

    let i = 0;
    wrapper.find(SelectItem).forEach((item) => {
      let expectedLabel = items[i];

      if (expectedLabel.label) {
        expectedLabel = expectedLabel.label;
      }
      if (expectedLabel.value) {
        expectedLabel = expectedLabel.value;
      }

      expect(item.prop('label')).toBe(expectedLabel);
      i += 1;
    });
  });

  it('triggers callback on change', () => {
    const items = ['a', 'b', 'c', 'd', 'e', 'f'];
    const selectionIndex = Math.floor(items.length / 2);

    /**
     * Mocked callback for the onSelect event
     * @param {string} value Mocked value
     */
    const callback = (value) => {
      expect(value).toBe(items[selectionIndex]);
    };

    const wrapper = mount((
      <Select
        items={items}
        onChange={callback}
      />
    ));

    wrapper.instance().toggleOpenState();
    wrapper.update();

    expect(wrapper).toMatchSnapshot();
    const node = wrapper.find(SelectItem).at(selectionIndex);

    node.prop('onSelect')(node.prop('value'), node.prop('label'));
  });
});
