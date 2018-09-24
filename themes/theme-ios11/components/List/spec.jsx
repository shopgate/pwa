import React from 'react';
import { mount } from 'enzyme';
import BaseListItem from '@shopgate/pwa-common/components/List/components/Item';
import List from './index';
import styles from './style';

describe('<List />', () => {
  it('should render with two children', () => {
    const wrapper = mount((
      <List>
        <List.Item title="List Item" />
        <List.Item title="List Item" />
      </List>
    ));

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(List.Item).length).toEqual(2);
  });

  it('should render a child and add styles for list items with images', () => {
    const wrapper = mount((
      <List hasImages>
        <List.Item title="List Item" />
      </List>
    ));

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(List.Item).length).toEqual(1);
    expect(wrapper.find(BaseListItem).first().hasClass(styles.itemWithImage)).toBeTruthy();
  });

  it('should not render without children', () => {
    const wrapper = mount((
      <List />
    ));

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(List).html()).toBe(null);
  });

  it('should not render invalid children', () => {
    const wrapper = mount((
      <List>
        <List.Item title="List Item" />
        xxx
      </List>
    ));

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(List.Item).length).toEqual(1);
  });
});
