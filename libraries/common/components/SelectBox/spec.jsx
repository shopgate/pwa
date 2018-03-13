import React from 'react';
import PropTypes from 'prop-types';
import { mount } from 'enzyme';
import SelectBox from './index';

/**
 * Mock Icon component.
 * @returns {JSX}
 */
const MockIconComponent = () => <span id="icon" />;

/**
 * Mock Item component.
 * @param {Object} props The components props.
 * @param {JSX} props.children The components children.
 * @returns {JSX}
 */
const MockItemComponent = ({ children }) => (
  <div>
    {children}
  </div>
);

MockItemComponent.propTypes = {
  children: PropTypes.node.isRequired,
};

describe('<SelectBox>', () => {
  const dummyItems = [
    {
      label: 'My item #1',
      value: 'item_1',
    },
    {
      label: 'My item #2',
      value: 'item_2',
    },
    {
      label: 'My item #3',
      value: 'item_3',
    },
  ];

  it('should render the selectbox with given mock components', () => {
    const wrapper = mount((
      <SelectBox icon={MockIconComponent} item={MockItemComponent} items={dummyItems} />
    ));

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(MockIconComponent).length).toEqual(1);
    expect(wrapper.find(MockItemComponent).length).toEqual(3);
  });

  it('should render with a default text', () => {
    const wrapper = mount((
      <SelectBox
        icon={MockIconComponent}
        item={MockItemComponent}
        items={dummyItems}
        defaultText="Foo"
      />
    ));

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('span').at(0).text()).toEqual('Foo');
  });

  it('should render with a preselected selection', () => {
    const wrapper = mount((
      <SelectBox
        icon={MockIconComponent}
        item={MockItemComponent}
        items={dummyItems}
        defaultText="Foo"
        initialValue="item_2"
      />
    ));

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('span').at(0).text()).toEqual('My item #2');
  });
});
