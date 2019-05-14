import React from 'react';
import { shallow } from 'enzyme';
import mockConsole from 'jest-mock-console';
import { ProductPropertiesRowGrouped } from '../ProductPropertiesRowGrouped';

const properties = [
  { subDisplayGroup: 'test1' },
  { subDisplayGroup: 'test1' },
];

describe('<ProductPropertiesRowGrouped />', () => {
  it('not render if no properties match to the group', () => {
    const wrapper = shallow(<ProductPropertiesRowGrouped properties={properties} group="test2" />);
    expect(wrapper.instance()).toEqual(null);
  });

  it('should render two rows of properties', () => {
    const restoreConsole = mockConsole();
    const wrapper = shallow(<ProductPropertiesRowGrouped properties={properties} group="test1" />);
    expect(wrapper.find('ProductPropertiesRow').length).toEqual(2);
    expect(wrapper).toMatchSnapshot();
    restoreConsole();
  });
});
