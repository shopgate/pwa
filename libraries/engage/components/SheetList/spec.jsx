import React from 'react';
import { mount } from 'enzyme';
import BaseListItem from '@shopgate/pwa-common/components/List/components/Item';
import SheetList from './index';
import styles from './style';

describe('<SheetList />', () => {
  it('should render with two children', () => {
    const wrapper = mount((
      <SheetList>
        <SheetList.Item title="List Item" />
        <SheetList.Item title="List Item" />
      </SheetList>
    ));

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(SheetList.Item).length).toEqual(2);
  });

  it('should render a child and add styles for list items with images', () => {
    const wrapper = mount((
      <SheetList hasImages>
        <SheetList.Item title="List Item" />
      </SheetList>
    ));

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(SheetList.Item).length).toEqual(1);
    expect(wrapper.find(BaseListItem).first().hasClass(styles.itemWithImage)).toBeTruthy();
  });

  it('should not render without children', () => {
    const wrapper = mount((
      <SheetList />
    ));

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(SheetList).html()).toBe(null);
  });

  it('should not render invalid children', () => {
    const wrapper = mount((
      <SheetList>
        <SheetList.Item title="List Item" />
        xxx
      </SheetList>
    ));

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(SheetList.Item).length).toEqual(1);
  });
});
