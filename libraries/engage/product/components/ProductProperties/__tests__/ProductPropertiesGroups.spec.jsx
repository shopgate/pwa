import React from 'react';
import { shallow } from 'enzyme';
import { ProductPropertiesGroups } from '../ProductPropertiesGroups';

const properties = [
  {
    displayGroup: 'Group1',
  },
  {
    displayGroup: 'Group1',
  },
  {
    displayGroup: 'Group2',
  },
  {
    displayGroup: 'Group2',
  },
];

const groups = ['Group1', 'Group2'];

describe('<ProductPropertiesGroups />', () => {
  it('should render two groups of properties', () => {
    const wrapper = shallow(<ProductPropertiesGroups properties={properties} groups={groups} />);
    expect(wrapper.find('Accordion').length).toEqual(2);
    expect(wrapper.find('table').length).toEqual(2);
    expect(wrapper.find('ProductPropertiesRows').length).toEqual(2);
    expect(wrapper).toMatchSnapshot();
  });
});
