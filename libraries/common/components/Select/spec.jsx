import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import Select from './index';
import SelectItem from './components/Item';

/**
 * Returns whether the given Enzyme wrapper contains at least one node
 * with a class name that ends with the provided suffix.
 *
 * This checks individual class tokens, so it works with elements that
 * have multiple classes.
 *
 * @param {Object} wrapper Enzyme wrapper (mount or shallow result).
 * @param {string} suffix Class name suffix to match, e.g. "-innerShadow".
 * @returns {boolean} True if a matching node exists.
 */
export function containsClassWithEnding(wrapper, suffix) {
  if (!wrapper || typeof wrapper.findWhere !== 'function' || !suffix) {
    return false;
  }

  return wrapper.findWhere((node) => {
    const className = node.prop('className');

    if (typeof className !== 'string') {
      return false;
    }

    return className
      .split(/\s+/)
      .some(cls => cls.endsWith(suffix));
  }).length > 0;
}

/**
 * Helper to simulate toggling the open state by touching the handle area.
 * @param {Object} wrapper Enzyme wrapper.
 */
const toggleOpen = (wrapper) => {
  wrapper.find('[role="presentation"]').simulate('touchstart');
  wrapper.update();
};

describe('<Select />', () => {
  jest.useFakeTimers();

  it('opens and closes the item list', () => {
    const wrapper = mount(<Select />);

    expect(wrapper.find(SelectItem).length).toBe(0);

    toggleOpen(wrapper);
    // opened – still 0 items because no items prop
    expect(containsClassWithEnding(wrapper, '-items')).toBe(true);

    toggleOpen(wrapper);
    expect(containsClassWithEnding(wrapper, '-items')).toBe(false);
  });

  it('renders without items', () => {
    const wrapper = mount(<Select />);

    toggleOpen(wrapper);
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
    toggleOpen(wrapper);

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

    toggleOpen(wrapper);

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

    toggleOpen(wrapper);

    expect(wrapper).toMatchSnapshot();
    const node = wrapper.find(SelectItem).at(selectionIndex);

    act(() => {
      node.prop('onSelect')(node.prop('value'), node.prop('label'));
    });
  });
});
