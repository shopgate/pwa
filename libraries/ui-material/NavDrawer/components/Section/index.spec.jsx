import React from 'react';
import { shallow } from 'enzyme';
import NavDrawerItem from '../Item';
import NavDrawerDivider from '../Divider';
import NavDrawerTitle from '../Title';
import NavDrawerSection from './index';

describe('<NavDrawerSection />', () => {
  it('should render with a title and dividers', () => {
    const sectionTitle = 'Section title';
    const itemLabel = 'Item Label';

    const wrapper = shallow((
      <NavDrawerSection title={sectionTitle} dividerTop dividerBottom>
        <NavDrawerItem label={itemLabel} />
      </NavDrawerSection>
    ));

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(NavDrawerDivider)).toHaveLength(2);
    expect(wrapper.find(NavDrawerTitle).prop('text')).toBe(sectionTitle);
    expect(wrapper.find(NavDrawerItem).prop('label')).toBe(itemLabel);
  });

  it('should render without a title and dividers', () => {
    const itemLabel = 'Item Label';
    const wrapper = shallow((
      <NavDrawerSection>
        <NavDrawerItem label={itemLabel} />
      </NavDrawerSection>
    ));

    expect(wrapper.find(NavDrawerDivider)).toHaveLength(0);
    expect(wrapper.find(NavDrawerTitle).prop('text')).toBe('');
    expect(wrapper.find(NavDrawerItem).prop('label')).toBe(itemLabel);
  });

  it('should not render without children', () => {
    const wrapper = shallow(<NavDrawerSection />);
    expect(wrapper.isEmptyRender()).toBe(true);
  });
});
